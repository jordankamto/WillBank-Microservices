/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.TransactionService.client.AccountServiceClient;
import com.stevecompany.TransactionService.dto.*;
import com.stevecompany.TransactionService.entity.Transaction;
import com.stevecompany.TransactionService.exception.BusinessException;
import com.stevecompany.TransactionService.messaging.TransactionEventPublisher;
import com.stevecompany.TransactionService.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);
    private final LedgerService ledger;
    private final AccountServiceClient accountClient;
    private final TransactionEventPublisher publisher;
    private final TransactionRepository repository;

    public TransactionService(
            LedgerService ledger,
            AccountServiceClient accountClient,
            TransactionEventPublisher publisher,
            TransactionRepository repository
    ) {
        this.ledger = ledger;
        this.accountClient = accountClient;
        this.publisher = publisher;
        this.repository = repository;
    }

    public TransactionResponseDTO deposit(TransactionRequestDTO dto) {
        log.info("Processing DEPOSIT - accountId: {}, amount: {}", dto.getAccountId(), dto.getAmount());
        
        // Validation
        validateAmount(dto.getAmount());
        validateAccountExists(dto.getAccountId());

        Transaction tx = new Transaction();
        tx.setAccountId(dto.getAccountId());
        tx.setAmount(dto.getAmount());
        tx.setType(Transaction.Type.DEPOSIT);

        try {
            accountClient.credit(dto.getAccountId(), dto.getAmount());
            tx.setStatus(Transaction.Status.SUCCESS);
            Transaction saved = ledger.record(tx);
            publisher.publishSuccess(saved);
            log.info("DEPOSIT successful - transactionId: {}", saved.getId());
            return TransactionResponseDTO.fromEntity(saved, "Deposit completed successfully");
        } catch (Exception e) {
            log.error("DEPOSIT failed - accountId: {}, error: {}", dto.getAccountId(), e.getMessage());
            tx.setStatus(Transaction.Status.FAILED);
            tx.setFailureReason(e.getMessage());
            Transaction saved = ledger.record(tx);
            publisher.publishFailure(saved);
            return TransactionResponseDTO.fromEntity(saved, "Deposit failed");
        }
    }

    public TransactionResponseDTO withdraw(TransactionRequestDTO dto) {
        log.info("Processing WITHDRAWAL - accountId: {}, amount: {}", dto.getAccountId(), dto.getAmount());
        
        // Validation
        validateAmount(dto.getAmount());
        validateAccountExists(dto.getAccountId());

        Transaction tx = new Transaction();
        tx.setAccountId(dto.getAccountId());
        tx.setAmount(dto.getAmount());
        tx.setType(Transaction.Type.WITHDRAWAL);

        try {
            accountClient.debit(dto.getAccountId(), dto.getAmount());
            tx.setStatus(Transaction.Status.SUCCESS);
            Transaction saved = ledger.record(tx);
            publisher.publishSuccess(saved);
            log.info("WITHDRAWAL successful - transactionId: {}", saved.getId());
            return TransactionResponseDTO.fromEntity(saved, "Withdrawal completed successfully");
        } catch (Exception e) {
            log.error("WITHDRAWAL failed - accountId: {}, error: {}", dto.getAccountId(), e.getMessage());
            tx.setStatus(Transaction.Status.FAILED);
            tx.setFailureReason(e.getMessage());
            Transaction saved = ledger.record(tx);
            publisher.publishFailure(saved);
            return TransactionResponseDTO.fromEntity(saved, "Withdrawal failed: " + e.getMessage());
        }
    }

    public TransactionResponseDTO transfer(TransferRequestDTO dto) {
        log.info("Processing TRANSFER - from: {}, to: {}, amount: {}", 
                dto.getSourceAccountId(), dto.getTargetAccountId(), dto.getAmount());
        
        // Validation
        validateAmount(dto.getAmount());
        validateAccountExists(dto.getSourceAccountId());
        validateAccountExists(dto.getTargetAccountId());
        
        if (dto.getSourceAccountId().equals(dto.getTargetAccountId())) {
            throw new BusinessException("Cannot transfer to the same account");
        }

        Transaction tx = new Transaction();
        tx.setAccountId(dto.getSourceAccountId());
        tx.setTargetAccountId(dto.getTargetAccountId());
        tx.setAmount(dto.getAmount());
        tx.setType(Transaction.Type.TRANSFER);

        try {
            // Débiter source
            accountClient.debit(dto.getSourceAccountId(), dto.getAmount());
            
            // Créditer destination
            accountClient.credit(dto.getTargetAccountId(), dto.getAmount());
            
            tx.setStatus(Transaction.Status.SUCCESS);
            Transaction saved = ledger.record(tx);
            publisher.publishSuccess(saved);
            log.info("TRANSFER successful - transactionId: {}", saved.getId());
            return TransactionResponseDTO.fromEntity(saved, "Transfer completed successfully");
        } catch (Exception e) {
            log.error("TRANSFER failed - from: {}, to: {}, error: {}", 
                    dto.getSourceAccountId(), dto.getTargetAccountId(), e.getMessage());
            
            // Rollback automatique grâce à @Transactional
            tx.setStatus(Transaction.Status.FAILED);
            tx.setFailureReason(e.getMessage());
            Transaction saved = ledger.record(tx);
            publisher.publishFailure(saved);
            return TransactionResponseDTO.fromEntity(saved, "Transfer failed: " + e.getMessage());
        }
    }

    public List<Transaction> getByAccount(UUID accountId) {
        log.info("Getting all transactions for account: {}", accountId);
        return repository.findByAccountIdOrderByCreatedAtDesc(accountId);
    }

    public Page<Transaction> getByAccountPaginated(UUID accountId, Pageable pageable) {
        log.info("Getting paginated transactions for account: {} - page: {}", accountId, pageable.getPageNumber());
        return repository.findByAccountId(accountId, pageable);
    }

    public List<Transaction> search(Transaction.Type type, LocalDate date) {
        log.info("Searching transactions - type: {}, date: {}", type, date);
        
        if (type != null && date != null) {
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
            return repository.findByTypeAndCreatedAtBetween(type, startOfDay, endOfDay);
        } else if (type != null) {
            return repository.findByType(type);
        } else if (date != null) {
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
            return repository.findByCreatedAtBetween(startOfDay, endOfDay);
        } else {
            return repository.findAll();
        }
    }

    // Méthodes de validation
    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Amount must be greater than zero");
        }
    }

    private void validateAccountExists(UUID accountId) {
        if (!accountClient.accountExists(accountId)) {
            throw new BusinessException("Account not found: " + accountId);
        }
    }
}
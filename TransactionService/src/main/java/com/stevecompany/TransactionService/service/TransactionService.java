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
import com.stevecompany.TransactionService.messaging.TransactionEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    private final LedgerService ledger;
    private final AccountServiceClient accountClient;
    private final TransactionEventPublisher publisher;

    public TransactionService(
            LedgerService ledger,
            AccountServiceClient accountClient,
            TransactionEventPublisher publisher
    ) {
        this.ledger = ledger;
        this.accountClient = accountClient;
        this.publisher = publisher;
    }

    public TransactionResponseDTO deposit(TransactionRequestDTO dto) {
        Transaction tx = new Transaction();
        tx.setAccountId(dto.accountId);
        tx.setAmount(dto.amount);
        tx.setType(Transaction.Type.DEPOSIT);

        try {
            accountClient.credit(dto.accountId, dto.amount);
            tx.setStatus(Transaction.Status.SUCCESS);
            ledger.record(tx);
            publisher.publishSuccess(tx);
            return success(tx);
        } catch (Exception e) {
            tx.setStatus(Transaction.Status.FAILED);
            tx.setFailureReason(e.getMessage());
            ledger.record(tx);
            publisher.publishFailure(tx);
            return failure(tx);
        }
    }

    private TransactionResponseDTO success(Transaction tx) {
        TransactionResponseDTO r = new TransactionResponseDTO();
        r.transactionId = tx.getId();
        r.status = "SUCCESS";
        r.message = "Transaction completed";
        return r;
    }

    private TransactionResponseDTO failure(Transaction tx) {
        TransactionResponseDTO r = new TransactionResponseDTO();
        r.transactionId = tx.getId();
        r.status = "FAILED";
        r.message = tx.getFailureReason();
        return r;
    }
}
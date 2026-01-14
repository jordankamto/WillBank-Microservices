/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.AccountService.client.CustomerServiceClient;
import com.stevecompany.AccountService.entity.Account;
import com.stevecompany.AccountService.exception.BusinessException;
import com.stevecompany.AccountService.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AccountService {

    private static final Logger log = LoggerFactory.getLogger(AccountService.class);
    private final AccountRepository repository;
    private final CustomerServiceClient customerClient;

    public AccountService(AccountRepository repository,
                          CustomerServiceClient customerClient) {
        this.repository = repository;
        this.customerClient = customerClient;
    }

    public Account create(Account account) {
        log.info("Creating account for customer: {}", account.getCustomerId());
        
        // 1. Vérifier que le client existe et que son KYC est ACTIVE
        CustomerServiceClient.CustomerExistsResponse customerCheck = 
                customerClient.checkCustomerExists(account.getCustomerId());
        
        if (!customerCheck.exists) {
            throw new BusinessException("Customer not found");
        }
        
        if (!customerCheck.kycActive) {
            throw new BusinessException("Customer KYC is not active. Current status: " + customerCheck.status);
        }
        
        // 2. Vérifier la règle : un seul compte courant par client
        if (account.getType() == Account.Type.CURRENT &&
            repository.existsByCustomerIdAndTypeAndDeletedFalse(
                    account.getCustomerId(), Account.Type.CURRENT)) {
            throw new BusinessException("Customer already has a CURRENT account");
        }

        Account saved = repository.save(account);
        log.info("Account created successfully with ID: {}", saved.getId());
        return saved;
    }

    public Account get(UUID id) {
        return repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new BusinessException("Account not found"));
    }

    public List<Account> findAll() {
        return repository.findAll().stream()
                .filter(a -> !a.isDeleted())
                .toList();
    }

    public List<Account> byCustomer(UUID customerId) {
        return repository.findByCustomerIdAndDeletedFalse(customerId);
    }

    public void freeze(UUID id) {
        Account acc = get(id);
        log.info("Freezing account {}", id);
        acc.setStatus(Account.Status.FROZEN);
        repository.save(acc);
    }

    public void block(UUID id) {
        Account acc = get(id);
        log.info("Blocking account {}", id);
        acc.setStatus(Account.Status.BLOCKED);
        repository.save(acc);
    }

    public void close(UUID id) {
        Account acc = get(id);
        log.info("Closing account {}", id);
        
        if (acc.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new BusinessException("Balance must be zero to close account. Current balance: " + acc.getBalance());
        }
        
        acc.setStatus(Account.Status.CLOSED);
        repository.save(acc);
    }

    public void updateBalance(UUID id, BigDecimal balance) {
        Account acc = get(id);
        log.info("Updating balance for account {} from {} to {}", id, acc.getBalance(), balance);
        acc.setBalance(balance);
        repository.save(acc);
    }
}
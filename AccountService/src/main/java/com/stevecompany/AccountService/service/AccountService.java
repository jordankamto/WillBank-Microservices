/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.AccountService.entity.Account;
import com.stevecompany.AccountService.exception.BusinessException;
import com.stevecompany.AccountService.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository repository;

    public AccountService(AccountRepository repository) {
        this.repository = repository;
    }

    public Account create(Account account) {

        if (account.getType() == Account.Type.CURRENT &&
            repository.existsByCustomerIdAndTypeAndDeletedFalse(
                    account.getCustomerId(), Account.Type.CURRENT)) {
            throw new BusinessException("Customer already has a CURRENT account");
        }

        return repository.save(account);
    }

    public Account get(UUID id) {
        return repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new BusinessException("Account not found"));
    }

    public List<Account> byCustomer(UUID customerId) {
        return repository.findByCustomerIdAndDeletedFalse(customerId);
    }

    public void freeze(UUID id) {
        Account acc = get(id);
        acc.setStatus(Account.Status.FROZEN);
        repository.save(acc);
    }

    public void block(UUID id) {
        Account acc = get(id);
        acc.setStatus(Account.Status.BLOCKED);
        repository.save(acc);
    }

    public void close(UUID id) {
        Account acc = get(id);
        if (acc.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new BusinessException("Balance must be zero to close account");
        }
        acc.setStatus(Account.Status.CLOSED);
        repository.save(acc);
    }

    public void updateBalance(UUID id, BigDecimal balance) {
        Account acc = get(id);
        acc.setBalance(balance);
        repository.save(acc);
    }
}
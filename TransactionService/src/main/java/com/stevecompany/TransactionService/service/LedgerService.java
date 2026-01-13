/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.TransactionService.entity.Transaction;
import com.stevecompany.TransactionService.repository.TransactionRepository;
import org.springframework.stereotype.Service;

@Service
public class LedgerService {

    private final TransactionRepository repository;

    public LedgerService(TransactionRepository repository) {
        this.repository = repository;
    }

    public Transaction record(Transaction tx) {
        return repository.save(tx);
    }
}
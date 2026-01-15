/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.repository;

/**
 *
 * @author steve
 */
import com.stevecompany.TransactionService.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    // Pagination
    Page<Transaction> findByAccountId(UUID accountId, Pageable pageable);

    // Sans pagination
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(UUID accountId);

    // Recherche par type
    List<Transaction> findByType(Transaction.Type type);

    // Recherche par date
    List<Transaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Recherche par type ET date
    List<Transaction> findByTypeAndCreatedAtBetween(Transaction.Type type, LocalDateTime start, LocalDateTime end);
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CompositeService.controller;

/**
 *
 * @author steve
 */
import com.stevecompany.CompositeService.dto.AccountStatementDTO;
import com.stevecompany.CompositeService.dto.DashboardResponseDTO;
import com.stevecompany.CompositeService.dto.TransactionDTO;
import com.stevecompany.CompositeService.service.CompositeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
public class CompositeController {

    private static final Logger log = LoggerFactory.getLogger(CompositeController.class);
    private final CompositeService service;

    public CompositeController(CompositeService service) {
        this.service = service;
    }

    /**
     * GET /api/dashboard/{customerId}
     * Retourne le dashboard complet d'un client
     */
    @GetMapping("/{customerId}")
    public ResponseEntity<DashboardResponseDTO> getDashboard(@PathVariable UUID customerId) {
        log.info("Received GET /api/dashboard/{}", customerId);
        DashboardResponseDTO dashboard = service.getDashboard(customerId);
        return ResponseEntity.ok(dashboard);
    }

    /**
     * GET /api/dashboard/accounts/{accountId}/statement?from=&to=
     * Retourne le relevé d'un compte sur une période
     */
    @GetMapping("/accounts/{accountId}/statement")
    public ResponseEntity<AccountStatementDTO> getAccountStatement(
            @PathVariable UUID accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        
        log.info("Received GET /api/dashboard/accounts/{}/statement - from: {}, to: {}", 
                accountId, from, to);
        
        AccountStatementDTO statement = service.getAccountStatement(accountId, from, to);
        return ResponseEntity.ok(statement);
    }

    /**
     * GET /api/dashboard/transactions/search?type=&date=
     * Recherche de transactions par type et/ou date
     */
    @GetMapping("/transactions/search")
    public ResponseEntity<List<TransactionDTO>> searchTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        log.info("Received GET /api/dashboard/transactions/search - type: {}, date: {}", type, date);
        
        List<TransactionDTO> transactions = service.searchTransactions(type, date);
        return ResponseEntity.ok(transactions);
    }
}
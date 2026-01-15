/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.controller;

/**
 *
 * @author steve
 */
import com.stevecompany.TransactionService.dto.TransactionRequestDTO;
import com.stevecompany.TransactionService.dto.TransactionResponseDTO;
import com.stevecompany.TransactionService.dto.TransferRequestDTO;
import com.stevecompany.TransactionService.entity.Transaction;
import com.stevecompany.TransactionService.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private static final Logger log = LoggerFactory.getLogger(TransactionController.class);
    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponseDTO> deposit(@RequestBody TransactionRequestDTO dto) {
        log.info("Received POST /api/transactions/deposit - accountId: {}, amount: {}", 
                dto.getAccountId(), dto.getAmount());
        TransactionResponseDTO response = service.deposit(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponseDTO> withdraw(@RequestBody TransactionRequestDTO dto) {
        log.info("Received POST /api/transactions/withdraw - accountId: {}, amount: {}", 
                dto.getAccountId(), dto.getAmount());
        TransactionResponseDTO response = service.withdraw(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponseDTO> transfer(@RequestBody TransferRequestDTO dto) {
        log.info("Received POST /api/transactions/transfer - from: {}, to: {}, amount: {}", 
                dto.getSourceAccountId(), dto.getTargetAccountId(), dto.getAmount());
        TransactionResponseDTO response = service.transfer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getByAccount(
            @PathVariable UUID accountId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        
        log.info("Received GET /api/transactions/account/{} - page: {}, size: {}", accountId, page, size);
        
        if (page >= 0 && size > 0) {
            // Pagination
            Page<Transaction> transactionsPage = service.getByAccountPaginated(accountId, PageRequest.of(page, size));
            return ResponseEntity.ok(transactionsPage.map(t -> 
                    TransactionResponseDTO.fromEntity(t, "Transaction retrieved successfully")));
        } else {
            // Sans pagination
            List<TransactionResponseDTO> transactions = service.getByAccount(accountId).stream()
                    .map(t -> TransactionResponseDTO.fromEntity(t, "Transaction retrieved successfully"))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(transactions);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<TransactionResponseDTO>> search(
            @RequestParam(required = false) Transaction.Type type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        log.info("Received GET /api/transactions/search - type: {}, date: {}", type, date);
        
        List<TransactionResponseDTO> transactions = service.search(type, date).stream()
                .map(t -> TransactionResponseDTO.fromEntity(t, "Transaction retrieved successfully"))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(transactions);
    }
}
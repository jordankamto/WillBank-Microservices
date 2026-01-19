/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.controller;

/**
 *
 * @author steve
 */
import com.stevecompany.AccountService.dto.AccountDTO;
import com.stevecompany.AccountService.entity.Account;
import com.stevecompany.AccountService.security.InternalRequestValidator;
import com.stevecompany.AccountService.service.AccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private static final Logger log = LoggerFactory.getLogger(AccountController.class);
    private final AccountService service;
    private final InternalRequestValidator validator;

    public AccountController(AccountService service,
                             InternalRequestValidator validator) {
        this.service = service;
        this.validator = validator;
    }

    @PostMapping
    public ResponseEntity<AccountDTO> create(@RequestBody Account account) {
        log.info("Received POST /api/accounts - customerId: {}, type: {}", 
                account.getCustomerId(), account.getType());
        Account created = service.create(account);
        log.info("Account created with ID: {}", created.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(AccountDTO.fromEntity(created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> get(@PathVariable UUID id) {
        log.info("Received GET /api/accounts/{}", id);
        Account account = service.get(id);
        return ResponseEntity.ok(AccountDTO.fromEntity(account));
    }

    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAll() {
        log.info("Received GET /api/accounts (all)");
        List<AccountDTO> accounts = service.findAll().stream()
                .map(AccountDTO::fromEntity)
                .collect(Collectors.toList());
        log.info("Returning {} accounts", accounts.size());
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<AccountDTO>> byCustomer(@PathVariable UUID customerId) {
        log.info("Received GET /api/accounts/customer/{}", customerId);
        List<AccountDTO> accounts = service.byCustomer(customerId).stream()
                .map(AccountDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(accounts);
    }

    @PutMapping("/{id}/freeze")
    public ResponseEntity<Map<String, Object>> freeze(@PathVariable UUID id) {
        log.info("Received PUT /api/accounts/{}/freeze", id);
        service.freeze(id);
        return ResponseEntity.ok(Map.of(
                "message", "Account frozen successfully",
                "accountId", id,
                "status", "FROZEN"
        ));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Map<String, Object>> activate(@PathVariable UUID id) {
        log.info("Received PUT /api/accounts/{}/activate", id);
        service.activate(id);
        return ResponseEntity.ok(Map.of(
                "message", "Account activated successfully",
                "accountId", id,
                "status", "ACTIVE"
        ));
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<Map<String, Object>> block(@PathVariable UUID id) {
        log.info("Received PUT /api/accounts/{}/block", id);
        service.block(id);
        return ResponseEntity.ok(Map.of(
                "message", "Account blocked successfully",
                "accountId", id,
                "status", "BLOCKED"
        ));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<Map<String, Object>> close(@PathVariable UUID id) {
        log.info("Received PUT /api/accounts/{}/close", id);
        service.close(id);
        return ResponseEntity.ok(Map.of(
                "message", "Account closed successfully",
                "accountId", id,
                "status", "CLOSED"
        ));
    }

    @PutMapping("/{id}/balance")
    public ResponseEntity<Map<String, Object>> updateBalance(
            @PathVariable UUID id,
            @RequestHeader(value = "X-INTERNAL-TOKEN", required = false) String token,
            @RequestBody Map<String, BigDecimal> payload) {
        
        log.info("Received PUT /api/accounts/{}/balance", id);
        
        if (token != null) {
            validator.validate(token);
        }
        
        BigDecimal balance = payload.get("balance");
        service.updateBalance(id, balance);
        
        return ResponseEntity.ok(Map.of(
                "message", "Balance updated successfully",
                "accountId", id,
                "newBalance", balance
        ));
    }
}

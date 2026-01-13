/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.controller;

/**
 *
 * @author steve
 */
import com.stevecompany.AccountService.entity.Account;
import com.stevecompany.AccountService.security.InternalRequestValidator;
import com.stevecompany.AccountService.service.AccountService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService service;
    private final InternalRequestValidator validator;

    public AccountController(AccountService service,
                             InternalRequestValidator validator) {
        this.service = service;
        this.validator = validator;
    }

    @PostMapping
    public Account create(@RequestBody Account account) {
        return service.create(account);
    }

    @GetMapping("/{id}")
    public Account get(@PathVariable UUID id) {
        return service.get(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Account> byCustomer(@PathVariable UUID customerId) {
        return service.byCustomer(customerId);
    }

    @PutMapping("/{id}/freeze")
    public void freeze(@PathVariable UUID id) {
        service.freeze(id);
    }

    @PutMapping("/{id}/block")
    public void block(@PathVariable UUID id) {
        service.block(id);
    }

    @PutMapping("/{id}/close")
    public void close(@PathVariable UUID id) {
        service.close(id);
    }

    @PutMapping("/{id}/balance")
    public void updateBalance(@PathVariable UUID id,
                              @RequestHeader("X-INTERNAL-TOKEN") String token,
                              @RequestBody BigDecimal balance) {
        validator.validate(token);
        service.updateBalance(id, balance);
    }
}

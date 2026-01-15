/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.event;

/**
 *
 * @author steve
 */
import java.math.BigDecimal;
import java.util.UUID;

public class AccountCreatedEvent {
    private UUID accountId;
    private UUID customerId;
    private String type;
    private BigDecimal balance;

    public AccountCreatedEvent() {}

    public AccountCreatedEvent(UUID accountId, UUID customerId, String type, BigDecimal balance) {
        this.accountId = accountId;
        this.customerId = customerId;
        this.type = type;
        this.balance = balance;
    }

    // Getters & Setters
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
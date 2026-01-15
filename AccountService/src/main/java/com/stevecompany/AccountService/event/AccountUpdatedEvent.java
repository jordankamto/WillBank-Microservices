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

public class AccountUpdatedEvent {
    private UUID accountId;
    private String status;
    private BigDecimal balance;
    private String updateType; // FREEZE, BLOCK, CLOSE, BALANCE_UPDATE

    public AccountUpdatedEvent() {}

    public AccountUpdatedEvent(UUID accountId, String status, BigDecimal balance, String updateType) {
        this.accountId = accountId;
        this.status = status;
        this.balance = balance;
        this.updateType = updateType;
    }

    // Getters & Setters
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public String getUpdateType() { return updateType; }
    public void setUpdateType(String updateType) { this.updateType = updateType; }
}
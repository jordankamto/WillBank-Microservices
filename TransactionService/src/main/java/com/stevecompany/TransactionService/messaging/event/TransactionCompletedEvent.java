/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.messaging.event;

/**
 *
 * @author steve
 */
import java.math.BigDecimal;
import java.util.UUID;

public class TransactionCompletedEvent {
    private UUID transactionId;
    private UUID accountId;
    private UUID targetAccountId; // Pour les transferts
    private String type;
    private BigDecimal amount;

    public TransactionCompletedEvent() {}

    public TransactionCompletedEvent(UUID transactionId, UUID accountId, UUID targetAccountId, 
                                      String type, BigDecimal amount) {
        this.transactionId = transactionId;
        this.accountId = accountId;
        this.targetAccountId = targetAccountId;
        this.type = type;
        this.amount = amount;
    }

    // Getters & Setters
    public UUID getTransactionId() { return transactionId; }
    public void setTransactionId(UUID transactionId) { this.transactionId = transactionId; }

    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }

    public UUID getTargetAccountId() { return targetAccountId; }
    public void setTargetAccountId(UUID targetAccountId) { this.targetAccountId = targetAccountId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
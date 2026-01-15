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

public class TransactionFailedEvent {
    private UUID transactionId;
    private UUID accountId;
    private String type;
    private BigDecimal amount;
    private String reason;

    public TransactionFailedEvent() {}

    public TransactionFailedEvent(UUID transactionId, UUID accountId, String type, 
                                   BigDecimal amount, String reason) {
        this.transactionId = transactionId;
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.reason = reason;
    }

    // Getters & Setters
    public UUID getTransactionId() { return transactionId; }
    public void setTransactionId(UUID transactionId) { this.transactionId = transactionId; }

    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
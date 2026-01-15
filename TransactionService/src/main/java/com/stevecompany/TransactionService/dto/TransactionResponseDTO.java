/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.dto;

/**
 *
 * @author steve
 */

import com.stevecompany.TransactionService.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionResponseDTO {
    private UUID transactionId;
    private UUID accountId;
    private UUID targetAccountId;
    private String type;
    private BigDecimal amount;
    private String status;
    private String message;
    private String failureReason;
    private LocalDateTime createdAt;

    public static TransactionResponseDTO fromEntity(Transaction transaction, String message) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.transactionId = transaction.getId();
        dto.accountId = transaction.getAccountId();
        dto.targetAccountId = transaction.getTargetAccountId();
        dto.type = transaction.getType().name();
        dto.amount = transaction.getAmount();
        dto.status = transaction.getStatus().name();
        dto.message = message;
        dto.failureReason = transaction.getFailureReason();
        dto.createdAt = transaction.getCreatedAt();
        return dto;
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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
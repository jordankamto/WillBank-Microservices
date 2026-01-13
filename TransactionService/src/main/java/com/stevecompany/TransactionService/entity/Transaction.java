/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.entity;

/**
 *
 * @author steve
 */
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID accountId;

    @Enumerated(EnumType.STRING)
    private Type type;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String failureReason;

    private LocalDateTime createdAt;

    public enum Type {
        DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT
    }

    public enum Status {
        SUCCESS, FAILED
    }

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    /* getters & setters */
    public UUID getId() { return id; }
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
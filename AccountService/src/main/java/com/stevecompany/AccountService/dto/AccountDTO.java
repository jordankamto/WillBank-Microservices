/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.dto;

/**
 *
 * @author steve
 */
import com.stevecompany.AccountService.entity.Account;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class AccountDTO {
    private UUID id;
    private UUID customerId;
    private String type;
    private BigDecimal balance;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AccountDTO fromEntity(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.id = account.getId();
        dto.customerId = account.getCustomerId();
        dto.type = account.getType().name();
        dto.balance = account.getBalance();
        dto.status = account.getStatus().name();
        dto.createdAt = account.getCreatedAt();
        dto.updatedAt = account.getUpdatedAt();
        return dto;
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
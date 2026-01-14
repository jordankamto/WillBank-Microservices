/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.event;

/**
 *
 * @author steve
 */
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Événement publié quand le statut d'un client change
 * Statuts : ACTIVE, SUSPENDED, CLOSED
 * Écouteurs : Account Service, Notification Service, Transaction Service
 */
public class CustomerStatusChangedEvent {
    private UUID customerId;
    private String email;
    private String previousStatus;
    private String newStatus;
    private LocalDateTime timestamp;

    public CustomerStatusChangedEvent() {
        this.timestamp = LocalDateTime.now();
    }

    public CustomerStatusChangedEvent(UUID customerId, String email, String previousStatus, String newStatus) {
        this.customerId = customerId;
        this.email = email;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.timestamp = LocalDateTime.now();
    }

    // GETTERS
    public UUID getCustomerId() { return customerId; }
    public String getEmail() { return email; }
    public String getPreviousStatus() { return previousStatus; }
    public String getNewStatus() { return newStatus; }
    public LocalDateTime getTimestamp() { return timestamp; }

    // SETTERS
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public void setEmail(String email) { this.email = email; }
    public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "CustomerStatusChangedEvent{" +
                "customerId=" + customerId +
                ", email='" + email + '\'' +
                ", previousStatus='" + previousStatus + '\'' +
                ", newStatus='" + newStatus + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
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

public class CustomerCreatedEvent {
    private UUID customerId;
    private String email;
    private String firstName;
    private String lastName;
    private String status;
    private LocalDateTime timestamp;

    public CustomerCreatedEvent() {
        this.timestamp = LocalDateTime.now();
    }

    public CustomerCreatedEvent(UUID customerId, String email, String firstName, String lastName, String status) {
        this.customerId = customerId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    // GETTERS
    public UUID getCustomerId() { return customerId; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getStatus() { return status; }
    public LocalDateTime getTimestamp() { return timestamp; }

    // SETTERS
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public void setEmail(String email) { this.email = email; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setStatus(String status) { this.status = status; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "CustomerCreatedEvent{" +
                "customerId=" + customerId +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", status='" + status + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
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
 * Événement publié quand le profil d'un client change
 * Écouteurs : Notification Service (notifier client), Audit Service, etc.
 */
public class CustomerProfileUpdatedEvent {
    private UUID customerId;
    private String email;
    private String firstName;
    private String lastName;
    private String address;
    private LocalDateTime timestamp;

    public CustomerProfileUpdatedEvent() {
        this.timestamp = LocalDateTime.now();
    }

    public CustomerProfileUpdatedEvent(UUID customerId, String email, String firstName, String lastName, String address) {
        this.customerId = customerId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.timestamp = LocalDateTime.now();
    }

    // GETTERS
    public UUID getCustomerId() { return customerId; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getAddress() { return address; }
    public LocalDateTime getTimestamp() { return timestamp; }

    // SETTERS
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public void setEmail(String email) { this.email = email; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setAddress(String address) { this.address = address; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "CustomerProfileUpdatedEvent{" +
                "customerId=" + customerId +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", address='" + address + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
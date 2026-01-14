/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.dto;

/**
 *
 * @author steve
 */
import com.stevecompany.CustomerService.entity.Customer;
import java.util.UUID;

public class CustomerExistsResponse {
    private boolean exists;
    private UUID customerId;
    private String status;

    public CustomerExistsResponse(boolean exists, UUID customerId, String status) {
        this.exists = exists;
        this.customerId = customerId;
        this.status = status;
    }

    public static CustomerExistsResponse found(Customer customer) {
        return new CustomerExistsResponse(true, customer.getId(), customer.getStatus().name());
    }

    public static CustomerExistsResponse notFound() {
        return new CustomerExistsResponse(false, null, null);
    }

    public boolean isExists() { return exists; }
    public UUID getCustomerId() { return customerId; }
    public String getStatus() { return status; }

    public void setExists(boolean exists) { this.exists = exists; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public void setStatus(String status) { this.status = status; }
}
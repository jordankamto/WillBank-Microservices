/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.client;

/**
 *
 * @author steve
 */
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Component
public class CustomerServiceClient {

    private static final Logger log = LoggerFactory.getLogger(CustomerServiceClient.class);
    private final RestTemplate restTemplate;
    private static final String CUSTOMER_SERVICE_URL = "http://CUSTOMER-SERVICE-WILLBANK";

    public CustomerServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CustomerExistsResponse checkCustomerExists(UUID customerId) {
        String url = CUSTOMER_SERVICE_URL + "/api/customers/" + customerId + "/exists";
        log.info("Calling Customer Service: {}", url);
        
        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            boolean exists = (Boolean) response.get("exists");
            boolean kycActive = (Boolean) response.get("kycActive");
            String status = (String) response.get("status");
            
            log.info("Customer {} - exists: {}, kycActive: {}, status: {}", 
                    customerId, exists, kycActive, status);
            
            return new CustomerExistsResponse(exists, kycActive, status);
        } catch (Exception e) {
            log.error("Error calling Customer Service for customer {}: {}", customerId, e.getMessage());
            return new CustomerExistsResponse(false, false, "ERROR");
        }
    }

    public static class CustomerExistsResponse {
        public final boolean exists;
        public final boolean kycActive;
        public final String status;

        public CustomerExistsResponse(boolean exists, boolean kycActive, String status) {
            this.exists = exists;
            this.kycActive = kycActive;
            this.status = status;
        }
    }
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CompositeService.client;

/**
 *
 * @author steve
 */
import com.stevecompany.CompositeService.dto.CustomerDTO;
import com.stevecompany.CompositeService.exception.ServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class CustomerServiceClient {

    private static final Logger log = LoggerFactory.getLogger(CustomerServiceClient.class);
    private static final String CUSTOMER_SERVICE_URL = "http://CUSTOMER-SERVICE-WILLBANK/api/customers";
    private final RestTemplate restTemplate;

    public CustomerServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CustomerDTO getCustomer(UUID customerId) {
        String url = CUSTOMER_SERVICE_URL + "/" + customerId;
        log.info("Calling Customer Service: {}", url);
        
        try {
            return restTemplate.getForObject(url, CustomerDTO.class);
        } catch (Exception e) {
            log.error("Error calling Customer Service for customer {}: {}", customerId, e.getMessage());
            throw new ServiceUnavailableException("Customer Service unavailable");
        }
    }
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CompositeService.client;

/**
 *
 * @author steve
 */
import com.stevecompany.CompositeService.dto.AccountDTO;
import com.stevecompany.CompositeService.exception.ServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Component
public class AccountServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AccountServiceClient.class);
    private static final String ACCOUNT_SERVICE_URL = "http://ACCOUNT-SERVICE-WILLBANK/api/accounts";
    private final RestTemplate restTemplate;

    public AccountServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<AccountDTO> getAccountsByCustomer(UUID customerId) {
        String url = ACCOUNT_SERVICE_URL + "/customer/" + customerId;
        log.info("Calling Account Service: {}", url);
        
        try {
            return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<AccountDTO>>() {}
            ).getBody();
        } catch (Exception e) {
            log.error("Error calling Account Service for customer {}: {}", customerId, e.getMessage());
            throw new ServiceUnavailableException("Account Service unavailable");
        }
    }

    public AccountDTO getAccount(UUID accountId) {
        String url = ACCOUNT_SERVICE_URL + "/" + accountId;
        log.info("Calling Account Service: {}", url);
        
        try {
            return restTemplate.getForObject(url, AccountDTO.class);
        } catch (Exception e) {
            log.error("Error calling Account Service for account {}: {}", accountId, e.getMessage());
            throw new ServiceUnavailableException("Account Service unavailable");
        }
    }
}
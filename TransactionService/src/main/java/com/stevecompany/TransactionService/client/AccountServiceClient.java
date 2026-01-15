/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.client;

/**
 *
 * @author steve
 */
import com.stevecompany.TransactionService.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Component
public class AccountServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AccountServiceClient.class);
    private static final String ACCOUNT_SERVICE_URL = "http://ACCOUNT-SERVICE-WILLBANK";
    private static final String INTERNAL_TOKEN = "INTERNAL_SECURE_TOKEN";

    private final RestTemplate restTemplate;

    public AccountServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Vérifie si un compte existe et est actif
     */
    public boolean accountExists(UUID accountId) {
        String url = ACCOUNT_SERVICE_URL + "/api/accounts/" + accountId;
        log.info("Checking if account {} exists", accountId);
        
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            String status = (String) response.getBody().get("status");
            boolean isActive = "ACTIVE".equals(status);
            log.info("Account {} exists and is active: {}", accountId, isActive);
            return isActive;
        } catch (Exception e) {
            log.error("Account {} not found or error: {}", accountId, e.getMessage());
            return false;
        }
    }

    /**
     * Récupère le solde d'un compte
     */
    public BigDecimal getBalance(UUID accountId) {
        String url = ACCOUNT_SERVICE_URL + "/api/accounts/" + accountId;
        log.info("Getting balance for account {}", accountId);
        
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Object balanceObj = response.getBody().get("balance");
            
            if (balanceObj instanceof Number) {
                return new BigDecimal(balanceObj.toString());
            }
            throw new BusinessException("Invalid balance format for account " + accountId);
        } catch (Exception e) {
            log.error("Error getting balance for account {}: {}", accountId, e.getMessage());
            throw new BusinessException("Cannot retrieve balance for account " + accountId);
        }
    }

    /**
     * Crédite un compte (ajoute de l'argent)
     */
    public void credit(UUID accountId, BigDecimal amount) {
        log.info("Crediting {} to account {}", amount, accountId);
        updateBalance(accountId, getBalance(accountId).add(amount));
    }

    /**
     * Débite un compte (retire de l'argent)
     */
    public void debit(UUID accountId, BigDecimal amount) {
        log.info("Debiting {} from account {}", amount, accountId);
        BigDecimal currentBalance = getBalance(accountId);
        BigDecimal newBalance = currentBalance.subtract(amount);
        
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Insufficient balance. Current: " + currentBalance + ", Required: " + amount);
        }
        
        updateBalance(accountId, newBalance);
    }

    /**
     * Met à jour le solde d'un compte (appel interne sécurisé)
     */
    private void updateBalance(UUID accountId, BigDecimal newBalance) {
        String url = ACCOUNT_SERVICE_URL + "/api/accounts/" + accountId + "/balance";
        log.info("Updating balance for account {} to {}", accountId, newBalance);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-INTERNAL-TOKEN", INTERNAL_TOKEN);
        headers.set("Content-Type", "application/json");
        
        Map<String, BigDecimal> body = Map.of("balance", newBalance);
        HttpEntity<Map<String, BigDecimal>> request = new HttpEntity<>(body, headers);
        
        try {
            restTemplate.exchange(url, HttpMethod.PUT, request, Map.class);
            log.info("Balance updated successfully for account {}", accountId);
        } catch (Exception e) {
            log.error("Error updating balance for account {}: {}", accountId, e.getMessage());
            throw new BusinessException("Failed to update account balance");
        }
    }
}
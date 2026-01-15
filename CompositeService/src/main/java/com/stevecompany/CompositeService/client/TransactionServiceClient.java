/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CompositeService.client;

/**
 *
 * @author steve
 */
import com.stevecompany.CompositeService.dto.TransactionDTO;
import com.stevecompany.CompositeService.exception.ServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
public class TransactionServiceClient {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceClient.class);
    private static final String TRANSACTION_SERVICE_URL = "http://TRANSACTION-SERVICE-WILLBANK/api/transactions";
    private final RestTemplate restTemplate;

    public TransactionServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<TransactionDTO> getRecentTransactions(UUID accountId, int limit) {
        String url = TRANSACTION_SERVICE_URL + "/account/" + accountId + "?page=0&size=" + limit;
        log.info("Calling Transaction Service: {}", url);
        
        try {
            // La réponse est paginée, on extrait le contenu
            return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<TransactionDTO>>() {}
            ).getBody();
        } catch (Exception e) {
            log.error("Error calling Transaction Service for account {}: {}", accountId, e.getMessage());
            throw new ServiceUnavailableException("Transaction Service unavailable");
        }
    }

    public List<TransactionDTO> getTransactionsByPeriod(UUID accountId, LocalDate from, LocalDate to) {
        String url = TRANSACTION_SERVICE_URL + "/account/" + accountId;
        log.info("Calling Transaction Service for period: {}", url);
        
        try {
            List<TransactionDTO> allTransactions = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<TransactionDTO>>() {}
            ).getBody();
            
            // Filtrer par période côté composite (ou ajouter paramètres au Transaction Service)
            return allTransactions.stream()
                .filter(tx -> {
                    LocalDate txDate = tx.getCreatedAt().toLocalDate();
                    return !txDate.isBefore(from) && !txDate.isAfter(to);
                })
                .toList();
        } catch (Exception e) {
            log.error("Error calling Transaction Service for account {}: {}", accountId, e.getMessage());
            throw new ServiceUnavailableException("Transaction Service unavailable");
        }
    }

    public List<TransactionDTO> searchTransactions(String type, LocalDate date) {
        StringBuilder url = new StringBuilder(TRANSACTION_SERVICE_URL + "/search?");
        
        if (type != null) url.append("type=").append(type).append("&");
        if (date != null) url.append("date=").append(date);
        
        log.info("Calling Transaction Service search: {}", url);
        
        try {
            return restTemplate.exchange(
                url.toString(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<TransactionDTO>>() {}
            ).getBody();
        } catch (Exception e) {
            log.error("Error calling Transaction Service search: {}", e.getMessage());
            throw new ServiceUnavailableException("Transaction Service unavailable");
        }
    }
}
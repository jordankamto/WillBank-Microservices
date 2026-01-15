/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CompositeService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.CompositeService.client.AccountServiceClient;
import com.stevecompany.CompositeService.client.CustomerServiceClient;
import com.stevecompany.CompositeService.client.TransactionServiceClient;
import com.stevecompany.CompositeService.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CompositeService {

    private static final Logger log = LoggerFactory.getLogger(CompositeService.class);
    private final CustomerServiceClient customerClient;
    private final AccountServiceClient accountClient;
    private final TransactionServiceClient transactionClient;

    public CompositeService(CustomerServiceClient customerClient,
                            AccountServiceClient accountClient,
                            TransactionServiceClient transactionClient) {
        this.customerClient = customerClient;
        this.accountClient = accountClient;
        this.transactionClient = transactionClient;
    }

    /**
     * Dashboard client : infos client + comptes + dernières transactions
     */
    public DashboardResponseDTO getDashboard(UUID customerId) {
        log.info("Building dashboard for customer: {}", customerId);
        
        DashboardResponseDTO dashboard = new DashboardResponseDTO();
        
        // 1. Récupérer les infos client
        CustomerDTO customer = customerClient.getCustomer(customerId);
        dashboard.setCustomer(customer);
        
        // 2. Récupérer tous les comptes du client
        List<AccountDTO> accounts = accountClient.getAccountsByCustomer(customerId);
        dashboard.setAccounts(accounts);
        
        // 3. Récupérer les dernières transactions de tous les comptes (max 10 par compte)
        List<TransactionDTO> recentTransactions = new ArrayList<>();
        for (AccountDTO account : accounts) {
            try {
                List<TransactionDTO> accountTransactions = transactionClient.getRecentTransactions(account.getId(), 10);
                recentTransactions.addAll(accountTransactions);
            } catch (Exception e) {
                log.warn("Could not fetch transactions for account {}: {}", account.getId(), e.getMessage());
            }
        }
        
        // Limiter à 20 transactions les plus récentes
        recentTransactions.sort((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()));
        dashboard.setRecentTransactions(
            recentTransactions.size() > 20 
                ? recentTransactions.subList(0, 20) 
                : recentTransactions
        );
        
        log.info("Dashboard built: {} accounts, {} recent transactions", 
                accounts.size(), dashboard.getRecentTransactions().size());
        
        return dashboard;
    }

    /**
     * Relevé d'un compte sur une période
     */
    public AccountStatementDTO getAccountStatement(UUID accountId, LocalDate from, LocalDate to) {
        log.info("Building account statement for account {} from {} to {}", accountId, from, to);
        
        AccountStatementDTO statement = new AccountStatementDTO();
        
        // 1. Récupérer les infos du compte
        AccountDTO account = accountClient.getAccount(accountId);
        statement.setAccount(account);
        
        // 2. Récupérer les transactions sur la période
        List<TransactionDTO> transactions = transactionClient.getTransactionsByPeriod(accountId, from, to);
        statement.setTransactions(transactions);
        statement.setFromDate(from);
        statement.setToDate(to);
        
        log.info("Account statement built: {} transactions", transactions.size());
        
        return statement;
    }

    /**
     * Recherche de transactions par type et/ou date
     */
    public List<TransactionDTO> searchTransactions(String type, LocalDate date) {
        log.info("Searching transactions - type: {}, date: {}", type, date);
        return transactionClient.searchTransactions(type, date);
    }
}
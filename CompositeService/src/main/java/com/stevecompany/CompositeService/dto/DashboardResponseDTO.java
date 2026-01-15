/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CompositeService.dto;

/**
 *
 * @author steve
 */
import java.util.List;

public class DashboardResponseDTO {
    private CustomerDTO customer;
    private List<AccountDTO> accounts;
    private List<TransactionDTO> recentTransactions;

    // Getters & Setters
    public CustomerDTO getCustomer() { return customer; }
    public void setCustomer(CustomerDTO customer) { this.customer = customer; }
    public List<AccountDTO> getAccounts() { return accounts; }
    public void setAccounts(List<AccountDTO> accounts) { this.accounts = accounts; }
    public List<TransactionDTO> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<TransactionDTO> recentTransactions) { 
        this.recentTransactions = recentTransactions; 
    }
}
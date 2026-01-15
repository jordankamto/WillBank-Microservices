/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CompositeService.dto;

/**
 *
 * @author steve
 */
import java.time.LocalDate;
import java.util.List;

public class AccountStatementDTO {
    private AccountDTO account;
    private LocalDate fromDate;
    private LocalDate toDate;
    private List<TransactionDTO> transactions;

    // Getters & Setters
    public AccountDTO getAccount() { return account; }
    public void setAccount(AccountDTO account) { this.account = account; }
    public LocalDate getFromDate() { return fromDate; }
    public void setFromDate(LocalDate fromDate) { this.fromDate = fromDate; }
    public LocalDate getToDate() { return toDate; }
    public void setToDate(LocalDate toDate) { this.toDate = toDate; }
    public List<TransactionDTO> getTransactions() { return transactions; }
    public void setTransactions(List<TransactionDTO> transactions) { this.transactions = transactions; }
}
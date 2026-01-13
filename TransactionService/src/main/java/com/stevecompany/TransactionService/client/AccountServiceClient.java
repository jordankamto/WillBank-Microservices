/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.client;

/**
 *
 * @author steve
 */
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class AccountServiceClient {

    public void credit(UUID accountId, BigDecimal amount) {
        // appel REST interne sécurisé (implémentation réelle plus tard)
    }

    public void debit(UUID accountId, BigDecimal amount) {
    }
}
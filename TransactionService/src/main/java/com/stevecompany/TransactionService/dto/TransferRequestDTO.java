/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.dto;

/**
 *
 * @author steve
 */

import java.math.BigDecimal;
import java.util.UUID;

public class TransferRequestDTO {
    public UUID sourceAccountId;
    public UUID targetAccountId;
    public BigDecimal amount;
}
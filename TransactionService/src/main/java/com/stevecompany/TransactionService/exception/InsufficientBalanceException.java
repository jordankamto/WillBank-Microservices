/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.exception;

/**
 *
 * @author steve
 */
public class InsufficientBalanceException extends BusinessException {
    public InsufficientBalanceException() {
        super("Insufficient balance");
    }
}
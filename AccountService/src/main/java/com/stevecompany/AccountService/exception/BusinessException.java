/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.exception;

/**
 *
 * @author steve
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.security;

/**
 *
 * @author steve
 */
import org.springframework.stereotype.Component;

@Component
public class InternalRequestValidator {

    private static final String INTERNAL_TOKEN = "INTERNAL_SECURE_TOKEN";

    public void validate(String token) {
        if (!INTERNAL_TOKEN.equals(token)) {
            throw new SecurityException("Unauthorized internal call");
        }
    }
}
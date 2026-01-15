/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.security;

/**
 *
 * @author steve
 */
import org.springframework.stereotype.Component;

@Component
public class InternalRequestValidator {
    public boolean isInternal(String token) {
        return true;
    }
}

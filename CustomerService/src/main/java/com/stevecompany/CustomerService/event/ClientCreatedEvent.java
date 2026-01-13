/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.event;

/**
 *
 * @author steve
 */
import java.util.UUID;

public record ClientCreatedEvent(UUID customerId, String email) {}

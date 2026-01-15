/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.messaging.event;

/**
 *
 * @author steve
 */
import java.util.UUID;

public class TransactionCompletedEvent {
    public UUID customerId;
    public String type;
    public double amount;
}
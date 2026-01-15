/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.NotificationService.external.firebase.FirebasePushSender;
import org.springframework.stereotype.Service;

@Service
public class PushNotificationService {

    private final FirebasePushSender sender;

    public PushNotificationService(FirebasePushSender sender) {
        this.sender = sender;
    }

    public void send(String message) {
        sender.send(message);
    }
}
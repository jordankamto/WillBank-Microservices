/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.external.firebase;

/**
 *
 * @author steve
 */
import org.springframework.stereotype.Component;

@Component
public class FirebasePushSender {

    public void send(String message) {
        System.out.println("[FCM] Push sent: " + message);
    }
}

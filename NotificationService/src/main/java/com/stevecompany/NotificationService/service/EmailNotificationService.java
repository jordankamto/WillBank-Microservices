/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.NotificationService.external.smtp.SmtpEmailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private final SmtpEmailSender sender;

    public EmailNotificationService(SmtpEmailSender sender) {
        this.sender = sender;
    }

    public void send(String message) {
        sender.send(message);
    }
}
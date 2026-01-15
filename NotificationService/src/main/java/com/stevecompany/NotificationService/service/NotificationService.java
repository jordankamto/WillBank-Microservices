/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.NotificationService.entity.Notification;
import com.stevecompany.NotificationService.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final EmailNotificationService emailService;
    private final PushNotificationService pushService;

    public NotificationService(NotificationRepository repository,
                               EmailNotificationService emailService,
                               PushNotificationService pushService) {
        this.repository = repository;
        this.emailService = emailService;
        this.pushService = pushService;
    }

    public void sendEmail(UUID customerId, String title, String message) {
        Notification n = build(customerId, title, message, Notification.Channel.EMAIL);
        try {
            emailService.send(message);
            n.setStatus(Notification.Status.SENT);
        } catch (Exception e) {
            n.setStatus(Notification.Status.FAILED);
        }
        repository.save(n);
    }

    public void sendPush(UUID customerId, String title, String message) {
        Notification n = build(customerId, title, message, Notification.Channel.PUSH);
        try {
            pushService.send(message);
            n.setStatus(Notification.Status.SENT);
        } catch (Exception e) {
            n.setStatus(Notification.Status.FAILED);
        }
        repository.save(n);
    }

    private Notification build(UUID customerId, String title, String message, Notification.Channel channel) {
        Notification n = new Notification();
        n.setCustomerId(customerId);
        n.setTitle(title);
        n.setMessage(message);
        n.setChannel(channel);
        return n;
    }
}
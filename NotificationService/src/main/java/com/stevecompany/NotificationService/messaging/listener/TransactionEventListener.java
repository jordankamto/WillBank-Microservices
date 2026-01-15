/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.messaging.listener;

/**
 *
 * @author steve
 */
import com.stevecompany.NotificationService.messaging.event.TransactionCompletedEvent;
import com.stevecompany.NotificationService.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionEventListener {

    private final NotificationService notificationService;

    public TransactionEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = "transaction.completed.queue")
    public void onTransactionCompleted(TransactionCompletedEvent event) {
        String msg = "Transaction " + event.type + " of " + event.amount + " completed.";
        notificationService.sendEmail(event.customerId, "Transaction Alert", msg);
        notificationService.sendPush(event.customerId, "Transaction Alert", msg);
    }
}
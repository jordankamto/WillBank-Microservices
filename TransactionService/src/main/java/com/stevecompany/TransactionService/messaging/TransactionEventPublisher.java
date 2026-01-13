/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.messaging;

/**
 *
 * @author steve
 */
import com.stevecompany.TransactionService.entity.Transaction;
import com.stevecompany.TransactionService.messaging.event.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class TransactionEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public TransactionEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishSuccess(Transaction tx) {
        TransactionCompletedEvent event = new TransactionCompletedEvent();
        event.transactionId = tx.getId();
        event.accountId = tx.getAccountId();
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "transaction.success", event);
    }

    public void publishFailure(Transaction tx) {
        TransactionFailedEvent event = new TransactionFailedEvent();
        event.transactionId = tx.getId();
        event.reason = tx.getFailureReason();
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "transaction.failed", event);
    }
}
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class TransactionEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(TransactionEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public TransactionEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishSuccess(Transaction tx) {
        log.info("Publishing TransactionCompletedEvent for transaction: {}", tx.getId());
        
        TransactionCompletedEvent event = new TransactionCompletedEvent(
                tx.getId(),
                tx.getAccountId(),
                tx.getTargetAccountId(),
                tx.getType().name(),
                tx.getAmount()
        );
        
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY_SUCCESS,
                event
        );
    }

    public void publishFailure(Transaction tx) {
        log.warn("Publishing TransactionFailedEvent for transaction: {} - reason: {}", 
                tx.getId(), tx.getFailureReason());
        
        TransactionFailedEvent event = new TransactionFailedEvent(
                tx.getId(),
                tx.getAccountId(),
                tx.getType().name(),
                tx.getAmount(),
                tx.getFailureReason()
        );
        
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY_FAILED,
                event
        );
    }
}
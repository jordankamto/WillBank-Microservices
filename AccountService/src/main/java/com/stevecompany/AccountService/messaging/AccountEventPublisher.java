/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.messaging;

/**
 *
 * @author steve
 */
import com.stevecompany.AccountService.event.AccountCreatedEvent;
import com.stevecompany.AccountService.event.AccountUpdatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class AccountEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(AccountEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public AccountEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishAccountCreated(AccountCreatedEvent event) {
        log.info("Publishing AccountCreatedEvent for account: {}", event.getAccountId());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ACCOUNT_EXCHANGE,
                RabbitMQConfig.ACCOUNT_CREATED_ROUTING_KEY,
                event
        );
    }

    public void publishAccountUpdated(AccountUpdatedEvent event) {
        log.info("Publishing AccountUpdatedEvent for account: {} - updateType: {}", 
                event.getAccountId(), event.getUpdateType());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ACCOUNT_EXCHANGE,
                RabbitMQConfig.ACCOUNT_UPDATED_ROUTING_KEY,
                event
        );
    }
}
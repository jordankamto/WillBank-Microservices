/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.messaging;

/**
 *
 * @author steve
 */
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class AccountEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public AccountEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishAccountEvent(Object event) {
        rabbitTemplate.convertAndSend(
                "account.exchange",
                "account.event",
                event
        );
    }
}
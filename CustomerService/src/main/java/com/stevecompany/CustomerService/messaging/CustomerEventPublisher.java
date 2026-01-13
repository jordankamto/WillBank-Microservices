/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.messaging;

/**
 *
 * @author steve
 */
import com.stevecompany.CustomerService.event.ClientCreatedEvent;
import com.stevecompany.CustomerService.event.ClientSuspendedEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class CustomerEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public CustomerEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishClientCreated(ClientCreatedEvent event) {
        rabbitTemplate.convertAndSend("customer.exchange", "customer.created", event);
    }

    public void publishClientSuspended(ClientSuspendedEvent event) {
        rabbitTemplate.convertAndSend("customer.exchange", "customer.suspended", event);
    }
}
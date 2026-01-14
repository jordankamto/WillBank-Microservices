/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.messaging;

/**
 *
 * @author steve
 */
import com.stevecompany.CustomerService.config.RabbitMQConfig;
import com.stevecompany.CustomerService.event.CustomerCreatedEvent;
import com.stevecompany.CustomerService.event.CustomerProfileUpdatedEvent;
import com.stevecompany.CustomerService.event.CustomerStatusChangedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class CustomerEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(CustomerEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public CustomerEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Publie un événement quand un nouveau client est créé
     * Écouteurs attendus : Account Service, Notification Service
     * 
     * @param event CustomerCreatedEvent
     */
    public void publishCustomerCreated(CustomerCreatedEvent event) {
        log.info("Publishing CustomerCreatedEvent for customer: {}", event.getCustomerId());
        try {
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.ROUTING_KEY_CREATED,
                event
            );
            log.info("CustomerCreatedEvent published successfully");
        } catch (Exception e) {
            log.error("Error publishing CustomerCreatedEvent", e);
            throw new RuntimeException("Failed to publish customer created event", e);
        }
    }

    /**
     * Publie un événement quand le profil d'un client est modifié
     * Écouteurs attendus : Notification Service, Audit Service
     * 
     * @param event CustomerProfileUpdatedEvent
     */
    public void publishCustomerProfileUpdated(CustomerProfileUpdatedEvent event) {
        log.info("Publishing CustomerProfileUpdatedEvent for customer: {}", event.getCustomerId());
        try {
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.ROUTING_KEY_PROFILE_UPDATED,
                event
            );
            log.info("CustomerProfileUpdatedEvent published successfully");
        } catch (Exception e) {
            log.error("Error publishing CustomerProfileUpdatedEvent", e);
            throw new RuntimeException("Failed to publish customer profile updated event", e);
        }
    }

    /**
     * Publie un événement quand le statut d'un client change
     * Statuts : ACTIVE → SUSPENDED, SUSPENDED → ACTIVE, CLOSED, etc.
     * Écouteurs attendus : Account Service, Notification Service, Transaction Service
     * 
     * @param event CustomerStatusChangedEvent
     */
    public void publishCustomerStatusChanged(CustomerStatusChangedEvent event) {
        log.info("Publishing CustomerStatusChangedEvent for customer: {} ({} → {})", 
            event.getCustomerId(), event.getPreviousStatus(), event.getNewStatus());
        try {
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.ROUTING_KEY_STATUS_CHANGED,
                event
            );
            log.info("CustomerStatusChangedEvent published successfully");
        } catch (Exception e) {
            log.error("Error publishing CustomerStatusChangedEvent", e);
            throw new RuntimeException("Failed to publish customer status changed event", e);
        }
    }
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.config;

/**
 *
 * @author steve
 */
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // ========== EXCHANGE & ROUTING KEYS ==========
    public static final String EXCHANGE_NAME = "customer.exchange";
    
    // Queues
    public static final String QUEUE_CREATED = "customer.created.queue";
    public static final String QUEUE_PROFILE_UPDATED = "customer.profile.updated.queue";
    public static final String QUEUE_STATUS_CHANGED = "customer.status.changed.queue";
    
    // Routing Keys
    public static final String ROUTING_KEY_CREATED = "customer.created";
    public static final String ROUTING_KEY_PROFILE_UPDATED = "customer.profile.updated";
    public static final String ROUTING_KEY_STATUS_CHANGED = "customer.status.changed";

    // ========== EXCHANGE ==========
    @Bean
    public TopicExchange customerExchange() {
        return new TopicExchange(EXCHANGE_NAME, true, false);
    }

    // ========== QUEUES ==========
    @Bean
    public Queue customerCreatedQueue() {
        return new Queue(QUEUE_CREATED, true);
    }

    @Bean
    public Queue customerProfileUpdatedQueue() {
        return new Queue(QUEUE_PROFILE_UPDATED, true);
    }

    @Bean
    public Queue customerStatusChangedQueue() {
        return new Queue(QUEUE_STATUS_CHANGED, true);
    }

    // ========== BINDINGS ==========
    @Bean
    public Binding bindingCreated() {
        return BindingBuilder
                .bind(customerCreatedQueue())
                .to(customerExchange())
                .with(ROUTING_KEY_CREATED);
    }

    @Bean
    public Binding bindingProfileUpdated() {
        return BindingBuilder
                .bind(customerProfileUpdatedQueue())
                .to(customerExchange())
                .with(ROUTING_KEY_PROFILE_UPDATED);
    }

    @Bean
    public Binding bindingStatusChanged() {
        return BindingBuilder
                .bind(customerStatusChangedQueue())
                .to(customerExchange())
                .with(ROUTING_KEY_STATUS_CHANGED);
    }

    // ========== MESSAGE CONVERTER & TEMPLATE ==========
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
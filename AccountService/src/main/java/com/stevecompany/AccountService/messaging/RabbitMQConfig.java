/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.messaging;

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

    // ===== CONSUMER : Événements venant de Customer Service =====
    public static final String CUSTOMER_SUSPENDED_QUEUE = "customer.suspended.queue";
    public static final String CUSTOMER_EXCHANGE = "customer.exchange";
    public static final String CUSTOMER_SUSPENDED_ROUTING_KEY = "customer.suspended";

    // ===== PRODUCER : Événements de Account Service =====
    public static final String ACCOUNT_EXCHANGE = "account.exchange";
    public static final String ACCOUNT_CREATED_QUEUE = "account.created.queue";
    public static final String ACCOUNT_UPDATED_QUEUE = "account.updated.queue";
    public static final String ACCOUNT_CREATED_ROUTING_KEY = "account.created";
    public static final String ACCOUNT_UPDATED_ROUTING_KEY = "account.updated";

    // ----- CONSUMER Config -----
    @Bean
    public Queue customerSuspendedQueue() {
        return QueueBuilder.durable(CUSTOMER_SUSPENDED_QUEUE).build();
    }

    @Bean
    public TopicExchange customerExchange() {
        return new TopicExchange(CUSTOMER_EXCHANGE);
    }

    @Bean
    public Binding customerSuspendedBinding() {
        return BindingBuilder
                .bind(customerSuspendedQueue())
                .to(customerExchange())
                .with(CUSTOMER_SUSPENDED_ROUTING_KEY);
    }

    // ----- PRODUCER Config -----
    @Bean
    public TopicExchange accountExchange() {
        return new TopicExchange(ACCOUNT_EXCHANGE);
    }

    @Bean
    public Queue accountCreatedQueue() {
        return QueueBuilder.durable(ACCOUNT_CREATED_QUEUE).build();
    }

    @Bean
    public Queue accountUpdatedQueue() {
        return QueueBuilder.durable(ACCOUNT_UPDATED_QUEUE).build();
    }

    @Bean
    public Binding accountCreatedBinding() {
        return BindingBuilder
                .bind(accountCreatedQueue())
                .to(accountExchange())
                .with(ACCOUNT_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding accountUpdatedBinding() {
        return BindingBuilder
                .bind(accountUpdatedQueue())
                .to(accountExchange())
                .with(ACCOUNT_UPDATED_ROUTING_KEY);
    }

    // ----- Message Converter -----
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
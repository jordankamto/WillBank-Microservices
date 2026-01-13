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
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String CUSTOMER_SUSPENDED_QUEUE = "customer.suspended.queue";
    public static final String CUSTOMER_EXCHANGE = "customer.exchange";
    public static final String CUSTOMER_SUSPENDED_ROUTING_KEY = "customer.suspended";

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
}
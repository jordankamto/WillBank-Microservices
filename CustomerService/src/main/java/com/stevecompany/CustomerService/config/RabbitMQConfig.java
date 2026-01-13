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

    public static final String EXCHANGE_NAME = "customer.exchange";
    public static final String QUEUE_CREATED = "customer.created.queue";
    public static final String QUEUE_SUSPENDED = "customer.suspended.queue";
    public static final String ROUTING_KEY_CREATED = "customer.created";
    public static final String ROUTING_KEY_SUSPENDED = "customer.suspended";

    @Bean
    public TopicExchange customerExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue customerCreatedQueue() {
        return new Queue(QUEUE_CREATED, true);
    }

    @Bean
    public Queue customerSuspendedQueue() {
        return new Queue(QUEUE_SUSPENDED, true);
    }

    @Bean
    public Binding bindingCreated() {
        return BindingBuilder
                .bind(customerCreatedQueue())
                .to(customerExchange())
                .with(ROUTING_KEY_CREATED);
    }

    @Bean
    public Binding bindingSuspended() {
        return BindingBuilder
                .bind(customerSuspendedQueue())
                .to(customerExchange())
                .with(ROUTING_KEY_SUSPENDED);
    }

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
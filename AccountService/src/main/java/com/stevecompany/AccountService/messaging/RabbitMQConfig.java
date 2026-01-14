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
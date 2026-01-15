/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.messaging;

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

    public static final String EXCHANGE = "transaction.exchange";
    public static final String QUEUE_SUCCESS = "transaction.completed.queue";
    public static final String QUEUE_FAILED = "transaction.failed.queue";
    public static final String ROUTING_KEY_SUCCESS = "transaction.success";
    public static final String ROUTING_KEY_FAILED = "transaction.failed";

    @Bean
    public TopicExchange transactionExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue transactionCompletedQueue() {
        return QueueBuilder.durable(QUEUE_SUCCESS).build();
    }

    @Bean
    public Queue transactionFailedQueue() {
        return QueueBuilder.durable(QUEUE_FAILED).build();
    }

    @Bean
    public Binding transactionSuccessBinding() {
        return BindingBuilder
                .bind(transactionCompletedQueue())
                .to(transactionExchange())
                .with(ROUTING_KEY_SUCCESS);
    }

    @Bean
    public Binding transactionFailedBinding() {
        return BindingBuilder
                .bind(transactionFailedQueue())
                .to(transactionExchange())
                .with(ROUTING_KEY_FAILED);
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
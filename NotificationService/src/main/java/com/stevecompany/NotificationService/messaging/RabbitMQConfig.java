/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.messaging;

/**
 *
 * @author steve
 */
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    Queue transactionCompletedQueue() {
        return new Queue("transaction.completed.queue", true);
    }

    @Bean
    Queue transactionFailedQueue() {
        return new Queue("transaction.failed.queue", true);
    }

    @Bean
    Queue customerSuspendedQueue() {
        return new Queue("customer.suspended.queue", true);
    }
}
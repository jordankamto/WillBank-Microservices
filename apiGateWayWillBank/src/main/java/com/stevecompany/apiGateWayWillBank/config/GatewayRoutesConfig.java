/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.apiGateWayWillBank.config;

/**
 *
 * @author steve
 */
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("customer-service", r -> r
                .path("/api/customers/**")
                .filters(f -> f.circuitBreaker(c -> c
                .setName("customerCB")
                .setFallbackUri("forward:/fallback/customer")))
                .uri("lb://CUSTOMER-SERVICE"))
                .route("account-service", r -> r
                .path("/api/accounts/**")
                .filters(f -> f.circuitBreaker(c -> c
                .setName("accountCB")
                .setFallbackUri("forward:/fallback/account")))
                .uri("lb://ACCOUNT-SERVICE"))
                .route("transaction-service", r -> r
                .path("/api/transactions/**")
                .filters(f -> f.circuitBreaker(c -> c
                .setName("transactionCB")
                .setFallbackUri("forward:/fallback/transaction")))
                .uri("lb://TRANSACTION-SERVICE"))
                .route("notification-service", r -> r
                .path("/api/notifications/**")
                .uri("lb://NOTIFICATION-SERVICE"))
                .route("composite-service", r -> r
                .path("/api/dashboard/**")
                .uri("lb://COMPOSITE-SERVICE"))
                .build();
    }
}

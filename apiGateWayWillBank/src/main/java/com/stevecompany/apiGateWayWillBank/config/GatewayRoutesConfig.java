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
                    .uri("lb://CUSTOMER-SERVICE-WILLBANK"))
                
                .route("account-service", r -> r
                    .path("/api/accounts/**")
                    .uri("lb://ACCOUNT-SERVICE-WILLBANK"))
                
                .route("transaction-service", r -> r
                    .path("/api/transactions/**")
                    .uri("lb://TRANSACTION-SERVICE-WILLBANK"))
                
                .route("composite-service", r -> r
                    .path("/api/dashboard/**")
                    .uri("lb://COMPOSITE-SERVICE-WILLBANK"))
                
                .route("notification-service", r -> r
                    .path("/api/notifications/**")
                    .uri("lb://NOTIFICATION-SERVICE-WILLBANK"))
                
                .build();
    }
}

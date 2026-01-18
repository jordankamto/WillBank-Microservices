/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.apiGateWayWillBank.config;

/**
 *
 * @author steve
 */
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${gateway.url:http://localhost:8080}")
    private String gatewayUrl;

    @Value("${account.service.url:http://localhost:8081}")
    private String accountServiceUrl;

    @Value("${transaction.service.url:http://localhost:8082}")
    private String transactionServiceUrl;

    @Value("${notification.service.url:http://localhost:8083}")
    private String notificationServiceUrl;

    @Value("${composite.service.url:http://localhost:8084}")
    private String compositeServiceUrl;

    @Bean
    public CorsWebFilter corsWebFilter() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",   // Frontend
                gatewayUrl,
                accountServiceUrl,
                transactionServiceUrl,
                notificationServiceUrl,
                compositeServiceUrl
        ));

        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}

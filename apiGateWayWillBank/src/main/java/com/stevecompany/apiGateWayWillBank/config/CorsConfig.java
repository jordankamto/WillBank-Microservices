/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.config;

/**
 *
 * @author steve
 */
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ UNIQUEMENT les services autorisés
        configuration.setAllowedOrigins(Arrays.asList(
                gatewayUrl,
                accountServiceUrl,
                transactionServiceUrl,
                notificationServiceUrl,
                compositeServiceUrl
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Content-Type", "Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

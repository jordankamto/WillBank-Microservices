/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.apiGateWayWillBank.filter;

/**
 *
 * @author steve
 */
import com.stevecompany.apiGateWayWillBank.util.JwtUtils;
import com.stevecompany.apiGateWayWillBank.config.RateLimiterConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
            org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        String clientIp = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();

        // Vérification JWT
        if (!JwtUtils.isValid(authHeader)) {
            log.warn("UNAUTHORIZED request from {}", clientIp);
            return unauthorizedResponse(exchange);
        }

        // Rate limiting simple
        var counter = RateLimiterConfig.COUNTERS.computeIfAbsent(clientIp, k -> new RateLimiterConfig.RequestCounter());
        long now = System.currentTimeMillis();

        if (now - counter.timestamp > RateLimiterConfig.WINDOW_MS) {
            counter.count.set(0);
            counter.timestamp = now;
        }

        if (counter.count.incrementAndGet() > RateLimiterConfig.MAX_REQUESTS) {
            log.warn("RATE LIMIT exceeded for {}", clientIp);
            return tooManyRequestsResponse(exchange);
        }

        return chain.filter(exchange);
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String jsonResponse = "{\"error\":\"Unauthorized\",\"message\":\"Invalid or missing authentication token\",\"status\":401}";
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(jsonResponse.getBytes(StandardCharsets.UTF_8));

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    private Mono<Void> tooManyRequestsResponse(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String jsonResponse = "{\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please try again later.\",\"status\":429}";
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(jsonResponse.getBytes(StandardCharsets.UTF_8));

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -1;
    }
}

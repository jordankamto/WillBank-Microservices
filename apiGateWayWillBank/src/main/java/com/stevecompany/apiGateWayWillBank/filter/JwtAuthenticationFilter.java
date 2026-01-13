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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
            org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        String clientIp = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();

        if (!JwtUtils.isValid(authHeader)) {
            log.warn("UNAUTHORIZED request from {}", clientIp);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
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
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.apiGateWayWillBank.config;

/**
 *
 * @author steve
 */
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class RateLimiterConfig {

    public static final int MAX_REQUESTS = 10;
    public static final long WINDOW_MS = 1000;

    public static final ConcurrentHashMap<String, RequestCounter> COUNTERS = new ConcurrentHashMap<>();

    public static class RequestCounter {

        public AtomicInteger count = new AtomicInteger(0);
        public long timestamp = Instant.now().toEpochMilli();
    }
}

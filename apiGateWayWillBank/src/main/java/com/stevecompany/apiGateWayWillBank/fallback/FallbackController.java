/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.apiGateWayWillBank.fallback;

/**
 *
 * @author steve
 */
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
public class FallbackController {

    @RequestMapping(value = "/fallback/customer", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Map<String, Object>> customerFallback() {
        return Mono.just(Map.of(
                "error", "Service Unavailable",
                "message", "Customer service is currently unavailable. Please try again later.",
                "service", "customer-service",
                "status", HttpStatus.SERVICE_UNAVAILABLE.value()
        ));
    }

    @RequestMapping(value = "/fallback/account", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Map<String, Object>> accountFallback() {
        return Mono.just(Map.of(
                "error", "Service Unavailable",
                "message", "Account service is currently unavailable. Please try again later.",
                "service", "account-service",
                "status", HttpStatus.SERVICE_UNAVAILABLE.value()
        ));
    }

    @RequestMapping(value = "/fallback/transaction", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Map<String, Object>> transactionFallback() {
        return Mono.just(Map.of(
                "error", "Service Unavailable",
                "message", "Transaction service is currently unavailable. Please try again later.",
                "service", "transaction-service",
                "status", HttpStatus.SERVICE_UNAVAILABLE.value()
        ));
    }
}

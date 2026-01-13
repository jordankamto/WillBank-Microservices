/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.apiGateWayWillBank.fallback;

/**
 *
 * @author steve
 */
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class FallbackController {

    @RequestMapping("/fallback/customer")
    public Mono<String> customerFallback() {
        return Mono.just("Customer service unavailable");
    }

    @RequestMapping("/fallback/account")
    public Mono<String> accountFallback() {
        return Mono.just("Account service unavailable");
    }

    @RequestMapping("/fallback/transaction")
    public Mono<String> transactionFallback() {
        return Mono.just("Transaction service unavailable");
    }
}

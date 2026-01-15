/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.controller;

/**
 *
 * @author steve
 */
import com.stevecompany.NotificationService.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/customer/{customerId}")
    public Object getByCustomer(@PathVariable UUID customerId) {
        return repository.findByCustomerId(customerId);
    }
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.controller;

/**
 *
 * @author steve
 */
import com.stevecompany.CustomerService.dto.CustomerDTO;
import com.stevecompany.CustomerService.entity.Customer;
import com.stevecompany.CustomerService.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> create(@RequestBody Customer customer) {
        log.info("Received POST /api/customers - firstName: {}, email: {}", 
                customer.getFirstName(), customer.getEmail());
        try {
            Customer created = service.create(customer);
            log.info("Customer created successfully with ID: {}", created.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(CustomerDTO.fromEntity(created));
        } catch (Exception e) {
            log.error("Error creating customer", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> get(@PathVariable UUID id) {
        log.info("Received GET /api/customers/{}", id);
        Customer customer = service.get(id);
        return ResponseEntity.ok(CustomerDTO.fromEntity(customer));
    }

    @GetMapping
    public ResponseEntity<?> search(@RequestParam(required = false) String email,
                                     @RequestParam(required = false) String phone) {
        log.info("Received GET /api/customers - email: {}, phone: {}", email, phone);
        
        // Si aucun paramètre, retourner tous les clients
        if (email == null && phone == null) {
            List<CustomerDTO> customers = service.findAll().stream()
                    .map(CustomerDTO::fromEntity)
                    .collect(Collectors.toList());
            log.info("Returning {} customers", customers.size());
            return ResponseEntity.ok(customers);
        }
        
        if (email != null) {
            return service.findByEmail(email)
                    .map(c -> ResponseEntity.ok(CustomerDTO.fromEntity(c)))
                    .orElse(ResponseEntity.notFound().build());
        }
        if (phone != null) {
            return service.findByPhone(phone)
                    .map(c -> ResponseEntity.ok(CustomerDTO.fromEntity(c)))
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.badRequest().body(Map.of(
                "error", "Bad Request",
                "message", "Please provide either 'email' or 'phone' parameter"
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> update(@PathVariable UUID id, @RequestBody Customer customer) {
        log.info("Received PUT /api/customers/{}", id);
        Customer updated = service.update(id, customer);
        return ResponseEntity.ok(CustomerDTO.fromEntity(updated));
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<CustomerDTO> suspend(@PathVariable UUID id) {
        log.info("Received PUT /api/customers/{}/suspend", id);
        Customer suspended = service.suspend(id);
        return ResponseEntity.ok(CustomerDTO.fromEntity(suspended));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<CustomerDTO> activate(@PathVariable UUID id) {
        log.info("Received PUT /api/customers/{}/activate", id);
        Customer activated = service.activate(id);
        return ResponseEntity.ok(CustomerDTO.fromEntity(activated));
    }
}
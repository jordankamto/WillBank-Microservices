/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.service;

/**
 *
 * @author steve
 */
import com.stevecompany.CustomerService.entity.Customer;
import com.stevecompany.CustomerService.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);
    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public Customer create(Customer customer) {
        log.info("Creating customer with email: {}", customer.getEmail());
        
        // Validation simple
        if (customer.getEmail() != null && repository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (customer.getPhone() != null && repository.findByPhone(customer.getPhone()).isPresent()) {
            throw new RuntimeException("Phone already exists");
        }

        Customer saved = repository.save(customer);
        log.info("Customer created with ID: {}", saved.getId());
        
        // RabbitMQ désactivé temporairement pour debug
        // publisher.publishClientCreated(new ClientCreatedEvent(saved.getId(), saved.getEmail()));
        
        return saved;
    }

    public Customer get(UUID id) {
        return repository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer update(UUID id, Customer updates) {
        Customer existing = get(id);
        
        if (updates.getFirstName() != null) existing.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) existing.setLastName(updates.getLastName());
        if (updates.getAddress() != null) existing.setAddress(updates.getAddress());
        
        // Email et phone : vérifier unicité
        if (updates.getEmail() != null && !updates.getEmail().equals(existing.getEmail())) {
            if (repository.findByEmail(updates.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists");
            }
            existing.setEmail(updates.getEmail());
        }
        if (updates.getPhone() != null && !updates.getPhone().equals(existing.getPhone())) {
            if (repository.findByPhone(updates.getPhone()).isPresent()) {
                throw new RuntimeException("Phone already exists");
            }
            existing.setPhone(updates.getPhone());
        }

        return repository.save(existing);
    }

    public Optional<Customer> findByEmail(String email) {
        return repository.findByEmail(email)
                .filter(c -> !c.isDeleted());
    }

    public Optional<Customer> findByPhone(String phone) {
        return repository.findByPhone(phone)
                .filter(c -> !c.isDeleted());
    }

    public java.util.List<Customer> findAll() {
        return repository.findAll().stream()
                .filter(c -> !c.isDeleted())
                .toList();
    }

    public Customer suspend(UUID id) {
        Customer c = get(id);
        c.setStatus(Customer.Status.SUSPENDED);
        Customer saved = repository.save(c);
        
        // RabbitMQ désactivé temporairement pour debug
        // publisher.publishClientSuspended(new ClientSuspendedEvent(id));
        
        return saved;
    }

    public Customer activate(UUID id) {
        Customer c = get(id);
        c.setStatus(Customer.Status.ACTIVE);
        return repository.save(c);
    }
}
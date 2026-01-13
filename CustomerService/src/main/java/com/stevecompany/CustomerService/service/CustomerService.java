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
import com.stevecompany.CustomerService.event.ClientCreatedEvent;
import com.stevecompany.CustomerService.event.ClientSuspendedEvent;
import com.stevecompany.CustomerService.messaging.CustomerEventPublisher;
import com.stevecompany.CustomerService.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository repository;
    private final CustomerEventPublisher publisher;

    public CustomerService(CustomerRepository repository,
                           CustomerEventPublisher publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }

    public Customer create(Customer customer) {
        Customer saved = repository.save(customer);
        publisher.publishClientCreated(
                new ClientCreatedEvent(saved.getId(), saved.getEmail()));
        return saved;
    }

    public Customer get(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer suspend(UUID id) {
        Customer c = get(id);
        c.setStatus(Customer.Status.SUSPENDED);
        repository.save(c);
        publisher.publishClientSuspended(new ClientSuspendedEvent(id));
        return c;
    }

    public Customer activate(UUID id) {
        Customer c = get(id);
        c.setStatus(Customer.Status.ACTIVE);
        return repository.save(c);
    }
}
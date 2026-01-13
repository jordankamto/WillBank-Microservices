/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.CustomerService.controller;

/**
 *
 * @author steve
 */
import com.stevecompany.CustomerService.entity.Customer;
import com.stevecompany.CustomerService.service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        return service.create(customer);
    }

    @GetMapping("/{id}")
    public Customer get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}/suspend")
    public Customer suspend(@PathVariable UUID id) {
        return service.suspend(id);
    }

    @PutMapping("/{id}/activate")
    public Customer activate(@PathVariable UUID id) {
        return service.activate(id);
    }
}
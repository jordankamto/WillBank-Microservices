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
import com.stevecompany.CustomerService.event.CustomerCreatedEvent;
import com.stevecompany.CustomerService.event.CustomerProfileUpdatedEvent;
import com.stevecompany.CustomerService.event.CustomerStatusChangedEvent;
import com.stevecompany.CustomerService.messaging.CustomerEventPublisher;
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
    private final CustomerEventPublisher eventPublisher;

    public CustomerService(CustomerRepository repository, CustomerEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Crée un nouveau client et publie un événement
     * Écouteurs : Notification Service, Account Service
     */
    public Customer create(Customer customer) {
        log.info("Creating customer with email: {}", customer.getEmail());
        
        if (customer.getEmail() != null && repository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (customer.getPhone() != null && repository.findByPhone(customer.getPhone()).isPresent()) {
            throw new RuntimeException("Phone already exists");
        }

        Customer saved = repository.save(customer);
        log.info("Customer created with ID: {}", saved.getId());
        
        // ✅ PUBLIER: Nouveau client créé
        eventPublisher.publishCustomerCreated(
            new CustomerCreatedEvent(
                saved.getId(),
                saved.getEmail(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getStatus().name()
            )
        );
        
        return saved;
    }

    /**
     * Récupère un client par ID (lève exception si absent)
     */
    public Customer get(UUID id) {
        return repository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    /**
     * Vérifie l'existence d'un client (utilisé par Account Service)
     * @param id UUID du client
     * @return Customer si trouvé, null sinon
     */
    public Customer findById(UUID id) {
        return repository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElse(null);
    }

    /**
     * Met à jour les informations du profil client
     * Publie un événement pour notifier les changements
     * Écouteurs : Notification Service, Audit Service, autres services intéressés
     */
    public Customer update(UUID id, Customer updates) {
        Customer existing = get(id);
        
        // Tracker les modifications
        boolean profileChanged = false;
        
        if (updates.getFirstName() != null && !updates.getFirstName().equals(existing.getFirstName())) {
            existing.setFirstName(updates.getFirstName());
            profileChanged = true;
        }
        if (updates.getLastName() != null && !updates.getLastName().equals(existing.getLastName())) {
            existing.setLastName(updates.getLastName());
            profileChanged = true;
        }
        if (updates.getAddress() != null && !updates.getAddress().equals(existing.getAddress())) {
            existing.setAddress(updates.getAddress());
            profileChanged = true;
        }
        
        // Email et phone : vérifier unicité
        if (updates.getEmail() != null && !updates.getEmail().equals(existing.getEmail())) {
            if (repository.findByEmail(updates.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists");
            }
            existing.setEmail(updates.getEmail());
            profileChanged = true;
        }
        if (updates.getPhone() != null && !updates.getPhone().equals(existing.getPhone())) {
            if (repository.findByPhone(updates.getPhone()).isPresent()) {
                throw new RuntimeException("Phone already exists");
            }
            existing.setPhone(updates.getPhone());
            profileChanged = true;
        }

        Customer saved = repository.save(existing);
        log.info("Customer {} updated", id);
        
        // ✅ PUBLIER: Profil modifié (seulement si changements)
        if (profileChanged) {
            eventPublisher.publishCustomerProfileUpdated(
                new CustomerProfileUpdatedEvent(
                    saved.getId(),
                    saved.getEmail(),
                    saved.getFirstName(),
                    saved.getLastName(),
                    saved.getAddress()
                )
            );
            log.info("Profile update event published for customer: {}", id);
        }
        
        return saved;
    }

    /**
     * Cherche un client par email
     */
    public Optional<Customer> findByEmail(String email) {
        return repository.findByEmail(email)
                .filter(c -> !c.isDeleted());
    }

    /**
     * Cherche un client par téléphone
     */
    public Optional<Customer> findByPhone(String phone) {
        return repository.findByPhone(phone)
                .filter(c -> !c.isDeleted());
    }

    /**
     * Récupère tous les clients non supprimés
     */
    public java.util.List<Customer> findAll() {
        return repository.findAll().stream()
                .filter(c -> !c.isDeleted())
                .toList();
    }

    /**
     * Suspend un client et publie un événement
     * Écouteurs : Account Service, Transaction Service, Notification Service
     */
    public Customer suspend(UUID id) {
        Customer c = get(id);
        
        // Ne publier que si le status change
        if (c.getStatus() != Customer.Status.SUSPENDED) {
            c.setStatus(Customer.Status.SUSPENDED);
            Customer saved = repository.save(c);
            log.info("Customer {} suspended", id);
            
            // ✅ PUBLIER: Client suspendu
            eventPublisher.publishCustomerStatusChanged(
                new CustomerStatusChangedEvent(
                    saved.getId(),
                    saved.getEmail(),
                    Customer.Status.SUSPENDED.name(),
                    "SUSPENDED"
                )
            );
            log.info("Suspension event published for customer: {}", id);
            
            return saved;
        }
        
        return c;
    }

    /**
     * Réactive un client et publie un événement
     * Écouteurs : Account Service, Notification Service
     */
    public Customer activate(UUID id) {
        Customer c = get(id);
        
        // Ne publier que si le status change
        if (c.getStatus() != Customer.Status.ACTIVE) {
            Customer.Status previousStatus = c.getStatus();
            c.setStatus(Customer.Status.ACTIVE);
            Customer saved = repository.save(c);
            log.info("Customer {} activated", id);
            
            // ✅ PUBLIER: Client activé
            eventPublisher.publishCustomerStatusChanged(
                new CustomerStatusChangedEvent(
                    saved.getId(),
                    saved.getEmail(),
                    previousStatus.name(),
                    Customer.Status.ACTIVE.name()
                )
            );
            log.info("Activation event published for customer: {}", id);
            
            return saved;
        }
        
        return c;
    }

    /**
     * Ferme un compte client (soft delete)
     * Écouteurs : Account Service (fermer tous les comptes), Notification Service
     */
    public void closeAccount(UUID id) {
        Customer c = get(id);
        c.setDeleted(true);
        c.setStatus(Customer.Status.CLOSED);
        Customer saved = repository.save(c);
        log.info("Customer {} account closed", id);
        
        // ✅ PUBLIER: Compte fermé
        eventPublisher.publishCustomerStatusChanged(
            new CustomerStatusChangedEvent(
                saved.getId(),
                saved.getEmail(),
                c.getStatus().name(),
                Customer.Status.CLOSED.name()
            )
        );
        log.info("Account closed event published for customer: {}", id);
    }
}
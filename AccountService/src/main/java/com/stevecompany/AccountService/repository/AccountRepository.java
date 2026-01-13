/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.repository;

/**
 *
 * @author steve
 */
import com.stevecompany.AccountService.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    boolean existsByCustomerIdAndTypeAndDeletedFalse(UUID customerId, Account.Type type);

    List<Account> findByCustomerIdAndDeletedFalse(UUID customerId);

    Optional<Account> findByIdAndDeletedFalse(UUID id);
}
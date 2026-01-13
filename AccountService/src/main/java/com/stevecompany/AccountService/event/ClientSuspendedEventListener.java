/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.AccountService.event;

/**
 *
 * @author steve
 */
import com.stevecompany.AccountService.entity.Account;
import com.stevecompany.AccountService.messaging.CustomerEventDTO;
import com.stevecompany.AccountService.repository.AccountRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ClientSuspendedEventListener {

    private final AccountRepository accountRepository;

    public ClientSuspendedEventListener(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @RabbitListener(queues = "customer.suspended.queue")
    public void handleCustomerSuspended(CustomerEventDTO event) {

        accountRepository.findByCustomerIdAndDeletedFalse(event.getCustomerId())
                .forEach(account -> {
                    account.setStatus(Account.Status.FROZEN);
                    accountRepository.save(account);
                });
    }
}
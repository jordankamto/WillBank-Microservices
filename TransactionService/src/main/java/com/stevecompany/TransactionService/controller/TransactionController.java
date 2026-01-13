/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.TransactionService.controller;

/**
 *
 * @author steve
 */
import com.stevecompany.TransactionService.dto.TransactionRequestDTO;
import com.stevecompany.TransactionService.dto.TransactionResponseDTO;
import com.stevecompany.TransactionService.service.TransactionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping("/deposit")
    public TransactionResponseDTO deposit(@RequestBody TransactionRequestDTO dto) {
        return service.deposit(dto);
    }
}
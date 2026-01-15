/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.dto;

/**
 *
 * @author steve
 */
import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationResponseDTO {
    public UUID id;
    public String channel;
    public String title;
    public String message;
    public String status;
    public LocalDateTime createdAt;
}
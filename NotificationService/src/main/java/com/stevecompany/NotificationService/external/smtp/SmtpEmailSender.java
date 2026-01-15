/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.NotificationService.external.smtp;

/**
 *
 * @author steve
 */
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class SmtpEmailSender {

    private final JavaMailSender mailSender;

    public SmtpEmailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(String message) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo("test@willbank.com");
        mail.setSubject("WillBank Notification");
        mail.setText(message);
        mailSender.send(mail);
    }
}
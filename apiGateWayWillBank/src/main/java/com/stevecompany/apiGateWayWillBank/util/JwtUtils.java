/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.stevecompany.apiGateWayWillBank.util;

/**
 *
 * @author steve
 */
public class JwtUtils {

    private static final String EXPECTED_TOKEN = "Bearer WILLBANK_SECRET_TOKEN";

    public static boolean isValid(String authHeader) {
        return EXPECTED_TOKEN.equals(authHeader);
    }
}

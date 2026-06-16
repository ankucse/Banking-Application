package com.banking.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthTestController {

    @GetMapping("/test")
    public String testAuth() {
        return "Hello from Auth Service!";
    }
}

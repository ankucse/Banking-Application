package com.banking.customer.controller;

import com.banking.customer.domain.CifMaster;
import com.banking.customer.service.CifService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cif")
public class CifController {

    @Autowired
    private CifService cifService;

    @GetMapping("/profile/{id}")
    public ResponseEntity<CifMaster> getProfile(@PathVariable UUID id) {
        return cifService.getProfile(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

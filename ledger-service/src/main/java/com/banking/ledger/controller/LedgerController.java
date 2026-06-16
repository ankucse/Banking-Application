package com.banking.ledger.controller;

import com.banking.ledger.domain.GlTransaction;
import com.banking.ledger.service.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ledger")
public class LedgerController {

    @Autowired
    private LedgerService ledgerService;

    @PostMapping("/transaction")
    public ResponseEntity<?> postTransaction(@RequestBody GlTransaction transaction) {
        try {
            GlTransaction saved = ledgerService.postTransaction(transaction);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException | com.banking.ledger.exception.LedgerImbalanceException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

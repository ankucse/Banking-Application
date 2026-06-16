package com.antigravity.payment.controller;

import com.antigravity.payment.domain.PaymentTransaction;
import com.antigravity.payment.dto.PaymentRequest;
import com.antigravity.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor

public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentTransaction> initiatePayment(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.initiatePayment(request));
    }

    @GetMapping("/{cifId}")
    public ResponseEntity<List<PaymentTransaction>> getPayments(@PathVariable String cifId) {
        return ResponseEntity.ok(paymentService.getPayments(cifId));
    }
}

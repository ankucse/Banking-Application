package com.antigravity.payment.controller;

import com.antigravity.payment.domain.BeneficiaryDocument;
import com.antigravity.payment.dto.BeneficiaryRequest;
import com.antigravity.payment.service.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/beneficiaries")
@RequiredArgsConstructor

public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @PostMapping
    public ResponseEntity<BeneficiaryDocument> addBeneficiary(@RequestBody BeneficiaryRequest request) {
        return ResponseEntity.ok(beneficiaryService.addBeneficiary(request));
    }

    @GetMapping("/{cifId}")
    public ResponseEntity<List<BeneficiaryDocument>> getBeneficiaries(@PathVariable String cifId) {
        return ResponseEntity.ok(beneficiaryService.getBeneficiaries(cifId));
    }
}

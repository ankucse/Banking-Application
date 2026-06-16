package com.antigravity.payment.service;

import com.antigravity.payment.domain.BeneficiaryDocument;
import com.antigravity.payment.dto.BeneficiaryRequest;
import com.antigravity.payment.repository.BeneficiaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String VERIFY_TOPIC = "VERIFY_BENEFICIARY";

    public BeneficiaryDocument addBeneficiary(BeneficiaryRequest request) {
        BeneficiaryDocument document = BeneficiaryDocument.builder()
                .cifId(request.getCifId())
                .payeeName(request.getPayeeName())
                .accountNumber(request.getAccountNumber())
                .ifscCode(request.getIfscCode())
                .bankName(request.getBankName())
                .alias(request.getAlias())
                .status("PENDING") // Initial state for Penny Drop simulation
                .build();

        BeneficiaryDocument saved = beneficiaryRepository.save(document);
        log.info("Saved Beneficiary as PENDING: {}", saved.getId());

        // Publish event to Kafka to simulate Penny Drop Verification
        kafkaTemplate.send(VERIFY_TOPIC, saved.getId());
        log.info("Published VERIFY_BENEFICIARY event for: {}", saved.getId());

        return saved;
    }

    public List<BeneficiaryDocument> getBeneficiaries(String cifId) {
        return beneficiaryRepository.findByCifId(cifId);
    }
}

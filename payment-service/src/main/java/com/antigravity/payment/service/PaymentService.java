package com.antigravity.payment.service;

import com.antigravity.payment.domain.PaymentTransaction;
import com.antigravity.payment.dto.PaymentRequest;
import com.antigravity.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String PROCESS_TOPIC = "PROCESS_PAYMENT";

    public PaymentTransaction initiatePayment(PaymentRequest request) {
        PaymentTransaction transaction = PaymentTransaction.builder()
                .cifId(request.getCifId())
                .beneficiaryId(request.getBeneficiaryId())
                .amount(request.getAmount())
                .paymentType(request.getPaymentType())
                .status("PROCESSING")
                .referenceNumber("TXN" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .build();

        PaymentTransaction saved = paymentRepository.save(transaction);
        log.info("Initiated Payment {} as PROCESSING", saved.getReferenceNumber());

        kafkaTemplate.send(PROCESS_TOPIC, saved.getId().toString());
        log.info("Published PROCESS_PAYMENT event for ID: {}", saved.getId());

        return saved;
    }

    public List<PaymentTransaction> getPayments(String cifId) {
        return paymentRepository.findByCifIdOrderByCreatedAtDesc(cifId);
    }
}

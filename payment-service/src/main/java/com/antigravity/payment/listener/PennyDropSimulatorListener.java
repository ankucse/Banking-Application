package com.antigravity.payment.listener;

import com.antigravity.payment.domain.BeneficiaryDocument;
import com.antigravity.payment.repository.BeneficiaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class PennyDropSimulatorListener {

    private final BeneficiaryRepository beneficiaryRepository;

    @KafkaListener(topics = "VERIFY_BENEFICIARY", groupId = "payment-service-group")
    public void simulatePennyDrop(String beneficiaryId) {
        log.info("Received VERIFY_BENEFICIARY event for ID: {}", beneficiaryId);

        try {
            // Simulate external switch delay (e.g. IMPS Penny Drop)
            Thread.sleep(2000);

            Optional<BeneficiaryDocument> optionalDoc = beneficiaryRepository.findById(beneficiaryId);
            if (optionalDoc.isPresent()) {
                BeneficiaryDocument doc = optionalDoc.get();
                // Simulating a successful name match
                doc.setStatus("ACTIVE");
                beneficiaryRepository.save(doc);
                log.info("Penny Drop Successful! Beneficiary {} is now ACTIVE", beneficiaryId);
                
                // In a real system, we might publish a NOTIFICATION_EVENT here
            } else {
                log.warn("Beneficiary with ID {} not found during Penny Drop simulation", beneficiaryId);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Penny Drop Simulation interrupted", e);
        }
    }
}

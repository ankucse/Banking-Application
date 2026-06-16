package com.antigravity.payment.listener;

import com.antigravity.payment.domain.PaymentTransaction;
import com.antigravity.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentSwitchListener {

    private final PaymentRepository paymentRepository;
    private final Random random = new Random();

    @KafkaListener(topics = "PROCESS_PAYMENT", groupId = "payment-service-group")
    public void simulateSwitchProcessing(String paymentId) {
        log.info("Received PROCESS_PAYMENT event for ID: {}", paymentId);

        try {
            // Simulate external switch delay (3-5 seconds)
            int delay = 3000 + random.nextInt(2000);
            Thread.sleep(delay);

            Optional<PaymentTransaction> optionalTx = paymentRepository.findById(Long.valueOf(paymentId));
            if (optionalTx.isPresent()) {
                PaymentTransaction tx = optionalTx.get();
                
                // Simulate network response (90% success rate)
                boolean isSuccess = random.nextInt(100) < 90;
                
                if (isSuccess) {
                    tx.setStatus("COMPLETED");
                    log.info("Payment Switch Success! Transaction {} is now COMPLETED", tx.getReferenceNumber());
                    // Note: Here we would typically publish a TRANSACTION_COMPLETED event 
                    // for the ledger-service to pick up and process double-entry bookkeeping.
                } else {
                    tx.setStatus("FAILED");
                    log.warn("Payment Switch Failure. Transaction {} is FAILED", tx.getReferenceNumber());
                }
                
                paymentRepository.save(tx);
                
            } else {
                log.warn("Payment with ID {} not found during Switch simulation", paymentId);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Payment Switch Simulation interrupted", e);
        }
    }
}

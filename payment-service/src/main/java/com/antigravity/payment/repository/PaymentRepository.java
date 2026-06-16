package com.antigravity.payment.repository;

import com.antigravity.payment.domain.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findByCifIdOrderByCreatedAtDesc(String cifId);
}

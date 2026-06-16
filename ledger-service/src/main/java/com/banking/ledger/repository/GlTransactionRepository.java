package com.banking.ledger.repository;

import com.banking.ledger.domain.GlTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GlTransactionRepository extends JpaRepository<GlTransaction, UUID> {
}

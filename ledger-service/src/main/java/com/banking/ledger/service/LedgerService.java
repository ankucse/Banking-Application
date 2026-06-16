package com.banking.ledger.service;

import com.banking.ledger.domain.GlJournalEntry;
import com.banking.ledger.domain.GlTransaction;
import com.banking.ledger.exception.LedgerImbalanceException;
import com.banking.ledger.repository.GlTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class LedgerService {

    @Autowired
    private GlTransactionRepository transactionRepository;

    @Transactional
    public GlTransaction postTransaction(GlTransaction transaction) {
        if (transaction.getEntries() == null || transaction.getEntries().isEmpty()) {
            throw new IllegalArgumentException("Transaction must contain at least one journal entry.");
        }

        BigDecimal totalDebits = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;

        for (GlJournalEntry entry : transaction.getEntries()) {
            if (entry.getDebitAmount() == null) entry.setDebitAmount(BigDecimal.ZERO);
            if (entry.getCreditAmount() == null) entry.setCreditAmount(BigDecimal.ZERO);
            
            if (entry.getDebitAmount().compareTo(BigDecimal.ZERO) < 0 || entry.getCreditAmount().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Debit and Credit amounts must be non-negative.");
            }

            totalDebits = totalDebits.add(entry.getDebitAmount());
            totalCredits = totalCredits.add(entry.getCreditAmount());
        }

        if (totalDebits.compareTo(totalCredits) != 0) {
            throw new LedgerImbalanceException(
                String.format("Ledger imbalance detected! Total Debits: %s, Total Credits: %s", totalDebits, totalCredits)
            );
        }

        // It balances, so we can save.
        return transactionRepository.save(transaction);
    }
}

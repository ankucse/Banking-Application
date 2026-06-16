package com.banking.ledger.domain;

import com.banking.ledger.listener.AppendOnlyListener;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "gl_journal_entry")
@EntityListeners(AppendOnlyListener.class)
public class GlJournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gl_transaction_id", nullable = false, updatable = false)
    private GlTransaction glTransaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gl_account_id", nullable = false, updatable = false)
    private GlAccount glAccount;

    @Column(nullable = false, precision = 19, scale = 4, updatable = false)
    private BigDecimal debitAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 4, updatable = false)
    private BigDecimal creditAmount = BigDecimal.ZERO;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public GlTransaction getGlTransaction() { return glTransaction; }
    public void setGlTransaction(GlTransaction glTransaction) { this.glTransaction = glTransaction; }
    public GlAccount getGlAccount() { return glAccount; }
    public void setGlAccount(GlAccount glAccount) { this.glAccount = glAccount; }
    public BigDecimal getDebitAmount() { return debitAmount; }
    public void setDebitAmount(BigDecimal debitAmount) { this.debitAmount = debitAmount; }
    public BigDecimal getCreditAmount() { return creditAmount; }
    public void setCreditAmount(BigDecimal creditAmount) { this.creditAmount = creditAmount; }
}

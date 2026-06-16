package com.banking.ledger.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "gl_transaction")
public class GlTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime transactionDate = LocalDateTime.now();

    @Column(nullable = false, length = 255, updatable = false)
    private String description;

    @OneToMany(mappedBy = "glTransaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GlJournalEntry> entries = new ArrayList<>();

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<GlJournalEntry> getEntries() { return entries; }
    public void setEntries(List<GlJournalEntry> entries) { this.entries = entries; }
    
    public void addEntry(GlJournalEntry entry) {
        entries.add(entry);
        entry.setGlTransaction(this);
    }
}

package com.banking.ledger.listener;

import com.banking.ledger.domain.GlJournalEntry;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;

public class AppendOnlyListener {

    @PreUpdate
    public void onPreUpdate(GlJournalEntry entry) {
        throw new UnsupportedOperationException("Ledger mutations are strictly forbidden. Journal entries are append-only.");
    }

    @PreRemove
    public void onPreRemove(GlJournalEntry entry) {
        throw new UnsupportedOperationException("Ledger mutations are strictly forbidden. Journal entries are append-only.");
    }
}

package com.banking.ledger.exception;

public class LedgerImbalanceException extends RuntimeException {
    public LedgerImbalanceException(String message) {
        super(message);
    }
}

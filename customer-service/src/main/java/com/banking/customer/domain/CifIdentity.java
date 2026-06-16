package com.banking.customer.domain;

import com.banking.customer.security.AesGcmEncryptionConverter;
import com.banking.customer.security.HashingUtils;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "cif_identity")
public class CifIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cif_master_id", nullable = false, unique = true)
    private CifMaster cifMaster;

    @Column(nullable = false, length = 50)
    private String documentType; // SSN, PASSPORT, NATIONAL_ID

    @Convert(converter = AesGcmEncryptionConverter.class)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String documentNumber; // Encrypted in DB

    @Column(nullable = false, unique = true, length = 64)
    private String idHash; // Deterministic SHA-256 hash for unique constraint

    @PrePersist
    @PreUpdate
    public void hashDocumentNumber() {
        if (this.documentNumber != null) {
            this.idHash = HashingUtils.hash(this.documentNumber);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public CifMaster getCifMaster() { return cifMaster; }
    public void setCifMaster(CifMaster cifMaster) { this.cifMaster = cifMaster; }
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }
    public String getIdHash() { return idHash; }
    public void setIdHash(String idHash) { this.idHash = idHash; }
}

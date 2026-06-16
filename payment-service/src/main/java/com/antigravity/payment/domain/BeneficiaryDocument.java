package com.antigravity.payment.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "beneficiaries")
public class BeneficiaryDocument {
    
    @Id
    private String id;
    private String cifId;
    private String payeeName;
    private String accountNumber;
    private String ifscCode;
    private String bankName;
    private String alias;
    private String status; // PENDING, ACTIVE, REJECTED
}

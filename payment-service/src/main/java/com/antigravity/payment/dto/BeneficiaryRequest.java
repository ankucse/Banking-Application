package com.antigravity.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryRequest {
    private String cifId;
    private String payeeName;
    private String accountNumber;
    private String ifscCode;
    private String bankName;
    private String alias;
}

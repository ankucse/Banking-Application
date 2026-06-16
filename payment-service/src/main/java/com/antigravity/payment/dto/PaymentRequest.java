package com.antigravity.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private String cifId;
    private String beneficiaryId;
    private BigDecimal amount;
    private String paymentType; // IMPS, NEFT
}

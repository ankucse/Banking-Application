package com.antigravity.payment.repository;

import com.antigravity.payment.domain.BeneficiaryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BeneficiaryRepository extends MongoRepository<BeneficiaryDocument, String> {
    List<BeneficiaryDocument> findByCifId(String cifId);
}

package com.banking.customer.repository;

import com.banking.customer.domain.CifMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CifMasterRepository extends JpaRepository<CifMaster, UUID> {
}

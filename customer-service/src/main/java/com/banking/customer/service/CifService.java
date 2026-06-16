package com.banking.customer.service;

import com.banking.customer.domain.CifMaster;
import com.banking.customer.repository.CifMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class CifService {
    
    @Autowired
    private CifMasterRepository repository;

    public Optional<CifMaster> getProfile(UUID id) {
        return repository.findById(id);
    }
}

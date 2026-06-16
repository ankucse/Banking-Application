package com.banking.customer.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "cif_address")
public class CifAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cif_master_id", nullable = false)
    private CifMaster cifMaster;

    @Column(nullable = false, length = 20)
    private String addressType; // RESIDENTIAL, MAILING, WORK

    @Column(nullable = false, length = 200)
    private String addressLine1;

    @Column(length = 200)
    private String addressLine2;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 20)
    private String postalCode;

    @Column(nullable = false, length = 100)
    private String country;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public CifMaster getCifMaster() { return cifMaster; }
    public void setCifMaster(CifMaster cifMaster) { this.cifMaster = cifMaster; }
    public String getAddressType() { return addressType; }
    public void setAddressType(String addressType) { this.addressType = addressType; }
    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }
    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}

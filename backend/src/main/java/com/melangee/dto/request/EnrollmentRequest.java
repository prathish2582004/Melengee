package com.melangee.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;

public class EnrollmentRequest {
    @JsonAlias({"isDevTestEnrollment", "devTestEnrollment"})
    private boolean isDevTestEnrollment = false;
    private String paymentReference;

    public EnrollmentRequest() {
    }

    public EnrollmentRequest(boolean isDevTestEnrollment) {
        this.isDevTestEnrollment = isDevTestEnrollment;
    }

    public boolean isDevTestEnrollment() {
        return isDevTestEnrollment;
    }

    public void setDevTestEnrollment(boolean devTestEnrollment) {
        isDevTestEnrollment = devTestEnrollment;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }
}


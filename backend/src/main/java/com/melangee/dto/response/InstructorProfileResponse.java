package com.melangee.dto.response;

import java.time.LocalDateTime;

public class InstructorProfileResponse {
    private Long id;
    private String headline;
    private String bio;
    private String phone;
    private String avatarUrl;
    private String specialization;
    private String qualification;
    private Integer yearsOfExperience;
    private LocalDateTime createdAt;

    public InstructorProfileResponse() {
    }

    public InstructorProfileResponse(Long id, String headline, String bio, String phone, String avatarUrl, String specialization, String qualification, Integer yearsOfExperience, LocalDateTime createdAt) {
        this.id = id;
        this.headline = headline;
        this.bio = bio;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.specialization = specialization;
        this.qualification = qualification;
        this.yearsOfExperience = yearsOfExperience;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


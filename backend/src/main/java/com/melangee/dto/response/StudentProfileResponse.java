package com.melangee.dto.response;

import java.time.LocalDateTime;

public class StudentProfileResponse {
    private Long id;
    private String headline;
    private String bio;
    private String phone;
    private String avatarUrl;
    private String learningGoals;
    private LocalDateTime createdAt;

    public StudentProfileResponse() {
    }

    public StudentProfileResponse(Long id, String headline, String bio, String phone, String avatarUrl, String learningGoals, LocalDateTime createdAt) {
        this.id = id;
        this.headline = headline;
        this.bio = bio;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.learningGoals = learningGoals;
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

    public String getLearningGoals() {
        return learningGoals;
    }

    public void setLearningGoals(String learningGoals) {
        this.learningGoals = learningGoals;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


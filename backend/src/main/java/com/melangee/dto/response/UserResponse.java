package com.melangee.dto.response;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private StudentProfileResponse studentProfile;
    private InstructorProfileResponse instructorProfile;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullName, String email, String role, boolean enabled, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public StudentProfileResponse getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfileResponse studentProfile) {
        this.studentProfile = studentProfile;
    }

    public InstructorProfileResponse getInstructorProfile() {
        return instructorProfile;
    }

    public void setInstructorProfile(InstructorProfileResponse instructorProfile) {
        this.instructorProfile = instructorProfile;
    }
}


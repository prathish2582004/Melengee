package com.melangee.dto.response;

import java.time.LocalDateTime;

public class WishlistResponse {
    private Long id;
    private CourseSummaryResponse course;
    private LocalDateTime createdAt;

    public WishlistResponse() {
    }

    public WishlistResponse(Long id, CourseSummaryResponse course, LocalDateTime createdAt) {
        this.id = id;
        this.course = course;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CourseSummaryResponse getCourse() {
        return course;
    }

    public void setCourse(CourseSummaryResponse course) {
        this.course = course;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


package com.melangee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.melangee.entity.EnrollmentStatus;

import java.time.LocalDateTime;

public class EnrollmentResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String courseSlug;
    private String courseThumbnailUrl;
    private String categoryName;
    private String instructorName;
    private String duration;
    private EnrollmentStatus status;
    private Integer progressPercentage;
    private Integer completedLessonsCount;
    private Integer totalLessonsCount;
    @JsonProperty("isDevTestEnrollment")
    private boolean isDevTestEnrollment;
    private String lastAccessedLesson;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    private LocalDateTime lastAccessedAt;

    public EnrollmentResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public String getCourseThumbnailUrl() {
        return courseThumbnailUrl;
    }

    public void setCourseThumbnailUrl(String courseThumbnailUrl) {
        this.courseThumbnailUrl = courseThumbnailUrl;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Integer getCompletedLessonsCount() {
        return completedLessonsCount;
    }

    public void setCompletedLessonsCount(Integer completedLessonsCount) {
        this.completedLessonsCount = completedLessonsCount;
    }

    public Integer getTotalLessonsCount() {
        return totalLessonsCount;
    }

    public void setTotalLessonsCount(Integer totalLessonsCount) {
        this.totalLessonsCount = totalLessonsCount;
    }

    public boolean isDevTestEnrollment() {
        return isDevTestEnrollment;
    }

    public void setDevTestEnrollment(boolean devTestEnrollment) {
        isDevTestEnrollment = devTestEnrollment;
    }

    public String getLastAccessedLesson() {
        return lastAccessedLesson;
    }

    public void setLastAccessedLesson(String lastAccessedLesson) {
        this.lastAccessedLesson = lastAccessedLesson;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }
}


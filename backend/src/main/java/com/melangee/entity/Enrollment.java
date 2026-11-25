package com.melangee.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "course_id"}, name = "uk_enrollments_student_course")
})
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EnrollmentStatus status = EnrollmentStatus.ENROLLED;

    @Column(name = "progress_percentage", nullable = false)
    private Integer progressPercentage = 0;

    @Column(name = "completed_lessons_count", nullable = false)
    private Integer completedLessonsCount = 0;

    @Column(name = "total_lessons_count", nullable = false)
    private Integer totalLessonsCount = 0;

    @Column(name = "is_dev_test_enrollment", nullable = false)
    private boolean isDevTestEnrollment = false;

    @Column(name = "last_accessed_lesson", length = 200)
    private String lastAccessedLesson;

    @CreationTimestamp
    @Column(name = "enrolled_at", nullable = false, updatable = false)
    private LocalDateTime enrolledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @UpdateTimestamp
    @Column(name = "last_accessed_at", nullable = false)
    private LocalDateTime lastAccessedAt;

    public Enrollment() {
    }

    public Enrollment(User student, Course course, boolean isDevTestEnrollment) {
        this.student = student;
        this.course = course;
        this.isDevTestEnrollment = isDevTestEnrollment;
        this.status = EnrollmentStatus.ENROLLED;
        this.progressPercentage = 0;
        this.completedLessonsCount = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
        if (status == EnrollmentStatus.COMPLETED && this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
        if (progressPercentage >= 100) {
            this.status = EnrollmentStatus.COMPLETED;
            if (this.completedAt == null) {
                this.completedAt = LocalDateTime.now();
            }
        } else if (progressPercentage > 0) {
            this.status = EnrollmentStatus.IN_PROGRESS;
        }
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


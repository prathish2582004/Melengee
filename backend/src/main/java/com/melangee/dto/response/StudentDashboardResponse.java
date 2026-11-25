package com.melangee.dto.response;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class StudentDashboardResponse {
    private UserResponse studentProfile;
    private Map<String, Object> stats;
    private EnrollmentResponse continueLearning;
    private List<EnrollmentResponse> enrolledCourses = new ArrayList<>();
    private List<EnrollmentResponse> completedCourses = new ArrayList<>();
    private List<WishlistResponse> wishlist = new ArrayList<>();
    private List<Map<String, Object>> recentActivity = new ArrayList<>();
    private List<Map<String, Object>> notifications = new ArrayList<>();
    private List<Map<String, Object>> certificatesPlaceholder = new ArrayList<>();
    private List<CourseSummaryResponse> courseRecommendations = new ArrayList<>();

    public StudentDashboardResponse() {
    }

    public UserResponse getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(UserResponse studentProfile) {
        this.studentProfile = studentProfile;
    }

    public Map<String, Object> getStats() {
        return stats;
    }

    public void setStats(Map<String, Object> stats) {
        this.stats = stats;
    }

    public EnrollmentResponse getContinueLearning() {
        return continueLearning;
    }

    public void setContinueLearning(EnrollmentResponse continueLearning) {
        this.continueLearning = continueLearning;
    }

    public List<EnrollmentResponse> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(List<EnrollmentResponse> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public List<EnrollmentResponse> getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(List<EnrollmentResponse> completedCourses) {
        this.completedCourses = completedCourses;
    }

    public List<WishlistResponse> getWishlist() {
        return wishlist;
    }

    public void setWishlist(List<WishlistResponse> wishlist) {
        this.wishlist = wishlist;
    }

    public List<Map<String, Object>> getRecentActivity() {
        return recentActivity;
    }

    public void setRecentActivity(List<Map<String, Object>> recentActivity) {
        this.recentActivity = recentActivity;
    }

    public List<Map<String, Object>> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Map<String, Object>> notifications) {
        this.notifications = notifications;
    }

    public List<Map<String, Object>> getCertificatesPlaceholder() {
        return certificatesPlaceholder;
    }

    public void setCertificatesPlaceholder(List<Map<String, Object>> certificatesPlaceholder) {
        this.certificatesPlaceholder = certificatesPlaceholder;
    }

    public List<CourseSummaryResponse> getCourseRecommendations() {
        return courseRecommendations;
    }

    public void setCourseRecommendations(List<CourseSummaryResponse> courseRecommendations) {
        this.courseRecommendations = courseRecommendations;
    }
}


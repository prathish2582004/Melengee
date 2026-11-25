package com.melangee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.melangee.entity.CourseLevel;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CourseDetailResponse {
    private Long id;
    private String title;
    private String slug;
    private String subtitle;
    private String description;
    private List<String> objectives = new ArrayList<>();
    private List<String> requirements = new ArrayList<>();
    private CourseLevel level;
    private BigDecimal price;
    private BigDecimal originalPrice;
    @JsonProperty("isFree")
    private boolean isFree;
    private String thumbnailUrl;
    private String duration;
    private Double rating;
    private Integer reviewsCount;
    private Integer studentsCount;
    private String badge;
    private UserResponse instructor;
    private CategoryResponse category;
    private List<CourseModuleResponse> modules = new ArrayList<>();
    private int totalLessons;
    @JsonProperty("isEnrolled")
    private boolean isEnrolled;
    @JsonProperty("isWishlisted")
    private boolean isWishlisted;
    private Integer studentProgress;

    public CourseDetailResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getObjectives() {
        return objectives;
    }

    public void setObjectives(List<String> objectives) {
        this.objectives = objectives;
    }

    public List<String> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }

    public CourseLevel getLevel() {
        return level;
    }

    public void setLevel(CourseLevel level) {
        this.level = level;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public Integer getStudentsCount() {
        return studentsCount;
    }

    public void setStudentsCount(Integer studentsCount) {
        this.studentsCount = studentsCount;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public UserResponse getInstructor() {
        return instructor;
    }

    public void setInstructor(UserResponse instructor) {
        this.instructor = instructor;
    }

    public CategoryResponse getCategory() {
        return category;
    }

    public void setCategory(CategoryResponse category) {
        this.category = category;
    }

    public List<CourseModuleResponse> getModules() {
        return modules;
    }

    public void setModules(List<CourseModuleResponse> modules) {
        this.modules = modules;
    }

    public int getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(int totalLessons) {
        this.totalLessons = totalLessons;
    }

    public boolean isEnrolled() {
        return isEnrolled;
    }

    public void setEnrolled(boolean enrolled) {
        isEnrolled = enrolled;
    }

    public boolean isWishlisted() {
        return isWishlisted;
    }

    public void setWishlisted(boolean wishlisted) {
        isWishlisted = wishlisted;
    }

    public Integer getStudentProgress() {
        return studentProgress;
    }

    public void setStudentProgress(Integer studentProgress) {
        this.studentProgress = studentProgress;
    }
}


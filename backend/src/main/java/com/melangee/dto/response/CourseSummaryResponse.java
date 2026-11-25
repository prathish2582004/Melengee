package com.melangee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.melangee.entity.CourseLevel;

import java.math.BigDecimal;

public class CourseSummaryResponse {
    private Long id;
    private String title;
    private String slug;
    private String subtitle;
    private String instructorName;
    private String instructorAvatar;
    private String categoryName;
    private String categorySlug;
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
    private int modulesCount;
    private int lessonsCount;
    @JsonProperty("isEnrolled")
    private boolean isEnrolled;
    @JsonProperty("isWishlisted")
    private boolean isWishlisted;

    public CourseSummaryResponse() {
    }

    public CourseSummaryResponse(Long id, String title, String slug, String subtitle, String instructorName,
                                 String instructorAvatar, String categoryName, String categorySlug, CourseLevel level,
                                 BigDecimal price, BigDecimal originalPrice, boolean isFree, String thumbnailUrl,
                                 String duration, Double rating, Integer reviewsCount, Integer studentsCount,
                                 String badge, int modulesCount, int lessonsCount) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.subtitle = subtitle;
        this.instructorName = instructorName;
        this.instructorAvatar = instructorAvatar;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
        this.level = level;
        this.price = price;
        this.originalPrice = originalPrice;
        this.isFree = isFree;
        this.thumbnailUrl = thumbnailUrl;
        this.duration = duration;
        this.rating = rating;
        this.reviewsCount = reviewsCount;
        this.studentsCount = studentsCount;
        this.badge = badge;
        this.modulesCount = modulesCount;
        this.lessonsCount = lessonsCount;
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

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getInstructorAvatar() {
        return instructorAvatar;
    }

    public void setInstructorAvatar(String instructorAvatar) {
        this.instructorAvatar = instructorAvatar;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public void setCategorySlug(String categorySlug) {
        this.categorySlug = categorySlug;
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

    public int getModulesCount() {
        return modulesCount;
    }

    public void setModulesCount(int modulesCount) {
        this.modulesCount = modulesCount;
    }

    public int getLessonsCount() {
        return lessonsCount;
    }

    public void setLessonsCount(int lessonsCount) {
        this.lessonsCount = lessonsCount;
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
}


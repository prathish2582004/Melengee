package com.melangee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LessonResponse {
    private Long id;
    private String title;
    private String duration;
    private String videoUrl;
    @JsonProperty("isFreePreview")
    private boolean isFreePreview;
    private Integer orderIndex;

    public LessonResponse() {
    }

    public LessonResponse(Long id, String title, String duration, String videoUrl, boolean isFreePreview, Integer orderIndex) {
        this.id = id;
        this.title = title;
        this.duration = duration;
        this.videoUrl = videoUrl;
        this.isFreePreview = isFreePreview;
        this.orderIndex = orderIndex;
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

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public boolean isFreePreview() {
        return isFreePreview;
    }

    public void setFreePreview(boolean freePreview) {
        isFreePreview = freePreview;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}


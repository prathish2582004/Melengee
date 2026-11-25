package com.melangee.dto.response;

import java.util.ArrayList;
import java.util.List;

public class CourseModuleResponse {
    private Long id;
    private String title;
    private String description;
    private Integer orderIndex;
    private List<LessonResponse> lessons = new ArrayList<>();

    public CourseModuleResponse() {
    }

    public CourseModuleResponse(Long id, String title, String description, Integer orderIndex, List<LessonResponse> lessons) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
        this.lessons = lessons != null ? lessons : new ArrayList<>();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<LessonResponse> getLessons() {
        return lessons;
    }

    public void setLessons(List<LessonResponse> lessons) {
        this.lessons = lessons;
    }
}


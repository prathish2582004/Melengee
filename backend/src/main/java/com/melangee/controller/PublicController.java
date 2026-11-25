package com.melangee.controller;

import com.melangee.dto.response.ApiResponse;
import com.melangee.dto.response.CategoryResponse;
import com.melangee.dto.response.CourseSummaryResponse;
import com.melangee.service.CategoryService;
import com.melangee.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@Tag(name = "Public Resources", description = "Public endpoints for landing page content, featured courses, categories and platform stats")
public class PublicController {

    private final CourseService courseService;
    private final CategoryService categoryService;

    public PublicController(CourseService courseService, CategoryService categoryService) {
        this.courseService = courseService;
        this.categoryService = categoryService;
    }

    @GetMapping("/health")
    @Operation(summary = "Health check endpoint")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("platform", "MELANGEE Online Education");
        health.put("phase", "Phase 2: Student Dashboard, Course Browsing and Enrollment");
        health.put("version", "2.0.0");
        return ResponseEntity.ok(ApiResponse.success("Service is active and healthy", health));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get course categories from database")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Course categories retrieved", categories));
    }

    @GetMapping("/courses/featured")
    @Operation(summary = "Get featured courses from database for landing page")
    public ResponseEntity<ApiResponse<List<CourseSummaryResponse>>> getFeaturedCourses() {
        List<CourseSummaryResponse> courses = courseService.getFeaturedCourses();
        return ResponseEntity.ok(ApiResponse.success("Featured courses retrieved", courses));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform metrics for public display")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPublicStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("activeStudents", "45,000+");
        stats.put("expertInstructors", "1,200+");
        stats.put("coursesCount", "350+");
        stats.put("completionRate", "96.4%");
        stats.put("globalCountries", "110+");
        return ResponseEntity.ok(ApiResponse.success("Platform statistics retrieved", stats));
    }
}

package com.melangee.controller;

import com.melangee.dto.response.ApiResponse;
import com.melangee.dto.response.CategoryResponse;
import com.melangee.dto.response.CourseDetailResponse;
import com.melangee.dto.response.CourseSummaryResponse;
import com.melangee.entity.CourseLevel;
import com.melangee.service.CategoryService;
import com.melangee.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Courses & Categories", description = "Course discovery, search, catalog filtering, and course details")
public class CourseController {

    private final CourseService courseService;
    private final CategoryService categoryService;

    public CourseController(CourseService courseService, CategoryService categoryService) {
        this.courseService = courseService;
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all course categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    @GetMapping("/courses")
    @Operation(summary = "Search, filter and paginate courses")
    public ResponseEntity<ApiResponse<Page<CourseSummaryResponse>>> getCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) CourseLevel level,
            @RequestParam(required = false) Boolean isFree,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "popular") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String studentEmail = userDetails != null ? userDetails.getUsername() : null;

        Page<CourseSummaryResponse> courses = courseService.getCourses(
                search,
                category,
                level,
                isFree,
                maxPrice,
                minRating,
                sortBy,
                page,
                size,
                studentEmail
        );

        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }

    @GetMapping("/courses/{id}")
    @Operation(summary = "Get full course details by ID")
    public ResponseEntity<ApiResponse<CourseDetailResponse>> getCourseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String studentEmail = userDetails != null ? userDetails.getUsername() : null;
        CourseDetailResponse course = courseService.getCourseById(id, studentEmail);
        return ResponseEntity.ok(ApiResponse.success("Course details retrieved successfully", course));
    }
}


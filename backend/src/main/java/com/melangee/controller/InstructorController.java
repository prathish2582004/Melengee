package com.melangee.controller;

import com.melangee.dto.response.ApiResponse;
import com.melangee.dto.response.UserResponse;
import com.melangee.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/instructor")
@Tag(name = "Instructor Studio", description = "Instructor-specific dashboard, course management and analytics")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('INSTRUCTOR')")
public class InstructorController {

    private final AuthService authService;

    public InstructorController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get Instructor dashboard summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse user = authService.getCurrentUser(userDetails.getUsername());

        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        data.put("stats", Map.of(
                "activeCourses", 4,
                "totalStudents", 3420,
                "averageRating", 4.89,
                "totalRevenueUsd", 28450.00
        ));

        data.put("coursesTaught", List.of(
                Map.of(
                        "id", 101,
                        "title", "Enterprise Java & Spring Boot Microservices Mastery",
                        "status", "Published",
                        "enrolledStudents", 2150,
                        "revenue", 17200.00,
                        "rating", 4.92
                ),
                Map.of(
                        "id", 105,
                        "title", "Reactive Microservices with Spring WebFlux & Kafka",
                        "status", "Drafting - Review Pending",
                        "enrolledStudents", 0,
                        "revenue", 0.00,
                        "rating", 0.0
                )
        ));

        return ResponseEntity.ok(ApiResponse.success("Instructor studio loaded successfully", data));
    }
}


package com.melangee.controller;

import com.melangee.dto.response.ApiResponse;
import com.melangee.dto.response.StudentDashboardResponse;
import com.melangee.service.StudentDashboardService;
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

@RestController
@RequestMapping("/api/v1/student")
@Tag(name = "Student Workspace", description = "Student-specific dashboard and learning operations")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentController {

    private final StudentDashboardService studentDashboardService;

    public StudentController(StudentDashboardService studentDashboardService) {
        this.studentDashboardService = studentDashboardService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get full student dashboard data from MySQL database")
    public ResponseEntity<ApiResponse<StudentDashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        StudentDashboardResponse response = studentDashboardService.getStudentDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Student dashboard loaded successfully", response));
    }
}

package com.melangee.controller;

import com.melangee.dto.request.EnrollmentRequest;
import com.melangee.dto.response.ApiResponse;
import com.melangee.dto.response.EnrollmentResponse;
import com.melangee.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@Tag(name = "Course Enrollment", description = "Endpoints for enrolling in courses and tracking student progress")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/{courseId}")
    @Operation(summary = "Enroll in a course", description = "Instant free enrollment for free courses, or development test enrollment for paid courses.")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enroll(
            @PathVariable Long courseId,
            @RequestBody(required = false) EnrollmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EnrollmentResponse enrollment = enrollmentService.enroll(courseId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Successfully enrolled in course!", enrollment));
    }

    @GetMapping("/my-courses")
    @Operation(summary = "Get current student's enrolled courses")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getMyEnrollments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<EnrollmentResponse> enrollments = enrollmentService.getStudentEnrollments(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Enrolled courses retrieved successfully", enrollments));
    }

    @GetMapping("/check/{courseId}")
    @Operation(summary = "Check if current student is enrolled in course")
    public ResponseEntity<ApiResponse<Boolean>> isEnrolled(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean enrolled = enrollmentService.isEnrolled(courseId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Enrollment status checked", enrolled));
    }

    @PatchMapping("/{courseId}/progress")
    @Operation(summary = "Update learning progress in an enrolled course")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> updateProgress(
            @PathVariable Long courseId,
            @RequestParam int completedLessons,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EnrollmentResponse updated = enrollmentService.updateProgress(courseId, completedLessons, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Progress updated successfully", updated));
    }
}


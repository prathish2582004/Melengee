package com.melangee.controller;

import com.melangee.dto.response.ApiResponse;
import com.melangee.dto.response.UserResponse;
import com.melangee.service.AuthService;
import com.melangee.service.UserService;
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
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Console", description = "Administration operations, metrics, user auditing and platform governance")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuthService authService;
    private final UserService userService;

    public AdminController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get Administration dashboard and system metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse adminUser = authService.getCurrentUser(userDetails.getUsername());
        Map<String, Object> stats = userService.getSystemStats();

        Map<String, Object> response = new HashMap<>();
        response.put("admin", adminUser);
        response.put("metrics", stats);

        return ResponseEntity.ok(ApiResponse.success("Admin dashboard loaded successfully", response));
    }

    @GetMapping("/users")
    @Operation(summary = "List all registered platform users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users retrieved successfully", users));
    }
}


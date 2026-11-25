package com.melangee.controller;

import com.melangee.dto.request.LoginRequest;
import com.melangee.dto.request.RegisterRequest;
import com.melangee.dto.response.ApiResponse;
import com.melangee.dto.response.AuthResponse;
import com.melangee.dto.response.UserResponse;
import com.melangee.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, login, profile retrieval, and session management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new Student or Instructor", description = "Validates inputs, encrypts password, creates user and associated profile. Prevents admin registration.")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful! Welcome to MELANGEE.", authResponse));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT", description = "Authenticates user credentials and returns JWT Bearer token and user details.")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful. Welcome back!", authResponse));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile", description = "Returns full profile details of currently authenticated user via JWT.")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User is not authenticated"));
        }
        UserResponse user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", user));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Stateless logout; client clears the stored JWT token.")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Successfully logged out from MELANGEE."));
    }
}


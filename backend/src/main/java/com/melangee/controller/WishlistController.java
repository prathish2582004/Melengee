package com.melangee.controller;

import com.melangee.dto.response.ApiResponse;
import com.melangee.dto.response.WishlistResponse;
import com.melangee.service.WishlistService;
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
@RequestMapping("/api/v1/wishlist")
@Tag(name = "Student Wishlist", description = "Endpoints for managing student saved courses")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get current student's wishlist")
    public ResponseEntity<ApiResponse<List<WishlistResponse>>> getWishlist(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<WishlistResponse> wishlist = wishlistService.getStudentWishlist(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved successfully", wishlist));
    }

    @PostMapping("/{courseId}")
    @Operation(summary = "Add course to wishlist")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        WishlistResponse item = wishlistService.addToWishlist(courseId, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course added to wishlist", item));
    }

    @DeleteMapping("/{courseId}")
    @Operation(summary = "Remove course from wishlist")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        wishlistService.removeFromWishlist(courseId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Course removed from wishlist", null));
    }
}


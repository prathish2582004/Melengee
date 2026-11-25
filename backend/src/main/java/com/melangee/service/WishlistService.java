package com.melangee.service;

import com.melangee.dto.response.WishlistResponse;
import com.melangee.entity.Course;
import com.melangee.entity.User;
import com.melangee.entity.Wishlist;
import com.melangee.exception.BadRequestException;
import com.melangee.exception.ResourceNotFoundException;
import com.melangee.mapper.CourseMapper;
import com.melangee.repository.CourseRepository;
import com.melangee.repository.UserRepository;
import com.melangee.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    public WishlistService(WishlistRepository wishlistRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository,
                           CourseMapper courseMapper) {
        this.wishlistRepository = wishlistRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
    }

    @Transactional
    public WishlistResponse addToWishlist(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (wishlistRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new BadRequestException("Course is already in your wishlist.");
        }

        Wishlist wishlist = new Wishlist(student, course);
        Wishlist saved = wishlistRepository.save(wishlist);
        return courseMapper.toWishlistResponse(saved);
    }

    @Transactional
    public void removeFromWishlist(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        Wishlist wishlist = wishlistRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course is not in your wishlist."));

        wishlistRepository.delete(wishlist);
    }

    @Transactional(readOnly = true)
    public List<WishlistResponse> getStudentWishlist(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        return wishlistRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(courseMapper::toWishlistResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        return wishlistRepository.existsByStudentIdAndCourseId(student.getId(), courseId);
    }
}


package com.melangee.service;

import com.melangee.dto.response.CourseDetailResponse;
import com.melangee.dto.response.CourseSummaryResponse;
import com.melangee.entity.Course;
import com.melangee.entity.CourseLevel;
import com.melangee.entity.Enrollment;
import com.melangee.entity.User;
import com.melangee.exception.ResourceNotFoundException;
import com.melangee.mapper.CourseMapper;
import com.melangee.repository.CourseRepository;
import com.melangee.repository.EnrollmentRepository;
import com.melangee.repository.UserRepository;
import com.melangee.repository.WishlistRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final WishlistRepository wishlistRepository;

    public CourseService(CourseRepository courseRepository,
                         CourseMapper courseMapper,
                         UserRepository userRepository,
                         EnrollmentRepository enrollmentRepository,
                         WishlistRepository wishlistRepository) {
        this.courseRepository = courseRepository;
        this.courseMapper = courseMapper;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.wishlistRepository = wishlistRepository;
    }

    @Transactional(readOnly = true)
    public Page<CourseSummaryResponse> getCourses(
            String keyword,
            String categorySlug,
            CourseLevel level,
            Boolean isFree,
            BigDecimal maxPrice,
            Double minRating,
            String sortBy,
            int page,
            int size,
            String currentStudentEmail
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "studentsCount"); // default 'popular'
        if ("rating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else if ("price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        // Normalize blank values to null for query
        String normKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        String normCategory = (categorySlug != null && !categorySlug.isBlank() && !"all".equalsIgnoreCase(categorySlug)) ? categorySlug.trim() : null;

        Page<Course> coursePage = courseRepository.findCoursesFiltered(
                normKeyword,
                normCategory,
                level,
                isFree,
                maxPrice,
                minRating,
                pageable
        );

        Long currentUserId = null;
        if (currentStudentEmail != null && !currentStudentEmail.isBlank()) {
            Optional<User> u = userRepository.findByEmail(currentStudentEmail);
            if (u.isPresent()) {
                currentUserId = u.get().getId();
            }
        }

        final Long finalUserId = currentUserId;
        return coursePage.map(course -> {
            boolean isEnrolled = false;
            boolean isWishlisted = false;
            if (finalUserId != null) {
                isEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(finalUserId, course.getId());
                isWishlisted = wishlistRepository.existsByStudentIdAndCourseId(finalUserId, course.getId());
            }
            return courseMapper.toCourseSummaryResponse(course, isEnrolled, isWishlisted);
        });
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseById(Long id, String currentStudentEmail) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        boolean isEnrolled = false;
        boolean isWishlisted = false;
        Integer progress = null;

        if (currentStudentEmail != null && !currentStudentEmail.isBlank()) {
            Optional<User> u = userRepository.findByEmail(currentStudentEmail);
            if (u.isPresent()) {
                Long studentId = u.get().getId();
                Optional<Enrollment> enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, course.getId());
                if (enrollment.isPresent()) {
                    isEnrolled = true;
                    progress = enrollment.get().getProgressPercentage();
                }
                isWishlisted = wishlistRepository.existsByStudentIdAndCourseId(studentId, course.getId());
            }
        }

        return courseMapper.toCourseDetailResponse(course, isEnrolled, isWishlisted, progress);
    }

    @Transactional(readOnly = true)
    public List<CourseSummaryResponse> getFeaturedCourses() {
        return courseRepository.findTop4ByStatusOrderByRatingDesc("PUBLISHED").stream()
                .map(courseMapper::toCourseSummaryResponse)
                .collect(Collectors.toList());
    }
}


package com.melangee.service;

import com.melangee.dto.response.*;
import com.melangee.entity.Course;
import com.melangee.entity.Enrollment;
import com.melangee.entity.EnrollmentStatus;
import com.melangee.entity.User;
import com.melangee.exception.ResourceNotFoundException;
import com.melangee.mapper.CourseMapper;
import com.melangee.mapper.UserMapper;
import com.melangee.repository.CourseRepository;
import com.melangee.repository.EnrollmentRepository;
import com.melangee.repository.UserRepository;
import com.melangee.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentDashboardService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final WishlistRepository wishlistRepository;
    private final CourseRepository courseRepository;
    private final UserMapper userMapper;
    private final CourseMapper courseMapper;

    public StudentDashboardService(UserRepository userRepository,
                                   EnrollmentRepository enrollmentRepository,
                                   WishlistRepository wishlistRepository,
                                   CourseRepository courseRepository,
                                   UserMapper userMapper,
                                   CourseMapper courseMapper) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.wishlistRepository = wishlistRepository;
        this.courseRepository = courseRepository;
        this.userMapper = userMapper;
        this.courseMapper = courseMapper;
    }

    @Transactional(readOnly = true)
    public StudentDashboardResponse getStudentDashboard(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        StudentDashboardResponse response = new StudentDashboardResponse();

        // 1. Student Profile
        UserResponse userResponse = userMapper.toUserResponse(student);
        response.setStudentProfile(userResponse);

        // 2. Enrollments
        List<Enrollment> allEnrollments = enrollmentRepository.findByStudentIdOrderByEnrolledAtDesc(student.getId());

        List<EnrollmentResponse> enrolledList = new ArrayList<>();
        List<EnrollmentResponse> completedList = new ArrayList<>();
        Enrollment activeContinueEnrollment = null;

        int totalHours = 0;

        for (Enrollment enr : allEnrollments) {
            EnrollmentResponse dto = courseMapper.toEnrollmentResponse(enr);
            if (enr.getStatus() == EnrollmentStatus.COMPLETED || enr.getProgressPercentage() >= 100) {
                completedList.add(dto);
            } else {
                enrolledList.add(dto);
                if (activeContinueEnrollment == null) {
                    activeContinueEnrollment = enr;
                }
            }
            totalHours += Math.max(1, (int) Math.round(enr.getCompletedLessonsCount() * 0.4));
        }

        response.setEnrolledCourses(enrolledList);
        response.setCompletedCourses(completedList);

        if (activeContinueEnrollment != null) {
            response.setContinueLearning(courseMapper.toEnrollmentResponse(activeContinueEnrollment));
        } else if (!allEnrollments.isEmpty()) {
            response.setContinueLearning(courseMapper.toEnrollmentResponse(allEnrollments.get(0)));
        }

        // 3. Dashboard Statistics
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalEnrolledCourses", allEnrollments.size());
        stats.put("coursesCompleted", completedList.size());
        stats.put("coursesInProgress", enrolledList.size());
        stats.put("totalLearningHours", totalHours > 0 ? totalHours : (enrolledList.isEmpty() ? 0 : 4));
        response.setStats(stats);

        // 4. Wishlist
        List<WishlistResponse> wishlistResponses = wishlistRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(courseMapper::toWishlistResponse)
                .collect(Collectors.toList());
        response.setWishlist(wishlistResponses);

        // 5. Recent Activity
        List<Map<String, Object>> activities = new ArrayList<>();
        for (Enrollment enr : allEnrollments) {
            Map<String, Object> act = new LinkedHashMap<>();
            act.put("id", enr.getId());
            act.put("type", enr.getStatus() == EnrollmentStatus.COMPLETED ? "COURSE_COMPLETED" : "LESSON_PROGRESS");
            act.put("courseTitle", enr.getCourse().getTitle());
            act.put("lessonTitle", enr.getLastAccessedLesson() != null ? enr.getLastAccessedLesson() : "Course Orientation");
            act.put("progress", enr.getProgressPercentage());
            act.put("timestamp", enr.getLastAccessedAt() != null ? enr.getLastAccessedAt() : enr.getEnrolledAt());
            activities.add(act);
        }
        if (activities.isEmpty()) {
            Map<String, Object> welcomeAct = new LinkedHashMap<>();
            welcomeAct.put("id", 1L);
            welcomeAct.put("type", "ACCOUNT_CREATED");
            welcomeAct.put("courseTitle", "Welcome to MELANGEE");
            welcomeAct.put("lessonTitle", "Account initialized and profile active");
            welcomeAct.put("progress", 100);
            welcomeAct.put("timestamp", student.getCreatedAt() != null ? student.getCreatedAt() : LocalDateTime.now());
            activities.add(welcomeAct);
        }
        response.setRecentActivity(activities);

        // 6. Notifications
        List<Map<String, Object>> notifications = new ArrayList<>();
        notifications.add(createNotification("WELCOME", "Welcome to MELANGEE", "Start exploring courses and enroll in high-impact programs.", LocalDateTime.now().minusHours(2)));
        if (!allEnrollments.isEmpty()) {
            notifications.add(createNotification("PROGRESS", "Keep Up the Momentum", "You are making steady progress in your enrolled curriculums.", LocalDateTime.now().minusMinutes(45)));
        }
        notifications.add(createNotification("FEATURE", "Phase 2 Active", "Course browsing, wishlist, and instant enrollment features are now live.", LocalDateTime.now().minusDays(1)));
        response.setNotifications(notifications);

        // 7. Certificates Placeholder Section
        List<Map<String, Object>> certs = new ArrayList<>();
        for (Enrollment comp : allEnrollments) {
            if (comp.getStatus() == EnrollmentStatus.COMPLETED || comp.getProgressPercentage() >= 100) {
                Map<String, Object> cert = new LinkedHashMap<>();
                cert.put("id", "CERT-" + comp.getCourse().getId() + "-" + student.getId());
                cert.put("courseTitle", comp.getCourse().getTitle());
                cert.put("issueDate", comp.getCompletedAt() != null ? comp.getCompletedAt() : LocalDateTime.now());
                cert.put("credentialId", "MEL-" + comp.getCourse().getId() + "-" + student.getId() + "-" + comp.getId());
                cert.put("status", "ISSUED");
                certs.add(cert);
            }
        }
        response.setCertificatesPlaceholder(certs);

        // 8. Course Recommendations
        Set<Long> enrolledCourseIds = allEnrollments.stream().map(e -> e.getCourse().getId()).collect(Collectors.toSet());
        List<CourseSummaryResponse> recommendations = courseRepository.findByStatus("PUBLISHED").stream()
                .filter(c -> !enrolledCourseIds.contains(c.getId()))
                .limit(4)
                .map(c -> {
                    boolean isWish = wishlistRepository.existsByStudentIdAndCourseId(student.getId(), c.getId());
                    return courseMapper.toCourseSummaryResponse(c, false, isWish);
                })
                .collect(Collectors.toList());
        response.setCourseRecommendations(recommendations);

        return response;
    }

    private Map<String, Object> createNotification(String type, String title, String message, LocalDateTime time) {
        Map<String, Object> notif = new LinkedHashMap<>();
        notif.put("type", type);
        notif.put("title", title);
        notif.put("message", message);
        notif.put("timestamp", time);
        return notif;
    }
}


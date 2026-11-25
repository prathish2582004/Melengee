package com.melangee;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.melangee.dto.request.EnrollmentRequest;
import com.melangee.dto.request.LoginRequest;
import com.melangee.dto.request.RegisterRequest;
import com.melangee.entity.Course;
import com.melangee.entity.Enrollment;
import com.melangee.entity.User;
import com.melangee.entity.Wishlist;
import com.melangee.repository.CourseRepository;
import com.melangee.repository.EnrollmentRepository;
import com.melangee.repository.UserRepository;
import com.melangee.repository.WishlistRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class Phase2IntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private EnrollmentRepository enrollmentRepository;

        @Autowired
        private WishlistRepository wishlistRepository;

        private String loginAndGetToken(String email, String password) throws Exception {
                LoginRequest loginRequest = new LoginRequest();
                loginRequest.setEmail(email);
                loginRequest.setPassword(password);

                MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data.token").isNotEmpty())
                                .andReturn();

                JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
                return root.path("data").path("token").asText();
        }

        private String registerTempStudent(String email) throws Exception {
                RegisterRequest req = new RegisterRequest(
                                "Phase Two Tester",
                                email,
                                "TestPass@1234",
                                "TestPass@1234",
                                "STUDENT");

                MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(req)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.data.token").isNotEmpty())
                                .andReturn();

                JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
                return root.path("data").path("token").asText();
        }

        private void cleanupTempStudent(String email) {
                userRepository.findByEmail(email).ifPresent(user -> {
                        List<Enrollment> enrollments = enrollmentRepository
                                        .findByStudentIdOrderByEnrolledAtDesc(user.getId());
                        for (Enrollment e : enrollments) {
                                Course c = e.getCourse();
                                enrollmentRepository.delete(e);
                                if (c != null && c.getStudentsCount() > 0) {
                                        c.setStudentsCount(c.getStudentsCount() - 1);
                                        courseRepository.save(c);
                                }
                        }
                        List<Wishlist> wishlists = wishlistRepository.findByStudentIdOrderByCreatedAtDesc(user.getId());
                        wishlistRepository.deleteAll(wishlists);
                        userRepository.delete(user);
                });
        }

        @Test
        @DisplayName("1. Course Discovery: listing, search, filters, sorting, pagination & categories")
        void testCourseDiscoveryEndpoints() throws Exception {
                // Categories API
                mockMvc.perform(get("/api/v1/categories"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data.length()", greaterThanOrEqualTo(6)))
                                .andExpect(jsonPath("$.data[0].coursesCount").isNumber());

                // Featured Courses public API
                mockMvc.perform(get("/api/v1/public/courses/featured"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.length()", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data[0].isFree").isBoolean());

                // Paginated all courses (including CORS check from localhost:5174 Vite fallback
                // port)
                mockMvc.perform(get("/api/v1/courses")
                                .header("Origin", "http://localhost:5174")
                                .param("page", "0")
                                .param("size", "2")
                                .param("sortBy", "popular"))
                                .andExpect(status().isOk())
                                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5174"))
                                .andExpect(jsonPath("$.data.content.length()").value(2))
                                .andExpect(jsonPath("$.data.totalElements", greaterThanOrEqualTo(6)))
                                .andExpect(jsonPath("$.data.totalPages", greaterThanOrEqualTo(3)));

                // Search filter
                mockMvc.perform(get("/api/v1/courses")
                                .param("search", "Docker"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.content.length()", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.content[*].title", hasItem(containsString("Docker"))));

                // Free courses filter
                mockMvc.perform(get("/api/v1/courses")
                                .param("isFree", "true"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.content.length()", greaterThanOrEqualTo(2)))
                                .andExpect(jsonPath("$.data.content[*].isFree", everyItem(is(true))));

                // Category & Level filter
                mockMvc.perform(get("/api/v1/courses")
                                .param("category", "full-stack-web-development")
                                .param("level", "ADVANCED")
                                .param("minRating", "4.8")
                                .param("sortBy", "rating"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.content.length()", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.content[0].level").value("ADVANCED"));
        }

        @Test
        @DisplayName("2. Course Details: modules, lessons, preview flags, objectives & 404 handling")
        void testCourseDetailsEndpoint() throws Exception {
                Course course = courseRepository.findBySlug("enterprise-java-spring-boot-microservices")
                                .orElseThrow();

                mockMvc.perform(get("/api/v1/courses/{id}", course.getId()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.title")
                                                .value("Enterprise Java & Spring Boot Microservices Mastery"))
                                .andExpect(jsonPath("$.data.isFree").value(false))
                                .andExpect(jsonPath("$.data.objectives.length()", greaterThanOrEqualTo(2)))
                                .andExpect(jsonPath("$.data.requirements.length()", greaterThanOrEqualTo(2)))
                                .andExpect(jsonPath("$.data.modules.length()", greaterThanOrEqualTo(2)))
                                .andExpect(jsonPath("$.data.modules[0].lessons[0].isFreePreview").isBoolean())
                                .andExpect(jsonPath("$.data.instructor.fullName").value("Dr. Elena Vance"));

                mockMvc.perform(get("/api/v1/courses/{id}", 999999L))
                                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("3. Enrollment & Progress: free enrollment, duplicate prevention, paid gate + dev-test flag & completion")
        void testEnrollmentLifecycle() throws Exception {
                String tempEmail = "enroll_" + UUID.randomUUID().toString().substring(0, 8) + "@melangee.com";
                try {
                        String token = registerTempStudent(tempEmail);
                        Course freeCourse = courseRepository.findBySlug("docker-containers-cloud-foundations")
                                        .orElseThrow();
                        Course paidCourse = courseRepository.findBySlug("applied-machine-learning-pytorch")
                                        .orElseThrow();

                        // Free enrollment succeeds -> 201
                        MvcResult enrollRes = mockMvc.perform(post("/api/v1/enrollments/{courseId}", freeCourse.getId())
                                        .header("Authorization", "Bearer " + token)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(new EnrollmentRequest(false))))
                                        .andExpect(status().isCreated())
                                        .andExpect(jsonPath("$.data.courseId").value(freeCourse.getId()))
                                        .andExpect(jsonPath("$.data.isDevTestEnrollment").value(false))
                                        .andExpect(jsonPath("$.data.status").value("ENROLLED"))
                                        .andReturn();

                        int totalLessons = objectMapper.readTree(enrollRes.getResponse().getContentAsString())
                                        .path("data").path("totalLessonsCount").asInt();

                        // Duplicate enrollment prevented -> 400
                        mockMvc.perform(post("/api/v1/enrollments/{courseId}", freeCourse.getId())
                                        .header("Authorization", "Bearer " + token)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(new EnrollmentRequest(false))))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.message", containsString("already enrolled")));

                        // Paid enrollment without devTest flag rejected -> 400
                        mockMvc.perform(post("/api/v1/enrollments/{courseId}", paidCourse.getId())
                                        .header("Authorization", "Bearer " + token)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(new EnrollmentRequest(false))))
                                        .andExpect(status().isBadRequest());

                        // Paid enrollment with labeled devTest flag accepted -> 201
                        mockMvc.perform(post("/api/v1/enrollments/{courseId}", paidCourse.getId())
                                        .header("Authorization", "Bearer " + token)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("{\"devTestEnrollment\":true}"))
                                        .andExpect(status().isCreated())
                                        .andExpect(jsonPath("$.data.isDevTestEnrollment").value(true));

                        // Check endpoint confirms enrollment
                        mockMvc.perform(get("/api/v1/enrollments/check/{courseId}", freeCourse.getId())
                                        .header("Authorization", "Bearer " + token))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.data").value(true));

                        // Complete all lessons on free course -> transitions status to COMPLETED
                        mockMvc.perform(patch("/api/v1/enrollments/{courseId}/progress", freeCourse.getId())
                                        .header("Authorization", "Bearer " + token)
                                        .param("completedLessons", String.valueOf(totalLessons)))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.data.progressPercentage").value(100))
                                        .andExpect(jsonPath("$.data.status").value("COMPLETED"));

                        // Check my-courses lists both
                        mockMvc.perform(get("/api/v1/enrollments/my-courses")
                                        .header("Authorization", "Bearer " + token))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.data.length()").value(2));
                } finally {
                        cleanupTempStudent(tempEmail);
                }
        }

        @Test
        @DisplayName("4. Wishlist: add, duplicate check, view, and remove")
        void testWishlistLifecycle() throws Exception {
                String tempEmail = "wish_" + UUID.randomUUID().toString().substring(0, 8) + "@melangee.com";
                try {
                        String token = registerTempStudent(tempEmail);
                        Course course = courseRepository.findBySlug("kubernetes-docker-aws-cloud-bootcamp")
                                        .orElseThrow();

                        // Add -> 201
                        mockMvc.perform(post("/api/v1/wishlist/{courseId}", course.getId())
                                        .header("Authorization", "Bearer " + token))
                                        .andExpect(status().isCreated())
                                        .andExpect(jsonPath("$.data.course.id").value(course.getId()))
                                        .andExpect(jsonPath("$.data.course.isWishlisted").value(true));

                        // Duplicate -> 400
                        mockMvc.perform(post("/api/v1/wishlist/{courseId}", course.getId())
                                        .header("Authorization", "Bearer " + token))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.message", containsString("already in your wishlist")));

                        // View wishlist -> contains course
                        mockMvc.perform(get("/api/v1/wishlist")
                                        .header("Authorization", "Bearer " + token))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.data.length()").value(1));

                        // Remove -> 200
                        mockMvc.perform(delete("/api/v1/wishlist/{courseId}", course.getId())
                                        .header("Authorization", "Bearer " + token))
                                        .andExpect(status().isOk());

                        // Empty after removal
                        mockMvc.perform(get("/api/v1/wishlist")
                                        .header("Authorization", "Bearer " + token))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.data.length()").value(0));
                } finally {
                        cleanupTempStudent(tempEmail);
                }
        }

        @Test
        @DisplayName("5. Student Dashboard: returns live MySQL stats, courses, wishlist, activity, notifications & certs")
        void testStudentDashboardEndpoint() throws Exception {
                String studentToken = loginAndGetToken("student@melangee.com", "Student@123456");

                mockMvc.perform(get("/api/v1/student/dashboard")
                                .header("Authorization", "Bearer " + studentToken))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.data.studentProfile.email").value("student@melangee.com"))
                                .andExpect(jsonPath("$.data.stats.totalEnrolledCourses", greaterThanOrEqualTo(2)))
                                .andExpect(jsonPath("$.data.stats.coursesCompleted", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.stats.coursesInProgress", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.stats.totalLearningHours", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.continueLearning.courseTitle").isNotEmpty())
                                .andExpect(jsonPath("$.data.enrolledCourses").isArray())
                                .andExpect(jsonPath("$.data.completedCourses.length()", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.wishlist").isArray())
                                .andExpect(jsonPath("$.data.recentActivity.length()", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.notifications.length()", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.certificatesPlaceholder.length()", greaterThanOrEqualTo(1)))
                                .andExpect(jsonPath("$.data.courseRecommendations.length()", greaterThanOrEqualTo(1)));
        }

        @Test
        @DisplayName("6. Authorization: unauthorized 401 and wrong-role 403 checks")
        void testAuthorizationAndSecurity() throws Exception {
                Course course = courseRepository.findBySlug("docker-containers-cloud-foundations").orElseThrow();

                // Unauthenticated requests blocked with 401
                mockMvc.perform(get("/api/v1/student/dashboard"))
                                .andExpect(status().isUnauthorized());
                mockMvc.perform(post("/api/v1/enrollments/{id}", course.getId()))
                                .andExpect(status().isUnauthorized());
                mockMvc.perform(get("/api/v1/wishlist"))
                                .andExpect(status().isUnauthorized());

                // Instructor blocked from student dashboard, enrollment & wishlist -> 403
                String instructorToken = loginAndGetToken("instructor@melangee.com", "Instructor@123456");

                mockMvc.perform(get("/api/v1/student/dashboard")
                                .header("Authorization", "Bearer " + instructorToken))
                                .andExpect(status().isForbidden());
                mockMvc.perform(post("/api/v1/enrollments/{id}", course.getId())
                                .header("Authorization", "Bearer " + instructorToken))
                                .andExpect(status().isForbidden());
                mockMvc.perform(post("/api/v1/wishlist/{id}", course.getId())
                                .header("Authorization", "Bearer " + instructorToken))
                                .andExpect(status().isForbidden());

                // Public Admin registration prevented -> 400
                RegisterRequest adminAttempt = new RegisterRequest("Bad Actor", "hacker@melangee.com", "Pass@1234",
                                "Pass@1234", "ADMIN");
                mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(adminAttempt)))
                                .andExpect(status().isBadRequest());
        }
}

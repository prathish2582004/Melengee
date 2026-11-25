package com.melangee.service;

import com.melangee.dto.request.EnrollmentRequest;
import com.melangee.dto.response.EnrollmentResponse;
import com.melangee.entity.*;
import com.melangee.exception.BadRequestException;
import com.melangee.exception.ResourceNotFoundException;
import com.melangee.mapper.CourseMapper;
import com.melangee.repository.CourseRepository;
import com.melangee.repository.EnrollmentRepository;
import com.melangee.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             CourseRepository courseRepository,
                             UserRepository userRepository,
                             CourseMapper courseMapper) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
    }

    @Transactional
    public EnrollmentResponse enroll(Long courseId, EnrollmentRequest request, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // 1. Prevent duplicate enrollment
        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new BadRequestException("You are already enrolled in this course.");
        }

        // 2. Validate Free vs Paid
        boolean isDevTest = false;
        if (!course.isFree()) {
            if (request != null && request.isDevTestEnrollment()) {
                isDevTest = true;
            } else {
                throw new BadRequestException(
                        "This is a premium course ($" + course.getPrice() + "). " +
                        "Official payment processing is introduced in a subsequent phase. " +
                        "Please select 'Enroll as Development Test' to complete your enrollment now."
                );
            }
        }

        // 3. Count total lessons
        int totalLessons = 0;
        String firstLessonTitle = "Course Orientation & Welcome";
        if (course.getModules() != null && !course.getModules().isEmpty()) {
            for (CourseModule mod : course.getModules()) {
                if (mod.getLessons() != null) {
                    totalLessons += mod.getLessons().size();
                    if (totalLessons == mod.getLessons().size() && !mod.getLessons().isEmpty()) {
                        firstLessonTitle = mod.getLessons().get(0).getTitle();
                    }
                }
            }
        }

        // 4. Create and save Enrollment entity in MySQL
        Enrollment enrollment = new Enrollment(student, course, isDevTest);
        enrollment.setTotalLessonsCount(totalLessons);
        enrollment.setCompletedLessonsCount(0);
        enrollment.setProgressPercentage(0);
        enrollment.setLastAccessedLesson(firstLessonTitle);

        Enrollment saved = enrollmentRepository.save(enrollment);

        // 5. Increment course student count
        course.setStudentsCount(course.getStudentsCount() + 1);
        courseRepository.save(course);

        return courseMapper.toEnrollmentResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getStudentEnrollments(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        return enrollmentRepository.findByStudentIdOrderByEnrolledAtDesc(student.getId()).stream()
                .map(courseMapper::toEnrollmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isEnrolled(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        return enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId);
    }

    @Transactional
    public EnrollmentResponse updateProgress(Long courseId, int completedLessons, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + studentEmail));

        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment record not found"));

        int total = enrollment.getTotalLessonsCount() > 0 ? enrollment.getTotalLessonsCount() : 10;
        int completed = Math.max(0, Math.min(completedLessons, total));
        int percentage = (int) Math.round(((double) completed / total) * 100);

        enrollment.setCompletedLessonsCount(completed);
        enrollment.setProgressPercentage(percentage);
        if (completed == 0) {
            enrollment.setStatus(EnrollmentStatus.ENROLLED);
            enrollment.setCompletedAt(null);
        } else if (enrollment.getCourse() != null && enrollment.getCourse().getModules() != null) {
            List<Lesson> flatLessons = enrollment.getCourse().getModules().stream()
                    .flatMap(m -> m.getLessons().stream())
                    .toList();
            if (!flatLessons.isEmpty()) {
                int lessonIdx = Math.min(completed - 1, flatLessons.size() - 1);
                enrollment.setLastAccessedLesson(flatLessons.get(lessonIdx).getTitle());
            }
        }

        Enrollment saved = enrollmentRepository.save(enrollment);
        return courseMapper.toEnrollmentResponse(saved);
    }
}


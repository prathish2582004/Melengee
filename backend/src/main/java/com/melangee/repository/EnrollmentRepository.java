package com.melangee.repository;

import com.melangee.entity.Course;
import com.melangee.entity.Enrollment;
import com.melangee.entity.EnrollmentStatus;
import com.melangee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByStudentAndCourse(User student, Course course);

    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    List<Enrollment> findByStudentIdOrderByEnrolledAtDesc(Long studentId);

    List<Enrollment> findByStudentIdAndStatus(Long studentId, EnrollmentStatus status);

    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, EnrollmentStatus status);

    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId ORDER BY e.lastAccessedAt DESC")
    List<Enrollment> findRecentEnrollmentsByStudent(@Param("studentId") Long studentId);
}


package com.melangee.repository;

import com.melangee.entity.Course;
import com.melangee.entity.User;
import com.melangee.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    Optional<Wishlist> findByStudentAndCourse(User student, Course course);

    Optional<Wishlist> findByStudentIdAndCourseId(Long studentId, Long courseId);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    List<Wishlist> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    void deleteByStudentIdAndCourseId(Long studentId, Long courseId);
}


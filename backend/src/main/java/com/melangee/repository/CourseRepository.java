package com.melangee.repository;

import com.melangee.entity.Course;
import com.melangee.entity.CourseLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findBySlug(String slug);

    List<Course> findTop4ByStatusOrderByRatingDesc(String status);

    List<Course> findByStatus(String status);

    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' " +
           "AND (:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(c.instructor.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:categorySlug IS NULL OR c.category.slug = :categorySlug) " +
           "AND (:level IS NULL OR c.level = :level) " +
           "AND (:isFree IS NULL OR c.isFree = :isFree) " +
           "AND (:maxPrice IS NULL OR c.price <= :maxPrice) " +
           "AND (:minRating IS NULL OR c.rating >= :minRating)")
    Page<Course> findCoursesFiltered(
            @Param("keyword") String keyword,
            @Param("categorySlug") String categorySlug,
            @Param("level") CourseLevel level,
            @Param("isFree") Boolean isFree,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") Double minRating,
            Pageable pageable
    );

    List<Course> findTop4ByCategorySlugAndIdNot(String categorySlug, Long courseId);
}


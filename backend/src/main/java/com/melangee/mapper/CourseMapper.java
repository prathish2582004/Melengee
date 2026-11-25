package com.melangee.mapper;

import com.melangee.dto.response.*;
import com.melangee.entity.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CourseMapper {

    private final UserMapper userMapper;

    public CourseMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        int count = category.getCourses() != null ? category.getCourses().size() : 0;
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getIcon(),
                category.getColor(),
                count
        );
    }

    public LessonResponse toLessonResponse(Lesson lesson) {
        if (lesson == null) return null;
        return new LessonResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getDuration(),
                lesson.getVideoUrl(),
                lesson.isFreePreview(),
                lesson.getOrderIndex()
        );
    }

    public CourseModuleResponse toCourseModuleResponse(CourseModule module) {
        if (module == null) return null;
        List<LessonResponse> lessonResponses = module.getLessons() != null
                ? module.getLessons().stream().map(this::toLessonResponse).collect(Collectors.toList())
                : new ArrayList<>();

        return new CourseModuleResponse(
                module.getId(),
                module.getTitle(),
                module.getDescription(),
                module.getOrderIndex(),
                lessonResponses
        );
    }

    public CourseSummaryResponse toCourseSummaryResponse(Course course) {
        return toCourseSummaryResponse(course, false, false);
    }

    public CourseSummaryResponse toCourseSummaryResponse(Course course, boolean isEnrolled, boolean isWishlisted) {
        if (course == null) return null;

        int modulesCount = course.getModules() != null ? course.getModules().size() : 0;
        int lessonsCount = 0;
        if (course.getModules() != null) {
            for (CourseModule mod : course.getModules()) {
                if (mod.getLessons() != null) {
                    lessonsCount += mod.getLessons().size();
                }
            }
        }

        String instructorName = course.getInstructor() != null ? course.getInstructor().getFullName() : "Melangee Faculty";
        String instructorAvatar = null;
        if (course.getInstructor() != null && course.getInstructor().getInstructorProfile() != null) {
            instructorAvatar = course.getInstructor().getInstructorProfile().getAvatarUrl();
        }

        String catName = course.getCategory() != null ? course.getCategory().getName() : "General";
        String catSlug = course.getCategory() != null ? course.getCategory().getSlug() : "general";

        CourseSummaryResponse res = new CourseSummaryResponse(
                course.getId(),
                course.getTitle(),
                course.getSlug(),
                course.getSubtitle(),
                instructorName,
                instructorAvatar,
                catName,
                catSlug,
                course.getLevel(),
                course.getPrice(),
                course.getOriginalPrice(),
                course.isFree(),
                course.getThumbnailUrl(),
                course.getDuration(),
                course.getRating(),
                course.getReviewsCount(),
                course.getStudentsCount(),
                course.getBadge(),
                modulesCount,
                lessonsCount
        );
        res.setEnrolled(isEnrolled);
        res.setWishlisted(isWishlisted);
        return res;
    }

    public CourseDetailResponse toCourseDetailResponse(Course course, boolean isEnrolled, boolean isWishlisted, Integer progress) {
        if (course == null) return null;

        CourseDetailResponse res = new CourseDetailResponse();
        res.setId(course.getId());
        res.setTitle(course.getTitle());
        res.setSlug(course.getSlug());
        res.setSubtitle(course.getSubtitle());
        res.setDescription(course.getDescription());
        res.setLevel(course.getLevel());
        res.setPrice(course.getPrice());
        res.setOriginalPrice(course.getOriginalPrice());
        res.setFree(course.isFree());
        res.setThumbnailUrl(course.getThumbnailUrl());
        res.setDuration(course.getDuration());
        res.setRating(course.getRating());
        res.setReviewsCount(course.getReviewsCount());
        res.setStudentsCount(course.getStudentsCount());
        res.setBadge(course.getBadge());
        res.setEnrolled(isEnrolled);
        res.setWishlisted(isWishlisted);
        res.setStudentProgress(progress);

        if (course.getObjectives() != null && !course.getObjectives().isBlank()) {
            List<String> objs = Arrays.stream(course.getObjectives().split("\\r?\\n"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            res.setObjectives(objs);
        }

        if (course.getRequirements() != null && !course.getRequirements().isBlank()) {
            List<String> reqs = Arrays.stream(course.getRequirements().split("\\r?\\n"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            res.setRequirements(reqs);
        }

        if (course.getInstructor() != null) {
            res.setInstructor(userMapper.toUserResponse(course.getInstructor()));
        }

        if (course.getCategory() != null) {
            res.setCategory(toCategoryResponse(course.getCategory()));
        }

        if (course.getModules() != null) {
            List<CourseModuleResponse> moduleResponses = course.getModules().stream()
                    .map(this::toCourseModuleResponse)
                    .collect(Collectors.toList());
            res.setModules(moduleResponses);

            int totalL = 0;
            for (CourseModuleResponse m : moduleResponses) {
                totalL += m.getLessons().size();
            }
            res.setTotalLessons(totalL);
        }

        return res;
    }

    public EnrollmentResponse toEnrollmentResponse(Enrollment enrollment) {
        if (enrollment == null) return null;

        EnrollmentResponse res = new EnrollmentResponse();
        res.setId(enrollment.getId());
        res.setStatus(enrollment.getStatus());
        res.setProgressPercentage(enrollment.getProgressPercentage());
        res.setCompletedLessonsCount(enrollment.getCompletedLessonsCount());
        res.setTotalLessonsCount(enrollment.getTotalLessonsCount());
        res.setDevTestEnrollment(enrollment.isDevTestEnrollment());
        res.setLastAccessedLesson(enrollment.getLastAccessedLesson());
        res.setEnrolledAt(enrollment.getEnrolledAt());
        res.setCompletedAt(enrollment.getCompletedAt());
        res.setLastAccessedAt(enrollment.getLastAccessedAt());

        if (enrollment.getCourse() != null) {
            Course c = enrollment.getCourse();
            res.setCourseId(c.getId());
            res.setCourseTitle(c.getTitle());
            res.setCourseSlug(c.getSlug());
            res.setCourseThumbnailUrl(c.getThumbnailUrl());
            res.setDuration(c.getDuration());
            if (c.getCategory() != null) {
                res.setCategoryName(c.getCategory().getName());
            }
            if (c.getInstructor() != null) {
                res.setInstructorName(c.getInstructor().getFullName());
            }
        }

        return res;
    }

    public WishlistResponse toWishlistResponse(Wishlist wishlist) {
        if (wishlist == null) return null;
        CourseSummaryResponse courseRes = toCourseSummaryResponse(wishlist.getCourse(), false, true);
        return new WishlistResponse(wishlist.getId(), courseRes, wishlist.getCreatedAt());
    }
}


package com.melangee.service;

import com.melangee.dto.response.CategoryResponse;
import com.melangee.entity.Category;
import com.melangee.exception.ResourceNotFoundException;
import com.melangee.mapper.CourseMapper;
import com.melangee.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CourseMapper courseMapper;

    public CategoryService(CategoryRepository categoryRepository, CourseMapper courseMapper) {
        this.categoryRepository = categoryRepository;
        this.courseMapper = courseMapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(courseMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
        return courseMapper.toCategoryResponse(category);
    }
}


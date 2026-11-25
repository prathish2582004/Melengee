package com.melangee.service;

import com.melangee.dto.response.UserResponse;
import com.melangee.entity.RoleType;
import com.melangee.entity.User;
import com.melangee.exception.ResourceNotFoundException;
import com.melangee.mapper.UserMapper;
import com.melangee.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        long students = userRepository.findByRoleName(RoleType.ROLE_STUDENT).size();
        long instructors = userRepository.findByRoleName(RoleType.ROLE_INSTRUCTOR).size();
        long admins = userRepository.findByRoleName(RoleType.ROLE_ADMIN).size();

        stats.put("totalUsers", totalUsers);
        stats.put("totalStudents", students);
        stats.put("totalInstructors", instructors);
        stats.put("totalAdmins", admins);
        stats.put("activeCourses", 24);
        stats.put("totalEnrollments", 1420);
        return stats;
    }
}


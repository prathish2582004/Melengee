package com.melangee.service;

import com.melangee.dto.request.LoginRequest;
import com.melangee.dto.request.RegisterRequest;
import com.melangee.dto.response.AuthResponse;
import com.melangee.dto.response.UserResponse;
import com.melangee.entity.*;
import com.melangee.exception.BadRequestException;
import com.melangee.exception.EmailAlreadyExistsException;
import com.melangee.exception.ResourceNotFoundException;
import com.melangee.mapper.UserMapper;
import com.melangee.repository.InstructorProfileRepository;
import com.melangee.repository.RoleRepository;
import com.melangee.repository.StudentProfileRepository;
import com.melangee.repository.UserRepository;
import com.melangee.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       StudentProfileRepository studentProfileRepository,
                       InstructorProfileRepository instructorProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.instructorProfileRepository = instructorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userMapper = userMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Password confirmation check
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        // 2. Strict Role verification (Strictly reject ADMIN registration via public endpoint)
        String requestedRole = request.getRole().toUpperCase().trim();
        if ("ADMIN".equals(requestedRole) || "ROLE_ADMIN".equals(requestedRole)) {
            throw new BadRequestException("Public registration as an Administrator is not allowed.");
        }

        RoleType roleType;
        if ("INSTRUCTOR".equals(requestedRole) || "ROLE_INSTRUCTOR".equals(requestedRole)) {
            roleType = RoleType.ROLE_INSTRUCTOR;
        } else if ("STUDENT".equals(requestedRole) || "ROLE_STUDENT".equals(requestedRole)) {
            roleType = RoleType.ROLE_STUDENT;
        } else {
            throw new BadRequestException("Invalid role specified. Must be STUDENT or INSTRUCTOR.");
        }

        // 3. Duplicate email check
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("The email '" + email + "' is already registered. Please login or use a different email.");
        }

        // 4. Fetch Role entity
        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> new ResourceNotFoundException("Role " + roleType + " not found in system."));

        // 5. Encrypt password using BCrypt
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 6. Create User
        User user = new User(request.getFullName().trim(), email, encodedPassword, role);

        // 7. Initialize appropriate role profile
        if (roleType == RoleType.ROLE_STUDENT) {
            StudentProfile studentProfile = new StudentProfile(user);
            studentProfile.setHeadline("Eager Student");
            studentProfile.setBio("Enrolled on MELANGEE to master industry-leading skills.");
            user.setStudentProfile(studentProfile);
        } else if (roleType == RoleType.ROLE_INSTRUCTOR) {
            InstructorProfile instructorProfile = new InstructorProfile(user);
            instructorProfile.setHeadline("Passionate Educator");
            instructorProfile.setBio("Educating the next generation of engineers and creators on MELANGEE.");
            user.setInstructorProfile(instructorProfile);
        }

        User savedUser = userRepository.save(user);

        // 8. Generate JWT token
        String token = tokenProvider.generateTokenFromUsername(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getRole().getName().name()
        );

        UserResponse userResponse = userMapper.toUserResponse(savedUser);
        return new AuthResponse(token, tokenProvider.getJwtExpirationMs(), userResponse);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UserResponse userResponse = userMapper.toUserResponse(user);
        return new AuthResponse(token, tokenProvider.getJwtExpirationMs(), userResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return userMapper.toUserResponse(user);
    }
}


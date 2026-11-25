package com.melangee.mapper;

import com.melangee.dto.response.InstructorProfileResponse;
import com.melangee.dto.response.StudentProfileResponse;
import com.melangee.dto.response.UserResponse;
import com.melangee.entity.InstructorProfile;
import com.melangee.entity.StudentProfile;
import com.melangee.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        UserResponse response = new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName().name(),
                user.isEnabled(),
                user.getCreatedAt()
        );

        if (user.getStudentProfile() != null) {
            response.setStudentProfile(toStudentProfileResponse(user.getStudentProfile()));
        }

        if (user.getInstructorProfile() != null) {
            response.setInstructorProfile(toInstructorProfileResponse(user.getInstructorProfile()));
        }

        return response;
    }

    public StudentProfileResponse toStudentProfileResponse(StudentProfile profile) {
        if (profile == null) {
            return null;
        }
        return new StudentProfileResponse(
                profile.getId(),
                profile.getHeadline(),
                profile.getBio(),
                profile.getPhone(),
                profile.getAvatarUrl(),
                profile.getLearningGoals(),
                profile.getCreatedAt()
        );
    }

    public InstructorProfileResponse toInstructorProfileResponse(InstructorProfile profile) {
        if (profile == null) {
            return null;
        }
        return new InstructorProfileResponse(
                profile.getId(),
                profile.getHeadline(),
                profile.getBio(),
                profile.getPhone(),
                profile.getAvatarUrl(),
                profile.getSpecialization(),
                profile.getQualification(),
                profile.getYearsOfExperience(),
                profile.getCreatedAt()
        );
    }
}


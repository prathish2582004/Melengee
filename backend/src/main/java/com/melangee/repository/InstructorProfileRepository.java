package com.melangee.repository;

import com.melangee.entity.InstructorProfile;
import com.melangee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstructorProfileRepository extends JpaRepository<InstructorProfile, Long> {
    Optional<InstructorProfile> findByUser(User user);
    Optional<InstructorProfile> findByUserId(Long userId);
}


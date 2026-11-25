package com.melangee.config;

import com.melangee.entity.*;
import com.melangee.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final WishlistRepository wishlistRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${melangee.app.initialAdminEmail:admin@melangee.com}")
    private String adminEmail;

    @Value("${melangee.app.initialAdminPassword:Admin@123456}")
    private String adminPassword;

    @Value("${melangee.app.initialAdminName:Melangee Administrator}")
    private String adminName;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           CourseRepository courseRepository,
                           EnrollmentRepository enrollmentRepository,
                           WishlistRepository wishlistRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.wishlistRepository = wishlistRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Seed Roles
        for (RoleType roleType : RoleType.values()) {
            if (!roleRepository.existsByName(roleType)) {
                roleRepository.save(new Role(roleType));
                logger.info("Initialized role: {}", roleType);
            }
        }

        // 2. Seed Initial Administrator Account
        if (!userRepository.existsByEmail(adminEmail)) {
            Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                    .orElseThrow(() -> new IllegalStateException("ROLE_ADMIN not found"));

            User admin = new User(
                    adminName,
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    adminRole
            );
            userRepository.save(admin);
            logger.info(">>> Initial Administrator account seeded: {}", adminEmail);
        }

        // 3. Seed demo Instructors
        Role instructorRole = roleRepository.findByName(RoleType.ROLE_INSTRUCTOR)
                .orElseThrow(() -> new IllegalStateException("ROLE_INSTRUCTOR not found"));

        User instructorElena = userRepository.findByEmail("instructor@melangee.com")
                .orElseGet(() -> {
                    User u = new User(
                            "Dr. Elena Vance",
                            "instructor@melangee.com",
                            passwordEncoder.encode("Instructor@123456"),
                            instructorRole
                    );
                    InstructorProfile profile = new InstructorProfile(u);
                    profile.setHeadline("Senior Full-Stack Architect & Cloud Specialist");
                    profile.setBio("12+ years leading enterprise distributed architectures.");
                    profile.setSpecialization("Software Architecture & Distributed Systems");
                    profile.setQualification("Ph.D. in Computer Engineering, MIT");
                    profile.setYearsOfExperience(12);
                    profile.setPhone("+1-555-0199");
                    u.setInstructorProfile(profile);
                    return userRepository.save(u);
                });

        User instructorMarcus = userRepository.findByEmail("marcus@melangee.com")
                .orElseGet(() -> {
                    User u = new User(
                            "Marcus Thorne",
                            "marcus@melangee.com",
                            passwordEncoder.encode("Instructor@123456"),
                            instructorRole
                    );
                    InstructorProfile profile = new InstructorProfile(u);
                    profile.setHeadline("Staff Frontend Engineer & React Core Contributor");
                    profile.setBio("10+ years specializing in high-performance frontend architecture.");
                    profile.setSpecialization("React, TypeScript & Web Performance");
                    profile.setQualification("B.S. in Software Engineering, UC Berkeley");
                    profile.setYearsOfExperience(10);
                    profile.setPhone("+1-555-0188");
                    u.setInstructorProfile(profile);
                    return userRepository.save(u);
                });

        // 4. Seed demo Student account
        Role studentRole = roleRepository.findByName(RoleType.ROLE_STUDENT)
                .orElseThrow(() -> new IllegalStateException("ROLE_STUDENT not found"));

        User demoStudent = userRepository.findByEmail("student@melangee.com")
                .orElseGet(() -> {
                    User u = new User(
                            "Alex Morgan",
                            "student@melangee.com",
                            passwordEncoder.encode("Student@123456"),
                            studentRole
                    );
                    StudentProfile profile = new StudentProfile(u);
                    profile.setHeadline("Software Engineering Apprentice");
                    profile.setBio("Passionate about cloud architecture and frontend performance.");
                    profile.setLearningGoals("Master Spring Boot, React, and Microservices");
                    profile.setPhone("+1-555-0144");
                    u.setStudentProfile(profile);
                    return userRepository.save(u);
                });

        // 5. Seed Categories
        Category catWeb = getOrCreateCategory("Full-Stack Web Development", "full-stack-web-development", "Modern frontend and backend engineering tracks.", "Code", "#3B82F6");
        Category catCloud = getOrCreateCategory("Cloud Architecture & DevOps", "cloud-architecture-devops", "Distributed infrastructure, containers, and orchestration.", "Cloud", "#6366F1");
        Category catData = getOrCreateCategory("Data Science & Artificial Intelligence", "data-science-ai", "Machine learning, neural networks, and data pipelines.", "Cpu", "#8B5CF6");
        Category catSec = getOrCreateCategory("Cybersecurity & Defense", "cybersecurity-defense", "Application security, network defense, and ethical hacking.", "ShieldCheck", "#EC4899");
        Category catMobile = getOrCreateCategory("Mobile Engineering", "mobile-engineering", "Cross-platform and native mobile software development.", "Smartphone", "#10B981");
        Category catDesign = getOrCreateCategory("Product Design & UX", "product-design-ux", "Interactive user experiences, design systems, and Figma.", "Palette", "#F59E0B");

        // 6. Seed Courses with Modules and Lessons
        if (courseRepository.count() == 0) {
            // Course 1: Enterprise Java (Paid)
            Course c1 = new Course(
                    "Enterprise Java & Spring Boot Microservices Mastery",
                    "enterprise-java-spring-boot-microservices",
                    "Architect scalable, fault-tolerant microservices with Spring Boot 3, Spring Security, Docker, and Kafka.",
                    "An intensive hands-on masterclass covering production architecture from scratch. You will build enterprise microservices with RESTful APIs, Spring Data JPA, JWT authentication, centralized caching with Redis, asynchronous messaging via Kafka, and containerized deployment with Docker and Kubernetes.",
                    CourseLevel.ADVANCED,
                    new BigDecimal("49.99"),
                    new BigDecimal("119.99"),
                    false,
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
                    "38 hours",
                    4.92,
                    1280,
                    5430,
                    "Bestseller",
                    instructorElena,
                    catWeb
            );
            c1.setObjectives("Design distributed microservices with Spring Boot 3\nImplement stateless JWT authentication and role-based access control\nConfigure Kafka event-driven pipelines\nDeploy and scale Docker containers with Kubernetes");
            c1.setRequirements("Basic understanding of Java OOP principles\nFamiliarity with SQL database fundamentals\nGit and terminal basics");

            CourseModule m1_1 = new CourseModule("Module 1: Architecture & Foundations", "Spring Boot 3 configuration and dependency injection principles.", 1);
            m1_1.addLesson(new Lesson("1.1 Course Orientation & Enterprise Architecture", "18 min", "https://example.com/video1", true, 1));
            m1_1.addLesson(new Lesson("1.2 Spring Framework Internals & IoC Container", "24 min", "https://example.com/video2", true, 2));
            m1_1.addLesson(new Lesson("1.3 RESTful API Best Practices & DTO Patterns", "28 min", "https://example.com/video3", false, 3));
            c1.addModule(m1_1);

            CourseModule m1_2 = new CourseModule("Module 2: Security & Stateless Auth", "Spring Security 6 and JWT Bearer tokens.", 2);
            m1_2.addLesson(new Lesson("2.1 Spring Security Filter Chain Deep Dive", "30 min", "https://example.com/video4", false, 1));
            m1_2.addLesson(new Lesson("2.2 Generating and Validating HMAC-SHA256 JWTs", "26 min", "https://example.com/video5", false, 2));
            m1_2.addLesson(new Lesson("2.3 Role-Based Method Security & Exception Handling", "22 min", "https://example.com/video6", false, 3));
            c1.addModule(m1_2);

            Course savedC1 = courseRepository.save(c1);

            // Course 2: Modern React 19 (Paid)
            Course c2 = new Course(
                    "Modern React 19, TypeScript & Next.js Architecture",
                    "modern-react-19-typescript-architecture",
                    "Build bulletproof frontend architectures with React 19, TypeScript, Context API, and Server Components.",
                    "Comprehensive engineering curriculum covering clean React code architecture, custom hooks, centralized Axios state handling, responsive CSS variables, component performance profiling, and server-side rendering.",
                    CourseLevel.INTERMEDIATE,
                    new BigDecimal("44.99"),
                    new BigDecimal("99.99"),
                    false,
                    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
                    "32 hours",
                    4.85,
                    940,
                    4120,
                    "Featured",
                    instructorMarcus,
                    catWeb
            );
            c2.setObjectives("Master React 19 primitives and modern hooks\nWrite scalable, type-safe components with TypeScript\nImplement centralized state and token interceptors with Axios\nDesign responsive UI components with clean design systems");
            c2.setRequirements("Basic JavaScript knowledge (ES6+)\nHTML and CSS familiarity");

            CourseModule m2_1 = new CourseModule("Module 1: Modern React Primitives", "Core hooks, component lifecycles, and render mechanics.", 1);
            m2_1.addLesson(new Lesson("1.1 React 19 Overview & Setup with Vite", "15 min", "https://example.com/react1", true, 1));
            m2_1.addLesson(new Lesson("1.2 State Architecture with useReducer & Context", "25 min", "https://example.com/react2", true, 2));
            m2_1.addLesson(new Lesson("1.3 Writing Custom Hooks for API Data Fetching", "22 min", "https://example.com/react3", false, 3));
            c2.addModule(m2_1);
            Course savedC2 = courseRepository.save(c2);

            // Course 3: Docker Essentials (FREE Course)
            Course c3 = new Course(
                    "Docker Containers & Cloud Foundations for Developers",
                    "docker-containers-cloud-foundations",
                    "Essential containerization concepts, multi-stage builds, and Compose setups for developers.",
                    "A completely free practical guide to Docker containers. Learn Dockerfile syntax, multi-stage compilation, volume persistence, internal networking, and local multi-service orchestration with Docker Compose.",
                    CourseLevel.BEGINNER,
                    BigDecimal.ZERO,
                    new BigDecimal("49.99"),
                    true,
                    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80",
                    "10 hours",
                    4.88,
                    3200,
                    12450,
                    "Free Course",
                    instructorElena,
                    catCloud
            );
            c3.setObjectives("Understand container virtualization vs hypervisors\nAuthor production-ready Dockerfiles\nCompose multi-container local environments with MySQL and Spring Boot\nInspect logs, networks, and persistent volumes");
            c3.setRequirements("A computer with terminal access\nNo prior container knowledge required");

            CourseModule m3_1 = new CourseModule("Module 1: Container Virtualization", "Fundamental container concepts and installation.", 1);
            m3_1.addLesson(new Lesson("1.1 What is Containerization?", "12 min", "https://example.com/docker1", true, 1));
            m3_1.addLesson(new Lesson("1.2 Running Your First Docker Container", "16 min", "https://example.com/docker2", true, 2));
            m3_1.addLesson(new Lesson("1.3 Docker Compose for Full-Stack Apps", "20 min", "https://example.com/docker3", true, 3));
            c3.addModule(m3_1);
            Course savedC3 = courseRepository.save(c3);

            // Course 4: Git & GitHub Workflow (FREE Course)
            Course c4 = new Course(
                    "Git Version Control & Professional GitHub Workflows",
                    "git-version-control-github-workflows",
                    "Master branching, pull requests, rebasing, and merge conflict resolution for modern engineering teams.",
                    "Learn industry standard Git workflows. Understand commits, branches, rebasing, stashing, Git hooks, resolving merge conflicts, and writing clean pull request reviews.",
                    CourseLevel.BEGINNER,
                    BigDecimal.ZERO,
                    new BigDecimal("39.99"),
                    true,
                    "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&auto=format&fit=crop&q=80",
                    "8 hours",
                    4.95,
                    4100,
                    18200,
                    "Free Course",
                    instructorMarcus,
                    catWeb
            );
            c4.setObjectives("Master Git branching strategies (GitHub Flow / Gitflow)\nResolve merge conflicts confidently\nLeverage interactive rebase for clean history\nParticipate effectively in code reviews");
            c4.setRequirements("Basic computer literacy");

            CourseModule m4_1 = new CourseModule("Module 1: Version Control Mastery", "Branching, rebasing, and team collaboration.", 1);
            m4_1.addLesson(new Lesson("1.1 Git Mental Model & Objects", "14 min", "https://example.com/git1", true, 1));
            m4_1.addLesson(new Lesson("1.2 Branching Strategies & Merge Conflicts", "18 min", "https://example.com/git2", true, 2));
            c4.addModule(m4_1);
            Course savedC4 = courseRepository.save(c4);

            // Course 5: Applied Machine Learning (Paid)
            Course c5 = new Course(
                    "Applied Machine Learning & Deep Neural Networks with PyTorch",
                    "applied-machine-learning-pytorch",
                    "Train production vision and NLP models, optimize GPU inference, and deploy deep learning APIs.",
                    "From backpropagation to transformers. Build end-to-end computer vision and sequence models with PyTorch and deploy them behind production REST endpoints.",
                    CourseLevel.ADVANCED,
                    new BigDecimal("54.99"),
                    new BigDecimal("129.99"),
                    false,
                    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80",
                    "44 hours",
                    4.94,
                    830,
                    3210,
                    "Hot & New",
                    instructorElena,
                    catData
            );
            c5.setObjectives("Build neural network architectures in PyTorch\nTrain Convolutional Neural Networks for vision\nImplement Transfer Learning with HuggingFace\nDeploy low-latency inference microservices");
            c5.setRequirements("Python programming proficiency\nBasic linear algebra and calculus");

            CourseModule m5_1 = new CourseModule("Module 1: PyTorch Foundations", "Tensors, autograd, and training loops.", 1);
            m5_1.addLesson(new Lesson("1.1 Tensor Operations & GPU Acceleration", "20 min", "https://example.com/ml1", true, 1));
            m5_1.addLesson(new Lesson("1.2 Building Your First Neural Network", "25 min", "https://example.com/ml2", false, 2));
            c5.addModule(m5_1);
            Course savedC5 = courseRepository.save(c5);

            // Course 6: Kubernetes & Cloud Infrastructure (Paid)
            Course c6 = new Course(
                    "Kubernetes, Docker & AWS Cloud Infrastructure Bootcamp",
                    "kubernetes-docker-aws-cloud-bootcamp",
                    "Deploy resilient containerized workloads with Kubernetes, Helm, Terraform, and AWS EKS.",
                    "The complete guide to production container orchestration. Master Pods, Deployments, Services, Ingress Controllers, Helm Charts, and automated cloud deployments.",
                    CourseLevel.INTERMEDIATE,
                    new BigDecimal("39.99"),
                    new BigDecimal("89.99"),
                    false,
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
                    "28 hours",
                    4.88,
                    710,
                    2890,
                    "High Rated",
                    instructorElena,
                    catCloud
            );
            c6.setObjectives("Deploy Kubernetes clusters with Terraform\nManage stateful and stateless workloads\nConfigure Ingress, TLS, and Service Meshes\nAutomate rollouts with GitOps and ArgoCD");
            c6.setRequirements("Docker containerization fundamentals\nBasic Linux command-line familiarity");

            CourseModule m6_1 = new CourseModule("Module 1: Kubernetes Cluster Architecture", "Control plane, worker nodes, and kubelet.", 1);
            m6_1.addLesson(new Lesson("1.1 Kubernetes Architecture Overview", "18 min", "https://example.com/k8s1", true, 1));
            m6_1.addLesson(new Lesson("1.2 Pods, Deployments, and ReplicaSets", "24 min", "https://example.com/k8s2", false, 2));
            c6.addModule(m6_1);
            Course savedC6 = courseRepository.save(c6);

            logger.info(">>> Seeded 6 comprehensive courses with modules and lessons.");

            // 7. Seed demo enrollments for student@melangee.com
            // Enrollment 1: In progress on Enterprise Java
            Enrollment enr1 = new Enrollment(demoStudent, savedC1, true);
            enr1.setTotalLessonsCount(6);
            enr1.setCompletedLessonsCount(4);
            enr1.setProgressPercentage(67);
            enr1.setStatus(EnrollmentStatus.IN_PROGRESS);
            enr1.setLastAccessedLesson("2.2 Generating and Validating HMAC-SHA256 JWTs");
            enr1.setLastAccessedAt(LocalDateTime.now().minusHours(3));
            enrollmentRepository.save(enr1);

            // Enrollment 2: Completed on Git Version Control (Free)
            Enrollment enr2 = new Enrollment(demoStudent, savedC4, false);
            enr2.setTotalLessonsCount(2);
            enr2.setCompletedLessonsCount(2);
            enr2.setProgressPercentage(100);
            enr2.setStatus(EnrollmentStatus.COMPLETED);
            enr2.setLastAccessedLesson("1.2 Branching Strategies & Merge Conflicts");
            enr2.setCompletedAt(LocalDateTime.now().minusDays(5));
            enr2.setLastAccessedAt(LocalDateTime.now().minusDays(5));
            enrollmentRepository.save(enr2);

            // 8. Seed Wishlist item for student@melangee.com
            Wishlist wish1 = new Wishlist(demoStudent, savedC2);
            wishlistRepository.save(wish1);

            logger.info(">>> Seeded demo student enrollments and wishlist for Alex Morgan.");
        }
    }

    private Category getOrCreateCategory(String name, String slug, String description, String icon, String color) {
        return categoryRepository.findBySlug(slug)
                .orElseGet(() -> categoryRepository.save(new Category(name, slug, description, icon, color)));
    }
}

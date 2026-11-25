# MELANGEE – Full-Stack Online Education Platform

## Phase 1 & Phase 2: Setup, Authentication, Public Website, Student Dashboard, Course Discovery & Enrollment

MELANGEE is an enterprise-grade full-stack online education platform engineered with modern architectural best practices. Phase 1 established the backend REST API, role-based JWT security layer, MySQL relational schema, and public React website. Phase 2 adds real MySQL-backed course discovery, filtering/sorting/pagination, course details with modular curriculum, free & labeled development-test enrollment, wishlist management, and a full data-driven Student Dashboard.

---

## 1. Technology Architecture

### Frontend
- **Framework**: React.js with Vite
- **Routing**: React Router DOM (v6/v7) with protected route guards
- **HTTP Client**: Axios with centralized request/response interceptors
- **Icons**: Lucide React
- **Styling**: Modern responsive CSS tokens & responsive Bootstrap grid
- **State Management**: React Context (`AuthContext`) with persistent JWT handling

### Backend
- **Framework**: Java 21, Spring Boot 3.3.5
- **Data Persistence**: Spring Data JPA & Hibernate
- **Database**: MySQL 8.0
- **Security**: Spring Security 6 with stateless JWT Bearer token authentication
- **Password Encryption**: BCrypt (strength 10)
- **API Documentation**: OpenAPI 3 / Swagger UI (`springdoc-openapi`)
- **Validation**: Jakarta Bean Validation (`@Valid`, `@Pattern`, `@Size`, etc.)

---

## 2. Project Directory Structure

```text
MELANGEE/
├── backend/
│   ├── src/main/java/com/melangee/
│   │   ├── MelangeeApplication.java       # Spring Boot main entry point
│   │   ├── config/
│   │   │   ├── DataInitializer.java       # Database seeder for Roles & Admin
│   │   │   ├── OpenApiConfig.java         # Swagger/OpenAPI 3 configuration
│   │   │   └── SecurityConfig.java        # Spring Security, CORS & filter chain
│   │   ├── controller/
│   │   │   ├── AuthController.java        # /api/v1/auth (register, login, me, logout)
│   │   │   ├── PublicController.java      # /api/v1/public (health, categories, courses)
│   │   │   ├── StudentController.java     # /api/v1/student (dashboard)
│   │   │   ├── InstructorController.java  # /api/v1/instructor (studio dashboard)
│   │   │   └── AdminController.java       # /api/v1/admin (console, user directory)
│   │   ├── dto/
│   │   │   ├── request/                   # RegisterRequest, LoginRequest
│   │   │   └── response/                  # AuthResponse, UserResponse, ApiResponse, ErrorResponse
│   │   ├── entity/
│   │   │   ├── Role.java & RoleType.java  # STUDENT, INSTRUCTOR, ADMIN
│   │   │   ├── User.java                  # User credentials & timestamps
│   │   │   ├── StudentProfile.java        # Learning goals, bio, headline
│   │   │   └── InstructorProfile.java     # Specialization, credentials, experience
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java# Centralized REST error handler
│   │   ├── mapper/
│   │   │   └── UserMapper.java            # Entity to DTO mapping
│   │   ├── repository/                    # Spring Data JPA repositories
│   │   └── security/                      # JwtTokenProvider, JwtFilter, UserPrincipal
│   ├── src/main/resources/
│   │   └── application.yml                # Configuration with environment variables
│   ├── .env.example                       # Sample environment variable template
│   ├── mvnw & mvnw.cmd                    # Maven wrapper
│   └── pom.xml                            # Maven dependencies & build config
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                    # Navbar, Footer, Button, Alert, LoadingSpinner
│   │   │   └── home/                      # Hero, Search, Categories, Featured, Testimonials, CTA
│   │   ├── context/                       # AuthContext (login, register, logout, role check)
│   │   ├── hooks/                         # useAuth hook
│   │   ├── layouts/                       # MainLayout, DashboardLayout
│   │   ├── pages/                         # Home, Courses, About, Contact, Login, Register, Dashboards
│   │   ├── routes/                        # AppRoutes, ProtectedRoute
│   │   ├── services/                      # Centralized Axios instance & API modules
│   │   ├── styles/                        # main.css global design tokens & styles
│   │   ├── utils/                         # constants, formatters
│   │   ├── App.jsx                        # Application root
│   │   └── main.jsx                       # Entry file
│   ├── package.json
│   └── vite.config.js
│
├── .env.example                           # Root environment variable template
└── README.md                              # Project documentation
```

---

## 3. Database & MySQL Setup

1. **Verify MySQL Service is Running**:
   ```powershell
   Get-Service -Name MySQL80
   # Or on Linux / macOS:
   sudo systemctl status mysql
   ```

2. **Database Initialization**:
   The database name is `melangee`. Spring Boot Hibernate DDL is configured with `update` mode, meaning all tables, unique constraints, and foreign key relationships will be generated automatically on first startup.

   To create the database manually via MySQL client:
   ```sql
   CREATE DATABASE IF NOT EXISTS melangee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Database Entities Created**:
   - **Phase 1**:
     - `roles`: `ROLE_STUDENT`, `ROLE_INSTRUCTOR`, `ROLE_ADMIN`
     - `users`: `id`, `full_name`, `email` (UNIQUE), `password` (BCrypt), `role_id` (FK), `enabled`, `created_at`, `updated_at`
     - `student_profiles`: `id`, `user_id` (FK, UNIQUE), `headline`, `bio`, `phone`, `learning_goals`, timestamps
     - `instructor_profiles`: `id`, `user_id` (FK, UNIQUE), `headline`, `bio`, `specialization`, `qualification`, `years_of_experience`, timestamps
   - **Phase 2**:
     - `categories`: `id`, `name` (UNIQUE), `slug` (UNIQUE), `description`, `icon`, `color`, timestamps
     - `courses`: `id`, `title`, `slug` (UNIQUE), `subtitle`, `description`, `objectives`, `requirements`, `level`, `price`, `original_price`, `is_free`, `thumbnail_url`, `duration`, `rating`, `reviews_count`, `students_count`, `badge`, `status`, `instructor_id` (FK), `category_id` (FK), timestamps
     - `course_modules`: `id`, `course_id` (FK), `title`, `description`, `order_index`, timestamps
     - `lessons`: `id`, `module_id` (FK), `title`, `duration`, `video_url`, `is_free_preview`, `order_index`, timestamps
     - `enrollments`: `id`, `student_id` (FK), `course_id` (FK), `status`, `progress_percentage`, `completed_lessons_count`, `total_lessons_count`, `is_dev_test_enrollment`, `last_accessed_lesson`, `enrolled_at`, `completed_at`, `last_accessed_at` (`uk_enrollments_student_course`)
     - `wishlist`: `id`, `student_id` (FK), `course_id` (FK), `created_at` (`uk_wishlist_student_course`)

### Phase 2 REST API Endpoints & Frontend Pages

- **Public & Discovery APIs**:
  - `GET /api/v1/categories` & `GET /api/v1/public/categories`
  - `GET /api/v1/public/courses/featured`
  - `GET /api/v1/courses` (supports `search`, `category`, `level`, `isFree`, `maxPrice`, `minRating`, `sortBy`, `page`, `size`)
  - `GET /api/v1/courses/{id}`
- **Student Operations (`ROLE_STUDENT` / `ROLE_ADMIN`)**:
  - `POST /api/v1/enrollments/{courseId}` (free enrollment directly; paid courses require `devTestEnrollment: true` in Phase 2)
  - `GET /api/v1/enrollments/my-courses`
  - `GET /api/v1/enrollments/check/{courseId}`
  - `PATCH /api/v1/enrollments/{courseId}/progress?completedLessons={n}`
  - `GET /api/v1/wishlist`, `POST /api/v1/wishlist/{courseId}`, `DELETE /api/v1/wishlist/{courseId}`
  - `GET /api/v1/student/dashboard`
- **Phase 2 Frontend Pages**:
  - `/courses` (`CoursesPage.jsx`), `/courses/:id` (`CourseDetailsPage.jsx`), `/dashboard/student` (`StudentDashboardPage.jsx`), `/my-courses` (`EnrolledCoursesPage.jsx`), `/wishlist` (`WishlistPage.jsx`)

---

## 4. How to Start the Spring Boot Backend

### Prerequisites
- JDK 21
- Environment variables configured (or defaults used from `application.yml`)

### Steps

1. Open a terminal and navigate to the `backend` directory:
   ```powershell
   cd "d:\Education platform\backend"
   ```

2. Run with the included Maven Wrapper:
   ```powershell
   # Windows:
   .\mvnw.cmd spring-boot:run

   # Linux / macOS:
   ./mvnw spring-boot:run
   ```

3. The backend will start on:
   - **Base URL**: `http://localhost:8080`
   - **Swagger / OpenAPI Documentation**: `http://localhost:8080/swagger-ui.html`
   - **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## 5. How to Start the React Frontend

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Steps

1. Open a terminal and navigate to the `frontend` directory:
   ```powershell
   cd "d:\Education platform\frontend"
   ```

2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```

4. The frontend will be live at:
   - `http://localhost:5173`

---

## 6. Pre-Seeded Demonstration Accounts

For ease of testing and evaluation, the backend seed engine (`DataInitializer.java`) automatically provisions three accounts on startup if not already present:

| Role | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Student** | `student@melangee.com` | `Student@123456` | `/dashboard/student` |
| **Instructor** | `instructor@melangee.com` | `Instructor@123456` | `/dashboard/instructor` |
| **Administrator** | `admin@melangee.com` | `Admin@123456` | `/dashboard/admin` |

*(Note: The login page also includes one-click autofill buttons for these demonstration credentials.)*

---

## 7. Security & Key Architectural Highlights

1. **Role Protection**:
   - Public user registration strictly allows `STUDENT` or `INSTRUCTOR` roles. Attempting to register as `ADMIN` via the public REST API or UI form is rejected with a `400 Bad Request`.
2. **Password Security**:
   - Raw passwords are never persisted. All passwords are encrypted with BCrypt before storage.
3. **Stateless JWT Authorization**:
   - Authenticated sessions issue a signed HMAC-SHA256 JWT containing the user ID, email, and role authority.
   - The React frontend Axios instance automatically attaches `Authorization: Bearer <token>` to outbound requests and handles `401 Unauthorized` responses gracefully.
4. **Protected Routes**:
   - `ProtectedRoute.jsx` intercepts unauthorized navigation attempts and redirects users to their appropriate role-specific workspace.


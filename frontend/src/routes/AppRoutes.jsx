import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public & Catalog Pages
import HomePage from '../pages/HomePage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailsPage from '../pages/CourseDetailsPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Student Workspace Pages
import StudentDashboardPage from '../pages/StudentDashboardPage';
import EnrolledCoursesPage from '../pages/EnrolledCoursesPage';
import WishlistPage from '../pages/WishlistPage';

// Instructor & Admin Dashboards
import InstructorDashboardPage from '../pages/InstructorDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with Main Navigation and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Student Dashboard & Operations */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/student" element={<StudentDashboardPage />} />
        <Route path="/my-courses" element={<EnrolledCoursesPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Route>

      {/* Protected Instructor Dashboard */}
      <Route
        path="/dashboard/instructor"
        element={
          <ProtectedRoute allowedRoles={['ROLE_INSTRUCTOR']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InstructorDashboardPage />} />
      </Route>

      {/* Protected Admin Dashboard */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
      </Route>

      {/* Catch-all 404 */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

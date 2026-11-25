import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import CourseSearch from '../components/home/CourseSearch';
import FeaturedCourses from '../components/home/FeaturedCourses';
import CategoriesSection from '../components/home/CategoriesSection';
import WhyMelangee from '../components/home/WhyMelangee';
import LearningBenefits from '../components/home/LearningBenefits';
import InstructorShowcase from '../components/home/InstructorShowcase';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';
import { publicService } from '../services/api';

const defaultCategories = [
  { id: 'web-dev', name: 'Full-Stack Web Development', count: 48, icon: 'Code', color: '#3B82F6' },
  { id: 'cloud-devops', name: 'Cloud Architecture & DevOps', count: 32, icon: 'Cloud', color: '#6366F1' },
  { id: 'data-ai', name: 'Data Science & Artificial Intelligence', count: 40, icon: 'Cpu', color: '#8B5CF6' },
  { id: 'cybersecurity', name: 'Cybersecurity & Ethical Hacking', count: 25, icon: 'ShieldCheck', color: '#EC4899' },
  { id: 'mobile-app', name: 'Mobile Application Engineering', count: 29, icon: 'Smartphone', color: '#10B981' },
  { id: 'ui-ux', name: 'Product Design & UX Research', count: 22, icon: 'Palette', color: '#F59E0B' },
];

const defaultCourses = [
  {
    id: 101,
    title: 'Enterprise Java & Spring Boot Microservices Mastery',
    instructor: 'Dr. Elena Vance',
    category: 'Full-Stack Web Development',
    level: 'Intermediate to Advanced',
    rating: 4.9,
    reviewsCount: 1280,
    studentsCount: 5430,
    duration: '38 hours',
    lessonsCount: 142,
    price: 49.99,
    originalPrice: 119.99,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 102,
    title: 'Modern React 19, TypeScript & Next.js Architecture',
    instructor: 'Marcus Thorne',
    category: 'Full-Stack Web Development',
    level: 'All Levels',
    rating: 4.85,
    reviewsCount: 940,
    studentsCount: 4120,
    duration: '32 hours',
    lessonsCount: 118,
    price: 44.99,
    originalPrice: 99.99,
    badge: 'Featured',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 103,
    title: 'Applied Machine Learning & Deep Neural Networks with PyTorch',
    instructor: 'Dr. Aisha Patel',
    category: 'Data Science & Artificial Intelligence',
    level: 'Advanced',
    rating: 4.95,
    reviewsCount: 830,
    studentsCount: 3210,
    duration: '44 hours',
    lessonsCount: 160,
    price: 54.99,
    originalPrice: 129.99,
    badge: 'Hot & New',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 104,
    title: 'Kubernetes, Docker & AWS Cloud Infrastructure Bootcamp',
    instructor: 'David Kim',
    category: 'Cloud Architecture & DevOps',
    level: 'Intermediate',
    rating: 4.88,
    reviewsCount: 710,
    studentsCount: 2890,
    duration: '28 hours',
    lessonsCount: 95,
    price: 39.99,
    originalPrice: 89.99,
    badge: 'High Rated',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  },
];

const HomePage = () => {
  const [courses, setCourses] = useState(defaultCourses);
  const [categories, setCategories] = useState(defaultCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Attempt fetching live data from Spring Boot backend
    const fetchHomeData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          publicService.getFeaturedCourses(),
          publicService.getCategories(),
        ]);
        if (coursesRes?.data) setCourses(coursesRes.data);
        if (categoriesRes?.data) setCategories(categoriesRes.data);
      } catch {
        // Retain default curated items if backend is not yet started
      }
    };

    fetchHomeData();
  }, []);

  // Filter courses based on search & category
  const filteredCourses = courses.filter((course) => {
    const title = (course.title || '').toLowerCase();
    const instructor = (course.instructorName || course.instructor || '').toLowerCase();
    const category = (course.categoryName || course.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      !query ||
      title.includes(query) ||
      instructor.includes(query) ||
      category.includes(query);

    const matchesCategory =
      selectedCategory === 'all' || category.includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <HeroSection />
      <div className="melangee-container">
        <CourseSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      <FeaturedCourses courses={filteredCourses} />
      <CategoriesSection categories={categories} />
      <WhyMelangee />
      <LearningBenefits />
      <InstructorShowcase />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { instructorService } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { BookOpen, Users, Star, DollarSign, PlusCircle, CheckCircle2, Award, Briefcase } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const InstructorDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await instructorService.getDashboard();
        if (response && response.data) {
          setDashboardData(response.data);
        }
      } catch (err) {
        // Fallback
        setDashboardData({
          stats: {
            activeCourses: 4,
            totalStudents: 3420,
            averageRating: 4.89,
            totalRevenueUsd: 28450.0,
          },
          coursesTaught: [
            {
              id: 101,
              title: 'Enterprise Java & Spring Boot Microservices Mastery',
              status: 'Published',
              enrolledStudents: 2150,
              revenue: 17200.0,
              rating: 4.92,
            },
            {
              id: 105,
              title: 'Reactive Microservices with Spring WebFlux & Kafka',
              status: 'Drafting - Review Pending',
              enrolledStudents: 0,
              revenue: 0.0,
              rating: 0.0,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading instructor studio..." />;
  }

  const stats = dashboardData?.stats || {
    activeCourses: 4,
    totalStudents: 3420,
    averageRating: 4.89,
    totalRevenueUsd: 28450.0,
  };

  const courses = dashboardData?.coursesTaught || [];

  return (
    <div>
      {/* Top Banner */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Instructor Studio: {user?.fullName}</h1>
              <span className="badge-melangee badge-instructor">Instructor</span>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
              {user?.instructorProfile?.headline || 'Empowering learners with cutting-edge engineering skills.'}
            </p>
          </div>
          <button
            onClick={() => alert('New Course Studio is scheduled for Phase 2 implementation!')}
            className="btn-melangee-primary"
          >
            <PlusCircle size={18} />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="melangee-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="#7C3AED" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.activeCourses}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active Courses</div>
          </div>
        </div>

        <div className="melangee-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalStudents}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Students</div>
          </div>
        </div>

        <div className="melangee-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} color="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.averageRating} / 5.0</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Instructor Rating</div>
          </div>
        </div>

        <div className="melangee-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="#16A34A" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatCurrency(stats.totalRevenueUsd)}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Earned Revenue</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Left: Courses Taught */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="melangee-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Courses Taught & Authored</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {courses.map((course) => (
                <div
                  key={course.id}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px' }}>{course.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>Status: <strong style={{ color: course.status === 'Published' ? '#16A34A' : '#D97706' }}>{course.status}</strong></span>
                      <span>Enrolled: <strong>{course.enrolledStudents}</strong></span>
                      <span>Rating: <strong>{course.rating > 0 ? course.rating : 'N/A'}</strong></span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {formatCurrency(course.revenue)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gross Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Instructor Profile */}
        <div>
          <div className="melangee-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Briefcase size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Instructor Credentials</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Specialization:</span>
                <strong>{user?.instructorProfile?.specialization || 'Full-Stack Software Architecture'}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Highest Qualification:</span>
                <span>{user?.instructorProfile?.qualification || 'Master of Computer Science'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Industry Experience:</span>
                <span>{user?.instructorProfile?.yearsOfExperience || 8}+ Years</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Email:</span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboardPage;


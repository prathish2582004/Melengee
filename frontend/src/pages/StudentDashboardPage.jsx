import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { studentService, enrollmentService, wishlistService } from '../services/api';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  User,
  Heart,
  Bell,
  Activity,
  Sparkles,
  PlayCircle,
  TrendingUp,
  Download,
  ShieldCheck,
  AlertCircle,
  Trash2,
  Calendar,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CourseCard from '../components/common/CourseCard';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'courses' | 'completed' | 'wishlist' | 'certificates' | 'activity'

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.getDashboard();
      if (response && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
      setError('Could not retrieve dashboard data from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSimulateProgress = async (courseId, currentCompleted, totalLessons) => {
    try {
      const nextCompleted = Math.min(totalLessons || 20, (currentCompleted || 0) + 1);
      await enrollmentService.updateProgress(courseId, nextCompleted);
      // Refresh dashboard data
      const response = await studentService.getDashboard();
      if (response && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleRemoveWishlist = async (courseId) => {
    try {
      await wishlistService.removeFromWishlist(courseId);
      // Refresh dashboard data
      const response = await studentService.getDashboard();
      if (response && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Connecting to Melangee backend and loading student workspace..." />;
  }

  const stats = dashboardData?.stats || {
    totalEnrolledCourses: 0,
    coursesCompleted: 0,
    coursesInProgress: 0,
    totalLearningHours: 0,
  };

  const profile = dashboardData?.studentProfile || user;
  const continueLearning = dashboardData?.continueLearning;
  const enrolledCourses = dashboardData?.enrolledCourses || [];
  const completedCourses = dashboardData?.completedCourses || [];
  const allEnrolledCourses = [...enrolledCourses, ...completedCourses];
  const wishlist = dashboardData?.wishlist || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const notifications = dashboardData?.notifications || [];
  const certificates = dashboardData?.certificatesPlaceholder || [];
  const recommendations = dashboardData?.courseRecommendations || [];

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* 1. Welcome Banner & Student Profile */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              }}
            >
              {profile?.fullName?.charAt(0) || 'S'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
                  Welcome back, {profile?.fullName}!
                </h1>
                <span className="badge-melangee badge-student">Student</span>
              </div>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                {profile?.studentProfile?.headline ||
                  'Enterprise Software Architecture & Distributed Systems Trainee'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                <span>Email: {profile?.email}</span>
                <span>•</span>
                <span>Learning Goal: {profile?.studentProfile?.learningGoals || 'Full-Stack Proficiency'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/courses" className="btn-melangee-primary">
              <BookOpen size={18} />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#991B1B',
            marginBottom: '28px',
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Dashboard Statistics: 4 Required Metrics from MySQL Backend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Total Enrolled Courses */}
        <div className="melangee-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={26} color="#4F46E5" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.totalEnrolledCourses ?? enrolledCourses.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Enrolled Courses</div>
          </div>
        </div>

        {/* Courses Completed */}
        <div className="melangee-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={26} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.coursesCompleted ?? completedCourses.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Courses Completed</div>
          </div>
        </div>

        {/* Courses in Progress */}
        <div className="melangee-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={26} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.coursesInProgress ?? enrolledCourses.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Courses in Progress</div>
          </div>
        </div>

        {/* Total Learning Hours */}
        <div className="melangee-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={26} color="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.totalLearningHours ?? 0} hrs
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Learning Hours</div>
          </div>
        </div>
      </div>

      {/* 3. Continue Learning Banner */}
      {continueLearning && (
        <div
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '36px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ flex: '1 1 450px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '4px',
                  letterSpacing: '0.5px',
                }}
              >
                CONTINUE LEARNING
              </span>
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                {continueLearning.categoryName || 'Active Curriculum'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              {continueLearning.courseTitle}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#93C5FD', marginBottom: '16px' }}>
              <PlayCircle size={16} />
              <span>Next Lesson: <strong>{continueLearning.lastAccessedLesson || 'Module 1: Getting Started'}</strong></span>
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#E2E8F0', marginBottom: '6px' }}>
                <span>Course Completion Progress</span>
                <span style={{ fontWeight: 700 }}>
                  {continueLearning.completedLessonsCount || 0} / {continueLearning.totalLessonsCount || 20} lessons ({continueLearning.progressPercentage || 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${continueLearning.progressPercentage || 0}%`,
                    height: '100%',
                    backgroundColor: '#10B981',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to={`/courses/${continueLearning.courseId}`}
              className="btn-melangee-primary"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--primary)',
                fontWeight: 700,
                padding: '12px 24px',
              }}
            >
              <span>Resume Lesson</span>
              <ArrowRight size={18} />
            </Link>

            <button
              onClick={() => handleSimulateProgress(continueLearning.courseId, continueLearning.completedLessonsCount, continueLearning.totalLessonsCount)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              Simulate Progress (+1 lesson)
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs for Dashboard Views */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          gap: '8px',
          marginBottom: '28px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {[
          { id: 'overview', label: 'Enrolled Courses', icon: <BookOpen size={16} />, count: allEnrolledCourses.length },
          { id: 'completed', label: 'Completed Courses', icon: <CheckCircle size={16} />, count: completedCourses.length },
          { id: 'wishlist', label: 'Wishlist', icon: <Heart size={16} />, count: wishlist.length },
          { id: 'certificates', label: 'Certificates', icon: <Award size={16} />, count: certificates.length },
          { id: 'activity', label: 'Recent Activity', icon: <Activity size={16} />, count: recentActivity.length },
          { id: 'notifications', label: 'Notifications', icon: <Bell size={16} />, count: notifications.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'var(--primary-light)' : '#F1F5F9',
                  color: isActive ? 'var(--primary)' : 'var(--text-light)',
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: ENROLLED COURSES & DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enrolled Curriculums ({allEnrolledCourses.length})</h2>
            <Link to="/my-courses" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem' }}>
              Manage All My Courses →
            </Link>
          </div>

          {allEnrolledCourses.length === 0 ? (
            <div className="melangee-card" style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFFFFF' }}>
              <BookOpen size={40} color="var(--primary)" style={{ marginBottom: '12px' }} />
              <h3>No enrolled courses yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Discover courses and enroll to begin your journey.</p>
              <Link to="/courses" className="btn-melangee-primary">Browse Courses</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {allEnrolledCourses.map((enr) => {
                const isDone = enr.status === 'COMPLETED' || enr.progressPercentage >= 100;
                return (
                  <div
                    key={enr.id}
                    className="melangee-card"
                    style={{
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <div style={{ position: 'relative', height: '160px', width: '100%' }}>
                      <img
                        src={enr.courseThumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                        alt={enr.courseTitle}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: isDone ? '#10B981' : 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '6px',
                        }}
                      >
                        {isDone ? 'Completed (100%)' : `${enr.progressPercentage || 0}% Complete`}
                      </span>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                        {enr.categoryName || 'Curriculum'}
                      </div>

                      <Link to={`/courses/${enr.courseId}`}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                          {enr.courseTitle}
                        </h3>
                      </Link>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        Instructor: <strong>{enr.instructorName || 'Melangee Faculty'}</strong>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          <span>Progress</span>
                          <span>{enr.completedLessonsCount || 0} / {enr.totalLessonsCount || 20} lessons</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${enr.progressPercentage || 0}%`,
                              height: '100%',
                              backgroundColor: isDone ? '#10B981' : 'var(--primary)',
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                        <Link
                          to={`/courses/${enr.courseId}`}
                          className="btn-melangee-primary"
                          style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.85rem' }}
                        >
                          <span>{isDone ? 'Review Course' : 'Resume Course'}</span>
                          <ArrowRight size={14} />
                        </Link>

                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => handleSimulateProgress(enr.courseId, enr.completedLessonsCount, enr.totalLessonsCount)}
                            title="Simulate +1 lesson completed"
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: '#F8FAFC',
                              cursor: 'pointer',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                            }}
                          >
                            +1 Lesson
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dashboard Summary Widgets Row: Wishlist, Activity, Notifications & Certificates */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '36px' }}>
            {/* Wishlist Quick View */}
            <div className="melangee-card" style={{ backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Heart size={18} color="#EF4444" />
                  <span>Wishlist ({wishlist.length})</span>
                </h3>
                <button type="button" onClick={() => setActiveTab('wishlist')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                  View All →
                </button>
              </div>
              {wishlist.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>No courses saved yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {wishlist.slice(0, 3).map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                      <Link to={`/courses/${item.course?.id}`} style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {item.course?.title}
                      </Link>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: item.course?.isFree ? '#10B981' : 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {item.course?.isFree ? 'FREE' : `$${item.course?.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity Quick View */}
            <div className="melangee-card" style={{ backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Activity size={18} color="var(--primary)" />
                  <span>Recent Activity</span>
                </h3>
                <button type="button" onClick={() => setActiveTab('activity')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                  View All →
                </button>
              </div>
              {recentActivity.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>No recent activity logged.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentActivity.slice(0, 3).map((act, idx) => (
                    <div key={idx} style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{act.courseTitle}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.lessonTitle} ({act.progress || 0}%)</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications & Certificates Quick View */}
            <div className="melangee-card" style={{ backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Bell size={18} color="#2563EB" />
                  <span>Notifications & Credentials</span>
                </h3>
                <button type="button" onClick={() => setActiveTab('notifications')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Alerts ({notifications.length}) →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.slice(0, 2).map((notif, idx) => (
                  <div key={idx} style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{notif.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{notif.message}</div>
                  </div>
                ))}
                <div
                  onClick={() => setActiveTab('certificates')}
                  style={{
                    marginTop: '4px',
                    padding: '10px 12px',
                    backgroundColor: '#F5F3FF',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#6D28D9' }}>
                    <Award size={16} />
                    <span>Certificates Vault ({certificates.length} Earned)</span>
                  </div>
                  <ArrowRight size={14} color="#6D28D9" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETED COURSES */}
      {activeTab === 'completed' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
            Completed Courses & Credentials ({completedCourses.length})
          </h2>

          {completedCourses.length === 0 ? (
            <div className="melangee-card" style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFFFFF' }}>
              <CheckCircle size={40} color="#10B981" style={{ marginBottom: '12px' }} />
              <h3>No completed courses yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Keep progressing through your enrolled curriculums to earn verified certificates.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {completedCourses.map((comp) => (
                <div
                  key={comp.id}
                  className="melangee-card"
                  style={{
                    padding: '24px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #A7F3D0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                      <CheckCircle size={18} />
                      <span>Curriculum Completed (100%)</span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
                      {comp.courseTitle}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Taught by {comp.instructorName || 'Melangee Faculty'}
                    </div>

                    <div
                      style={{
                        backgroundColor: '#F0FDF4',
                        border: '1px dashed #86EFAC',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '16px',
                        fontSize: '0.82rem',
                        color: '#166534',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                        <Award size={16} />
                        <span>Verified Melangee Credential</span>
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        Certificate ID: <strong>MEL-{comp.courseId}-2026</strong>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${comp.courseId}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                    }}
                  >
                    <span>Review Course Curriculum</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Saved in Wishlist ({wishlist.length})</h2>
            <Link to="/courses" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem' }}>
              Browse Catalog →
            </Link>
          </div>

          {wishlist.length === 0 ? (
            <div className="melangee-card" style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFFFFF' }}>
              <Heart size={40} color="#EF4444" style={{ marginBottom: '12px' }} />
              <h3>Your wishlist is empty</h3>
              <p style={{ color: 'var(--text-muted)' }}>Bookmark courses you want to study later by clicking the heart icon.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {wishlist.map((item) => {
                const c = item.course;
                if (!c) return null;
                return (
                  <div
                    key={item.id}
                    className="melangee-card"
                    style={{ padding: '20px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                        {c.categoryName || 'General'}
                      </span>
                      <button
                        onClick={() => handleRemoveWishlist(c.id)}
                        title="Remove from wishlist"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <Link to={`/courses/${c.id}`}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                        {c.title}
                      </h4>
                    </Link>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      By {c.instructorName || 'Melangee Faculty'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                      <span style={{ fontWeight: 800, color: c.isFree ? '#10B981' : 'var(--text-main)' }}>
                        {c.isFree ? 'FREE' : `$${c.price}`}
                      </span>
                      <Link to={`/courses/${c.id}`} className="btn-melangee-primary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CERTIFICATES SECTION PLACEHOLDER */}
      {activeTab === 'certificates' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
            Official Certificates of Completion
          </h2>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={26} color="#7C3AED" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Verified Credentials Portal</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  MELANGEE accredited certificates are issued upon 100% curriculum completion.
                </p>
              </div>
            </div>

            {certificates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <Award size={40} color="#94A3B8" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                  No Certificates Issued Yet
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 16px' }}>
                  Complete all modules and lessons in any enrolled course to unlock your verified credential and downloadable PDF certificate.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {certificates.map((cert, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '20px',
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        STATUS: {cert.status || 'ISSUED'}
                      </span>
                      <ShieldCheck size={18} color="#10B981" />
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>
                      {cert.courseTitle}
                    </h4>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Credential ID: <strong>{cert.credentialId}</strong>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Issue Date: {cert.issueDate ? String(cert.issueDate).substring(0, 10) : '2026-11-25'}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => alert(`Certificate verification for ${cert.credentialId}: VALID & ACCREDITED BY MELANGEE.`)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: '#FFFFFF',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <ShieldCheck size={14} />
                        <span>Verify Credential</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => alert(`Downloading Certificate PDF for ${cert.credentialId}...`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          border: 'none',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Download size={14} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: RECENT ACTIVITY */}
      {activeTab === 'activity' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
            Recent Learning Activity
          </h2>

          <div className="melangee-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
            {recentActivity.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>No recent activities recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivity.map((act, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      paddingBottom: '16px',
                      borderBottom: idx === recentActivity.length - 1 ? 'none' : '1px solid var(--border-light)',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: act.type === 'COURSE_COMPLETED' ? '#ECFDF5' : '#EEF2FF',
                        color: act.type === 'COURSE_COMPLETED' ? '#10B981' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {act.type === 'COURSE_COMPLETED' ? <CheckCircle size={18} /> : <PlayCircle size={18} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {act.courseTitle}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {act.lessonTitle} • Progress at {act.progress || 0}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
                        {act.timestamp ? String(act.timestamp).replace('T', ' ').substring(0, 16) : 'Recently'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
            System & Learning Notifications ({notifications.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notifications.map((notif, idx) => (
              <div
                key={idx}
                className="melangee-card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: notif.type === 'PROGRESS' ? '#EFF6FF' : '#F5F3FF',
                    color: notif.type === 'PROGRESS' ? '#2563EB' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bell size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '4px' }}>
                    {notif.title}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 6px 0', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {notif.timestamp ? String(notif.timestamp).replace('T', ' ').substring(0, 16) : 'Just now'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Course Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} color="var(--primary)" />
                <span>Recommended Curriculums for You</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Tailored selections aligned with your software architecture learning track.
              </p>
            </div>
            <Link to="/courses" className="btn-melangee-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              View All Courses
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {recommendations.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;

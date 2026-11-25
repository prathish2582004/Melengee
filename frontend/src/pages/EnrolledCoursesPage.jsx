import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
  Award,
  AlertCircle,
  ArrowRight,
  Filter,
  BarChart3,
  Search
} from 'lucide-react';
import { enrollmentService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EnrolledCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'IN_PROGRESS' | 'COMPLETED'
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await enrollmentService.getMyEnrollments();
      if (response && response.data) {
        setEnrollments(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
      setError('Could not retrieve your enrolled courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleSimulateProgress = async (courseId, currentCompleted, totalLessons) => {
    try {
      const nextCompleted = Math.min(totalLessons || 20, (currentCompleted || 0) + 1);
      await enrollmentService.updateProgress(courseId, nextCompleted);
      // Refresh enrollments
      fetchEnrollments();
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your enrolled curriculums..." />;
  }

  // Filter list
  const filteredCourses = enrollments.filter((item) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'COMPLETED' && (item.status === 'COMPLETED' || item.progressPercentage >= 100)) ||
      (filterStatus === 'IN_PROGRESS' && item.status !== 'COMPLETED' && item.progressPercentage < 100);

    const matchesSearch =
      !searchQuery.trim() ||
      item.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="melangee-container" style={{ padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <BookOpen size={28} color="var(--primary)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Enrolled Courses</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track your progress, resume learning from your last lesson, and earn verified certificates.
        </p>
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
            marginBottom: '24px',
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          backgroundColor: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'All Courses', value: 'ALL', count: enrollments.length },
            {
              label: 'In Progress',
              value: 'IN_PROGRESS',
              count: enrollments.filter((e) => e.status !== 'COMPLETED' && e.progressPercentage < 100).length,
            },
            {
              label: 'Completed',
              value: 'COMPLETED',
              count: enrollments.filter((e) => e.status === 'COMPLETED' || e.progressPercentage >= 100).length,
            },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filterStatus === tab.value ? 'var(--primary)' : 'var(--bg-main)',
                color: filterStatus === tab.value ? '#FFFFFF' : 'var(--text-main)',
                transition: 'var(--transition-fast)',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search my courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div
          className="melangee-card"
          style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: '#FFFFFF' }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <BookOpen size={30} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
            No courses found
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            {filterStatus === 'COMPLETED'
              ? "You haven't completed any courses yet. Keep learning to earn your certificates!"
              : 'You have not enrolled in any matching courses yet.'}
          </p>
          <Link to="/courses" className="btn-melangee-primary">
            Browse Course Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {filteredCourses.map((item) => {
            const isDone = item.status === 'COMPLETED' || item.progressPercentage >= 100;
            return (
              <div
                key={item.id}
                className="melangee-card"
                style={{
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: '170px', width: '100%' }}>
                  <img
                    src={item.courseThumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                    alt={item.courseTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isDone ? (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  ) : (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.progressPercentage || 0}% Progress
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                    {item.categoryName || 'Curriculum'}
                  </div>

                  <Link to={`/courses/${item.courseId}`}>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        lineHeight: 1.4,
                        marginBottom: '10px',
                        color: 'var(--text-main)',
                      }}
                    >
                      {item.courseTitle}
                    </h3>
                  </Link>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Instructor: <strong>{item.instructorName || 'Melangee Faculty'}</strong>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {item.completedLessonsCount || 0} / {item.totalLessonsCount || 20} lessons ({item.progressPercentage || 0}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.progressPercentage || 0}%`,
                          height: '100%',
                          backgroundColor: isDone ? '#10B981' : 'var(--primary)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Last accessed lesson */}
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <PlayCircle size={15} color="var(--primary)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.lastAccessedLesson || 'Module 1: Orientation'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    <Link
                      to={`/courses/${item.courseId}`}
                      className="btn-melangee-primary"
                      style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
                    >
                      <span>{isDone ? 'Review Curriculum' : 'Resume Learning'}</span>
                      <ArrowRight size={14} />
                    </Link>

                    {!isDone && (
                      <button
                        type="button"
                        onClick={() => handleSimulateProgress(item.courseId, item.completedLessonsCount, item.totalLessonsCount)}
                        title="Simulate completing next lesson"
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: '#F1F5F9',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
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
    </div>
  );
};

export default EnrolledCoursesPage;


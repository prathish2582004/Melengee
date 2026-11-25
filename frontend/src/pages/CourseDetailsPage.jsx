import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  PlayCircle,
  Lock,
  Heart,
  Share2,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { courseService, enrollmentService, wishlistService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enrollment & Wishlist action states
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState(null);
  const [enrollErrorMessage, setEnrollErrorMessage] = useState(null);

  // Accordion state for modules
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await courseService.getCourseById(id);
        if (response && response.data) {
          const courseData = response.data;
          setCourse(courseData);
          setIsEnrolled(courseData.isEnrolled || false);
          setIsWishlisted(courseData.isWishlisted || false);

          // By default, open the first module
          if (courseData.modules && courseData.modules.length > 0) {
            setOpenModules({ [courseData.modules[0].id]: true });
          }
        } else {
          setError('Course details not available.');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const toggleModule = (moduleId) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleEnroll = async (isDevTest = false) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    setActionLoading(true);
    setEnrollSuccessMessage(null);
    setEnrollErrorMessage(null);

    try {
      const response = await enrollmentService.enroll(course.id, isDevTest);
      if (response && (response.success || response.data)) {
        setIsEnrolled(true);
        setEnrollSuccessMessage(
          isDevTest
            ? 'Successfully enrolled via Development Test Enrollment! All curriculum lessons are unlocked.'
            : 'Congratulations! You are officially enrolled in this free course.'
        );
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      const msg = err.response?.data?.message || 'Enrollment failed. Please try again.';
      setEnrollErrorMessage(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    setWishlistLoading(true);
    setEnrollErrorMessage(null);
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(course.id);
        setIsWishlisted(false);
      } else {
        await wishlistService.addToWishlist(course.id);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      setEnrollErrorMessage(err.response?.data?.message || 'Wishlist update failed. Ensure you are signed in with a Student account.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const canEnrollRole = !isAuthenticated || user?.role === 'ROLE_STUDENT' || user?.role === 'ROLE_ADMIN';

  if (loading) {
    return <LoadingSpinner message="Loading course curriculum and faculty details..." />;
  }

  if (error || !course) {
    return (
      <div className="melangee-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
        <h2>Course Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {error || "The requested course could not be retrieved or doesn't exist."}
        </p>
        <Link to="/courses" className="btn-melangee-primary">
          Back to Course Catalog
        </Link>
      </div>
    );
  }

  const levelColor = {
    BEGINNER: '#10B981',
    INTERMEDIATE: '#3B82F6',
    ADVANCED: '#8B5CF6',
    ALL_LEVELS: '#6366F1',
  }[course.level] || '#6366F1';

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
          color: '#FFFFFF',
          padding: '60px 0 50px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="melangee-container">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
            <Link to="/" style={{ color: '#94A3B8' }}>Home</Link>
            <span>/</span>
            <Link to="/courses" style={{ color: '#94A3B8' }}>Courses</Link>
            <span>/</span>
            <span style={{ color: '#CBD5E1' }}>{course.category?.name || 'Category'}</span>
            <span>/</span>
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{course.title}</span>
          </div>

          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 600px' }}>
              {/* Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {course.category?.name || 'General'}
                </span>

                <span
                  style={{
                    backgroundColor: levelColor,
                    color: '#FFFFFF',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {course.level ? course.level.replace('_', ' ') : 'ALL LEVELS'}
                </span>

                {course.badge && (
                  <span
                    style={{
                      backgroundColor: '#F59E0B',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                    }}
                  >
                    ★ {course.badge}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, marginBottom: '16px' }}>
                {course.title}
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '24px' }}>
                {course.subtitle || course.description?.slice(0, 150) + '...'}
              </p>

              {/* Rating, Students & Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem', color: '#E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ display: 'flex', color: '#FBBF24' }}>
                    <Star size={18} fill="#FBBF24" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#FBBF24' }}>
                    {course.rating ? course.rating.toFixed(1) : '4.9'}
                  </span>
                  <span style={{ color: '#94A3B8' }}>({course.reviewsCount || 128} ratings)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} color="#94A3B8" />
                  <span>{course.studentsCount || 0} students enrolled</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#94A3B8" />
                  <span>{course.duration || '12 hours'} on-demand content</span>
                </div>
              </div>

              {/* Instructor info banner in header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  {course.instructor?.fullName?.charAt(0) || 'I'}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Created and mentored by</div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                    {course.instructor?.fullName || 'Senior Melangee Faculty'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body: 2 Columns */}
      <div className="melangee-container" style={{ marginTop: '40px' }}>
        <div className="course-details-grid">
          
          {/* Left Column: Course Overview, Objectives, Requirements, Curriculum, Instructor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Success / Error Banners */}
            {enrollSuccessMessage && (
              <div
                style={{
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#065F46',
                }}
              >
                <CheckCircle2 size={24} color="#10B981" />
                <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600 }}>{enrollSuccessMessage}</div>
                <Link to="/dashboard/student" className="btn-melangee-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Go to Dashboard
                </Link>
              </div>
            )}

            {enrollErrorMessage && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#991B1B',
                }}
              >
                <AlertCircle size={24} color="#EF4444" />
                <div style={{ flex: 1, fontSize: '0.95rem' }}>{enrollErrorMessage}</div>
              </div>
            )}

            {/* What you'll learn (Objectives) */}
            {course.objectives && course.objectives.length > 0 && (
              <div className="melangee-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={22} color="var(--primary)" />
                  <span>What You'll Master in this Course</span>
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {course.objectives.map((obj, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum (Modules & Lessons) */}
            <div className="melangee-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '4px' }}>
                    Course Curriculum & Syllabus
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                    {course.modules?.length || 0} comprehensive modules • {course.totalLessons || 0} lessons • {course.duration || '12h total'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = Object.keys(openModules).length === course.modules?.length;
                    if (allOpen) {
                      setOpenModules({});
                    } else {
                      const allState = {};
                      course.modules?.forEach((m) => { allState[m.id] = true; });
                      setOpenModules(allState);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {Object.keys(openModules).length === course.modules?.length ? 'Collapse All' : 'Expand All Sections'}
                </button>
              </div>

              {/* Modules List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((mod, modIdx) => {
                    const isOpen = !!openModules[mod.id];
                    return (
                      <div
                        key={mod.id}
                        style={{
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Module Header Bar */}
                        <div
                          onClick={() => toggleModule(mod.id)}
                          style={{
                            padding: '16px 20px',
                            backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'var(--transition-fast)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary)',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {modIdx + 1}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-main)' }}>
                                {mod.title}
                              </div>
                              {mod.description && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  {mod.description}
                                </div>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                              {mod.lessons?.length || 0} lessons
                            </span>
                            {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                          </div>
                        </div>

                        {/* Lessons Accordion Body */}
                        {isOpen && (
                          <div style={{ borderTop: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                            {mod.lessons && mod.lessons.length > 0 ? (
                              mod.lessons.map((lesson, lIdx) => (
                                <div
                                  key={lesson.id}
                                  style={{
                                    padding: '12px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: lIdx === mod.lessons.length - 1 ? 'none' : '1px solid var(--border-light)',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {lesson.isFreePreview || isEnrolled ? (
                                      <PlayCircle size={18} color="var(--primary)" />
                                    ) : (
                                      <Lock size={16} color="var(--text-light)" />
                                    )}
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                                      {lesson.title}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {lesson.isFreePreview && (
                                      <span
                                        style={{
                                          fontSize: '0.72rem',
                                          fontWeight: 700,
                                          padding: '2px 8px',
                                          borderRadius: '4px',
                                          backgroundColor: '#ECFDF5',
                                          color: '#059669',
                                          border: '1px solid #A7F3D0',
                                        }}
                                      >
                                        Free Preview
                                      </span>
                                    )}
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                      {lesson.duration || '15:00'}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Lessons syllabus under active configuration.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Curriculum outline being finalized.
                  </div>
                )}
              </div>
            </div>

            {/* Description & Overview */}
            <div className="melangee-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px' }}>
                Course Detailed Description
              </h2>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {course.description}
              </div>
            </div>

            {/* Requirements & Prerequisites */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="melangee-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px' }}>
                  Requirements & Prerequisites
                </h2>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {course.requirements.map((req, idx) => (
                    <li key={idx} style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor Bio Card */}
            {course.instructor && (
              <div className="melangee-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '20px' }}>
                  Meet Your Instructor
                </h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'var(--primary-gradient)',
                      color: '#FFFFFF',
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-md)',
                      flexShrink: 0,
                    }}
                  >
                    {course.instructor.fullName?.charAt(0) || 'I'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {course.instructor.fullName}
                    </div>
                    <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                      {course.instructor.instructorProfile?.headline || 'Senior Software Engineer & Lead Melangee Instructor'}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                      {course.instructor.instructorProfile?.bio ||
                        'Dedicated educator with over a decade of industry expertise building distributed enterprise architectures, cloud applications, and guiding thousands of developers worldwide.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Action / Enrollment Card */}
          <div style={{ position: 'sticky', top: '92px' }}>
            <div
              className="melangee-card"
              style={{
                padding: '28px',
                backgroundColor: '#FFFFFF',
                boxShadow: 'var(--shadow-xl)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
              }}
            >
              {/* Thumbnail preview */}
              <div
                style={{
                  width: '100%',
                  height: '190px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  position: 'relative',
                }}
              >
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                  }}
                >
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Heart
                      size={20}
                      color={isWishlisted ? '#EF4444' : '#64748B'}
                      fill={isWishlisted ? '#EF4444' : 'none'}
                    />
                  </button>
                </div>
              </div>

              {/* Price display */}
              <div style={{ marginBottom: '20px' }}>
                {course.isFree ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10B981' }}>
                      FREE
                    </span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      100% Free Lifetime Access
                    </span>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {formatCurrency(course.price)}
                      </span>
                      {course.originalPrice && (
                        <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                          {formatCurrency(course.originalPrice)}
                        </span>
                      )}
                      <span
                        style={{
                          backgroundColor: '#FEF3C7',
                          color: '#B45309',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        Special Phase 2 Offer
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {!canEnrollRole ? (
                  <div
                    style={{
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FDE68A',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '0.85rem',
                      color: '#92400E',
                      fontWeight: 500,
                      textAlign: 'center',
                    }}
                  >
                    Signed in as Instructor. Switch to a Student account to enroll in or bookmark courses.
                  </div>
                ) : isEnrolled ? (
                  <div>
                    <div
                      style={{
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '10px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '10px',
                        color: '#1E40AF',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={18} color="#2563EB" />
                      <span>You are enrolled in this course</span>
                    </div>
                    <Link
                      to="/dashboard/student"
                      className="btn-melangee-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    >
                      <span>Continue in Student Dashboard</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (course.isFree || Number(course.price) === 0) ? (
                  <button
                    onClick={() => handleEnroll(false)}
                    disabled={actionLoading}
                    className="btn-melangee-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
                  >
                    {actionLoading ? 'Enrolling...' : (isAuthenticated ? 'Enroll in Free Course' : 'Sign In to Enroll Free')}
                  </button>
                ) : (
                  <div>
                    {/* Paid course: Phase 2 explicitly labeled Development Test Enrollment */}
                    <button
                      onClick={() => handleEnroll(true)}
                      disabled={actionLoading}
                      className="btn-melangee-primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '14px',
                        fontSize: '0.98rem',
                        background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                      }}
                    >
                      {actionLoading ? 'Processing...' : (isAuthenticated ? 'Enroll with Development Test Access' : 'Sign In for Test Enrollment')}
                    </button>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                        marginTop: '8px',
                        backgroundColor: '#F1F5F9',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        lineHeight: 1.4,
                      }}
                    >
                      <strong>Phase 2 Test Enrollment:</strong> Paid checkout is scheduled for Phase 3. Use this labeled test enrollment to unlock the curriculum during development.
                    </div>
                  </div>
                )}

                {canEnrollRole && (
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#FFFFFF',
                      color: isWishlisted ? '#EF4444' : 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
                    <span>{isWishlisted ? 'Saved in Your Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                )}
              </div>

              {/* Inclusions List */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '14px', color: 'var(--text-main)' }}>
                  This course includes:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="var(--primary)" />
                    <span>{course.duration || '12 hours'} on-demand HD video</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} color="var(--primary)" />
                    <span>{course.totalLessons || 24} modular lessons & downloadable resources</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Monitor size={16} color="var(--primary)" />
                    <span>Access on mobile, tablet and desktop</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--primary)" />
                    <span>Full lifetime curriculum access</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={16} color="var(--primary)" />
                    <span>Official Melangee Certificate of Completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .course-details-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: 36px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .course-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseDetailsPage;


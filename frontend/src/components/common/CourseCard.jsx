import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, BookOpen, Heart, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { enrollmentService, wishlistService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const CourseCard = ({ course, onWishlistToggle, onEnrollSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(course.isWishlisted || false);
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    setIsWishlisted(course.isWishlisted || false);
    setIsEnrolled(course.isEnrolled || false);
  }, [course.isWishlisted, course.isEnrolled]);

  const isFreeCourse = Boolean(course.isFree) || Number(course.price) === 0;

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActionError(null);

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(course.id);
        setIsWishlisted(false);
        if (onWishlistToggle) onWishlistToggle(course.id, false);
      } else {
        await wishlistService.addToWishlist(course.id);
        setIsWishlisted(true);
        if (onWishlistToggle) onWishlistToggle(course.id, true);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      setActionError(err.response?.data?.message || 'Wishlist action failed');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuickFreeEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActionError(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${course.id}` } });
      return;
    }

    if (user?.role !== 'ROLE_STUDENT' && user?.role !== 'ROLE_ADMIN') {
      navigate(`/courses/${course.id}`);
      return;
    }

    setEnrollLoading(true);
    try {
      await enrollmentService.enroll(course.id, false);
      setIsEnrolled(true);
      if (onEnrollSuccess) onEnrollSuccess(course.id);
    } catch (err) {
      console.error('Quick enrollment failed:', err);
      const status = err.response?.status;
      if (status === 400 && err.response?.data?.message?.includes('already enrolled')) {
        setIsEnrolled(true);
      } else {
        setActionError(err.response?.data?.message || 'Could not enroll');
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  const levelColor = {
    BEGINNER: '#10B981',
    INTERMEDIATE: '#3B82F6',
    ADVANCED: '#8B5CF6',
    ALL_LEVELS: '#6366F1',
  }[course.level] || '#6366F1';

  return (
    <div
      className="melangee-card melangee-card-interactive"
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Thumbnail */}
      <Link to={`/courses/${course.id}`} style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden', display: 'block' }}>
        <img
          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Level Tag */}
        <span
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '4px',
            borderLeft: `3px solid ${levelColor}`,
          }}
        >
          {course.level ? course.level.replace('_', ' ') : 'ALL LEVELS'}
        </span>

        {/* Badge or Free badge */}
        {isFreeCourse ? (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)',
            }}
          >
            FREE
          </span>
        ) : course.badge ? (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {course.badge}
          </span>
        ) : null}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isWishlisted ? '#EF4444' : '#64748B',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'var(--transition-fast)',
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} />
        </button>
      </Link>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
            {course.categoryName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontWeight: 700 }}>{course.rating ? Number(course.rating).toFixed(1) : '5.0'}</span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>({course.reviewsCount || 0})</span>
          </div>
        </div>

        <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              marginBottom: '10px',
              lineHeight: 1.4,
              color: 'var(--text-main)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {course.title}
          </h3>
        </Link>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
          <User size={15} />
          <span>{course.instructorName || 'Melangee Faculty'}</span>
        </div>

        {/* Meta Stats: Duration & Lessons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            <span>{course.duration || '10 hours'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={14} />
            <span>{course.lessonsCount ? `${course.lessonsCount} lessons` : `${course.modulesCount || 3} modules`}</span>
          </div>
        </div>

        {actionError && (
          <div style={{ fontSize: '0.78rem', color: '#DC2626', marginBottom: '8px', fontWeight: 500 }}>
            {actionError}
          </div>
        )}

        {/* Pricing and Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
          <div>
            {isFreeCourse ? (
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}>
                FREE
              </span>
            ) : (
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {formatCurrency(course.price)}
                </span>
                {course.originalPrice && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: '6px' }}>
                    {formatCurrency(course.originalPrice)}
                  </span>
                )}
              </div>
            )}
          </div>

          {isEnrolled ? (
            <Link
              to="/dashboard/student"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
              }}
            >
              <CheckCircle2 size={15} />
              <span>Enrolled</span>
            </Link>
          ) : isFreeCourse ? (
            <button
              type="button"
              onClick={handleQuickFreeEnroll}
              disabled={enrollLoading}
              className="btn-melangee-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <span>{enrollLoading ? 'Enrolling...' : 'Enroll Free'}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <Link
              to={`/courses/${course.id}`}
              className="btn-melangee-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <span>Enroll Now</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

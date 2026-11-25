import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Trash2, ArrowRight, Star, Clock, User, AlertCircle } from 'lucide-react';
import { wishlistService } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wishlistService.getWishlist();
      if (response && response.data) {
        setWishlistItems(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      setError('Could not load your saved courses. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (courseId) => {
    setRemovingId(courseId);
    try {
      await wishlistService.removeFromWishlist(courseId);
      setWishlistItems((prev) => prev.filter((item) => item.course?.id !== courseId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your saved courses..." />;
  }

  return (
    <div className="melangee-container" style={{ padding: '40px 24px 80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Heart size={26} color="#EF4444" fill="#EF4444" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Saved Wishlist</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Keep track of curriculums and courses you want to take next.
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

      {wishlistItems.length === 0 ? (
        <div
          className="melangee-card"
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Heart size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
            Your wishlist is empty
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 24px' }}>
            Explore thousands of expert-led courses on Melangee and bookmark the topics you love.
          </p>
          <Link to="/courses" className="btn-melangee-primary">
            <BookOpen size={18} />
            <span>Discover Courses</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {wishlistItems.map((item) => {
            const course = item.course;
            if (!course) return null;

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
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => handleRemove(course.id)}
                    disabled={removingId === course.id}
                    title="Remove from wishlist"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        backgroundColor: 'var(--primary-light)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {course.categoryName || 'General'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {course.level ? course.level.replace('_', ' ') : 'ALL LEVELS'}
                    </span>
                  </div>

                  <Link to={`/courses/${course.id}`}>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        lineHeight: 1.4,
                        marginBottom: '8px',
                        color: 'var(--text-main)',
                      }}
                    >
                      {course.title}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    <User size={14} />
                    <span>{course.instructorName || 'Melangee Faculty'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {course.rating ? course.rating.toFixed(1) : '4.9'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      <span>{course.duration || '10h'}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                    <div>
                      {course.isFree ? (
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10B981' }}>FREE</span>
                      ) : (
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {formatCurrency(course.price)}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn-melangee-primary"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                      <span>View Course</span>
                      <ArrowRight size={14} />
                    </Link>
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

export default WishlistPage;


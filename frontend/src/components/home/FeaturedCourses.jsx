import React from 'react';
import { Star, Clock, BookOpen, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

const FeaturedCourses = ({ courses = [] }) => {
  return (
    <section style={{ padding: '40px 0 60px' }}>
      <div className="melangee-container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Curated Excellence
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Learning Paths</h2>
          </div>
          <Link to="/courses" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
            <span>Explore All Courses</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No courses found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {courses.map((course) => {
              const thumbnail = course.thumbnailUrl || course.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80';
              const categoryLabel = course.categoryName || course.category || 'Engineering';
              const instructorLabel = course.instructorName || course.instructor || 'Melangee Faculty';
              const levelLabel = course.level ? String(course.level).replace('_', ' ') : 'ALL LEVELS';
              const isFreeCourse = Boolean(course.isFree) || Number(course.price) === 0;

              return (
                <div
                  key={course.id}
                  className="melangee-card melangee-card-interactive"
                  style={{
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* Course Image */}
                  <Link to={`/courses/${course.id}`} style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden', display: 'block' }}>
                    <img
                      src={thumbnail}
                      alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {course.badge && (
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
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {levelLabel}
                    </span>
                  </Link>

                  {/* Content */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '6px' }}>
                      {categoryLabel}
                    </div>

                    <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: '12px', lineHeight: 1.4, color: 'var(--text-main)' }}>
                        {course.title}
                      </h3>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '14px' }}>
                      <User size={15} />
                      <span>{instructorLabel}</span>
                    </div>

                    {/* Meta info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        <span>{course.duration || '12 hours'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={14} />
                        <span>{course.lessonsCount || course.modulesCount || 10} lessons</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{course.rating ? Number(course.rating).toFixed(1) : '4.9'}</span>
                      </div>
                    </div>

                    {/* Pricing and Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px' }}>
                      <div>
                        {isFreeCourse ? (
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>
                            FREE
                          </span>
                        ) : (
                          <>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {formatCurrency(course.price)}
                            </span>
                            {course.originalPrice && (
                              <span style={{ fontSize: '0.88rem', color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: '6px' }}>
                                {formatCurrency(course.originalPrice)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <Link
                        to={`/courses/${course.id}`}
                        className="btn-melangee-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        {isFreeCourse ? 'Enroll Free' : 'View Course'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;

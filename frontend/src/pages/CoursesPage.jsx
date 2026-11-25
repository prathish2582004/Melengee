import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, RefreshCw, AlertCircle } from 'lucide-react';
import { courseService } from '../services/api';
import CourseCard from '../components/common/CourseCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states initialized from URL params where provided
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [priceType, setPriceType] = useState('ALL'); // 'ALL' | 'FREE' | 'PAID'
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Mobile filter drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL query params if changed externally
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat && urlCat !== selectedCategory) {
      setSelectedCategory(urlCat);
      setPage(0);
    }
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
      setPage(0);
    }
  }, [searchParams]);

  // Load categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await courseService.getCategories();
        if (res && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch courses with current filter parameters
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: search.trim() || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        level: selectedLevel || undefined,
        isFree: priceType === 'FREE' ? true : priceType === 'PAID' ? false : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        sortBy,
        page,
        size: 9,
      };

      const res = await courseService.getCourses(params);
      if (res && res.data) {
        setCourses(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      const serverMsg = err.response?.data?.message;
      setError(
        serverMsg
          ? `Backend error: ${serverMsg}`
          : 'Unable to load courses from backend. Ensure the Spring Boot API is running on http://localhost:8080.'
      );
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedLevel, priceType, minRating, sortBy, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCourses();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLevel('');
    setPriceType('ALL');
    setMinRating('');
    setSortBy('popular');
    setPage(0);
    setSearchParams({});
  };

  const levels = [
    { label: 'All Levels', value: '' },
    { label: 'Beginner', value: 'BEGINNER' },
    { label: 'Intermediate', value: 'INTERMEDIATE' },
    { label: 'Advanced', value: 'ADVANCED' },
  ];

  const sortOptions = [
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Newest Releases', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="melangee-container">
        {/* Header Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>
            Explore Verified Engineering Curriculums
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
            Master distributed backends, modern frontend architectures, and cloud DevOps designed by industry practitioners.
          </p>
        </div>

        {/* Top Control Bar */}
        <div
          className="melangee-card"
          style={{
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1, maxWidth: '500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 14px', width: '100%' }}>
              <Search size={18} color="var(--primary)" />
              <input
                type="text"
                placeholder="Search courses, skills, or instructors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.92rem' }}
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-melangee-primary" style={{ padding: '10px 18px', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </form>

          {/* Sort & Mobile Filter Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <ArrowUpDown size={16} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                className="form-control-melangee"
                style={{ padding: '8px 12px', fontSize: '0.88rem', width: 'auto' }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="btn-melangee-outline d-md-none"
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Courses Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
          {/* Filters Sidebar */}
          <aside
            style={{
              gridColumn: 'span 3',
              display: mobileFiltersOpen ? 'block' : 'none',
            }}
            className="d-md-block"
          >
            <div className="melangee-card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem' }}>
                  <SlidersHorizontal size={18} color="var(--primary)" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Categories Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Category</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => { setSelectedCategory('all'); setPage(0); }}
                    />
                    <span>All Disciplines</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.slug}
                        onChange={() => { setSelectedCategory(cat.slug); setPage(0); }}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Course Level Filter */}
              <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <label className="form-label">Experience Level</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {levels.map((lvl) => (
                    <label key={lvl.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === lvl.value}
                        onChange={() => { setSelectedLevel(lvl.value); setPage(0); }}
                      />
                      <span>{lvl.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <label className="form-label">Pricing</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="priceType"
                      checked={priceType === 'ALL'}
                      onChange={() => { setPriceType('ALL'); setPage(0); }}
                    />
                    <span>All Prices</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="priceType"
                      checked={priceType === 'FREE'}
                      onChange={() => { setPriceType('FREE'); setPage(0); }}
                    />
                    <span style={{ color: '#10B981', fontWeight: 600 }}>Free Courses Only</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="priceType"
                      checked={priceType === 'PAID'}
                      onChange={() => { setPriceType('PAID'); setPage(0); }}
                    />
                    <span>Premium / Paid Only</span>
                  </label>
                </div>
              </div>

              {/* Rating Filter */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <label className="form-label">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => { setMinRating(e.target.value); setPage(0); }}
                  className="form-control-melangee"
                  style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                >
                  <option value="">All Ratings</option>
                  <option value="4.8">4.8 Stars and above</option>
                  <option value="4.5">4.5 Stars and above</option>
                  <option value="4.0">4.0 Stars and above</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Courses Grid and Pagination */}
          <main style={{ gridColumn: 'span 9' }} className="courses-main-grid">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing <strong>{courses.length}</strong> of <strong>{totalElements}</strong> programs
              </span>
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
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <LoadingSpinner message="Searching verified curriculums..." />
            ) : courses.length === 0 ? (
              <div className="melangee-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No courses match your criteria</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Try adjusting your search query, switching categories, or clearing filters.
                </p>
                <button onClick={handleResetFilters} className="btn-melangee-primary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="btn-melangee-outline"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            border: `1px solid ${page === i ? 'var(--primary)' : 'var(--border-color)'}`,
                            backgroundColor: page === i ? 'var(--primary)' : '#FFFFFF',
                            color: page === i ? '#FFFFFF' : 'var(--text-main)',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page >= totalPages - 1}
                      className="btn-melangee-outline"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .courses-main-grid {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CoursesPage;

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const CourseSearch = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: 'all', label: 'All Fields' },
    { id: 'Full-Stack Web Development', label: 'Web & Full-Stack' },
    { id: 'Cloud Architecture & DevOps', label: 'Cloud & DevOps' },
    { id: 'Data Science & Artificial Intelligence', label: 'AI & Data' },
    { id: 'Cybersecurity', label: 'Cybersecurity' },
  ];

  return (
    <div style={{ margin: '-30px auto 40px', position: 'relative', zIndex: 10, maxWidth: '900px', width: '100%' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          padding: '16px 20px',
        }}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '14px' }}>
          <Search size={22} color="var(--primary)" />
          <input
            type="text"
            placeholder="Search over 350+ courses by title, topic, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              width: '100%',
              fontFamily: 'inherit',
              color: 'var(--text-main)',
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '6px' }}>
            <SlidersHorizontal size={14} /> Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: isSelected ? 'var(--primary)' : '#F1F5F9',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition-fast)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseSearch;


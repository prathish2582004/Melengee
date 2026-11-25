import React from 'react';
import { Code, Cloud, Cpu, ShieldCheck, Smartphone, Palette, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  Code: <Code size={24} />,
  Cloud: <Cloud size={24} />,
  Cpu: <Cpu size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  Smartphone: <Smartphone size={24} />,
  Palette: <Palette size={24} />,
};

const CategoriesSection = ({ categories = [] }) => {
  return (
    <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="melangee-container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Domain Specializations
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>Explore Top Disciplines</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Structured curriculums designed to take you from foundational principles to production-grade architecture.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/courses?category=${encodeURIComponent(cat.slug || cat.id)}`}
              className="melangee-card melangee-card-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {iconMap[cat.icon] || <Code size={24} />}
              </div>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{cat.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {cat.coursesCount ?? cat.count ?? 0} Available Courses
                </span>
              </div>
              <ArrowRight size={18} color="var(--text-light)" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;


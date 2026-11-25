import React from 'react';
import { Star, Users, Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorShowcase = () => {
  const instructors = [
    {
      name: 'Dr. Elena Vance',
      role: 'Principal Systems Architect',
      organization: 'Former Senior Staff Engineer at Oracle Cloud',
      rating: 4.96,
      students: '18,500+',
      courses: 6,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      expertise: 'Java, Spring Boot, High-Throughput Distributed Systems',
    },
    {
      name: 'Marcus Thorne',
      role: 'Lead Frontend Infrastructure Engineer',
      organization: 'Senior Frontend Tech Lead',
      rating: 4.92,
      students: '14,200+',
      courses: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      expertise: 'React 19, TypeScript, Web Performance & SSR Architecture',
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Head of Applied AI Research',
      organization: 'Ph.D. in Computer Science, Stanford',
      rating: 4.98,
      students: '12,900+',
      courses: 4,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      expertise: 'Deep Learning, PyTorch, Large Language Model Pipelines',
    },
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="melangee-container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            World-Class Mentorship
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
            Learn from Verified Industry Leaders
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Our instructors do not teach from textbooks. They are active engineers and tech architects delivering battle-tested domain knowledge.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {instructors.map((inst, idx) => (
            <div
              key={idx}
              className="melangee-card melangee-card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 16px' }}>
                <img
                  src={inst.avatar}
                  alt={inst.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #EEF2FF' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'var(--accent)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFF',
                  }}
                  title="Verified Instructor"
                >
                  <Award size={13} color="#FFF" />
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{inst.name}</h3>
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>{inst.role}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>{inst.organization}</div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', padding: '10px', borderRadius: '8px', marginBottom: '18px' }}>
                <strong>Focus:</strong> {inst.expertise}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: 'auto', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={15} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontWeight: 700 }}>{inst.rating}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <Users size={15} />
                  <span>{inst.students} Students</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  <span>{inst.courses} Courses</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorShowcase;


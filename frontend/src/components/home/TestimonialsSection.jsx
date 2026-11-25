import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "The Spring Boot microservices and JWT security course on MELANGEE was transformative. I cracked my Senior Backend Engineer interview at an enterprise fintech thanks to the architectural clarity.",
      author: "Samantha Reed",
      role: "Senior Backend Engineer",
      company: "Fintech Enterprise",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      quote: "As a self-taught engineer, I struggled with distributed systems. MELANGEE broke down complex concurrency and messaging patterns with live code that made complete sense.",
      author: "Devon Chen",
      role: "Full-Stack Engineer",
      company: "Cloud Solutions Co.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      quote: "The instructor feedback and code reviews are unprecedented. Unlike generic video sites, you actually get high-caliber critique on your architectural decisions and performance optimizations.",
      author: "Priya Nair",
      role: "Data & ML Engineer",
      company: "AI Analytics Lab",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 5,
    },
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
      <div className="melangee-container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Proven Impact
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
            What Our Graduates Say
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Over 45,000 engineers and leaders have leveled up their careers through MELANGEE's rigorous programs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="melangee-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                padding: '28px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '24px', flexGrow: 1 }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <img
                  src={t.avatar}
                  alt={t.author}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.author}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.role} &bull; {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


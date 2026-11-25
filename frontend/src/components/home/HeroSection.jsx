import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Users, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero-wrapper">
      <div className="melangee-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {/* Left Column: Headlines & Call to actions */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'var(--primary-light)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '20px',
                border: '1px solid #C7D2FE',
              }}
            >
              <Sparkles size={16} />
              <span>Next-Gen Education Technology</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '20px', lineHeight: 1.15 }}>
              Master Industry Skills with <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MELANGEE</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '540px', lineHeight: 1.6 }}>
              Accelerate your engineering and leadership career with immersive curricula crafted by Silicon Valley architects and Fortune 500 mentors.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '40px' }}>
              <Link to="/register" className="btn-melangee-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                <span>Get Started for Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/courses" className="btn-melangee-outline" style={{ padding: '14px 24px', fontSize: '1rem' }}>
                <span>Browse All Courses</span>
              </Link>
            </div>

            {/* Platform Guarantees */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--accent)" />
                <span>Verified Industry Certificates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Hands-on Live Projects</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                position: 'relative',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                alt="Students collaborating online"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.85) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  color: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>4.9 / 5.0 (15,000+ Reviews)</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', opacity: 0.9 }}>
                  "MELANGEE gave me the architectural mastery needed to transition into a Principal Software Engineer role."
                </p>
              </div>
            </div>

            {/* Floating Metric Card */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                backgroundColor: '#FFFFFF',
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
              className="d-none d-sm-flex"
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>45,000+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active Learners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


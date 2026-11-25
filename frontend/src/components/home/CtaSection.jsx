import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const CtaSection = () => {
  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="melangee-container">
        <div
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
            borderRadius: '24px',
            padding: '60px 40px',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          {/* Subtle Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#C7D2FE',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={16} />
              <span>Begin Your Journey Today</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '20px', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              Ready to Build Production-Grade Systems?
            </h2>

            <p style={{ fontSize: '1.1rem', color: '#E0E7FF', marginBottom: '36px', lineHeight: 1.6, opacity: 0.9 }}>
              Join thousands of passionate engineers and educators on MELANGEE. Start with free interactive modules or enroll in our flagship career tracks.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '32px' }}>
              <Link
                to="/register"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '14px 30px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  transition: 'var(--transition-fast)',
                }}
              >
                <span>Create Free Student Account</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/courses"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '14px 26px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'var(--transition-fast)',
                }}
              >
                <span>Browse All Curriculum</span>
              </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '24px', fontSize: '0.88rem', color: '#C7D2FE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#34D399" />
                <span>No Credit Card Required</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#34D399" />
                <span>Instant Course Access</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#34D399" />
                <span>14-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;


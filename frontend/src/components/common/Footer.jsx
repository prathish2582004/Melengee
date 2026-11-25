import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0F172A', color: '#94A3B8', paddingTop: '64px', paddingBottom: '32px' }}>
      <div className="melangee-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <GraduationCap size={20} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                MELANGEE
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Empowering learners worldwide with enterprise-grade software engineering, cloud architecture, and data engineering education.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--primary)" />
                <span>support@melangee.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--primary)" />
                <span>+1 (800) 456-7890</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--primary)" />
                <span>San Francisco, CA & Global Remote</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/courses" style={{ color: '#94A3B8' }} onMouseEnter={(e) => e.target.style.color = '#FFF'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>All Courses</Link></li>
              <li><Link to="/courses" style={{ color: '#94A3B8' }} onMouseEnter={(e) => e.target.style.color = '#FFF'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Learning Paths</Link></li>
              <li><Link to="/about" style={{ color: '#94A3B8' }} onMouseEnter={(e) => e.target.style.color = '#FFF'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Why MELANGEE</Link></li>
              <li><Link to="/register" style={{ color: '#94A3B8' }} onMouseEnter={(e) => e.target.style.color = '#FFF'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Become an Instructor</Link></li>
              <li><Link to="/contact" style={{ color: '#94A3B8' }} onMouseEnter={(e) => e.target.style.color = '#FFF'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Help & Support</Link></li>
            </ul>
          </div>

          {/* Popular Topics */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Explore Tracks</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/courses" style={{ color: '#94A3B8' }}>Full-Stack Java & Spring Boot</Link></li>
              <li><Link to="/courses" style={{ color: '#94A3B8' }}>Modern React & Next.js</Link></li>
              <li><Link to="/courses" style={{ color: '#94A3B8' }}>Cloud Native & DevOps</Link></li>
              <li><Link to="/courses" style={{ color: '#94A3B8' }}>Applied Machine Learning</Link></li>
              <li><Link to="/courses" style={{ color: '#94A3B8' }}>Cybersecurity Defense</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Stay Connected</h4>
            <p style={{ fontSize: '0.88rem', marginBottom: '16px' }}>
              Subscribe to receive weekly curated engineering roadmaps and career insights.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to MELANGEE newsletter!'); }} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none',
                  flexGrow: 1,
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #1E293B',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.85rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} MELANGEE Inc. All rights reserved. Built with precision for Phase 1.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#privacy" style={{ color: '#94A3B8' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: '#94A3B8' }}>Terms of Service</a>
            <a href="#cookies" style={{ color: '#94A3B8' }}>Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


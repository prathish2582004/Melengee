import React from 'react';
import { Target, Compass, Award, Users, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '60px 0' }}>
      <div className="melangee-container">
        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 60px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Our Mission & Story
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.5px' }}>
            Empowering the World's Next Generation of Tech Leaders
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.6 }}>
            MELANGEE was founded on a simple truth: high-impact software engineering cannot be mastered through multiple-choice quizzes and disjointed tutorial videos. It demands real systems, deep feedback, and architectural discipline.
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          <div className="melangee-card" style={{ padding: '36px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Target size={26} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Our Mission</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              To bridge the gap between academic education and real-world tech industry demands. We build comprehensive curricula that empower engineers to craft fault-tolerant, scalable, and secure systems.
            </p>
          </div>

          <div className="melangee-card" style={{ padding: '36px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Compass size={26} color="var(--secondary)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Our Vision</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              A globally accessible ecosystem where any motivated learner can learn directly from distinguished principal engineers and gain career-defining capabilities regardless of geographic location.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '48px', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Core Principles</h2>
            <p style={{ color: 'var(--text-muted)' }}>The foundational pillars guiding every course, instructor, and learning path on MELANGEE.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Engineering Rigor</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                We believe in testing, linting, security, and benchmarking from day one.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={20} color="var(--secondary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Mentorship Over Lectures</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Continuous peer code reviews and architectural discussions foster deep comprehension.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={20} color="var(--accent)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Verified Competence</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Credentials represent verifiable GitHub repositories and deployed cloud infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Join CTA */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Ready to Experience the MELANGEE Difference?</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-melangee-primary" style={{ padding: '12px 28px' }}>Join as a Student</Link>
            <Link to="/register" className="btn-melangee-outline" style={{ padding: '12px 28px' }}>Teach on MELANGEE</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;


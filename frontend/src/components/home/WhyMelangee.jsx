import React from 'react';
import { Award, Zap, Users, Terminal, CheckCircle2, ShieldCheck } from 'lucide-react';

const WhyMelangee = () => {
  const features = [
    {
      icon: <Terminal size={24} color="#4F46E5" />,
      bg: '#EEF2FF',
      title: 'Production-Grade Projects',
      description: 'Build real-world microservices, distributed caching layers, and high-concurrency frontend apps instead of toy demos.',
    },
    {
      icon: <Award size={24} color="#0EA5E9" />,
      bg: '#E0F2FE',
      title: 'Industry Recognized Credentials',
      description: 'Receive verifiable digital certificates with cryptographically signed verification IDs shareable on LinkedIn and resumes.',
    },
    {
      icon: <Users size={24} color="#8B5CF6" />,
      bg: '#F5F3FF',
      title: 'Expert Practitioner Mentors',
      description: 'Learn directly from staff software engineers, principal architects, and tech leads working at top tech firms.',
    },
    {
      icon: <Zap size={24} color="#F59E0B" />,
      bg: '#FEF3C7',
      title: 'Adaptive Learning Tracks',
      description: 'Tailor your learning journey based on current expertise with diagnostic skill assessments and personalized pacing.',
    },
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="melangee-container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            The MELANGEE Advantage
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
            Engineered for Real-World Competence
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Traditional bootcamps teach syntax; MELANGEE equips you with software design patterns, system scalability, and enterprise resilience.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
          {features.map((item, idx) => (
            <div
              key={idx}
              className="melangee-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMelangee;


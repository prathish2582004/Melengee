import React from 'react';
import { Layers, GitCommit, CheckSquare, Sparkles } from 'lucide-react';

const LearningBenefits = () => {
  const steps = [
    {
      number: '01',
      title: 'Interactive Conceptual Foundation',
      desc: 'Deep-dive into core theory with bite-sized video lessons and interactive architectural diagrams.',
      icon: <Layers size={22} color="var(--primary)" />,
    },
    {
      number: '02',
      title: 'Hands-On Code Sandbox',
      desc: 'Implement live features, write automated unit tests, and solve algorithmic challenges in real-time.',
      icon: <GitCommit size={22} color="var(--secondary)" />,
    },
    {
      number: '03',
      title: 'Automated & Peer Code Reviews',
      desc: 'Receive immediate linting and code quality suggestions modeled after enterprise CI/CD workflows.',
      icon: <CheckSquare size={22} color="var(--accent)" />,
    },
    {
      number: '04',
      title: 'Production Deployment & Career Showcase',
      desc: 'Deploy live projects to cloud environments and showcase verified repositories to recruiters.',
      icon: <Sparkles size={22} color="var(--warning)" />,
    },
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
      <div className="melangee-container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Structured Methodology
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
            How You Learn on MELANGEE
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            A proven 4-stage pedagogy designed to bridge the gap between academic theory and enterprise engineering requirements.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="melangee-card"
              style={{
                position: 'relative',
                padding: '30px 24px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  {step.icon}
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-light)', fontFamily: 'var(--font-heading)' }}>
                  {step.number}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', lineHeight: 1.3 }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningBenefits;


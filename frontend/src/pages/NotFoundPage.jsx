import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, marginBottom: '16px' }}>
          404
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '28px' }}>
          The educational resource or page you are looking for has been relocated or does not exist.
        </p>
        <Link to="/" className="btn-melangee-primary" style={{ display: 'inline-flex', padding: '12px 24px' }}>
          <ArrowLeft size={18} />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;


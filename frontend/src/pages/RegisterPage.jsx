import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DASHBOARD_ROUTES } from '../utils/constants';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { GraduationCap, BookOpen, Briefcase, CheckCircle, ShieldAlert } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT', // 'STUDENT' or 'INSTRUCTOR'
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).{8,64}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role !== 'STUDENT' && formData.role !== 'INSTRUCTOR') {
      newErrors.role = 'Role must be either STUDENT or INSTRUCTOR';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });

      // Redirect to proper role dashboard
      const targetDashboard = DASHBOARD_ROUTES[user.role] || '/';
      navigate(targetDashboard, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration could not be completed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <GraduationCap size={24} />
            </div>
            <span className="navbar-brand-logo" style={{ fontSize: '1.8rem' }}>MELANGEE</span>
          </Link>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '8px', marginBottom: '6px' }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join the next-generation tech education platform</p>
        </div>

        {/* Card */}
        <div className="melangee-card" style={{ padding: '36px' }}>
          {serverError && (
            <Alert
              type="error"
              title="Registration Error"
              message={serverError}
              onClose={() => setServerError('')}
            />
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Role Selection Tabs */}
            <div>
              <label className="form-label">I want to join MELANGEE as a:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `2px solid ${formData.role === 'STUDENT' ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: formData.role === 'STUDENT' ? 'var(--primary-light)' : '#FFFFFF',
                    color: formData.role === 'STUDENT' ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <BookOpen size={18} />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'INSTRUCTOR' })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `2px solid ${formData.role === 'INSTRUCTOR' ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: formData.role === 'INSTRUCTOR' ? '#F5F3FF' : '#FFFFFF',
                    color: formData.role === 'INSTRUCTOR' ? '#6D28D9' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <Briefcase size={18} />
                  <span>Instructor</span>
                </button>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', margin: '6px 0 0' }}>
                * Public registration is strictly for Students and Instructors. Administrative accounts are seeded internally.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className={`form-control-melangee ${errors.fullName ? 'is-invalid' : ''}`}
                placeholder="e.g. Alex Morgan"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                autoComplete="name"
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className={`form-control-melangee ${errors.email ? 'is-invalid' : ''}`}
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password *</label>
              <input
                type="password"
                className={`form-control-melangee ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Minimum 8 characters with upper, lower, number, symbol"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="new-password"
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className={`form-control-melangee ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
              style={{ marginTop: '10px', padding: '12px' }}
            >
              Complete Registration
            </Button>
          </form>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


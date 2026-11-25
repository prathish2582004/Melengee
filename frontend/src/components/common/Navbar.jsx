import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../utils/constants';
import {
  GraduationCap,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown,
  BookOpen,
  Heart
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, getDashboardRoute } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--primary)' : 'var(--text-main)',
    fontWeight: isActive ? '700' : '500',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'var(--transition-fast)',
    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="melangee-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
            }}
          >
            <GraduationCap size={24} />
          </div>
          <span className="navbar-brand-logo">MELANGEE</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="d-none d-md-flex">
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/courses" style={navLinkStyle}>Courses</NavLink>
          <NavLink to="/about" style={navLinkStyle}>About</NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Contact</NavLink>
        </nav>

        {/* Desktop Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="d-none d-md-flex">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#F1F5F9',
                  border: '1px solid var(--border-color)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span>{user?.fullName}</span>
                <span className={`badge-melangee ${user?.role === 'ROLE_STUDENT' ? 'badge-student' : user?.role === 'ROLE_INSTRUCTOR' ? 'badge-instructor' : 'badge-admin'}`}>
                  {ROLE_LABELS[user?.role] || 'User'}
                </span>
                <ChevronDown size={16} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '220px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-color)',
                    padding: '8px',
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Signed in as</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  </div>

                  <Link
                    to={getDashboardRoute()}
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: 'var(--text-main)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LayoutDashboard size={16} color="var(--primary)" />
                    <span>My Dashboard</span>
                  </Link>

                  {user?.role === 'ROLE_STUDENT' && (
                    <>
                      <Link
                        to="/my-courses"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: 'var(--text-main)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <BookOpen size={16} color="var(--primary)" />
                        <span>My Enrolled Courses</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: 'var(--text-main)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Heart size={16} color="#EF4444" />
                        <span>My Wishlist</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: 'var(--danger)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-melangee-outline">
                Sign In
              </Link>
              <Link to="/register" className="btn-melangee-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            display: 'none',
          }}
          className="d-flex d-md-none"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF',
            padding: '16px 24px',
            boxShadow: 'var(--shadow-lg)',
          }}
          className="d-md-none"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <NavLink to="/" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/courses" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>Courses</NavLink>
            <NavLink to="/about" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>About</NavLink>
            <NavLink to="/contact" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{user?.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                </div>
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-melangee-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LayoutDashboard size={18} />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-melangee-outline"
                  style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)' }}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-melangee-outline" style={{ textAlign: 'center' }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-melangee-primary" style={{ textAlign: 'center' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


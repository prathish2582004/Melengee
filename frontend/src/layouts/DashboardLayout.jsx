import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import { ROLE_LABELS } from '../utils/constants';
import {
  BookOpen,
  LayoutDashboard,
  Award,
  Settings,
  Users,
  BarChart3,
  LogOut,
  FolderPlus,
  Shield,
  Heart,
  Compass
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (user?.role === 'ROLE_STUDENT') {
      return [
        { label: 'Overview', to: '/dashboard/student', icon: <LayoutDashboard size={18} /> },
        { label: 'My Enrolled Courses', to: '/my-courses', icon: <BookOpen size={18} /> },
        { label: 'Saved Wishlist', to: '/wishlist', icon: <Heart size={18} /> },
        { label: 'Explore Catalog', to: '/courses', icon: <Compass size={18} /> },
      ];
    } else if (user?.role === 'ROLE_INSTRUCTOR') {
      return [
        { label: 'Studio Overview', to: '/dashboard/instructor', icon: <LayoutDashboard size={18} /> },
        { label: 'Courses Taught', to: '#', icon: <BookOpen size={18} /> },
        { label: 'Create New Course', to: '#', icon: <FolderPlus size={18} /> },
        { label: 'Analytics & Revenue', to: '#', icon: <BarChart3 size={18} /> },
        { label: 'Settings', to: '#', icon: <Settings size={18} /> },
      ];
    } else if (user?.role === 'ROLE_ADMIN') {
      return [
        { label: 'Admin Dashboard', to: '/dashboard/admin', icon: <Shield size={18} /> },
        { label: 'User Directory', to: '/dashboard/admin', icon: <Users size={18} /> },
        { label: 'Platform Settings', to: '#', icon: <Settings size={18} /> },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const sidebarLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.92rem',
    fontWeight: isActive ? '700' : '500',
    color: isActive ? 'var(--primary)' : 'var(--text-main)',
    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Navbar />

      <div className="dashboard-wrapper">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          {/* User mini badge */}
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.fullName}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.email}
                </div>
              </div>
            </div>
            <span className={`badge-melangee ${user?.role === 'ROLE_STUDENT' ? 'badge-student' : user?.role === 'ROLE_INSTRUCTOR' ? 'badge-instructor' : 'badge-admin'}`}>
              {ROLE_LABELS[user?.role] || 'User'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {navItems.map((item, idx) => (
              <NavLink key={idx} to={item.to} style={sidebarLinkStyle}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '24px' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--danger)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Main Content Area */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

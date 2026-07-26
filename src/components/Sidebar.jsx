import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dog, 
  Calendar, 
  FileText, 
  Stethoscope, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Pets Gallery', path: '/pets', icon: Dog },
    { label: 'Appointments', path: '/appointments', icon: Calendar },
    { label: 'Medical History', path: '/medical-records', icon: FileText },
    { label: 'Care Services', path: '/services', icon: Stethoscope },
    { label: 'System & IDE', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px var(--primary-glow)'
        }}>
          <Dog size={24} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.1 }}>PetCare<span style={{ color: 'var(--primary)' }}>Pro</span></h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enterprise v1.0</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={({ isActive }) => ({
                justifyContent: 'flex-start',
                padding: '0.75rem 1rem',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile Card & Logout */}
      <div className="glass-panel" style={{ padding: '12px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'var(--primary)'
          }}>
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="btn btn-danger btn-sm"
          style={{ width: '100%' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Shield, LogOut } from 'lucide-react'; // 1. Imported LogOut icon
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ title }) => {
  const { user, logout } = useAuth(); // 2. Destructured logout from useAuth
  const [theme, setTheme] = useState(() => localStorage.getItem('pet_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pet_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <span className="badge badge-admin">System Admin</span>;
      case 'ROLE_VET':
        return <span className="badge badge-vet">Veterinarian</span>;
      default:
        return <span className="badge badge-owner">Pet Owner</span>;
    }
  };

  return (
    <header className="header">
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user && getRoleBadge(user.role)}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#8b5cf6" />}
        </button>

        {/* User Info & Logout Button */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.1 }}>{user.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>

            {/* 3. Added Logout Button */}
            <button
              onClick={logout}
              className="btn btn-danger btn-sm"
              title="Sign Out of Account"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
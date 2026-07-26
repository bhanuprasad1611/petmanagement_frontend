import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { dashboardApi } from '../api/dashboardApi';
import { petApi } from '../api/petApi';
import { appointmentApi } from '../api/appointmentApi';
import { useAuth } from '../context/AuthContext';
import { Dog, Calendar, Stethoscope, Users, CheckCircle2, Clock, Activity, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentPets, setRecentPets] = useState([]);
  const [upcomingAppts, setUpcomingAppts] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      const results = await Promise.allSettled([
        dashboardApi.getStats(),
        petApi.getAll(),
        appointmentApi.getAll(),
      ]);

      // Dashboard statistics
      if (results[0].status === 'fulfilled') {
        setStats(results[0].value.data);
      } else {
        console.error('Stats error:', results[0].reason);
      }

      // Recent pets
      if (results[1].status === 'fulfilled') {
        setRecentPets(results[1].value.data.slice(0, 4));
      } else {
        console.error('Pets error:', results[1].reason);
      }

      // Upcoming appointments
      if (results[2].status === 'fulfilled') {
        setUpcomingAppts(results[2].value.data.slice(0, 5));
      } else {
        console.error('Appointments error:', results[2].reason);
        setUpcomingAppts([]);
      }

    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  return (
    <div>
      <Navbar title="Executive Dashboard" />

      <div className="content-body">
        {/* Welcome Header */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                Hello, <span className="gradient-text">{user?.name}</span> 👋
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                {user?.role === 'ROLE_ADMIN' && 'System overview, database metrics and management control panel.'}
                {user?.role === 'ROLE_VET' && 'Clinical schedule, upcoming consultations, and patient history logs.'}
                {user?.role === 'ROLE_OWNER' && 'Welcome to your pet care hub. Track vaccinations and appointment status.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/pets" className="btn btn-primary">
                <Plus size={18} /> Add Pet
              </Link>
              <Link to="/appointments" className="btn btn-secondary">
                <Calendar size={18} /> Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Counter Grid */}
        <div className="grid-stats">
          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ color: '#06b6d4' }}>
              <Dog size={28} />
            </div>
            <div>
              <div className="stat-val">{stats?.totalPets || 0}</div>
              <div className="stat-lbl">Registered Pets</div>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ color: '#f59e0b' }}>
              <Clock size={28} />
            </div>
            <div>
              <div className="stat-val">{stats?.pendingAppointments || 0}</div>
              <div className="stat-lbl">Pending Appointments</div>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ color: '#10b981' }}>
              <CheckCircle2 size={28} />
            </div>
            <div>
              <div className="stat-val">{stats?.completedAppointments || 0}</div>
              <div className="stat-lbl">Completed Visits</div>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ color: '#8b5cf6' }}>
              <Stethoscope size={28} />
            </div>
            <div>
              <div className="stat-val">{stats?.totalServices || 0}</div>
              <div className="stat-lbl">Active Services</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Quick Views */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
          {/* Upcoming Appointments Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="var(--primary)" />
                Upcoming Consultations
              </h3>
              <Link to="/appointments" style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                View All
              </Link>
            </div>

            {upcomingAppts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No appointments scheduled yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingAppts.map((appt) => (
                  <div
                    key={appt.id}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(15,23,42,0.4)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{appt.petName} ({appt.serviceName})</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Owner: {appt.ownerName} • {new Date(appt.appointmentDate).toLocaleString()}
                      </div>
                    </div>
                    <span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Pets Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dog size={20} color="var(--secondary)" />
                Pet Profiles
              </h3>
              <Link to="/pets" style={{ fontSize: '0.82rem', color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none' }}>
                Manage Gallery
              </Link>
            </div>

            {recentPets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No pets registered yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {recentPets.map((pet) => (
                  <div
                    key={pet.id}
                    style={{
                      padding: '12px',
                      background: 'rgba(15,23,42,0.4)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'; }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pet.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pet.breed || pet.species} • {pet.age} yrs</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

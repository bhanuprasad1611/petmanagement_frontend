import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Modal } from '../components/Modal';
import { appointmentApi } from '../api/appointmentApi';
import { petApi } from '../api/petApi';
import { serviceApi } from '../api/serviceApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, Plus, CheckCircle, Clock, XCircle, AlertCircle, User, Stethoscope } from 'lucide-react';

export const Appointments = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    petId: '',
    serviceName: 'Comprehensive Health Examination',
    appointmentDate: '',
    reason: '',
  });

  const fetchData = async () => {
    try {
      const [apptsRes, petsRes, servicesRes] = await Promise.all([
        appointmentApi.getAll(),
        petApi.getAll(),
        serviceApi.getPublic(),
      ]);
      setAppointments(apptsRes.data);
      setPets(petsRes.data);
      setServices(servicesRes.data);
      if (petsRes.data.length > 0) {
        setFormData((prev) => ({ ...prev, petId: petsRes.data[0].id }));
      }
    } catch (err) {
      showToast('Error loading appointments data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.petId) {
      showToast('Please select a pet for the appointment', 'error');
      return;
    }

    try {
      await appointmentApi.create({
        petId: parseInt(formData.petId),
        serviceName: formData.serviceName,
        appointmentDate: formData.appointmentDate || new Date(Date.now() + 86400000).toISOString(),
        reason: formData.reason,
      });
      showToast('Appointment requested successfully!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Failed to schedule appointment', 'error');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentApi.updateStatus(id, newStatus, user.role === 'ROLE_VET' ? user.id : null);
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update appointment status', 'error');
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <div>
      <Navbar title="Appointment Management & Scheduling" />

      <div className="content-body">
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                {st}
              </button>
            ))}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={18} /> Schedule Appointment
          </button>
        </div>

        {/* Appointments List Table */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading appointments schedule...</div>
          ) : filteredAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Calendar size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3>No Appointments Found</h3>
              <p>Schedule a visit to connect with a veterinarian.</p>
            </div>
          ) : (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Pet & Species</th>
                    <th>Service Requested</th>
                    <th>Owner</th>
                    <th>Assigned Vet</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td style={{ fontWeight: 600 }}>
                        {new Date(appt.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary)' }}>{appt.petName}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({appt.petSpecies})</span>
                      </td>
                      <td>{appt.serviceName}</td>
                      <td>{appt.ownerName}</td>
                      <td>{appt.vetName ? `Dr. ${appt.vetName}` : <span style={{ color: 'var(--text-dim)' }}>Unassigned</span>}</td>
                      <td>
                        <span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {user.role !== 'ROLE_OWNER' && appt.status === 'PENDING' && (
                            <button
                              onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#38bdf8', fontSize: '0.75rem' }}
                            >
                              Confirm
                            </button>
                          )}
                          {user.role !== 'ROLE_OWNER' && appt.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#34d399', fontSize: '0.75rem' }}
                            >
                              Complete
                            </button>
                          )}
                          {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusUpdate(appt.id, 'CANCELLED')}
                              className="btn btn-danger btn-sm"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Schedule Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Schedule Pet Consultation"
        >
          <form onSubmit={handleCreateSubmit}>
            <div className="form-group">
              <label>Select Pet *</label>
              <select
                className="form-input"
                required
                value={formData.petId}
                onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} - {p.breed || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Service Required *</label>
              <select
                className="form-input"
                required
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              >
                {services.length > 0 ? (
                  services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title} (${s.price})
                    </option>
                  ))
                ) : (
                  <option value="Comprehensive Health Examination">Comprehensive Health Examination ($49.99)</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Date & Time *</label>
              <input
                type="datetime-local"
                required
                className="form-input"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Reason for Visit / Symptoms</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="Describe any symptoms or specific questions..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Confirm Booking
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

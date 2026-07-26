import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Modal } from '../components/Modal';
import { medicalApi } from '../api/medicalApi';
import { petApi } from '../api/petApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FileText, Plus, Stethoscope, Syringe, Calendar, CheckCircle2 } from 'lucide-react';

export const MedicalRecords = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedPetFilter, setSelectedPetFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    petId: '',
    visitDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    vaccineName: '',
    nextDueDate: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [recordsRes, petsRes] = await Promise.all([
        medicalApi.getAll(),
        petApi.getAll(),
      ]);
      setRecords(recordsRes.data);
      setPets(petsRes.data);
      if (petsRes.data.length > 0) {
        setFormData((prev) => ({ ...prev, petId: petsRes.data[0].id }));
      }
    } catch (err) {
      showToast('Failed to load medical records history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.petId) {
      showToast('Please select a pet', 'error');
      return;
    }

    try {
      await medicalApi.create({
        ...formData,
        petId: parseInt(formData.petId),
      });
      showToast('Medical record entry saved!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Error saving medical record', 'error');
    }
  };

  const filteredRecords = records.filter((r) => {
    if (selectedPetFilter === 'ALL') return true;
    return r.petId === parseInt(selectedPetFilter);
  });

  return (
    <div>
      <Navbar title="Medical & Vaccination Records" />

      <div className="content-body">
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter by Pet:</label>
            <select
              className="form-input"
              style={{ width: '220px' }}
              value={selectedPetFilter}
              onChange={(e) => setSelectedPetFilter(e.target.value)}
            >
              <option value="ALL">All Pets</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species})
                </option>
              ))}
            </select>
          </div>

          {(user.role === 'ROLE_VET' || user.role === 'ROLE_ADMIN') && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={18} /> New Medical Diagnosis
            </button>
          )}
        </div>

        {/* Medical History Timeline */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading medical history...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <FileText size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <h3>No Medical Records Found</h3>
            <p>Clinical visit notes and vaccination logs will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredRecords.map((rec) => (
              <div key={rec.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(6,182,212,0.15)', color: 'var(--primary)' }}>
                      <Stethoscope size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{rec.petName} - Clinical Visit</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Attending Vet: <strong>Dr. {rec.vetName || 'System Vet'}</strong> • Date: <strong>{rec.visitDate}</strong>
                      </div>
                    </div>
                  </div>

                  {rec.vaccineName && (
                    <span className="badge badge-confirmed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Syringe size={14} /> Vaccine: {rec.vaccineName}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Diagnosis & Evaluation</div>
                    <p style={{ marginTop: '0.25rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>{rec.diagnosis}</p>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prescribed Treatment</div>
                    <p style={{ marginTop: '0.25rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>{rec.treatment || 'N/A'}</p>
                  </div>
                </div>

                {(rec.nextDueDate || rec.notes) && (
                  <div style={{ background: 'rgba(15,23,42,0.4)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem' }}>
                    {rec.nextDueDate && (
                      <div style={{ color: 'var(--accent-amber)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} /> Next Vaccine Booster Due: {rec.nextDueDate}
                      </div>
                    )}
                    {rec.notes && <div style={{ color: 'var(--text-muted)' }}>Notes: {rec.notes}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Medical Record Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Medical & Vaccination Entry"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Target Pet *</label>
              <select
                className="form-input"
                required
                value={formData.petId}
                onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} - {p.ownerName})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Visit Date *</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Diagnosis & Clinical Findings *</label>
              <textarea
                required
                className="form-input"
                rows="3"
                placeholder="Enter clinical assessment details..."
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Prescribed Treatment / Medication</label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="Medication dosage and instructions..."
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              ></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Vaccine Administered (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rabies Booster"
                  value={formData.vaccineName}
                  onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Next Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Veterinary Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder="Follow-up instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Save Medical Record
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

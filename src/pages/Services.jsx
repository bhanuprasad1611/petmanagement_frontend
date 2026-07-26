import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Modal } from '../components/Modal';
import { serviceApi } from '../api/serviceApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Stethoscope, Plus, Clock, DollarSign, CheckCircle2, Edit3, Trash2 } from 'lucide-react';

export const Services = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Clinical',
    description: '',
    price: '',
    durationMinutes: '30',
    available: true,
  });

  const fetchServices = async () => {
    try {
      const res = await serviceApi.getAll();
      setServices(res.data);
    } catch (err) {
      showToast('Failed to load services catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (srv = null) => {
    if (srv) {
      setEditingService(srv);
      setFormData({
        title: srv.title || '',
        category: srv.category || 'Clinical',
        description: srv.description || '',
        price: srv.price || '',
        durationMinutes: srv.durationMinutes || '30',
        available: srv.available ?? true,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        category: 'Clinical',
        description: '',
        price: '',
        durationMinutes: '30',
        available: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes),
      };

      if (editingService) {
        await serviceApi.update(editingService.id, payload);
        showToast('Service package updated!', 'success');
      } else {
        await serviceApi.create(payload);
        showToast('New service package added!', 'success');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      showToast('Error saving service details', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service package?')) return;
    try {
      await serviceApi.delete(id);
      showToast('Service deleted from catalog', 'success');
      fetchServices();
    } catch (err) {
      showToast('Failed to delete service', 'error');
    }
  };

  return (
    <div>
      <Navbar title="Care Services & Packages" />

      <div className="content-body">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Clinical Services Catalog</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Browse veterinary procedures, grooming options, and health care packages</p>
          </div>

          {(user.role === 'ROLE_ADMIN' || user.role === 'ROLE_VET') && (
            <button onClick={() => handleOpenModal()} className="btn btn-primary">
              <Plus size={18} /> Add New Service
            </button>
          )}
        </div>

        {/* Services Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading clinical services...</div>
        ) : (
          <div className="grid-cards">
            {services.map((srv) => (
              <div key={srv.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-vet">{srv.category}</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${srv.price.toFixed(2)}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>{srv.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{srv.description}</p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    <Clock size={16} color="var(--primary)" />
                    <span>Duration: {srv.durationMinutes} mins</span>
                  </div>

                  {(user.role === 'ROLE_ADMIN' || user.role === 'ROLE_VET') && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleOpenModal(srv)} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
                        <Edit3 size={15} color="#38bdf8" />
                      </button>
                      <button onClick={() => handleDelete(srv.id)} className="btn btn-danger btn-sm" style={{ padding: '6px' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingService ? 'Edit Service Package' : 'Create New Service'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Title *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Dental Scaling"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Clinical">Clinical</option>
                  <option value="Preventative">Preventative</option>
                  <option value="Grooming">Grooming</option>
                  <option value="Dental">Dental</option>
                  <option value="Boarding">Boarding</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="form-input"
                  placeholder="49.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Duration (Minutes)</label>
              <input
                type="number"
                className="form-input"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {editingService ? 'Update Service' : 'Add to Catalog'}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

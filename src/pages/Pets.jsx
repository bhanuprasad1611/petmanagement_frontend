import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Modal } from '../components/Modal';
import { petApi } from '../api/petApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Dog, Plus, Search, Trash2, Edit3, Shield, Info } from 'lucide-react';

export const Pets = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    microchipId: '',
    photoUrl: '',
    notes: '',
  });

  const fetchPets = async () => {
    try {
      const res = await petApi.getAll();
      setPets(res.data);
    } catch (err) {
      showToast('Failed to load pets list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleOpenModal = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setFormData({
        name: pet.name || '',
        species: pet.species || 'Dog',
        breed: pet.breed || '',
        age: pet.age || '',
        gender: pet.gender || 'Male',
        weight: pet.weight || '',
        microchipId: pet.microchipId || '',
        photoUrl: pet.photoUrl || '',
        notes: pet.notes || '',
      });
    } else {
      setEditingPet(null);
      setFormData({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        weight: '',
        microchipId: '',
        photoUrl: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      if (editingPet) {
        await petApi.update(editingPet.id, payload);
        showToast('Pet profile updated successfully!', 'success');
      } else {
        await petApi.create(payload);
        showToast('New pet profile created!', 'success');
      }
      setIsModalOpen(false);
      fetchPets();
    } catch (err) {
      showToast('Error saving pet details', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet profile?')) return;
    try {
      await petApi.delete(id);
      showToast('Pet profile removed', 'success');
      fetchPets();
    } catch (err) {
      showToast('Failed to delete pet', 'error');
    }
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecies = speciesFilter === 'ALL' || pet.species.toLowerCase() === speciesFilter.toLowerCase();
    return matchesSearch && matchesSpecies;
  });

  return (
    <div>
      <Navbar title="Pet Gallery & Management" />

      <div className="content-body">
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by pet name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>

            <select
              className="form-input"
              style={{ width: '150px' }}
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            >
              <option value="ALL">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <Plus size={18} /> Register New Pet
          </button>
        </div>

        {/* Pet Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading pets gallery...</div>
        ) : filteredPets.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Dog size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <h3>No Pets Found</h3>
            <p>Register a pet profile to begin tracking medical records and appointments.</p>
          </div>
        ) : (
          <div className="grid-cards">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
                  <img
                    src={pet.photoUrl}
                    alt={pet.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'; }}
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleOpenModal(pet)} className="btn btn-secondary btn-sm" style={{ padding: '6px', borderRadius: '50%', background: 'rgba(15,23,42,0.8)' }}>
                      <Edit3 size={15} color="#38bdf8" />
                    </button>
                    <button onClick={() => handleDelete(pet.id)} className="btn btn-danger btn-sm" style={{ padding: '6px', borderRadius: '50%', background: 'rgba(244,63,94,0.8)' }}>
                      <Trash2 size={15} color="#fff" />
                    </button>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{pet.name}</h3>
                      <span className="badge badge-vet">{pet.species}</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '0.75rem 0' }}>
                      <div> Breed: <strong style={{ color: 'var(--text-main)' }}>{pet.breed || 'N/A'}</strong></div>
                      <div> Age: <strong style={{ color: 'var(--text-main)' }}>{pet.age ? `${pet.age} yrs` : 'N/A'}</strong></div>
                      <div> Gender: <strong style={{ color: 'var(--text-main)' }}>{pet.gender}</strong></div>
                      <div> Weight: <strong style={{ color: 'var(--text-main)' }}>{pet.weight ? `${pet.weight} kg` : 'N/A'}</strong></div>
                    </div>

                    {pet.microchipId && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'rgba(6,182,212,0.1)', padding: '6px 10px', borderRadius: '6px', marginBottom: '0.75rem' }}>
                        Microchip: <strong>{pet.microchipId}</strong>
                      </div>
                    )}

                    {pet.notes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        "{pet.notes}"
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Owner: {pet.ownerName || 'Self'}</span>
                    <span>ID: #{pet.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Pet Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPet ? `Edit Pet: ${editingPet.name}` : 'Register New Pet'}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Pet Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Species *</label>
                <select
                  className="form-input"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Reptile">Reptile</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Breed</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Golden Retriever"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Age (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 3"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Gender</label>
                <select
                  className="form-input"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 14.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Microchip ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 985141002341902"
                value={formData.microchipId}
                onChange={(e) => setFormData({ ...formData, microchipId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Photo Image URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Special Notes & Dietary Allergies</label>
              <textarea
                className="form-input"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {editingPet ? 'Save Changes' : 'Register Pet'}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

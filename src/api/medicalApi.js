import api from './axios';

export const medicalApi = {
  getAll: () => api.get('/medical-records'),
  getByPet: (petId) => api.get(`/medical-records/pet/${petId}`),
  create: (data) => api.post('/medical-records', data),
};

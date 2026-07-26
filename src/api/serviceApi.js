import api from './axios';

export const serviceApi = {
  getPublic: () => api.get('/services/public'),
  getAll: () => api.get('/services'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

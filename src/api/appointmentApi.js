import api from './axios';

export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, status, vetId) => {
    let url = `/appointments/${id}/status?status=${status}`;
    if (vetId) url += `&vetId=${vetId}`;
    return api.patch(url);
  },
  delete: (id) => api.delete(`/appointments/${id}`),
};

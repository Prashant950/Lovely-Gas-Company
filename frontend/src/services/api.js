import api from '../api/axios'

// ---- Auth ----
export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data), // { token, user }
  me: () => api.get('/auth/me').then((r) => r.data.user),
  updateProfile: (payload) => api.put('/auth/profile', payload).then((r) => r.data),
}

// ---- Services ----
export const serviceApi = {
  // Public: active services only. Pass { all: true } for admin (includes inactive).
  list: (opts = {}) =>
    api
      .get('/services', { params: opts.all ? { all: 'true' } : {} })
      .then((r) => r.data.services),
  get: (id) => api.get(`/services/${id}`).then((r) => r.data.service),
  create: (payload) => api.post('/services', payload).then((r) => r.data.service),
  update: (id, payload) =>
    api.put(`/services/${id}`, payload).then((r) => r.data.service),
  remove: (id) => api.delete(`/services/${id}`).then((r) => r.data),
}

// ---- Users (admin) ----
export const userApi = {
  list: () => api.get('/users').then((r) => r.data.users),
  get: (id) => api.get(`/users/${id}`).then((r) => r.data.user),
  create: (payload) => api.post('/users', payload).then((r) => r.data.user),
  update: (id, payload) => api.put(`/users/${id}`, payload).then((r) => r.data.user),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data),
}

// ---- Inquiries ----
export const inquiryApi = {
  create: (payload) => api.post('/inquiries', payload).then((r) => r.data), // { inquiry, message }
  my: () => api.get('/inquiries/my').then((r) => r.data.inquiries),
  list: () => api.get('/inquiries').then((r) => r.data.inquiries),
  update: (id, payload) =>
    api.put(`/inquiries/${id}`, payload).then((r) => r.data.inquiry),
  remove: (id) => api.delete(`/inquiries/${id}`).then((r) => r.data),
}

// ---- Stats (admin dashboard) ----
export const statsApi = {
  get: () => api.get('/stats').then((r) => r.data.stats),
}

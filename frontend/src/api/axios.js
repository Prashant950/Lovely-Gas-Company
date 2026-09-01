import axios from 'axios'

const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  url = url.trim().replace(/\/+$/, '')
  if (!url.endsWith('/api')) {
    url += '/api'
  }
  return url
}

// Central axios instance. Base URL points at the Express API.
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
})

const TOKEN_KEY = 'lgc_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

// Attach JWT (if present) to every request.
api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor returns the FULL response; service methods unwrap `.data`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    // Auto-logout on expired/invalid token, except on the login call itself.
    const isLoginCall = error?.config?.url?.includes('/auth/login')
    if (status === 401 && !isLoginCall) {
      tokenStore.clear()
      if (window.location.pathname.startsWith('/admin')) {
        window.location.assign('/admin/login')
      }
    }
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

export default api

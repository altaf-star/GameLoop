import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT from localStorage to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 so an expired/orphaned token doesn't leave the user
// stuck in a broken "authenticated" state. Redirects to /login with a flag
// the login page can read to show "Your session expired — please sign in again."
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const url = err.config?.url || '';
      // Don't bounce from the login/register calls themselves — those legitimately
      // return 401 for bad credentials and the page handles the message inline.
      const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');
      if (hadToken && !isAuthCall && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(err);
  },
);

export default api;

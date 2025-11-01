import axios from "axios";
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // dari .env.local
  timeout: 10000, // 10 detik
});

api.interceptors.request.use((config) => {
  // Jangan kirim Authorization hanya untuk endpoint login
  const url = config.url || '';
  const isLoginEndpoint = url.includes('/auth/login');
  if (!isLoginEndpoint) {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

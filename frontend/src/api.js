import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:5001/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const fetchVerifyMe = () => API.get('/auth/verify-me');
export const updatePreferences = (data) => API.put('/auth/preferences', data);

export const fetchProducts = (params) => API.get('/products', { params });
export const addProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const fetchDashboard = () => API.get('/dashboard');
export const fetchAIInsights = () => API.get('/dashboard/insights');

export const createOrder = (data) => API.post('/orders', data);
export const fetchOrders = () => API.get('/orders');

export const downloadReport = () => API.get('/reports/csv', { responseType: 'blob' });

export default API;

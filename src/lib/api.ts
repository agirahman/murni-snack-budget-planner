import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menyisipkan token ke setiap request
api.interceptors.request.use(
    (config) => {
        // Pastikan kode ini hanya jalan di client-side (browser)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor response untuk handle error global (misal 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token tidak valid atau kadaluarsa
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // Redirect ke login tanpa refresh halaman (opsional, tapi window.location lebih aman untuk reset state)
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// src/services/apiClient.js

const API_BASE_URL = 'http://localhost:8000/api';

export const apiClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // SDD CA-01.3: Without token or invalid token -> 401
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    }

    // SDD CA-01.3: Insufficient role -> 403
    if (response.status === 403) {
        console.error('Forbidden: Insufficient role to perform this action.');
    }

    return response;
};
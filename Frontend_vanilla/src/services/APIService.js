const API_BASE_URL = 'http://localhost:3000/v1';

const fetchApi = async (endpoint, options = {}) => {
    options.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const token = localStorage.getItem('authToken');
    if (token) {
        options.headers['Authorization'] = `Hc ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = response.status === 204 ? null : await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Error ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Error en la llamada API:", error.message);
        throw error;
    }
};

export const APIService = {
    getProducts: async () => await fetchApi('/products'),
    getCategories: async () => await fetchApi('/categories'),
    
    register: async (userData) => {
        return await fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    login: async (credentials) => {
        return await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },
    createReservation: async (reservationData) => {
        return await fetchApi('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData),
        });
    },

    getReservationHistory: async () => {
        return await fetchApi('/reservations/history');
    },

    createOrder: async (orderDetails) => {
        return await fetchApi('/orders', {
            method: 'POST',
            body: JSON.stringify({ details: orderDetails }),
        });
    },
    getPublications: async () => await fetchApi('/publications'),
    
    getPublicationById: async (id) => await fetchApi(`/publications/${parseInt(id)}`),

    createPublication: async (publicationData) => {
        return await fetchApi('/publications', {
            method: 'POST',
            body: JSON.stringify(publicationData),
        });
    },

    updatePublication: async (id, publicationData) => {
        return await fetchApi(`/publications/${parseInt(id)}`, {
            method: 'PUT',
            body: JSON.stringify(publicationData),
        });
    },

    deletePublication: async (id) => {
        return await fetchApi(`/publications/${parseInt(id)}`, {
            method: 'DELETE',
        });
    },

    likePublication: async (publicationId) => {
        return await fetchApi(`/publications/${parseInt(publicationId)}/like`, {
            method: 'POST',
        });
    },

    unlikePublication: async (publicationId) => {
        return await fetchApi(`/publications/${parseInt(publicationId)}/like`, {
            method: 'DELETE',
        });
    }
};
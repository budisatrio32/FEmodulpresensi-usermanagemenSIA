
import api from './axios';

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise} Response data dari login
 */
export const login = async (email, password) => {
	try {
		const response = await api.post('/auth/login', { email, password });
		return response.data;
	} catch (error) {
		// Lempar error ke pemanggil
		throw error;
	}
};

export default {
	login,
};

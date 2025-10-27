
import api from './axios';

/**
 * authorization: Bearer <token>
 * @returns {Promise} Response dengan data statistik
 */
export const hasPermission = (roles) => {
  const userRole = localStorage.getItem('roles');
  return roles.includes(userRole);
};

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
    hasPermission,
	login,
};

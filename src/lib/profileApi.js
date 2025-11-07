import api from './axios';

/**
 * ambil data profil user berdasarkan token yang tersimpan di cookie
 * @returns {Promise<{status: string, user: {name: string, roles: array}}>} data user atau status gagal
 */
export const getProfileNav = async () => {
  try {
    const response = await api.get('/auth/user-info');
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error)
  }
};
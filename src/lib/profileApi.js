import api from './axios';

/**
 * ambil data profil user berdasarkan token yang tersimpan di cookie
 * @returns {Promise<*>} data user atau status gagal
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error)
  }
};
/**
 * ambil data profile staff
 */
export const getStaffProfile = async () => {
  try {
    const response = await api.get('/profile/staff');
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error)
  }
};

export default {
    getProfile,
    getStaffProfile,
};
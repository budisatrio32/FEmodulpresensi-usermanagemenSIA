import api from './axios';

/**
 * Admin API Services
 * Semua endpoint khusus untuk Admin Dashboard
 */

/**
 * Get dashboard statistics (Total Mata Kuliah, Mahasiswa, Dosen, Kelas)
 * @returns {Promise} Response dengan data statistik
 */
export const getDashboardStatistics = async () => {
  try {
    const response = await api.get('/admin/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    throw error;
  }
};

/**
 * Get detailed statistics (untuk data lebih lengkap - optional)
 * @returns {Promise} Response dengan data statistik detail
 */
export const getDetailedStatistics = async () => {
  try {
    const response = await api.get('/admin/statistics/detailed');
    return response.data;
  } catch (error) {
    console.error('Error fetching detailed statistics:', error);
    throw error;
  }
};

/**
 * Get all managers
 * @returns {Promise} Response dengan data managers
 */
export const getManagers = async () => {
  try {
    const response = await api.get('/admin/managers');
    return response.data;
  } catch (error) {
    console.error('Error fetching managers:', error);
    throw error;
  }
};

/**
 * Create new manager
 * @param {Object} managerData - Data manager baru
 * @returns {Promise} Response hasil create
 */
export const createManager = async (managerData) => {
  try {
    const response = await api.post('/admin/managers', managerData);
    return response.data;
  } catch (error) {
    console.error('Error creating manager:', error);
    throw error;
  }
};

/**
 * Delete manager
 * @param {number} managerId - ID manager yang akan dihapus
 * @returns {Promise} Response hasil delete
 */
export const deleteManager = async (managerId) => {
  try {
    const response = await api.delete(`/admin/managers/${managerId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting manager:', error);
    throw error;
  }
};

export default {
  getDashboardStatistics,
  getDetailedStatistics,
  getManagers,
  createManager,
  deleteManager,
};

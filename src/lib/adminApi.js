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
    const response = await api.get('/manager/statistics');
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
    const response = await api.get('/manager/statistics/detailed');
    return response.data;
  } catch (error) {
    console.error('Error fetching detailed statistics:', error);
    throw error;
  }
};

/**
 * Get all programs
 * @returns {Promise} Response dengan data programs
 */
export const getPrograms = async () => {
  try {
    const response = await api.get('/manager/programs');
    return response.data;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
};

/**
 * Get all subjects
 * @returns {Promise} Response dengan data subjects
 */
export const getSubjects = async () => {
  try {
    const response = await api.get('/manager/subjects');
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};
/**
 * Store new subject
 * @param {Object} subjectData - Data mata kuliah baru
 * @returns {Promise} Response hasil create
 */
export const storeSubject = async (subjectData) => {
  try {
    const response = await api.post('/manager/subjects', subjectData);
    return response.data;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

/**
 * Get all classes
 * @returns {Promise} Response dengan data kelas
 */
export const getClasses = async () => {
  try {
    const response = await api.get('/manager/classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
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
export const storeManager = async (managerData) => {
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
/**
 * Get all dosen
 * @returns {Promise} Response dengan data dosen
 */
export const getDosen = async () => {
  try {
    const response = await api.get('/manager/users-by-role', {
      params: { role: 'dosen' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dosen:', error);
    throw error;
  }
};
/**
 * Tambah dosen baru
 * @param {Object} dosenData - Data dosen baru
 * @returns {Promise} Response hasil create
 */
export const storeDosen = async (dosenData) => {
  try {
    const response = await api.post('/manager/lecturers', dosenData);
    return response.data;
  } catch (error) {
    console.error('Error creating dosen:', error);
    throw error;
  }
};

export default {
  getDashboardStatistics,
  getDetailedStatistics,
  getPrograms,
  getManagers,
  storeManager,
  deleteManager,
  getSubjects,
  storeSubject,
  getClasses,
  getDosen,
  storeDosen,
};

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
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
  }
};

/**
 * Ambil detail matkul dari id untuk load data ke form edit
 * @param {number} subjectId - id matkul
 * @returns {Promise} Response dengan data subject
 */
export const getSubjectById = async (subjectId) => {
  try {
    const response = await api.get(`/manager/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error);
  }
};

/**
 * Update matkul yang ada
 * @param {number} subjectId - id matkul yang akan diupdate
 * @param {Object} subjectData - Data matkul yang diupdate
 * @returns {Promise} Response hasil update
 */
export const updateSubject = async (subjectId, subjectData) => {
  try {
    const response = await api.put(`/manager/subjects/${subjectId}`, subjectData);
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error);
  }
};

/**
 * Get all academic periods
 * @returns {Promise} Response dengan data academic periods
 */
export const getAcademicPeriods = async () => {
  try {
    const response = await api.get('/manager/academic-periods');
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
  }
};

/**
 * Store new class
 * @param {Object} classData - Data kelas baru
 * @returns {Promise} Response hasil create
 */
export const storeClass = async (classData) => {
  try {
    const response = await api.post('/manager/classes', classData);
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
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
    throw (error.response?.data ?? error);
  }
};

/**
 * Get all mahasiswa
 * @returns {Promise} Response dengan data mahasiswa
 */
export const getMahasiswa = async () => {
  try {
    const response = await api.get('/manager/users-by-role', {
      params: { role: 'mahasiswa' }
    });
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error);
  }
};
/**
 * Store mahasiswa baru
 * @param {Object} mahasiswaData - Data mahasiswa baru
 * @returns {Promise} Response hasil create
 */
export const storeMahasiswa = async (mahasiswaData) => {
  try {
    const response = await api.post('/manager/students', mahasiswaData);
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error);
  }
};

/**
 * Ubah status aktif/non-aktif user (Mahasiswa/Dosen)
 * Dapat diakses oleh Admin dan Manager
 * @param {number} userId - ID user yang akan diubah statusnya
 * @returns {Promise} Response hasil update
 */
export const toggleUserStatus = async (userId) => {
  try {
    const response = await api.patch(`/manager/users/${userId}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw (error.response?.data ?? error);
  }
};

/**
 * Ubah status aktif/non-aktif manager
 * Hanya dapat diakses oleh Admin
 * @param {number} managerId - ID manager yang akan diubah statusnya
 * @returns {Promise} Response hasil update
 */
export const toggleManagerStatus = async (managerId) => {
  try {
    const response = await api.patch(`/admin/managers/${managerId}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error("Error toggling manager status:", error);
    throw (error.response?.data ?? error);
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
  getSubjectById,
  updateSubject,
  getClasses,
  getDosen,
  storeDosen,
  getMahasiswa,
  storeMahasiswa,
  toggleUserStatus,
  toggleManagerStatus,
};

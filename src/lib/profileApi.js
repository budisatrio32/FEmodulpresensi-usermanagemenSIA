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
 * @returns {Promise<*>} data user atau status gagal
 */
export const getStaffProfile = async () => {
  try {
    const response = await api.get('/profile/staff');
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error)
  }
};

/**
 * edit data profile staff
 * @param {Object} data data profile yang akan diubah
 * @returns {Promise<*>} data user atau status gagal
 */
export const updateStaffProfile = async (data) => {
  try {
    let payload = data;
    if (data && (data.profile_image instanceof File || data.profile_image instanceof Blob)) {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === 'profile_image') {
          if (value instanceof File || value instanceof Blob) {
            formData.append('profile_image', value);
          }
        } else {
          formData.append(key, value);
        }
      });

      payload = formData;
    }
    const response = await api.post('/profile/staff', payload);
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error)
  }
};

/**
 * ambil data profile umum mahasiswa
 * @returns {Promise<*>} data user atau status gagal
 */
export const getStudentProfile = async () => {
  try {
    const response = await api.get('/student/profile/identity');
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error)
  }
};

/**
 * ambil data alamat mahasiswa
 * @returns {Promise<*>} data user atau status gagal
 */
export const getStudentAddress = async () => {
  try {
    const response = await api.get('/student/profile/address');
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error)
  }
};

/**
 * ambil data keluarga & pendidikan mahasiswa
 * @returns {Promise<*>} data user atau status gagal
 */
export const getStudentFamilyEducation = async () => {
  try {
    const response = await api.get('/student/profile/family-education');
    return response.data;
  } catch (error) {
    throw (error.response?.data ?? error)
  }
};

export default {
    getProfile,
    getStaffProfile,
    updateStaffProfile,
    getStudentProfile,
    getStudentAddress,
    getStudentFamilyEducation,
};
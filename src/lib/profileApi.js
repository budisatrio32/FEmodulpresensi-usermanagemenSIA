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
    getStudentProfile,
    getStudentAddress,
    getStudentFamilyEducation,
};
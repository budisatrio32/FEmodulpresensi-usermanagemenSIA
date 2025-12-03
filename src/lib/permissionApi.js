import api from "./axios";

/**
 * permissionApi.js
 * Semua fungsi terkait permission API
 */

/**
 * Get permission for a specific class
 * @param {string} classId - ID of the class
 * @returns {Promise} Response dengan data permission
 */
export const getPermissionForAClass = async (classId) => {
    try {
        const response = await api.get(`lecturer/classes/${classId}/permission`);
        return response.data;
    } catch (error) {
        throw (error.response?.data ?? error);
    }
};
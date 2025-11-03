import api from "./axios";

/**
 * Class API Services
 * Semua endpoint khusus untuk Class Management
 */

/**
 * Get all classes
 * @returns {Promise} Response dengan data classes
 */
export const getAllClasses = async () => {
    try {
        const response = await api.get("manager/classes");
        return response.data;
    } catch (error) {
        throw (error.response?.data ?? error);
    }
};

/** 
 * Toggle status aktif/non-aktif kelas
 */
export const toggleClassStatus = async (classId) => {
    try {
        const response = await api.patch(`manager/classes/${classId}/toggle-status`);
        return response.data;
    } catch (error) {
        console.error("Error toggling class status:", error);
        throw (error.response?.data ?? error);
    }
};

export default {
    getAllClasses,
};
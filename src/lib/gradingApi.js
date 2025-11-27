import api from "./axios";

/**
 * Semua fungsi terkait grading nilai
 */

/**
// ...existing code...

/**
 * Get academic periods/semesters
 * @returns {Promise} Response dengan data periode akademik
 */
export const getAcademicPeriods = async () => {
    try {
        const response = await api.get('/academic-periods');
        return response.data;
    } catch (error) {
        throw (error.response?.data ?? error);
    }
};

/**
 * Get student grades by semester
 * @param {string} semesterId - ID semester/periode akademik (optional)
 * @returns {Promise} Response dengan data nilai mahasiswa
 */
export const getStudentGrades = async (semesterId = null) => {
    try {
        const params = {};
        if (semesterId) {
            params.id_academic_period = semesterId;
        }
        
        const response = await api.get(`/student/grades`, { params });
        return response.data;
    } catch (error) {
        throw (error.response?.data ?? error);
    }
};

/**
 * Get student grade detail by class
 * @param {string} classId - ID kelas
 * @returns {Promise} Response dengan detail nilai mata kuliah
 */
export const getStudentGradeDetail = async (classId) => {
    try {
        const response = await api.get(`/student/classes/${classId}/grades`);
        return response.data;
    } catch (error) {
        throw (error.response?.data ?? error);
    }
};

/**
 * Download transcript PDF
 * @param {string} academicPeriodId - ID periode akademik
 * @returns {Promise} Blob PDF file
 */
export const downloadTranscriptPDF = async (academicPeriodId) => {
    try {
        const response = await api.get(`/student/transcript/${academicPeriodId}/pdf`, {
            responseType: 'blob', // Important: untuk file download
        });
        return response;
    } catch (error) {
        throw (error.response?.data ?? error);
    }
};
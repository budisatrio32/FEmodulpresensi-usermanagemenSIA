import api from './axios';

/**
 * Attendance API Module
 * Handles all attendance-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ========================================
// LECTURER ATTENDANCE APIS
// ========================================

/**
 * Get all classes for authenticated lecturer
 * @returns {Promise} - Classes data
 */
export async function getLecturerClasses(academicPeriodId = '') {
    const url = academicPeriodId 
        ? `/lecturer/classes/attendance-list?id_academic_period=${academicPeriodId}`
        : `/lecturer/classes/attendance-list`;
    
    const response = await api.get(url);
    return response.data;
}

/**
 * Get class detail with students and schedules
 * @param {number} classId - The class ID
 * @returns {Promise} - Class detail data
 */
export const getClassDetail = async (classId) => {
    const response = await api.get(`/lecturer/classes/${classId}`);
    return response.data;
};

/**
 * Open QR attendance session
 * @param {number} scheduleId - The schedule ID
 * @returns {Promise} - QR session data
 */
export const openQRSession = async (scheduleId) => {
    const response = await api.post(`/lecturer/schedules/${scheduleId}/open-qr`);
    return response.data;
};

/**
 * Get active QR code for a schedule
 * @param {number} scheduleId - The schedule ID
 * @returns {Promise} - Active QR data
 */
export const getActiveQR = async (scheduleId) => {
    const response = await api.get(`/lecturer/schedules/${scheduleId}/qr`);
    return response.data;
};

/**
 * Send manual attendance (lecturer marks students)
 * @param {number} scheduleId - The schedule ID
 * @param {Array} studentIds - Array of student IDs
 * @returns {Promise} - Success response
 */
export const sendManualAttendance = async (scheduleId, studentIds) => {
    const response = await api.post(`/lecturer/schedules/${scheduleId}/presences`, {
        student_ids: studentIds
    });
    return response.data;
};

/**
 * Close attendance session
 * @param {number} scheduleId - The schedule ID
 * @returns {Promise} - Success response
 */
export const closeAttendanceSession = async (scheduleId) => {
    const response = await api.post(`/lecturer/schedules/${scheduleId}/close`);
    return response.data;
};

// ========================================
// STUDENT ATTENDANCE APIS
// ========================================

/**
 * Get student's classes
 * @returns {Promise} - Student classes data
 */
export const getStudentClasses = async () => {
    const response = await api.get('/student/classes');
    return response.data;
};

/**
 * Get student attendance history for a class
 * @param {number} studentId - The student ID
 * @param {number} classId - The class ID
 * @returns {Promise} - Attendance history data
 */
export const getAttendanceHistory = async (studentId, classId) => {
    const response = await api.get(`/student/${studentId}/classes/${classId}/attendances`);
    return response.data;
};

/**
 * Scan QR code for attendance
 * @param {string} key - The QR code key
 * @param {number} studentId - The student ID
 * @returns {Promise} - Scan result
 */
export const scanQRAttendance = async (key, studentId) => {
    const response = await api.post('/student/attendances/scan', {
        key,
        id_student: studentId
    });
    return response.data;
};

// ========================================
// ACADEMIC PERIODS API
// ========================================

/**
 * Get all academic periods
 * @returns {Promise} - Academic periods data
 */
export const getAcademicPeriods = async () => {
    const response = await api.get('/academic-periods');
    return response.data;
};

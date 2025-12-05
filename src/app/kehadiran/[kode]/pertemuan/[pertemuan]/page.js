'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getClassDetail, sendManualAttendance, getPresencesBySchedule, deletePresence } from '@/lib/attendanceApi';
import { getPermissionForAScheduleInAClass } from '@/lib/permissionApi';
import { ErrorMessageBoxWithButton } from '@/components/ui/message-box';
import { AlertConfirmationDialog, AlertSuccessDialog, AlertErrorDialog } from '@/components/ui/alert-dialog';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import { ArrowLeft, CalendarDays, Save, QrCode } from 'lucide-react';
import { PrimaryButton, WarningButton } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Footer from '@/components/ui/footer';
import LoadingEffect from '@/components/ui/loading-effect';

export default function InputPresensiPage() {
    const router = useRouter();
    const params = useParams();
    const id_schedule = params.pertemuan;
    const id_class = params.kode;

    // State management
    const [mahasiswaData, setMahasiswaData] = useState([]);
    const [originalAttendance, setOriginalAttendance] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [permissionChecked, setPermissionChecked] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(null);
    const [loadingPermission, setLoadingPermission] = useState(true);
    const [countdown, setCountdown] = useState(5);
    const [classInfo, setClassInfo] = useState({
        code_subject: '-',
        name_subject: '-',
        code_class: '-',
        dosen: '-'
    });
    const [scheduleInfo, setScheduleInfo] = useState({
        pertemuanke: '-',
        date: '',
    });
    const [statistics, setStatistics] = useState({
        total_students: 0,
        present_students: 0,
        absent_students: 0
    });
    const [errors, setErrors] = useState({});

    // Alert states
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);

    // Check permission on mount
    useEffect(() => {
        if (id_class) {
            checkPermission();
        }
    }, [id_class]);

    // Fetch data after permission is granted
    useEffect(() => {
        if (permissionChecked && permissionGranted) {
            fetchAllData();
        }
    }, [permissionChecked, permissionGranted]);

    // Countdown redirect effect when permission is denied
    useEffect(() => {
        let timer;
        if (permissionGranted === false) {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            } else {
                handleBack();
            }
        }
        return () => clearTimeout(timer);
    }, [permissionGranted, countdown]);

    // Check Permission
    const checkPermission = async () => {
        setErrors(prev => ({...prev, permission: null}));
        setLoadingPermission(true);
        try {
            const response = await getPermissionForAScheduleInAClass(id_class, id_schedule);
            if (response.status === 'success') {
                if (response.data.permission === false) {
                    setPermissionGranted(false);
                    setPermissionChecked(true);
                } else {
                    setPermissionGranted(true);
                    setPermissionChecked(true);
                }
            } else {
                setErrors(prev => ({...prev, permission: 'Gagal memeriksa izin akses: ' + response.message}));
            }
        } catch (error) {
            setErrors(prev => ({...prev, permission: 'Gagal memeriksa izin akses: ' + error.message}));
        } finally {
            setLoadingPermission(false);
        }
    };

    // Fetch All Data
    const fetchAllData = async () => {
        setErrors(prev => ({...prev, fetch: null}));
        setIsLoading(true);
        await Promise.all([
            fetchClassDetail(),
            fetchAttendanceData()
        ]);
        setIsLoading(false);
    };

    // Fetch class detail with students list
    const fetchClassDetail = async () => {
        setErrors(prev => ({...prev, fetch: null}));
        try {
            const response = await getClassDetail(id_class);
            
            if (response.status === 'success') {
                setClassInfo(response.data.class_info);
            } else {
                setErrors(prev => ({...prev, fetch: 'Gagal memuat data kelas: ' + response.message}));
            }
        } catch (error) {
            setErrors(prev => ({...prev, fetch: 'Terjadi kesalahan saat memuat data kelas: ' + error.message}));
        }
    };

    // Fetch attendance data
    const fetchAttendanceData = async () => {
        setErrors(prev => ({...prev, fetch: null}));
        try {
            const response = await getPresencesBySchedule(id_schedule);
            
            if (response.status === 'success') {
                // Set schedule info dari response
                setScheduleInfo({
                    pertemuanke: response.data.pertemuan || '-',
                    date: response.data.tanggal || ''
                });

                // Ambil ID mahasiswa yang sudah hadir dari database
                const attendedStudentIds = response.data.students.map(s => s.id_user_si);
                
                // Simpan data asli dari database untuk comparison nanti
                setOriginalAttendance(attendedStudentIds);
                
                // Fetch class detail untuk mendapatkan daftar mahasiswa
                const classData = await getClassDetail(response.data.id_class);
                
                if (classData.status === 'success') {
                    // Transform data ke format yang sesuai dengan table
                    const formattedData = classData.data.students.map(student => ({
                        id: student.id_user_si,
                        nim: student.nim,
                        nama: student.name,
                        hadir: attendedStudentIds.includes(student.id_user_si),
                    }));
                    
                    setMahasiswaData(formattedData);

                    // Update statistics
                    setStatistics({
                        total_students: formattedData.length,
                        present_students: attendedStudentIds.length,
                        absent_students: formattedData.length - attendedStudentIds.length
                    });
                }
            } else {
                setErrors(prev => ({...prev, fetch: 'Gagal memuat data presensi: ' + response.message}));
            }
        } catch (error) {
            setErrors(prev => ({...prev, fetch: 'Terjadi kesalahan saat memuat data presensi: ' + error.message}));
        }
    };

// Handle scan QR
const handleScanQR = () => {
    setIsScanning(true);
    router.push(`/kehadiran/${id_class}/pertemuan/${id_schedule}/scanqr?id_schedule=${id_schedule}&id_class=${id_class}&nama=${encodeURIComponent(classInfo.name_subject || '')}&kelas=${encodeURIComponent(classInfo.code_class || '')}&tanggal=${scheduleInfo.date}`);
};

// Format tanggal
const formatTanggal = (dateString) => {
if (!dateString) return '-';
const date = new Date(dateString);
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const dayName = days[date.getDay()];
const day = date.getDate();
const month = months[date.getMonth()];
const year = date.getFullYear();

return `${dayName}, ${day} ${month} ${year}`;
};

// Toggle presensi (tanpa konfirmasi, langsung update state)
const togglePresensi = (id) => {
    setMahasiswaData(prevData =>
        prevData.map(item =>
            item.id === id ? { ...item, hadir: !item.hadir } : item
        )
    );
};

// Simpan semua presensi
const handleSaveAll = async () => {
    if (mahasiswaData.length === 0) {
        setAlertMessage('Tidak ada data mahasiswa untuk disimpan');
        setShowErrorDialog(true);
        return;
    }

    // Calculate changes
    const currentAttendedIds = mahasiswaData.filter(m => m.hadir === true).map(m => m.id);
    const toAdd = currentAttendedIds.filter(id => !originalAttendance.includes(id));
    const toDelete = originalAttendance.filter(id => !currentAttendedIds.includes(id));
    
    const hadirCount = currentAttendedIds.length;
    const totalCount = mahasiswaData.length;
    
    // Build confirmation message with details
    let message = `Anda akan menyimpan presensi untuk ${hadirCount} mahasiswa hadir dari total ${totalCount} mahasiswa.`;
    
    if (toAdd.length > 0 || toDelete.length > 0) {
        message += '\n\nPerubahan:';
        if (toAdd.length > 0) message += `\n• Menambah ${toAdd.length} presensi baru`;
        if (toDelete.length > 0) message += `\n• Menghapus ${toDelete.length} presensi`;
    }
    
    message += '\n\nLanjutkan?';
    
    setAlertMessage(message);
    setConfirmAction(() => async () => {
        setShowConfirmDialog(false);
        await savePresences();
    });
    setShowConfirmDialog(true);
};

const savePresences = async () => {
    setIsSaving(true);
    setErrors(prev => ({...prev, save: null}));
    try {
        // Current state: mahasiswa yang dicentang sekarang
        const currentAttendedIds = mahasiswaData
            .filter(m => m.hadir === true)
            .map(m => m.id);
        
        // Mahasiswa yang perlu ditambah (dicentang sekarang tapi belum di DB)
        const toAdd = currentAttendedIds.filter(id => !originalAttendance.includes(id));
        
        // Mahasiswa yang perlu dihapus (ada di DB tapi sekarang tidak dicentang)
        const toDelete = originalAttendance.filter(id => !currentAttendedIds.includes(id));

        // Execute delete operations first
        if (toDelete.length > 0) {
            await Promise.all(
                toDelete.map(studentId => deletePresence(id_schedule, studentId))
            );
        }

        // Then save current attendance (will create new or update existing)
        if (currentAttendedIds.length > 0) {
            await sendManualAttendance(id_schedule, currentAttendedIds);
        }

        const response = { status: 'success' };
        
        if (response.status === 'success') {
            setAlertMessage('Presensi berhasil disimpan!');
            setShowSuccessDialog(true);
            
            // Redirect setelah 1.5 detik
            setTimeout(() => {
                router.back();
            }, 1500);
        } else {
            setErrors(prev => ({...prev, save: 'Gagal menyimpan presensi: ' + response.message}));
            setAlertMessage('Gagal menyimpan presensi: ' + response.message);
            setShowErrorDialog(true);
        }
    } catch (error) {
        setErrors(prev => ({...prev, save: 'Terjadi kesalahan saat menyimpan presensi: ' + error.message}));
        setAlertMessage('Terjadi kesalahan saat menyimpan presensi: ' + error.message);
        setShowErrorDialog(true);
    } finally {
        setIsSaving(false);
    }
};

const columns = [
{ key: 'nim', label: 'NIM', width: '150px', cellClassName: 'font-medium' },
{ key: 'nama', label: 'Nama Mahasiswa', className: 'text-left', cellClassName: 'text-left font-medium' },
{ key: 'hadir', label: 'Hadir', width: '100px', cellClassName: 'text-center' },
];

const customRender = {
    hadir: (value, item) => {
        return (
        <div className="flex items-center justify-center">
            <Checkbox
            checked={item.hadir}
            onCheckedChange={() => togglePresensi(item.id)}
            />
        </div>
        );
    },
};

// Handle back navigation
const handleBack = () => {
    router.push('/kehadiran/' + id_class);
};

// Loading permission check
if (loadingPermission) {
    return <LoadingEffect message="Memeriksa izin akses..." />;
  } else if (permissionGranted === false) {
    return (
        <div className="min-h-screen bg-brand-light-sage">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <ErrorMessageBoxWithButton
                    message={'Anda tidak memiliki izin untuk mengakses kelas atau jadwal ini.' + `\n\nAkan dialihkan kembali dalam ${countdown} detik.`}
                    action={handleBack}
                    btntext={countdown > 0 ? `Kembali (${countdown})` : 'Kembali'}
                />
            </div>
        </div>
    );
  } else if (errors.permission) {
    return (
        <div className="min-h-screen bg-brand-light-sage">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <ErrorMessageBoxWithButton
                    message={errors.permission}
                    action={checkPermission}
                />
            </div>
        </div>
    );
  } else if (isLoading) {
    return <LoadingEffect message="Memuat data mahasiswa..." />;
  } else if (errors.fetch) {
    return (
        <div className="min-h-screen bg-brand-light-sage">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <ErrorMessageBoxWithButton
                    message={errors.fetch}
                    action={fetchAllData}
                    back={true}
                    actionback={handleBack}
                />
            </div>
        </div>
    );
  }return (
<div className="min-h-screen bg-brand-light-sage flex flex-col">
    <Navbar />
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
    <button
        onClick={handleBack}
        className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
        style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
    >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Detail Presensi
    </button>

    {/* Header */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
        <div className="flex items-start gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
            <CalendarDays className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Input Presensi - Pertemuan {scheduleInfo.pertemuanke}
            </h1>
            <p className="mt-1 text-lg" style={{ color: '#015023', opacity: 0.75, fontFamily: 'Urbanist, sans-serif' }}>
            {classInfo.code_subject} - {classInfo.name_subject}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Kelas: {classInfo.code_class}
            </span>
            <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#DABC4E', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {formatTanggal(scheduleInfo.date)}
            </span>
            {classInfo?.dosen && (
                <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#DABC4E', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Dosen: {classInfo.dosen}
                </span>
            )}
            </div>
        </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Total Mahasiswa
            </p>
            <p className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            {mahasiswaData.length} Mahasiswa
            </p>
        </div>
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Hadir
            </p>
            <p className="text-2xl font-bold" style={{ color: '#16874B', fontFamily: 'Urbanist, sans-serif' }}>
            {mahasiswaData.filter(m => m.hadir === true).length} Mahasiswa
            </p>
        </div>
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Tidak Hadir
            </p>
            <p className="text-2xl font-bold" style={{ color: '#BE0414', fontFamily: 'Urbanist, sans-serif' }}>
            {mahasiswaData.filter(m => m.hadir === false).length} Mahasiswa
            </p>
        </div>
        </div>
    </div>
    {/* Tabel Mahasiswa */}
    {mahasiswaData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
            <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Daftar Mahasiswa
                </h2>
                <p className="text-sm mt-1" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                Centang checkbox untuk menandai mahasiswa hadir
                </p>
            </div>
            
            <button
                onClick={handleScanQR}
                disabled={isScanning}
                className="flex items-center gap-2 text-white px-6 py-3 transition shadow-sm hover:opacity-90 font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#015023', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
            >
                <QrCode className="w-5 h-5" />
                {isScanning ? 'Memulai Scanner...' : 'Mulai Scan QR'}
            </button>
            </div>
            
            <DataTable
            columns={columns}
            data={mahasiswaData}
            actions={[]}
            pagination={false}
            customRender={customRender}
            />
        </div>
    )}

    {/* Actions */}
    {mahasiswaData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                <p className="font-medium">Keterangan:</p>
                <p className="text-gray-600 mt-1">
                • Centang checkbox untuk menandai mahasiswa hadir<br />
                • Gunakan tombol "Mulai Scan QR" untuk presensi otomatis via QR Code
                </p>
            </div>

            <div className="flex gap-3">
                <WarningButton
                onClick={handleBack}
                disabled={isSaving}
                >
                Batal
                </WarningButton>
                
                <PrimaryButton
                onClick={handleSaveAll}
                disabled={isSaving}
                className="gap-2"
                >
                <Save className="w-4 h-4" />
                {isSaving ? 'Menyimpan...' : 'Simpan Presensi'}
                </PrimaryButton>
            </div>
            </div>
        </div>
    )}
    </div>
    
    {/* Alert Dialogs */}
    <AlertConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Konfirmasi"
        description={alertMessage}
        confirmText="Ya, Lanjutkan"
        cancelText="Batal"
        onConfirm={confirmAction}
    />
    
    <AlertSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Berhasil"
        description={alertMessage}
        closeText="Tutup"
    />
    
    <AlertErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title="Gagal"
        description={alertMessage}
        closeText="Tutup"
    />
    
    <Footer />
</div>
);
}

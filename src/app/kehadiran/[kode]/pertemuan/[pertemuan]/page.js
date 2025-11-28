'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getClassDetail, sendManualAttendance, getPresencesBySchedule, deletePresence } from '@/lib/attendanceApi';
import { ErrorMessageBoxWithButton } from '@/components/ui/message-box';
import { AlertConfirmationDialog, AlertSuccessDialog, AlertErrorDialog } from '@/components/ui/alert-dialog';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import { ArrowLeft, CalendarDays, Save, QrCode } from 'lucide-react';
import { PrimaryButton, OutlineButton } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Footer from '@/components/ui/footer';
import LoadingEffect from '@/components/ui/loading-effect';

export default function InputPresensiPage({ params }) {
const router = useRouter();
const searchParams = useSearchParams();
const { kode, pertemuan } = React.use(params);
const id_schedule = searchParams.get('id_schedule') || '';
const id_class = searchParams.get('id_class') || '';
const nama = searchParams.get('nama') || '';
const kelas = searchParams.get('kelas') || '';
const tanggal = searchParams.get('tanggal') || '';

const [classInfo, setClassInfo] = useState(null);
const [mahasiswaData, setMahasiswaData] = useState([]);
const [originalAttendance, setOriginalAttendance] = useState([]); // Track original from DB
const [selectedStudents, setSelectedStudents] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [isScanning, setIsScanning] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Alert states
const [showConfirmDialog, setShowConfirmDialog] = useState(false);
const [showSuccessDialog, setShowSuccessDialog] = useState(false);
const [showErrorDialog, setShowErrorDialog] = useState(false);
const [alertMessage, setAlertMessage] = useState('');
const [confirmAction, setConfirmAction] = useState(null);

    // Fetch data on mount
    useEffect(() => {
        if (id_class && id_schedule) {
            fetchClassDetail();
        } else {
            setLoading(false);
            setError('ID kelas atau jadwal tidak ditemukan');
        }
    }, [id_class, id_schedule]);

    // Fetch class detail with students list
    const fetchClassDetail = async () => {
        setLoading(true);
        try {
            setError(null);
            console.log('Fetching class detail for id_class:', id_class);
            console.log('Fetching attendance for id_schedule:', id_schedule);

            // Fetch class detail dan attendance secara paralel
            const [classData, attendanceData] = await Promise.all([
                getClassDetail(id_class),
                getPresencesBySchedule(id_schedule)
            ]);

            console.log('Class API Response:', classData);
            console.log('Attendance API Response:', attendanceData);

            if (classData.status === 'success') {
                setClassInfo(classData.data.class_info);
                
                // Ambil ID mahasiswa yang sudah hadir dari database
                const attendedStudentIds = attendanceData.status === 'success' 
                    ? attendanceData.data.students.map(s => s.id_user_si)
                    : [];

                // Simpan data asli dari database untuk comparison nanti
                setOriginalAttendance(attendedStudentIds);
                
                console.log('Attended student IDs:', attendedStudentIds);
                
                // Format students data dengan status hadir berdasarkan data dari database
                const formattedStudents = classData.data.students.map((student, index) => ({
                    id: student.id_user_si,
                    no: index + 1,
                    nim: student.nim,
                    nama: student.name,
                    hadir: attendedStudentIds.includes(student.id_user_si), // Check dari database
                }));
                
                setMahasiswaData(formattedStudents);
                console.log('Students loaded:', formattedStudents.length, 'items');
                console.log('Present students:', formattedStudents.filter(s => s.hadir).length);
            } else {
                const errorMsg = classData.message || 'Gagal mengambil data kelas';
                console.error('API Error:', errorMsg);
                setError(errorMsg);
            }
        } catch (err) {
        console.error('Error fetching class detail:', err);
        
        let errorMessage = 'Terjadi kesalahan saat mengambil data';
        if (err.response) {
            errorMessage = `Server Error (${err.response.status}): ${err.response.data?.message || err.response.statusText}`;
        } else if (err.request) {
            errorMessage = 'Tidak dapat terhubung ke server. Pastikan backend Laravel berjalan.';
        } else if (err.message) {
            errorMessage = err.message;
        } else if (err.status === 'error') {
            errorMessage = err.message || 'Gagal mengambil data kelas';
        }
        
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
};

// Handle scan QR
const handleScanQR = () => {
    setIsScanning(true);
    router.push(`/kehadiran/${kode}/pertemuan/${pertemuan}/scanqr?id_schedule=${id_schedule}&id_class=${id_class}&nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}&tanggal=${tanggal}`);
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
    setIsLoading(true);
    try {
        // Current state: mahasiswa yang dicentang sekarang
        const currentAttendedIds = mahasiswaData
            .filter(m => m.hadir === true)
            .map(m => m.id);
        
        // Mahasiswa yang perlu ditambah (dicentang sekarang tapi belum di DB)
        const toAdd = currentAttendedIds.filter(id => !originalAttendance.includes(id));
        
        // Mahasiswa yang perlu dihapus (ada di DB tapi sekarang tidak dicentang)
        const toDelete = originalAttendance.filter(id => !currentAttendedIds.includes(id));
        
        console.log('Current attended:', currentAttendedIds);
        console.log('Original attendance:', originalAttendance);
        console.log('To add:', toAdd);
        console.log('To delete:', toDelete);

        // Execute delete operations first
        if (toDelete.length > 0) {
            console.log('Deleting presences for:', toDelete);
            await Promise.all(
                toDelete.map(studentId => deletePresence(id_schedule, studentId))
            );
        }

        // Then save current attendance (will create new or update existing)
        if (currentAttendedIds.length > 0) {
            console.log('Saving attendance for:', currentAttendedIds);
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
            setAlertMessage('Gagal menyimpan presensi: ' + (response.message || 'Unknown error'));
            setShowErrorDialog(true);
        }
    } catch (error) {
        console.error('Error saving attendance:', error);
        let errorMessage = 'Gagal menyimpan presensi';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        setAlertMessage(errorMessage);
        setShowErrorDialog(true);
    } finally {
        setIsLoading(false);
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

if (loading) {
    return <LoadingEffect message="Memuat data mahasiswa..." />;
}

return (
<div className="min-h-screen bg-brand-light-sage flex flex-col">
    <Navbar />
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
    <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
        style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
    >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Detail Presensi
    </button>

    {/* Error Message */}
    {error && (
        <ErrorMessageBoxWithButton message={error} action={fetchClassDetail} />
    )}

    {/* Header */}
    {(
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
        <div className="flex items-start gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
            <CalendarDays className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Input Presensi - Pertemuan {pertemuan}
            </h1>
            <p className="mt-1 text-lg" style={{ color: '#015023', opacity: 0.75, fontFamily: 'Urbanist, sans-serif' }}>
            {kode} - {nama}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Kelas: {kelas}
            </span>
            <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#DABC4E', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {formatTanggal(tanggal)}
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
    )}

    {/* Tabel Mahasiswa */}
    {!loading && mahasiswaData.length > 0 && (
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
    {!loading && mahasiswaData.length > 0 && (
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
            <OutlineButton
            onClick={() => router.back()}
            disabled={isLoading}
            >
            Batal
            </OutlineButton>
            
            <PrimaryButton
            onClick={handleSaveAll}
            disabled={isLoading}
            className="gap-2"
            >
            <Save className="w-4 h-4" />
            {isLoading ? 'Menyimpan...' : 'Simpan Presensi'}
            </PrimaryButton>
        </div>
        </div>
    </div>
    )}

    {/* Empty State */}
    {!loading && mahasiswaData.length === 0 && !error && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Belum ada data mahasiswa untuk kelas ini.
            </p>
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

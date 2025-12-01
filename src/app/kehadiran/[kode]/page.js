'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, QrCode, UserCheck, ClipboardCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getClassSchedules, getStudentAttendanceHistoryByClass } from '@/lib/attendanceApi';
import { getProfile } from '@/lib/profileApi';
import { ErrorMessageBoxWithButton } from '@/components/ui/message-box';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import Footer from '@/components/ui/footer';
import LoadingEffect from '@/components/ui/loading-effect';

export default function DetailKehadiranPage({ params }) {
const router = useRouter();
const searchParams = useSearchParams();
const { kode } = React.use(params);
const id_class = searchParams.get('id_class') || '';
const nama = searchParams.get('nama') || '';
const kelas = searchParams.get('kelas') || '';
const sks = searchParams.get('sks') || '';
const dosen = searchParams.get('dosen') || '';

// State management
const [role, setRole] = useState(null);
const [classInfo, setClassInfo] = useState(null);
const [schedules, setSchedules] = useState([]);
const [statistics, setStatistics] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch user role on mount
useEffect(() => {
	fetchUserRole();
}, []);

// Fetch data when role and id_class are available
useEffect(() => {
	if (role && id_class) {
		fetchData();
	}
}, [role, id_class]);

// Fetch user role from profile API
const fetchUserRole = async () => {
	try {
		const data = await getProfile();
		if (data.status === 'success') {
			setRole(data.data.role);
		}
	} catch (err) {
		console.error('Error fetching user role:', err);
		setRole('mahasiswa'); // fallback
	}
};

// Fetch data based on role
const fetchData = async () => {
	setLoading(true);
	try {
		setError(null);
		
		if (role === 'dosen') {
			await fetchClassSchedules();
		} else if (role === 'mahasiswa') {
			await fetchStudentAttendanceHistory();
		}
	} catch (err) {
		console.error('Error fetching data:', err);
		setError(err.message || 'Gagal mengambil data');
	} finally {
		setLoading(false);
	}
};

// Fetch class schedules from API (for lecturer)
const fetchClassSchedules = async () => {
	try {
		console.log('Fetching class schedules for id_class:', id_class);

		const data = await getClassSchedules(id_class);
		console.log('API Response:', data);

		if (data.status === 'success') {
			setClassInfo(data.data.class_info);
			setSchedules(data.data.schedules);
			console.log('Schedules loaded:', data.data.schedules.length, 'items');
		} else {
			const errorMsg = data.message || 'Gagal mengambil data pertemuan';
			console.error('API Error:', errorMsg);
			setError(errorMsg);
		}
	} catch (err) {
		console.error('Error fetching schedules:', err);
		
		let errorMessage = 'Terjadi kesalahan saat mengambil data';
		if (err.response) {
			errorMessage = `Server Error (${err.response.status}): ${err.response.data?.message || err.response.statusText}`;
		} else if (err.request) {
			errorMessage = 'Tidak dapat terhubung ke server. Pastikan backend Laravel berjalan.';
		} else {
			errorMessage = err.message;
		}
		
		setError(errorMessage);
	}
};

// Fetch student attendance history from API (for student)
const fetchStudentAttendanceHistory = async () => {
	try {
		console.log('Fetching student attendance history for id_class:', id_class);

		const data = await getStudentAttendanceHistoryByClass(id_class);
		console.log('API Response:', data);

		if (data.status === 'success') {
			setClassInfo(data.data.class_info);
			setSchedules(data.data.schedules);
			setStatistics(data.data.statistics);
			console.log('Attendance history loaded:', data.data.schedules.length, 'items');
		} else {
			const errorMsg = data.message || 'Gagal mengambil riwayat presensi';
			console.error('API Error:', errorMsg);
			setError(errorMsg);
		}
	} catch (err) {
		console.error('Error fetching attendance history:', err);
		
		let errorMessage = 'Terjadi kesalahan saat mengambil data';
		if (err.response) {
			errorMessage = `Server Error (${err.response.status}): ${err.response.data?.message || err.response.statusText}`;
		} else if (err.request) {
			errorMessage = 'Tidak dapat terhubung ke server. Pastikan backend Laravel berjalan.';
		} else {
			errorMessage = err.message;
		}
		
		setError(errorMessage);
	}
};

// Format tanggal
const formatTanggal = (dateString) => {
const date = new Date(dateString);
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const dayName = days[date.getDay()];
const day = date.getDate();
const month = months[date.getMonth()];
const year = date.getFullYear();

return `${dayName}, ${day} ${month} ${year}`;
};

// Columns untuk mahasiswa
const columnsMahasiswa = [
{ key: 'tanggal', label: 'Tanggal', className: 'text-left', cellClassName: 'text-left' },
{ key: 'jam', label: 'Jam Mulai - Selesai', width: '180px', cellClassName: 'text-center' },
{ key: 'kelas', label: 'Kelas', width: '100px', cellClassName: 'font-medium' },
{ key: 'jam_presensi', label: 'Jam Presensi', width: '130px', cellClassName: 'text-center' },
{ key: 'status', label: 'Status', width: '200px' },
];

// Columns untuk dosen
const columnsDosen = [
{ key: 'tanggal', label: 'Tanggal Pertemuan', className: 'text-left', cellClassName: 'text-left' },
{ key: 'jam', label: 'Jam Mulai - Selesai', width: '180px', cellClassName: 'text-center' },
{ key: 'kelas', label: 'Kelas', width: '100px', cellClassName: 'font-medium' },
{ key: 'aksi', label: 'Aksi Presensi', width: '200px' },
];

// Custom render untuk mahasiswa
const customRenderMahasiswa = {
tanggal: (value, item) => formatTanggal(item.tanggal),
jam: (value, item) => `${formatJam(item.jam_mulai)} - ${formatJam(item.jam_selesai)}`,
kelas: (value, item) => item.code_class,
status: (value, item) => {
    if (!item.status) {
    return (
        <span className="px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontFamily: 'Urbanist, sans-serif' }}>
        Belum Presensi
        </span>
    );
    }
    
    const isScanQR = item.status === 'Scan QR';
    return (
    <span className="px-3 py-1.5 rounded-lg font-medium" style={{ 
        backgroundColor: isScanQR ? '#dcfce7' : '#fef3c7', 
        color: isScanQR ? '#16874B' : '#92400e',
        fontFamily: 'Urbanist, sans-serif' 
    }}>
        {item.status}
    </span>
    );
},
jam_presensi: (value, item) => {
    if (!item.jam_presensi) return '-';
    return <span className="font-semibold" style={{ color: '#015023' }}>{item.jam_presensi}</span>;
},
};

// Format jam (HH:mm dari HH:mm:ss)
const formatJam = (time) => {
    if (!time) return '-';
    // Jika format HH:mm:ss, ambil HH:mm saja
    return time.substring(0, 5);
};

// Custom render untuk dosen
const customRenderDosen = {
tanggal: (value, item) => formatTanggal(item.tanggal),
jam: (value, item) => `${formatJam(item.jam_mulai)} - ${formatJam(item.jam_selesai)}`,
kelas: (value, item) => item.code_class,
aksi: (value, item) => (
    <div className="flex items-center justify-center">
    <button
        onClick={() => router.push(`/kehadiran/${kode}/pertemuan/${item.pertemuan}?id_schedule=${item.id_schedule}&id_class=${id_class}&nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(item.code_class)}&tanggal=${item.tanggal}`)}
        className="flex items-center gap-2 text-white px-4 py-2 transition shadow-sm hover:opacity-90 font-semibold"
        style={{ backgroundColor: '#015023', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
    >
        <ClipboardCheck className="w-4 h-4" />
        Input Presensi
    </button>
    </div>
),
};

// Display data dan class info
const displayData = schedules;
const displayClassInfo = classInfo || { code_class: kelas, sks, dosen };

if (loading) {
    const message = role === 'dosen' ? "Memuat data mahasiswa..." : "Memuat riwayat presensi...";
    return <LoadingEffect message={message} />;
}

return (
    <div className="min-h-screen bg-brand-light-sage flex flex-col">
    <Navbar/>
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
    
    <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
        style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
    >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Daftar Mata Kuliah
    </button>

    {/* Error Message */}
    {error && role === 'dosen' && (
        <ErrorMessageBoxWithButton message={error} action={fetchClassSchedules} />
    )}

    {/* Card Info Mata Kuliah + Statistics */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
        {/* Header Info */}
        <div className="flex items-start gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
            <CalendarDays className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Detail Presensi - {classInfo?.code_subject || kode}
            </h1>
            <p className="mt-1 text-lg" style={{ color: '#015023', opacity: 0.75, fontFamily: 'Urbanist, sans-serif' }}>
            {nama}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Kelas: {kelas}
            </span>
            <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {sks} SKS
            </span>
            {dosen && (
                <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#DABC4E', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Dosen: {dosen}
                </span>
            )}
            </div>
        </div>
        </div>

        {/* Statistics for Student */}
        {role === 'mahasiswa' && statistics && (
        <div className="border-t pt-6" style={{ borderColor: '#e5e7eb' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Pertemuan */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#015023' }}>
                <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                    Total Pertemuan
                </p>
                <p className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    {statistics.total_pertemuan}
                </p>
                </div>
            </div>

            {/* Sudah Presensi */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#16874B' }}>
                <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                    Sudah Presensi
                </p>
                <p className="text-3xl font-bold" style={{ color: '#16874B', fontFamily: 'Urbanist, sans-serif' }}>
                    {statistics.sudah_presensi}
                </p>
                </div>
            </div>

            {/* Persentase Kehadiran */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#DABC4E' }}>
                <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                    Persentase Kehadiran
                </p>
                <p className="text-3xl font-bold" style={{ color: '#DABC4E', fontFamily: 'Urbanist, sans-serif' }}>
                    {statistics.persentase_kehadiran}%
                </p>
                </div>
            </div>
            </div>
        </div>
        )}
    </div>

    {/* Tabel Pertemuan */}
    {!loading && role === 'dosen' && displayData.length > 0 && (
    <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
        Daftar Pertemuan & Input Presensi
        </h2>
        
        <DataTable
        columns={columnsDosen}
        data={displayData}
        actions={[]}
        pagination={false}
        customRender={customRenderDosen}
        />
    </div>
    )}

    {/* Empty State for Lecturer */}
    {!loading && role === 'dosen' && displayData.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Belum ada jadwal pertemuan untuk kelas ini.
            </p>
        </div>
    )}

    {/* Tabel Riwayat Presensi for Student */}
    {!loading && role === 'mahasiswa' && displayData.length > 0 && (
    <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
        Riwayat Presensi
        </h2>
        
        <DataTable
        columns={columnsMahasiswa}
        data={displayData}
        actions={[]}
        pagination={false}
        customRender={customRenderMahasiswa}
        />
    </div>
    )}

    {/* Empty State for Student */}
    {!loading && role === 'mahasiswa' && displayData.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Belum ada data presensi untuk kelas ini.
            </p>
        </div>
    )}

    {/* Error Message for Student */}
    {error && role === 'mahasiswa' && (
        <ErrorMessageBoxWithButton message={error} action={fetchStudentAttendanceHistory} />
    )}
    </div>
    <Footer/>
</div>
);
}
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, QrCode, UserCheck, ClipboardCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getClassSchedules } from '@/lib/attendanceApi';
import { ErrorMessageBoxWithButton } from '@/components/ui/message-box';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import Footer from '@/components/ui/footer';

export default function DetailKehadiranPage({ params }) {
const router = useRouter();
const searchParams = useSearchParams();
const { kode } = params;
const id_class = searchParams.get('id_class') || '';
const nama = searchParams.get('nama') || '';
const kelas = searchParams.get('kelas') || '';
const sks = searchParams.get('sks') || '';
const dosen = searchParams.get('dosen') || '';

// State management
const [role, setRole] = useState('mahasiswa');
const [classInfo, setClassInfo] = useState(null);
const [schedules, setSchedules] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch data on mount
useEffect(() => {
	const userRole = localStorage.getItem('userRole') || 'mahasiswa';
	setRole(userRole);
	
	if (id_class && userRole === 'dosen') {
		fetchClassSchedules();
	} else {
		setLoading(false);
	}
}, [id_class]);

// Fetch class schedules from API
const fetchClassSchedules = async () => {
	setLoading(true);
	try {
		setError(null);
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
	} finally {
		setLoading(false);
	}
};

// Toggle role function (for development only)
const toggleRole = () => {
const newRole = role === 'mahasiswa' ? 'dosen' : 'mahasiswa';
setRole(newRole);
localStorage.setItem('userRole', newRole);
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
jam: (value, item) => `${item.jamMulai} - ${item.jamSelesai}`,
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
    if (!item.jamPresensi) return '-';
    return <span className="font-semibold" style={{ color: '#015023' }}>{item.jamPresensi}</span>;
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

return (
<div className="min-h-screen bg-brand-light-sage flex flex-col">
    <Navbar/>
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
    
    {/* Dev Toggle Role Button */}
    <div className="mb-4 flex justify-end">
        <button
        onClick={toggleRole}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition shadow-sm hover:opacity-90"
        style={{ 
            backgroundColor: role === 'mahasiswa' ? '#16874B' : '#DABC4E', 
            color: '#015023',
            fontFamily: 'Urbanist, sans-serif',
            border: '2px solid #015023'
        }}
        >
        <span>🔄</span>
        Switch to {role === 'mahasiswa' ? 'Dosen' : 'Mahasiswa'} View
        </button>
    </div>

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

    {/* Loading State */}
    {loading && role === 'dosen' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
            <p className="text-lg" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>Memuat data...</p>
        </div>
    )}

    {/* Card Info Mata Kuliah */}
    {!loading && (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
        <div className="flex items-start gap-4">
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

    </div>
    )}

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

    {/* Empty State */}
    {!loading && role === 'dosen' && displayData.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Belum ada jadwal pertemuan untuk kelas ini.
            </p>
        </div>
    )}
    </div>
    <Footer/>
</div>
);
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, QrCode, UserCheck, ClipboardCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import Footer from '@/components/ui/footer';

export default function DetailKehadiranPage({ params }) {
const router = useRouter();
const searchParams = useSearchParams();
const { kode } = params;
const nama = searchParams.get('nama') || '';
const kelas = searchParams.get('kelas') || '';
const sks = searchParams.get('sks') || '';
const dosen = searchParams.get('dosen') || '';

// Role detection
const [role, setRole] = useState('mahasiswa');

useEffect(() => {
// Get role from localStorage (or cookies in production)
const userRole = localStorage.getItem('userRole') || 'mahasiswa';
setRole(userRole);
}, []);

// Toggle role function (for development only)
const toggleRole = () => {
const newRole = role === 'mahasiswa' ? 'dosen' : 'mahasiswa';
setRole(newRole);
localStorage.setItem('userRole', newRole);
};

// Dummy data pertemuan
const pertemuanData = [
{
    pertemuan: 1,
    tanggal: new Date('2024-09-02'),
    jamMulai: '08:00',
    jamSelesai: '10:30',
    kelas: kelas,
    status: 'Scan QR',
    jamPresensi: '08:05',
},
{
    pertemuan: 2,
    tanggal: new Date('2024-09-09'),
    jamMulai: '08:00',
    jamSelesai: '10:30',
    kelas: kelas,
    status: 'Ditambahkan Dosen',
    jamPresensi: '-',
},
{
    pertemuan: 3,
    tanggal: new Date('2024-09-16'),
    jamMulai: '08:00',
    jamSelesai: '10:30',
    kelas: kelas,
    status: 'Scan QR',
    jamPresensi: '07:58',
},
{
    pertemuan: 4,
    tanggal: new Date('2024-09-23'),
    jamMulai: '08:00',
    jamSelesai: '10:30',
    kelas: kelas,
    status: null,
    jamPresensi: null,
},
{
    pertemuan: 5,
    tanggal: new Date('2024-09-30'),
    jamMulai: '08:00',
    jamSelesai: '10:30',
    kelas: kelas,
    status: 'Scan QR',
    jamPresensi: '08:10',
},
];

// Format tanggal
const formatTanggal = (date) => {
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

// Custom render untuk dosen
const customRenderDosen = {
tanggal: (value, item) => formatTanggal(item.tanggal),
jam: (value, item) => `${item.jamMulai} - ${item.jamSelesai}`,
aksi: (value, item) => (
    <div className="flex items-center justify-center">
    <button
        onClick={() => router.push(`/kehadiran/${kode}/pertemuan/${item.pertemuan}?nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}&tanggal=${item.tanggal.toISOString()}`)}
        className="flex items-center gap-2 text-white px-4 py-2 transition shadow-sm hover:opacity-90 font-semibold"
        style={{ backgroundColor: '#015023', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
    >
        <ClipboardCheck className="w-4 h-4" />
        Input Presensi
    </button>
    </div>
),
};    return (
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

    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
        <div className="flex items-start gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
            <CalendarDays className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Detail Presensi - {kode}
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

        {/* Summary Stats - Hidden for Dosen */}
        {role === 'mahasiswa' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Total Pertemuan
            </p>
            <p className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            {pertemuanData.length}
            </p>
        </div>
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Sudah Presensi
            </p>
            <p className="text-2xl font-bold" style={{ color: '#16874B', fontFamily: 'Urbanist, sans-serif' }}>
            {pertemuanData.filter(p => p.status).length}
            </p>
        </div>
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Persentase Kehadiran
            </p>
            <p className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            {Math.round((pertemuanData.filter(p => p.status).length / pertemuanData.length) * 100)}%
            </p>
        </div>
        </div>
        )}
    </div>

    {/* Tabel Pertemuan */}
    <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
        {role === 'dosen' ? 'Daftar Pertemuan & Input Presensi' : 'Riwayat Presensi'}
        </h2>
        
        <DataTable
        columns={role === 'dosen' ? columnsDosen : columnsMahasiswa}
        data={pertemuanData}
        actions={[]}
        pagination={false}
        customRender={role === 'dosen' ? customRenderDosen : customRenderMahasiswa}
        />
    </div>
    </div>
    <Footer/>
</div>
);
}

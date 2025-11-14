'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import { ArrowLeft, CalendarDays, Save, QrCode } from 'lucide-react';
import { PrimaryButton, OutlineButton } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function InputPresensiPage({ params }) {
const router = useRouter();
const searchParams = useSearchParams();
const { kode, pertemuan } = params;
const nama = searchParams.get('nama') || '';
const kelas = searchParams.get('kelas') || '';
const tanggal = searchParams.get('tanggal') || '';
const dosen = searchParams.get('dosen') || '';

const [isLoading, setIsLoading] = useState(false);
const [isScanning, setIsScanning] = useState(false);

// Handle scan QR
const handleScanQR = () => {
setIsScanning(true);
// Navigate to scan QR page
router.push(`/kehadiran/${kode}/pertemuan/${pertemuan}/scanqr?nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}&tanggal=${tanggal}`);
};

// Dummy data mahasiswa
const [mahasiswaData, setMahasiswaData] = useState([
{
    id: 1,
    nim: '2021110001',
    nama: 'John Doe',
    hadir: true,
},
{
    id: 2,
    nim: '2021110002',
    nama: 'Jane Smith',
    hadir: true,
},
{
    id: 3,
    nim: '2021110003',
    nama: 'Bob Johnson',
    hadir: false,
},
{
    id: 4,
    nim: '2021110004',
    nama: 'Alice Williams',
    hadir: true,
},
{
    id: 5,
    nim: '2021110005',
    nama: 'Charlie Brown',
    hadir: false,
},
{
    id: 6,
    nim: '2021110006',
    nama: 'Diana Prince',
    hadir: true,
},
{
    id: 7,
    nim: '2021110007',
    nama: 'Ethan Hunt',
    hadir: true,
},
{
    id: 8,
    nim: '2021110008',
    nama: 'Fiona Green',
    hadir: null,
},
]);

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

// Toggle presensi
const togglePresensi = (id) => {
setMahasiswaData(prevData =>
    prevData.map(item =>
    item.id === id ? { ...item, hadir: !item.hadir } : item
    )
);
};

// Simpan semua presensi
const handleSaveAll = async () => {
const belumDiinput = mahasiswaData.filter(item => item.hadir === null);

if (belumDiinput.length > 0) {
    const confirm = window.confirm(
    `Masih ada ${belumDiinput.length} mahasiswa yang belum diinput presensinya. Lanjutkan menyimpan?`
    );
    if (!confirm) return;
}

setIsLoading(true);
try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Prepare data untuk API
    const presensiData = mahasiswaData.map(item => ({
    nim: item.nim,
    nama: item.nama,
    hadir: item.hadir ?? false, // Default false jika null
    }));
    
    console.log('Saving presensi data:', presensiData);
    
    alert('Presensi berhasil disimpan!');
    router.back();
} catch (error) {
    alert('Gagal menyimpan presensi: ' + error.message);
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

return (
<div className="min-h-screen bg-brand-light-sage">
    <Navbar />
    <div className="container mx-auto px-4 py-8 max-w-7xl">
    <button
        onClick={() => router.back()}
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
                <span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#DABC4E', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Dosen: {dosen}
                </span>
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

    {/* Actions */}
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
    </div>
</div>
);
}

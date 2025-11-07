'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import { ArrowLeft, QrCode, CheckCircle, Clock, Users } from 'lucide-react';
import { PrimaryButton, OutlineButton } from '@/components/ui/button';

export default function ScanQRPage({ params }) {
const router = useRouter();
const searchParams = useSearchParams();
const { kode, pertemuan } = params;
const nama = searchParams.get('nama') || '';
const kelas = searchParams.get('kelas') || '';
const tanggal = searchParams.get('tanggal') || '';

const [scannedStudents, setScannedStudents] = useState([]);
const [qrCode] = useState('PRESENSIQR2024092301'); // Dummy QR Code value

// Dummy data mahasiswa
const allStudents = [
{ id: 1, nim: '2021110001', nama: 'John Doe' },
{ id: 2, nim: '2021110002', nama: 'Jane Smith' },
{ id: 3, nim: '2021110003', nama: 'Bob Johnson' },
{ id: 4, nim: '2021110004', nama: 'Alice Williams' },
{ id: 5, nim: '2021110005', nama: 'Charlie Brown' },
{ id: 6, nim: '2021110006', nama: 'Diana Prince' },
{ id: 7, nim: '2021110007', nama: 'Ethan Hunt' },
{ id: 8, nim: '2021110008', nama: 'Fiona Green' },
];

// Fungsi save presensi ke database (auto trigger saat scan)
const savePresensiToDatabase = async (student) => {
try {
    // Simulate API call
    console.log('Auto saving to database:', {
    nim: student.nim,
    nama: student.nama,
    waktuScan: student.waktuScan,
    pertemuan: pertemuan,
    kode: kode,
    hadir: true,
    metode: 'Scan QR'
    });
    
    // TODO: Replace dengan actual API call
    // await fetch('/api/presensi', {
    //   method: 'POST',
    //   body: JSON.stringify({ ... })
    // });
    
} catch (error) {
    console.error('Error saving presensi:', error);
}
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

const handleSelesai = () => {
const confirm = window.confirm(
    `${scannedStudents.length} dari ${allStudents.length} mahasiswa telah melakukan presensi.\n\nData sudah tersimpan otomatis ke database.\n\nAkhiri sesi scan QR?`
);

if (confirm) {
    // Tidak perlu save lagi, sudah auto save saat scan
    router.back();
}
};

const columns = [
{ key: 'no', label: 'No', width: '80px', cellClassName: 'text-center font-medium' },
{ key: 'nim', label: 'NIM', width: '150px', cellClassName: 'font-medium' },
{ key: 'nama', label: 'Nama Mahasiswa', className: 'text-left', cellClassName: 'text-left font-medium' },
{ key: 'waktuScan', label: 'Waktu Scan', width: '150px', cellClassName: 'text-center' },
{ key: 'status', label: 'Status', width: '120px' },
];

const customRender = {
no: (value, item, index) => index + 1,
waktuScan: (value) => (
    <span className="font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
    {value}
    </span>
),
status: () => (
    <div className="flex items-center justify-center">
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg font-medium" 
        style={{ backgroundColor: '#dcfce7', color: '#16874B', fontFamily: 'Urbanist, sans-serif' }}>
        <CheckCircle className="w-4 h-4" />
        Hadir
    </span>
    </div>
),
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
        Kembali ke Input Presensi
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#015023' }}>
            <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
            <h2 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                QR Code Presensi
            </h2>
            <p className="text-sm" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                Scan untuk absen otomatis
            </p>
            </div>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-white p-6 rounded-2xl shadow-xl border-4" style={{ borderColor: '#015023' }}>
            {/* Placeholder QR Code - Replace with actual QR library */}
            <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-2">
                {Array.from({ length: 64 }).map((_, i) => (
                    <div
                    key={i}
                    className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    style={{ borderRadius: '2px' }}
                    />
                ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-4 rounded-xl shadow-lg">
                    <QrCode className="w-12 h-12" style={{ color: '#015023' }} />
                </div>
                </div>
            </div>
            </div>
            
            <div className="mt-4 text-center">
            <p className="text-sm font-medium" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                Kode: <span className="font-mono font-bold" style={{ color: '#015023' }}>{qrCode}</span>
            </p>
            </div>
        </div>

        {/* Info */}
        <div className="bg-brand-light-sage rounded-xl p-4">
            <p className="text-sm font-medium mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Informasi Pertemuan:
            </p>
            <div className="space-y-2 text-sm" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            <p><span className="font-semibold">Mata Kuliah:</span> {kode} - {nama}</p>
            <p><span className="font-semibold">Kelas:</span> {kelas}</p>
            <p><span className="font-semibold">Pertemuan:</span> {pertemuan}</p>
            <p><span className="font-semibold">Tanggal:</span> {formatTanggal(tanggal)}</p>
            </div>
        </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#16874B' }}>
            <Users className="w-6 h-6 text-white" />
            </div>
            <div>
            <h2 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Statistik Presensi
            </h2>
            <p className="text-sm" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                Update real-time
            </p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-brand-light-sage rounded-xl p-4">
            <p className="text-sm font-medium mb-1" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Total Mahasiswa
            </p>
            <p className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {allStudents.length}
            </p>
            </div>

            <div className="rounded-xl p-4" style={{ backgroundColor: '#dcfce7' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#16874B', opacity: 0.8, fontFamily: 'Urbanist, sans-serif' }}>
                Sudah Scan
            </p>
            <p className="text-3xl font-bold" style={{ color: '#16874B', fontFamily: 'Urbanist, sans-serif' }}>
                {scannedStudents.length}
            </p>
            </div>
        </div>

        {/* Live Indicator */}
        <div className="mb-6 flex items-center justify-center gap-2 text-sm" style={{ fontFamily: 'Urbanist, sans-serif' }}>
        <div className="relative">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#16874B' }}></div>
            <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#16874B', opacity: 0.5 }}></div>
        </div>
        <span className="font-semibold" style={{ color: '#16874B' }}>
            Sesi scan QR aktif
        </span>
        </div>

        {/* Daftar Mahasiswa yang Sudah Scan */}
        <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Daftar Mahasiswa yang Sudah Presensi
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                {scannedStudents.length > 0 
                    ? `${scannedStudents.length} mahasiswa telah melakukan presensi`
                    : 'Belum ada mahasiswa yang melakukan presensi'
                }
                </p>
            </div>

            {scannedStudents.length < allStudents.length && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
                <Clock className="w-4 h-4" style={{ color: '#92400e' }} />
                <span className="text-sm font-medium" style={{ color: '#92400e', fontFamily: 'Urbanist, sans-serif' }}>
                    Sesi Aktif
                </span>
                </div>
            )}
            </div>

            {scannedStudents.length > 0 ? (
            <DataTable
                columns={columns}
                data={scannedStudents}
                actions={[]}
                pagination={false}
                customRender={customRender}
            />
            ) : (
            <div className="text-center py-12">
                <QrCode className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                <p className="text-lg font-medium" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                Menunggu mahasiswa untuk scan QR Code...
                </p>
            </div>
            )}
        </div>
        </div>
    </div>

    {/* Actions */}
    <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            <p className="font-medium">Keterangan:</p>
            <p className="text-gray-600 mt-1">
            • QR Code akan aktif selama sesi presensi dibuka<br />
            • Mahasiswa scan QR menggunakan aplikasi mobile<br />
            • Data akan <span className="font-semibold text-green-600">tersimpan otomatis</span> ke database saat scan<br />
            • Klik "Akhiri Presensi" untuk menutup sesi scan QR
            </p>
        </div>

        <div className="flex gap-3">
            <OutlineButton onClick={() => router.back()}>
            Kembali
            </OutlineButton>
            
            <PrimaryButton
            onClick={handleSelesai}
            className="gap-2"
            >
            <CheckCircle className="w-4 h-4" />
            Akhiri Presensi
            </PrimaryButton>
        </div>
        </div>
    </div>
    </div>
</div>
);
}

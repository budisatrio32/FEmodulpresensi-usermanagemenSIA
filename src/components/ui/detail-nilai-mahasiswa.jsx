'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import DataTable from '@/components/ui/table';
import { PrimaryButton, OutlineButton } from '@/components/ui/button';
import Navbar from '@/components/ui/navigation-menu';

export default function DetailNilaiMahasiswa() {
const router = useRouter();

// State untuk semester selector
const [selectedSemester, setSelectedSemester] = useState('2024-ganjil');

// Data semester options
const semesterOptions = [
{ value: '2024-ganjil', label: 'Semester Ganjil 2024/2025' },
{ value: '2023-genap', label: 'Semester Genap 2023/2024' },
{ value: '2023-ganjil', label: 'Semester Ganjil 2023/2024' },
{ value: '2022-genap', label: 'Semester Genap 2022/2023' },
{ value: '2022-ganjil', label: 'Semester Ganjil 2022/2023' },
];

// Data dummy nilai mahasiswa
const [nilaiData] = useState([
{
    id: 1,
    kode_matkul: 'IF101',
    nama_matkul: 'Pemrograman Dasar',
    sks: 3,
    bobot: 'A',
    nilai: 4.00,
    nilai_sks: 12.00
},
{
    id: 2,
    kode_matkul: 'IF102',
    nama_matkul: 'Matematika Diskrit',
    sks: 3,
    bobot: 'A-',
    nilai: 3.75,
    nilai_sks: 11.25
},
{
    id: 3,
    kode_matkul: 'IF103',
    nama_matkul: 'Algoritma dan Struktur Data',
    sks: 4,
    bobot: 'B+',
    nilai: 3.50,
    nilai_sks: 14.00
},
{
    id: 4,
    kode_matkul: 'IF104',
    nama_matkul: 'Basis Data',
    sks: 3,
    bobot: 'B',
    nilai: 3.00,
    nilai_sks: 9.00
},
{
    id: 5,
    kode_matkul: 'IF105',
    nama_matkul: 'Jaringan Komputer',
    sks: 3,
    bobot: 'A',
    nilai: 4.00,
    nilai_sks: 12.00
},
]);

// Hitung total SKS dan IPK
const totalSKS = nilaiData.reduce((sum, item) => sum + item.sks, 0);
const totalNilaiSKS = nilaiData.reduce((sum, item) => sum + item.nilai_sks, 0);
const ipk = (totalNilaiSKS / totalSKS).toFixed(2);

// Define table columns
const columns = [
{ 
    key: 'kode_matkul', 
    label: 'Kode Matkul', 
    width: '120px' 
},
{ 
    key: 'nama_matkul', 
    label: 'Mata Kuliah',
    className: 'text-left',
    cellClassName: 'text-left font-medium'
},
{ 
    key: 'sks', 
    label: 'SKS', 
    width: '80px' 
},
{ 
    key: 'bobot', 
    label: 'Bobot', 
    width: '80px',
    cellClassName: 'font-semibold'
},
{ 
    key: 'nilai', 
    label: 'Nilai', 
    width: '100px' 
},
{ 
    key: 'nilai_sks', 
    label: 'Nilai x SKS', 
    width: '120px',
    cellClassName: 'font-medium'
},
];

// Handle semester change
useEffect(() => {
// Simulasi fetch data berdasarkan semester
console.log('Fetching data for semester:', selectedSemester);
// TODO: Replace dengan API call
// fetchNilaiData(selectedSemester);
}, [selectedSemester]);

const handleExport = () => {
alert('Fitur export akan segera tersedia');
};

return (

<div className="min-h-screen bg-brand-light-sage">
    <Navbar />
    <div className="container mx-auto px-4 py-8 max-w-7xl">
    {/* Back Button */}
    <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
        style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
    >
        <ArrowLeft className="w-5 h-5" />
        Kembali
    </button>

    {/* Semester Selector */}
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6" style={{ borderRadius: '16px' }}>
        <div className="flex items-center gap-4">
        <label 
            htmlFor="semester-select"
            className="text-sm font-semibold whitespace-nowrap"
            style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
        >
            Pilih Periode:
        </label>
        <select
            id="semester-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="flex-1 px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition"
            style={{
            fontFamily: 'Urbanist, sans-serif',
            borderColor: '#015023',
            color: '#015023',
            fontWeight: '600',
            maxWidth: '400px'
            }}
        >
            {semesterOptions.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
            ))}
        </select>
        </div>
    </div>

    {/* Header */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
        <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
            <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#015023' }}
            >
            <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
            <h1 
                className="text-3xl font-bold mb-2"
                style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
            >
                Detail Nilai Akhir
            </h1>
            <p 
                className="text-lg"
                style={{ color: '#015023', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}
            >
                {semesterOptions.find(s => s.value === selectedSemester)?.label}
            </p>
            </div>
        </div>

        <OutlineButton
            onClick={handleExport}
            className="gap-2"
        >
            <Download className="w-4 h-4" />
            Export PDF
        </OutlineButton>
        </div>

        {/* Info Mahasiswa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            NIM
            </p>
            <p className="text-lg font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            2021110001
            </p>
        </div>
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Nama Mahasiswa
            </p>
            <p className="text-lg font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            John Doe
            </p>
        </div>
        <div>
            <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Program Studi
            </p>
            <p className="text-lg font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Teknik Informatika
            </p>
        </div>
        </div>
    </div>

    {/* Table Nilai */}
    <div className="mb-6">
        <DataTable
        columns={columns}
        data={nilaiData}
        actions={[]}
        pagination={false}
        />
    </div>

    {/* Summary IPK */}
    <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
        <h3 
        className="text-xl font-bold mb-4"
        style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
        >
        Ringkasan Nilai
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium mb-1" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Total SKS
            </p>
            <p className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            {totalSKS}
            </p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium mb-1" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Total Nilai x SKS
            </p>
            <p className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            {totalNilaiSKS.toFixed(2)}
            </p>
        </div>
        
        <div 
            className="rounded-xl p-4 text-white"
            style={{ backgroundColor: '#015023' }}
        >
            <p className="text-sm font-medium mb-1" style={{ opacity: 0.8, fontFamily: 'Urbanist, sans-serif' }}>
            IPK Semester
            </p>
            <p className="text-3xl font-bold" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            {ipk}
            </p>
        </div>
        </div>

        {/* Keterangan Bobot */}
        <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold mb-3" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Keterangan Bobot Nilai:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            <div className="flex justify-between">
            <span className="font-medium">A:</span>
            <span className="text-gray-600">4.00</span>
            </div>
            <div className="flex justify-between">
            <span className="font-medium">A-:</span>
            <span className="text-gray-600">3.75</span>
            </div>
            <div className="flex justify-between">
            <span className="font-medium">B+:</span>
            <span className="text-gray-600">3.50</span>
            </div>
            <div className="flex justify-between">
            <span className="font-medium">B:</span>
            <span className="text-gray-600">3.00</span>
            </div>
            <div className="flex justify-between">
            <span className="font-medium">B-:</span>
            <span className="text-gray-600">2.75</span>
            </div>
            <div className="flex justify-between">
            <span className="font-medium">C+:</span>
            <span className="text-gray-600">2.50</span>
            </div>
            <div className="flex justify-between">
            <span className="font-medium">C:</span>
            <span className="text-gray-600">2.00</span>
            </div>
            <div className="flex justify-between">
            <span className="font-medium">D:</span>
            <span className="text-gray-600">1.00</span>
            </div>
        </div>
        </div>
    </div>
    </div>
</div>
);
}

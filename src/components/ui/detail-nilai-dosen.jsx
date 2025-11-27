    'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Eye } from 'lucide-react';
import DataTable from '@/components/ui/table';
import { PrimaryButton, OutlineButton, WarningButton } from '@/components/ui/button';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import Navbar from '@/components/ui/navigation-menu';    
export default function DetailNilaiDosen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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

    // Data dummy mata kuliah untuk input nilai
    const [matkulData, setMatkulData] = useState([
    {
        id: 1,
        kode_matkul: 'IF101',
        nama_matkul: 'Pemrograman Dasar',
        kelas: 'PL1AA',
        sks: 3,
    },
    {
        id: 2,
        kode_matkul: 'IF102',
        nama_matkul: 'Matematika Diskrit',
        kelas: 'PL1AB',
        sks: 3,
    },
    {
        id: 3,
        kode_matkul: 'IF103',
        nama_matkul: 'Algoritma dan Struktur Data',
        kelas: 'PL2AA',
        sks: 4,
    },
    {
        id: 4,
        kode_matkul: 'IF104',
        nama_matkul: 'Basis Data',
        kelas: 'PL2AB',
        sks: 3,
    },
    {
        id: 5,
        kode_matkul: 'IF105',
        nama_matkul: 'Jaringan Komputer',
        kelas: 'PL3AA',
        sks: 3,
    },
    ]);

    // Handle detail nilai click
    const handleDetailNilai = (item) => {
        const params = new URLSearchParams({
            kode: item.kode_matkul,
            nama: item.nama_matkul,
            sks: item.sks.toString()
        });
        router.push(`/hasil-studi/input-nilai-mahasiswa?${params.toString()}`);
    };

    // Custom render for detail nilai column
    const customRender = {
        nama_matkul: (value, item) => {
            return (
                <div className="text-left">
                    <div className="font-medium" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        {item.nama_matkul}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                        Kelas: {item.kelas}
                    </div>
                </div>
            );
        },
        detail_nilai: (value, item) => {
            return (
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => handleDetailNilai(item)}
                        className="flex items-center gap-2 text-white px-4 py-2 transition shadow-sm hover:opacity-90 font-semibold"
                        style={{ 
                            backgroundColor: '#015023',
                            borderRadius: '12px',
                            fontFamily: 'Urbanist, sans-serif'
                        }}
                    >
                        <Eye className="w-4 h-4" />
                        Detail Nilai
                    </button>
                </div>
            );
        }
    };

    // Define table columns (hanya: no, kode matkul, matkul, sks, detail nilai)
    const columns = [
    { 
        key: 'kode_matkul', 
        label: 'Kode Matkul', 
        width: '130px',
        cellClassName: 'font-medium'
    },
    { 
        key: 'nama_matkul', 
        label: 'Mata Kuliah',
        className: 'text-left'
    },
    { 
        key: 'sks', 
        label: 'SKS', 
        width: '100px',
        cellClassName: 'font-semibold'
    },
    { 
        key: 'detail_nilai', 
        label: 'Aksi', 
        width: '200px'
    },
    ];

    // Handle semester change
    useEffect(() => {
    fetchClassData(selectedSemester);
    }, [selectedSemester]);

    const fetchClassData = async (semester) => {
    setIsLoading(true);
    try {
    const response = await getClassForGradingByDosen(semester);
    if (response.status === 'success') {
        setMatkulData(response.data);

    }
    else {
        console.error('Failed to fetch class data:', response.message);
    }


    } catch (error) {
    console.error('Error fetching class data:', error);
    } finally {
    setIsLoading(false);
    }
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
                htmlFor="semester-select-dosen"
                className="text-sm font-semibold whitespace-nowrap"
                style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
            >
                Pilih Periode:
            </label>
            <select
                id="semester-select-dosen"
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
                    Daftar Mata Kuliah
                </h1>
                <p 
                    className="text-lg"
                    style={{ color: '#015023', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}
                >
                    {semesterOptions.find(s => s.value === selectedSemester)?.label}
                </p>
                </div>
            </div>
            </div>

            {/* Info Dosen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
                <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Dosen Pengampu
                </p>
                <p className="text-lg font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Dr. Ahmad Wijaya
                </p>
            </div>
            <div>
                <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Jumlah Mata Kuliah
                </p>
                <p className="text-lg font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {matkulData.length} Mata Kuliah
                </p>
            </div>
            </div>
        </div>

        {/* Table Nilai */}
        <div>
            <DataTable
            columns={columns}
            data={matkulData}
            actions={[]}
            pagination={false}
            customRender={customRender}
            />
        </div>
        </div>
        </div>
    );
}

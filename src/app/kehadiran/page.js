'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';

export default function KehadiranPage() {
	const router = useRouter();
	const [selectedSemester, setSelectedSemester] = useState('2024-ganjil');

// Data semester options
const semesterOptions = [
{ value: '2024-ganjil', label: 'Semester Ganjil 2024/2025' },
{ value: '2023-genap', label: 'Semester Genap 2023/2024' },
{ value: '2023-ganjil', label: 'Semester Ganjil 2023/2024' },
{ value: '2022-genap', label: 'Semester Genap 2022/2023' },
{ value: '2022-ganjil', label: 'Semester Ganjil 2022/2023' },
];

// Handle semester change
useEffect(() => {
// Simulasi fetch data berdasarkan semester
console.log('Fetching data for semester:', selectedSemester);
// TODO: Replace dengan API call
// fetchNilaiData(selectedSemester);
}, [selectedSemester]);

	// Dummy data daftar mata kuliah (presensi)
	const data = useMemo(() => [
		{
			kode_matkul: 'IF301',
			nama_matkul: 'Metode dan Model Pengembangan Perangkat Lunak',
			sks: 3,
			kelas: 'PL3AA',
			dosen: 'Dr. Ahmad Wijaya',
			jumlah_pertemuan: 8,
		},
		{
			kode_matkul: 'IF210',
			nama_matkul: 'Basis Data',
			sks: 3,
			kelas: 'BD2AB',
			dosen: 'Dra. Rina Pratiwi',
			jumlah_pertemuan: 9,
		},
		{
			kode_matkul: 'IF220',
			nama_matkul: 'Jaringan Komputer',
			sks: 3,
			kelas: 'JK2AA',
			dosen: 'Budi Santoso, M.Kom',
			jumlah_pertemuan: 7,
		},
		{
			kode_matkul: 'IF205',
			nama_matkul: 'Matematika Diskrit',
			sks: 3,
			kelas: 'MD2AC',
			dosen: 'Ayu Lestari, M.Si',
			jumlah_pertemuan: 10,
		},
		{
			kode_matkul: 'IF230',
			nama_matkul: 'Pemrograman Web Lanjut',
			sks: 3,
			kelas: 'PW3AB',
			dosen: 'Rahmat Hidayat, M.Kom',
			jumlah_pertemuan: 6,
		},
	], []);

	const columns = [
		{ key: 'kode_matkul', label: 'Kode Matkul', width: '130px', cellClassName: 'font-medium' },
		{ key: 'nama_matkul', label: 'Mata Kuliah', className: 'text-left', cellClassName: 'text-left font-medium' },
		{ key: 'sks', label: 'SKS', width: '80px', cellClassName: 'font-semibold' },
		{ key: 'kelas', label: 'Kelas', width: '100px', cellClassName: 'font-medium' },
		{ key: 'dosen', label: 'Dosen', className: 'text-left', cellClassName: 'text-left' },
		{ key: 'jumlah_pertemuan', label: 'Jumlah Pertemuan', width: '180px', cellClassName: 'font-medium text-center' },
		{ key: 'detail', label: 'Detail', width: '120px' },
	];

	const customRender = {
		detail: (_value, item) => (
			<div className="flex items-center justify-center">
				<button
					onClick={() => router.push(`/kehadiran/${item.kode_matkul}?nama=${encodeURIComponent(item.nama_matkul)}&kelas=${encodeURIComponent(item.kelas)}&sks=${item.sks}&dosen=${encodeURIComponent(item.dosen)}`)}
					className="flex items-center gap-2 text-white px-4 py-2 transition shadow-sm hover:opacity-90 font-semibold"
					style={{ backgroundColor: '#015023', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
				>
					<Eye className="w-4 h-4" />
					Detail
				</button>
			</div>
		),
		jumlah_pertemuan: (value) => (
			<span className="inline-block px-3 py-1 rounded-lg font-semibold" style={{ backgroundColor: '#DABC4E', color: '#015023' }}>
				{value} Pertemuan
			</span>
		),
	};

	return (
		<div className="min-h-screen bg-brand-light-sage">
			<Navbar />
			<div className="container mx-auto px-4 py-8 max-w-7xl">

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
					<h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
						Daftar Mata Kuliah - Presensi
					</h1>
					<p className="mt-2" style={{ color: '#015023', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}>
						Pilih mata kuliah untuk melihat detail presensi dan pertemuan.
					</p>
				</div>

				{/* Tabel Daftar Matkul */}
				<DataTable
					columns={columns}
					data={data}
					actions={[]}
					pagination={false}
					customRender={customRender}
				/>
			</div>
		</div>
	);
}


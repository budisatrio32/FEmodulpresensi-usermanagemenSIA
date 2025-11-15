'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import { Eye, GraduationCap, Users } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

export default function AkademikPage() {
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
		console.log('Fetching data for semester:', selectedSemester);
		// TODO: Replace dengan API call
		// fetchKelasData(selectedSemester);
	}, [selectedSemester]);

	// Dummy data daftar kelas
	const data = useMemo(() => [
		{
			kode_kelas: 'IF3AA',
			nama_kelas: 'Informatika 3AA',
			mata_kuliah: 'Metode dan Model Pengembangan Perangkat Lunak',
			kode_matkul: 'IF301',
		},
		{
			kode_kelas: 'IF2AB',
			nama_kelas: 'Informatika 2AB',
			mata_kuliah: 'Basis Data',
			kode_matkul: 'IF210',
		},
		{
			kode_kelas: 'IF2AA',
			nama_kelas: 'Informatika 2AA',
			mata_kuliah: 'Jaringan Komputer',
			kode_matkul: 'IF220',
		},
		{
			kode_kelas: 'IF2AC',
			nama_kelas: 'Informatika 2AC',
			mata_kuliah: 'Matematika Diskrit',
			kode_matkul: 'IF205',
		},
		{
			kode_kelas: 'IF3AB',
			nama_kelas: 'Informatika 3AB',
			mata_kuliah: 'Pemrograman Web Lanjut',
			kode_matkul: 'IF230',
		},
		{
			kode_kelas: 'IF1AA',
			nama_kelas: 'Informatika 1AA',
			mata_kuliah: 'Algoritma dan Pemrograman',
			kode_matkul: 'IF101',
		},
	], []);

	const columns = [
		{ key: 'kode_kelas', label: 'Kode Kelas', width: '130px', cellClassName: 'font-bold' },
		{ key: 'nama_kelas', label: 'Nama Kelas', width: '180px', cellClassName: 'font-medium' },
		{ key: 'mata_kuliah', label: 'Mata Kuliah', className: 'text-left', cellClassName: 'text-left' },
		{ key: 'detail', label: 'Detail Kelas', width: '140px' },
	];

	const customRender = {
		detail: (_value, item) => (
			<div className="flex items-center justify-center">
				<button
					onClick={() => router.push(`/akademik/detailkelas/${item.kode_kelas}?nama=${encodeURIComponent(item.nama_kelas)}&matkul=${encodeURIComponent(item.mata_kuliah)}`)}
					className="flex items-center gap-2 text-white px-4 py-2 transition shadow-sm hover:opacity-90 font-semibold"
					style={{ backgroundColor: '#015023', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
				>
					<Eye className="w-4 h-4" />
					Detail
				</button>
			</div>
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
					<div className="flex items-start gap-4">
						<div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
							<GraduationCap className="w-8 h-8 text-white" />
						</div>
						<div className="flex-1">
							<h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
								Data Akademik
							</h1>
							<p className="mt-2" style={{ color: '#015023', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}>
								Daftar kelas per periode akademik
							</p>
						</div>
					</div>
				</div>

				{/* Tabel Daftar Kelas */}
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

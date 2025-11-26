'use client';

import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLecturerClasses, getAcademicPeriods } from '@/lib/attendanceApi';
import { ErrorMessageBoxWithButton } from '@/components/ui/message-box';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import Footer from '@/components/ui/footer';

export default function KehadiranPage() {
	const router = useRouter();
	const [selectedSemester, setSelectedSemester] = useState('');
	const [semesterOptions, setSemesterOptions] = useState([]);
	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch academic periods only on mount
	useEffect(() => {
		fetchAcademicPeriods();
	}, []);

	// Fetch classes when semester changes
	useEffect(() => {
		if (selectedSemester !== '') {
			fetchClasses();
		}
	}, [selectedSemester]);

	const fetchClasses = async () => {
		setLoading(true);
		try {
			setError(null);
			console.log('Fetching lecturer classes with filter:', selectedSemester);

			const data = await getLecturerClasses(selectedSemester);
			console.log('API Response:', data);

			if (data.status === 'success') {
				setClasses(data.data);
				console.log('Classes loaded:', data.data.length, 'items');
			} else {
				const errorMsg = data.message || 'Gagal mengambil data kelas';
				console.error('API Error:', errorMsg);
				setError(errorMsg);
			}

		} catch (err) {
			console.error('Error fetching classes:', err);
			
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

	const fetchAcademicPeriods = async () => {
		try {
			const data = await getAcademicPeriods();

			if (data.status === 'success') {
				// Transform to dropdown options
				const options = data.data.map(period => ({
					value: period.id_academic_period.toString(),
					label: period.name,
					is_active: period.is_active
				}));
				setSemesterOptions(options);

				// Auto-select active period
				const activePeriod = options.find(opt => opt.is_active);
				if (activePeriod) {
					setSelectedSemester(activePeriod.value);
				}
			}
		} catch (err) {
			console.error('Error fetching academic periods:', err);
			setSemesterOptions([{ value: '', label: 'Semua Periode' }]);
		}
	};

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
					onClick={() => router.push(`/kehadiran/${item.kode_matkul}?id_class=${item.id_class}&nama=${encodeURIComponent(item.nama_matkul)}&kelas=${encodeURIComponent(item.kelas)}&sks=${item.sks}&dosen=${encodeURIComponent(item.dosen)}`)}
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
		<div className="min-h-screen bg-brand-light-sage flex flex-col">
			<Navbar/>
			<div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">

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

				{ /* Error Message */}
				{error && (
					<ErrorMessageBoxWithButton message={error} action={fetchClasses} />
				)}

				{/* Loading State */}
				{loading && (
					<div className="bg-white rounded-2xl shadow-lg p-8 text-center">
						<p className="text-lg" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>Memuat data...</p>
					</div>
				)}

				{/* Tabel Daftar Matkul */}
				{!loading && !error && (
					<DataTable
						columns={columns}
						data={classes}
						actions={[]}
						pagination={false}
						customRender={customRender}
					/>
				)}
			</div>
			<Footer/>
		</div>
	);
}

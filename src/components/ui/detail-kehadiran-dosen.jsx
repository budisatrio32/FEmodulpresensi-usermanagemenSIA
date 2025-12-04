'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, ClipboardCheck } from 'lucide-react';
import { getClassSchedules } from '@/lib/attendanceApi';
import { getPermissionForAClass } from '@/lib/permissionApi';
import { ErrorMessageBoxWithButton } from '@/components/ui/message-box';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import LoadingEffect from '@/components/ui/loading-effect';

export default function DetailKehadiranDosen() {
	const router = useRouter();
	const params = useParams();
	
	const id_class = params.kode;

	// State management
	const [classInfo, setClassInfo] = useState({
        code_subject: '',
        name_subject: '',
        code_class: '',
        sks: 0,
        dosen: ''
    });
	const [schedules, setSchedules] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [permissionChecked, setPermissionChecked] = useState(false);
	const [permissionGranted, setPermissionGranted] = useState(null);
	const [loadingPermission, setLoadingPermission] = useState(true);
	const [countdown, setCountdown] = useState(5);

	// Check permission on mount
	useEffect(() => {
		if (id_class) {
			checkPermission();
		}
	}, [id_class]);

	// Fetch data after permission is granted
	useEffect(() => {
		if (permissionChecked && permissionGranted) {
			fetchAll();
		}
	}, [permissionChecked, permissionGranted]);

	// Countdown redirect effect when permission is denied
	useEffect(() => {
		let timer;
		if (permissionGranted === false) {
			if (countdown > 0) {
				timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
			} else {
				handleBack();
			}
		}
		return () => clearTimeout(timer);
	}, [permissionGranted, countdown]);

	// Check Permission
	const checkPermission = async () => {
		setErrors(prev => ({...prev, permission: null}));
		setLoadingPermission(true);
		try {
			const response = await getPermissionForAClass(id_class);
			if (response.status === 'success') {
				// Check if permission is granted
				if (response.data.permission === false) {
					setPermissionGranted(false);
                    setPermissionChecked(true);
				} else {
                    setPermissionGranted(true);
					setPermissionChecked(true);
				}
			} else {
				setErrors(prev => ({...prev, permission: 'Gagal memeriksa izin akses: ' + response.message}));
			}
		} catch (error) {
			setErrors(prev => ({...prev, permission: 'Gagal memeriksa izin akses: ' + error.message}));
		} finally {
			setLoadingPermission(false);
		}
	};

	// Fetch All
	const fetchAll = async () => {
		setErrors(prev => ({...prev, fetch: null}));
		setIsLoading(true);
		await fetchClassSchedules();
		setIsLoading(false);
	};

	// Fetch class schedules from API
	const fetchClassSchedules = async () => {
		try {
			const data = await getClassSchedules(id_class);

			if (data.status === 'success') {
				setClassInfo(data.data.class_info);
				setSchedules(data.data.schedules);
			} else {
				setErrors(prev => ({...prev, fetch: 'Gagal mengambil data pertemuan: ' + data.message}));
			}
		} catch (err) {
			setErrors(prev => ({...prev, fetch: 'Terjadi kesalahan saat mengambil data: ' + err.message}));
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

	// Format jam (HH:mm dari HH:mm:ss)
	const formatJam = (time) => {
		if (!time) return '-';
		return time.substring(0, 5);
	};

	// Columns untuk dosen
	const columns = [
		{ key: 'tanggal', label: 'Tanggal', className: 'text-left', cellClassName: 'text-left' },
		{ key: 'jam', label: 'Jam Mulai - Selesai', width: '180px', cellClassName: 'text-center' },
		{ key: 'aksi', label: 'Aksi Presensi', width: '200px' },
	];

	// Custom render untuk dosen
	const customRender = {
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

	const handleBack = () => {
		router.push('/kehadiran');
	};

	// Show loading permission
	if (loadingPermission) {
		return <LoadingEffect message="Memeriksa izin akses..." />;
	} else if (permissionGranted === false) {
		return (
			<div className="min-h-screen bg-brand-light-sage">
				<Navbar />
				<div className="container mx-auto px-4 py-8 max-w-7xl">
					<ErrorMessageBoxWithButton
						message={'Anda tidak memiliki izin untuk mengakses kelas ini.' + `\n\nAkan dialihkan kembali dalam ${countdown} detik.`}
						action={handleBack}
						btntext={countdown > 0 ? `Kembali (${countdown})` : 'Kembali'}
					/>
				</div>
			</div>
		);
	} else if (errors.permission) {
		return (
			<div className="min-h-screen bg-brand-light-sage">
				<Navbar />
				<div className="container mx-auto px-4 py-8 max-w-7xl">
					<ErrorMessageBoxWithButton
						message={errors.permission}
						action={checkPermission}
					/>
				</div>
			</div>
		);
	} else if (isLoading) {
		return <LoadingEffect message="Memuat data jadwal..." />;
	} else if (errors.fetch) {
		return (
			<div className="min-h-screen bg-brand-light-sage">
				<Navbar />
				<div className="container mx-auto px-4 py-8 max-w-7xl">
					<ErrorMessageBoxWithButton
						message={errors.fetch}
						action={fetchAll}
						back={true}
						actionback={handleBack}
					/>
				</div>
			</div>
		);
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

				{/* Card Info Mata Kuliah */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
					<div className="flex items-start gap-4">
						<div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
							<CalendarDays className="w-8 h-8 text-white" />
						</div>
						<div className="flex-1">
							<h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
								Detail Presensi - {classInfo.code_subject}
							</h1>
							<p className="mt-1 text-lg" style={{ color: '#015023', opacity: 0.75, fontFamily: 'Urbanist, sans-serif' }}>
								{classInfo.name_subject}
							</p>
							<div className="mt-3 flex flex-wrap gap-3">
								<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
									Kelas: {classInfo.code_class}
								</span>
								<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
									{classInfo.sks} SKS
								</span>
								{classInfo.dosen && (
									<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#DABC4E', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
										Dosen: {classInfo.dosen}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Tabel Pertemuan */}
				{schedules.length > 0 ? (
					<div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
						<h2 className="text-xl font-bold mb-4" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
							Daftar Pertemuan & Input Presensi
						</h2>
						
						<DataTable
							columns={columns}
							data={schedules}
							actions={[]}
							pagination={false}
							customRender={customRender}
                            nomertext='Pertemuan'
						/>
					</div>
				) : (
					<div className="bg-white rounded-2xl shadow-lg p-8 text-center">
						<p className="text-lg" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
							Belum ada jadwal pertemuan untuk kelas ini.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

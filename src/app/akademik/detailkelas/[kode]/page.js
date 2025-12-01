'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import Footer from '@/components/ui/footer';
import DataTable from '@/components/ui/table';
import ChatModal from '@/components/ui/chatmodal';
import RoleSwitcher from '@/components/ui/role-switcher';
import { ArrowLeft, GraduationCap, Users, Mail, Phone, MessageCircle, Megaphone } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { getClassDetail } from '@/lib/ClassApi';

export default function DetailKelasPage({ params }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { kode } = params;
	
	const classId = searchParams.get('id') || '';

	// State for class data
	const [classData, setClassData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Get user role from localStorage
	const [userRole, setUserRole] = useState('mahasiswa');

	useEffect(() => {
		const role = localStorage.getItem('userRole') || 'mahasiswa';
		setUserRole(role);
	}, []);

	// Fetch class detail data
	useEffect(() => {
		const fetchClassData = async () => {
			if (!classId) {
				setError('ID kelas tidak ditemukan');
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const response = await getClassDetail(classId);
				
				if (response.status === 'success') {
					setClassData(response.data);
				} else {
					setError('Gagal memuat data kelas');
				}
			} catch (err) {
				console.error('Error fetching class detail:', err);
				setError(err.message || 'Terjadi kesalahan saat memuat data');
			} finally {
				setLoading(false);
			}
		};

		fetchClassData();
	}, [classId]);

	// Chat modal state
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [chatUser, setChatUser] = useState({ id: '', name: '', nim: '' });

	// Extract class info and students/lecturers from API response
	const classInfo = classData?.class_info || {};
	const mahasiswaData = classData?.students || [];
	const dosenData = useMemo(() => {
		if (!classInfo.dosen) return [];
		// Split dosen names by comma and create array
		const dosenNames = classInfo.dosen.split(', ');
		return dosenNames.map((nama, index) => ({
			id: index,
			nama: nama.trim(),
		}));
	}, [classInfo.dosen]);

	const columns = [
		{ key: 'nim', label: 'NIM', width: '140px', cellClassName: 'font-bold' },
		{ key: 'name', label: 'Nama Mahasiswa', className: 'text-left', cellClassName: 'text-left font-medium' },
		{ key: 'chat', label: 'Chat', width: '120px' },
	];

	const dosenColumns = [
		{ key: 'nama', label: 'Nama Dosen', className: 'text-left', cellClassName: 'text-left font-medium' },
		{ key: 'chat', label: 'Chat', width: '120px' },
	];

	const customRender = {
		chat: (_value, item) => (
			<div className="flex items-center justify-center">
				<button
					onClick={() => {
						setChatUser({ id: item.nim, name: item.name, nim: item.nim });
						setIsChatOpen(true);
					}}
					className="flex items-center gap-2 text-white px-3 py-2 transition shadow-sm hover:opacity-90 font-semibold"
					style={{ backgroundColor: '#16874B', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
				>
					<MessageCircle className="w-4 h-4" />
					Chat
				</button>
			</div>
		),
	};

	const dosenCustomRender = {
		chat: (_value, item) => (
			<div className="flex items-center justify-center">
				<button
					onClick={() => {
						setChatUser({ id: item.nama, name: item.nama, nim: '' });
						setIsChatOpen(true);
					}}
					className="flex items-center gap-2 text-white px-3 py-2 transition shadow-sm hover:opacity-90 font-semibold"
					style={{ backgroundColor: '#16874B', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
				>
					<MessageCircle className="w-4 h-4" />
					Chat
				</button>
			</div>
		),
	};

	return (
		<div className="min-h-screen bg-brand-light-sage flex flex-col">
			<Navbar/>
			<div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
				
				{/* Back Button */}
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
					style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
				>
					<ArrowLeft className="w-5 h-5" />
					Kembali ke Daftar Kelas
				</button>

				{/* Loading State */}
				{loading && (
					<div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center" style={{ borderRadius: '16px' }}>
						<p style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>Memuat data kelas...</p>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center" style={{ borderRadius: '16px' }}>
						<p style={{ color: '#dc2626', fontFamily: 'Urbanist, sans-serif' }}>{error}</p>
					</div>
				)}

				{/* Header */}
				{!loading && !error && classData && (
					<div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
						<div className="flex items-start gap-4">
							<div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
								<GraduationCap className="w-8 h-8 text-white" />
							</div>
							<div className="flex-1">
								<h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
									Detail Kelas - {classInfo.code_class || kode}
								</h1>
								<p className="mt-1 text-lg font-medium" style={{ color: '#015023', opacity: 0.75, fontFamily: 'Urbanist, sans-serif' }}>
									{classInfo.name_subject || '-'}
								</p>
								<div className="mt-3 flex flex-wrap gap-3">
									<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
										ID: {classInfo.id_class || '-'}
									</span>
									<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
										Kode: {classInfo.code_subject || '-'}
									</span>
									<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#DABC4E', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
										Semester: {classInfo.academic_period || '-'}
									</span>
									<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
										{classInfo.sks || 0} SKS
									</span>
								</div>
				</div>
				</div>
		</div>
				)}			{/* Tabel Daftar Dosen Pengampu */}
			{!loading && !error && classData && (
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
							Daftar Dosen Pengampu
						</h2>
						{userRole === 'dosen' && (
							<button
								onClick={() => router.push(`/akademik/detailkelas/${kode}/pengumuman?id=${classId}`)}
								className="flex items-center gap-2 text-white px-4 py-2 transition shadow-sm hover:opacity-90 font-semibold"
								style={{ backgroundColor: '#015023', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
							>
								<Megaphone className="w-4 h-4" />
								Buat Pengumuman
							</button>
						)}
					</div>
					
					<DataTable
						columns={dosenColumns}
						data={dosenData}
						actions={[]}
						pagination={false}
						customRender={dosenCustomRender}
					/>
				</div>
			)}

			{/* Tabel Daftar Mahasiswa */}
			{!loading && !error && classData && (
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
					<h2 className="text-xl font-bold mb-4" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
						Daftar Mahasiswa
					</h2>					<DataTable
							columns={columns}
							data={mahasiswaData}
							actions={[]}
							pagination={false}
							customRender={customRender}
						/>
					</div>
			)}
			</div>

			{/* Chat Modal */}
			<ChatModal
				isOpen={isChatOpen}
				onClose={() => setIsChatOpen(false)}
				userId={chatUser.id}
				userName={chatUser.name}
				userNim={chatUser.nim}
			/>

			{/* Role Switcher for Development/Testing */}
			<RoleSwitcher />
			<Footer/>
		</div>
	);
}

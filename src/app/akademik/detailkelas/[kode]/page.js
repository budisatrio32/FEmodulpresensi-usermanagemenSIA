'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import ChatModal from '@/components/ui/chatmodal';
import RoleSwitcher from '@/components/ui/role-switcher';
import { ArrowLeft, GraduationCap, Users, Mail, Phone, MessageCircle, Megaphone } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

export default function DetailKelasPage({ params }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { kode } = params;
	
	const namaKelas = searchParams.get('nama') || '';
	const mataKuliah = searchParams.get('matkul') || '';
	const dosen = searchParams.get('dosen') || '';
	const semester = searchParams.get('semester') || '';
	const sks = searchParams.get('sks') || '';

	// Get user role from localStorage
	const [userRole, setUserRole] = useState('mahasiswa');

	useEffect(() => {
		const role = localStorage.getItem('userRole') || 'mahasiswa';
		setUserRole(role);
	}, []);

	// Chat modal state
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [chatUser, setChatUser] = useState({ id: '', name: '', nim: '' });

	// Dummy data mahasiswa
	const mahasiswaData = useMemo(() => [
		{
			nim: '2021110001',
			nama: 'Andi Pratama',
			email: 'andi.pratama@student.ugn.ac.id',
		},
		{
			nim: '2021110002',
			nama: 'Budi Santoso',
			email: 'budi.santoso@student.ugn.ac.id',
		},
		{
			nim: '2021110003',
			nama: 'Citra Dewi',
			email: 'citra.dewi@student.ugn.ac.id',
		},
		{
			nim: '2021110004',
			nama: 'Dina Marlina',
			email: 'dina.marlina@student.ugn.ac.id',
		},
		{
			nim: '2021110005',
			nama: 'Eko Prasetyo',
			email: 'eko.prasetyo@student.ugn.ac.id',
		},
		{
			nim: '2021110006',
			nama: 'Fitri Handayani',
			email: 'fitri.handayani@student.ugn.ac.id',
		},
		{
			nim: '2021110007',
			nama: 'Gilang Ramadhan',
			email: 'gilang.ramadhan@student.ugn.ac.id',
		},
		{
			nim: '2021110008',
			nama: 'Hana Safitri',
			email: 'hana.safitri@student.ugn.ac.id',
		},
		{
			nim: '2021110009',
			nama: 'Indra Wijaya',
			email: 'indra.wijaya@student.ugn.ac.id',
		},
		{
			nim: '2021110010',
			nama: 'Joko Susanto',
			email: 'joko.susanto@student.ugn.ac.id',
		},
	], []);

	// Dummy data dosen
	const dosenData = useMemo(() => [
		{
			nama: 'Dr. Ahmad Wijaya, M.Kom',
			email: 'ahmad.wijaya@ugn.ac.id',
		},
		{
			nama: 'Dra. Rina Pratiwi, M.Pd',
			email: 'rina.pratiwi@ugn.ac.id',
		},
		{
			nama: 'Budi Santoso, M.Kom',
			email: 'budi.santoso@ugn.ac.id',
		},
	], []);

	const columns = [
		{ key: 'nim', label: 'NIM', width: '140px', cellClassName: 'font-bold' },
		{ key: 'nama', label: 'Nama Mahasiswa', className: 'text-left', cellClassName: 'text-left font-medium' },
		{ key: 'email', label: 'Email', className: 'text-left', cellClassName: 'text-left' },
		{ key: 'chat', label: 'Chat', width: '120px' },
	];

	const dosenColumns = [
		{ key: 'nama', label: 'Nama Dosen', className: 'text-left', cellClassName: 'text-left font-medium' },
		{ key: 'email', label: 'Email', className: 'text-left', cellClassName: 'text-left' },
		{ key: 'chat', label: 'Chat', width: '120px' },
	];

	const customRender = {
		email: (value) => (
			<div className="flex items-center gap-2">
				<Mail className="w-4 h-4" style={{ color: '#015023', opacity: 0.6 }} />
				<span style={{ color: '#015023' }}>{value}</span>
			</div>
		),
		chat: (_value, item) => (
			<div className="flex items-center justify-center">
				<button
					onClick={() => {
						setChatUser({ id: item.nim, name: item.nama, nim: item.nim });
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
		email: (value) => (
			<div className="flex items-center gap-2">
				<Mail className="w-4 h-4" style={{ color: '#015023', opacity: 0.6 }} />
				<span style={{ color: '#015023' }}>{value}</span>
			</div>
		),
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
					Kembali ke Daftar Kelas
				</button>

				{/* Header */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
					<div className="flex items-start gap-4">
						<div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
							<GraduationCap className="w-8 h-8 text-white" />
						</div>
						<div className="flex-1">
							<h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
								Detail Kelas - {kode}
							</h1>
							<p className="mt-1 text-lg font-medium" style={{ color: '#015023', opacity: 0.75, fontFamily: 'Urbanist, sans-serif' }}>
								{namaKelas}
							</p>
							<div className="mt-3 flex flex-wrap gap-3">
								<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
									{mataKuliah}
								</span>
								<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#DABC4E', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
									Semester {semester}
								</span>
								<span className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f3f4f6', color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
									{sks} SKS
								</span>
							</div>
				</div>
				</div>
			</div>

			{/* Tabel Daftar Dosen Pengampu */}
			<div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
						Daftar Dosen Pengampu
					</h2>
					{userRole === 'dosen' && (
						<button
							onClick={() => router.push(`/akademik/detailkelas/${kode}/pengumuman`)}
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

			{/* Tabel Daftar Mahasiswa */}
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
		</div>
	);
}

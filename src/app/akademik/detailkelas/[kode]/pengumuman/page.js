'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import Footer from '@/components/ui/footer';
import { ArrowLeft, Send, Megaphone } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { createAnnouncement } from '@/lib/notificationApi';
import LoadingEffect from '@/components/ui/loading-effect';

export default function BuatPengumumanPage() {
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();
	const { kode } = params;

	const [formData, setFormData] = useState({
		judul: '',
		isi: '',
	});

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [classId, setClassId] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Get class ID from URL params
	useEffect(() => {
		// Try to get id from URL params first
		const idFromUrl = searchParams.get('id');
		
		if (idFromUrl) {
			setClassId(parseInt(idFromUrl));
			setIsLoading(false);
		} else {
			// Fallback: fetch from API if id not in URL
			const fetchClassId = async () => {
				try {
					const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lecturer/classes`, {
						credentials: 'include'
					});
					const data = await response.json();
					
					if (data.status === 'success') {
						const targetClass = data.data.find(c => c.code_class === kode);
						if (targetClass) {
							setClassId(targetClass.id_class);
						}
					}
				} catch (error) {
					console.error('Error fetching class ID:', error);
				} finally {
					setIsLoading(false);
				}
			};
			
			fetchClassId();
		}
	}, [kode, searchParams]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error saat user mulai mengetik
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		// Title is now optional - will auto-generate if empty
		// if (!formData.judul.trim()) {
		// 	newErrors.judul = 'Judul pengumuman harus diisi';
		// }

		if (!formData.isi.trim()) {
			newErrors.isi = 'Isi pengumuman harus diisi';
		} else if (formData.isi.trim().length < 10) {
			newErrors.isi = 'Isi pengumuman minimal 10 karakter';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		if (!classId) {
			alert('Gagal mendapatkan ID kelas. Silakan coba lagi.');
			return;
		}

		setIsSubmitting(true);

		try {
			const payload = {
				id_class: classId,
				title: formData.judul.trim() || null, // null will trigger auto-generate
				message: formData.isi.trim()
			};

			const response = await createAnnouncement(payload);

			if (response.status === 'success') {
				alert('Pengumuman berhasil dikirim!');
				router.back();
			} else {
				alert('Gagal mengirim pengumuman: ' + (response.message || 'Terjadi kesalahan'));
			}
		} catch (error) {
			console.error('Error submitting announcement:', error);
			alert('Gagal mengirim pengumuman: ' + (error.message || 'Terjadi kesalahan'));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return <LoadingEffect message="Memuat form..." />;
	}

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
					Kembali
				</button>

				{/* Header */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
					<div className="flex items-start gap-4">
						<div className="p-4 rounded-xl" style={{ backgroundColor: '#015023' }}>
							<Megaphone className="w-8 h-8 text-white" />
						</div>
						<div className="flex-1">
							<h1 className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
								Buat Pengumuman
							</h1>
							<p className="mt-2" style={{ color: '#015023', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}>
								Kelas {kode}
							</p>
						</div>
					</div>
				</div>

				{/* Form */}
				<div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
					<form onSubmit={handleSubmit} className="space-y-6">
						
						{/* Judul */}
						<div>
							<label 
								htmlFor="judul"
								className="block text-sm font-semibold mb-2"
								style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
							>
								Judul Pengumuman
							</label>
							<input
								type="text"
								id="judul"
								name="judul"
								value={formData.judul}
								onChange={handleChange}
								placeholder="Masukkan judul pengumuman"
								className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition"
									style={{
										fontFamily: 'Urbanist, sans-serif',
										borderColor: errors.judul ? '#BE0414' : '#015023',
										borderRadius: '12px',
										opacity: errors.judul ? 1 : 0.7
									}}
								/>
								{errors.judul && (
									<p className="mt-1 text-sm" style={{ color: '#BE0414', fontFamily: 'Urbanist, sans-serif' }}>
										{errors.judul}
									</p>
								)}
								<p className="mt-1 text-xs" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
									Opsional. Jika kosong, akan otomatis menjadi "Pengumuman Kelas - {kode}"
								</p>
							</div>						{/* Isi Pengumuman */}
						<div>
							<label 
								htmlFor="isi"
								className="block text-sm font-semibold mb-2"
								style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
							>
								Isi Pengumuman <span className="text-red-600">*</span>
							</label>
							<textarea
								id="isi"
								name="isi"
								value={formData.isi}
								onChange={handleChange}
								placeholder="Tulis isi pengumuman di sini..."
								rows={8}
								className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition resize-none"
								style={{
									fontFamily: 'Urbanist, sans-serif',
									borderColor: errors.isi ? '#BE0414' : '#015023',
									borderRadius: '12px',
									opacity: errors.isi ? 1 : 0.7
								}}
							/>
							{errors.isi && (
								<p className="mt-1 text-sm" style={{ color: '#BE0414', fontFamily: 'Urbanist, sans-serif' }}>
									{errors.isi}
								</p>
							)}
							<p className="mt-1 text-xs" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
								Minimal 10 karakter
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3 pt-4">
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
								style={{
									backgroundColor: '#015023',
									color: 'white',
									fontFamily: 'Urbanist, sans-serif',
									borderRadius: '12px'
								}}
							>
								<Send className="w-5 h-5" />
								{isSubmitting ? 'Mengirim...' : 'Kirim Pengumuman'}
							</button>
							<button
								type="button"
								onClick={() => router.back()}
								className="px-6 py-3 rounded-xl font-semibold transition shadow-sm hover:opacity-90"
								style={{
									backgroundColor: '#f3f4f6',
									color: '#015023',
									fontFamily: 'Urbanist, sans-serif',
									borderRadius: '12px'
								}}
							>
								Batal
							</button>
						</div>
					</form>
				</div>
			</div>
			<Footer/>
		</div>
	);
}

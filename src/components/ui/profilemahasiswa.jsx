'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, MapPin, Users } from 'lucide-react';
import { Field, FieldLabel, FieldContent, FieldDescription, FieldError } from '@/components/ui/field';
import { PrimaryButton, OutlineButton, WarningButton } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ProfileMahasiswa() {
const router = useRouter();
const [isLoading, setIsLoading] = useState(false);
const [errors, setErrors] = useState({});

// State untuk data profile mahasiswa
const [profileData, setProfileData] = useState({
// Data yang bisa edit dan dilihat
registration_number: '2021110001',
full_name: 'John Doe',
alamat: 'Jl. Mawar No. 123',
dusun: 'Dusun Makmur',
kelurahan: 'Kelurahan Sejahtera',
kecamatan: 'Kecamatan Bahagia',
city_regency: 'Kota Jakarta',
provinsi: 'DKI Jakarta',
kode_pos: '12345',

// Data yang bisa edit dan dilihat
gender: 'Laki-laki',
religion: 'Islam',
tanggal_lahir: '2000-01-15',
tempat_lahir: 'Jakarta',
nik: '3201010101000001',
nomor_kartu_keluarga: '3201010101000001',
citizenship: 'WNI',
birth_order: '1',
jumlah_saudara: '2',
sekolah_asal: 'SMA Negeri 1 Jakarta',
});

const handleChange = (e) => {
const { name, value } = e.target;
setProfileData(prev => ({
    ...prev,
    [name]: value
}));
// Clear error untuk field ini
if (errors[name]) {
    setErrors(prev => ({
    ...prev,
    [name]: ''
    }));
}
};

const validateForm = () => {
const newErrors = {};

// Validasi data wajib
if (!profileData.registration_number?.trim()) {
    newErrors.registration_number = 'Registration Number wajib diisi';
}

if (!profileData.full_name?.trim()) {
    newErrors.full_name = 'Nama Lengkap wajib diisi';
}

if (!profileData.alamat?.trim()) {
    newErrors.alamat = 'Alamat wajib diisi';
}

if (!profileData.gender) {
    newErrors.gender = 'Jenis Kelamin wajib dipilih';
}

if (!profileData.religion) {
    newErrors.religion = 'Agama wajib dipilih';
}

if (!profileData.tanggal_lahir) {
    newErrors.tanggal_lahir = 'Tanggal Lahir wajib diisi';
}

if (!profileData.tempat_lahir?.trim()) {
    newErrors.tempat_lahir = 'Tempat Lahir wajib diisi';
}

if (!profileData.nik?.trim()) {
    newErrors.nik = 'NIK wajib diisi';
} else if (profileData.nik.length !== 16) {
    newErrors.nik = 'NIK harus 16 digit';
}

setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
e.preventDefault();

if (!validateForm()) {
    return;
}

setIsLoading(true);

try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: Replace with actual API call
    // const response = await fetch('/api/profile/mahasiswa', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify(profileData)
    // });

    // if (!response.ok) throw new Error('Gagal memperbarui profile');

    alert('Profile berhasil diperbarui!');
} catch (error) {
    alert('Gagal memperbarui profile: ' + error.message);
} finally {
    setIsLoading(false);
}
};

const handleCancel = () => {
if (window.confirm('Apakah Anda yakin ingin membatalkan perubahan?')) {
    router.back();
}
};

const genderOptions = ['Laki-laki', 'Perempuan'];
const religionOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
const citizenshipOptions = ['WNI', 'WNA'];

return (
<div className="min-h-screen bg-brand-light-sage">
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button
    onClick={() => router.back()}
    className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
    style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
    >
    <ArrowLeft className="w-5 h-5" />
    Kembali
    </button>

    {/* Header dengan Avatar */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
    <div className="flex items-center gap-6">
        <Avatar className="size-24 sm:size-28">
        <AvatarImage src="/profile-placeholder.jpg" alt={profileData.full_name} />
        <AvatarFallback className="text-2xl">
            {profileData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </AvatarFallback>
        </Avatar>
        <div>
        <h1 
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
        >
            Profile Mahasiswa
        </h1>
        <p 
            className="text-lg"
            style={{ color: '#015023', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}
        >
            {profileData.full_name}
        </p>
        <p 
            className="text-sm"
            style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}
        >
            NIM: {profileData.registration_number}
        </p>
        </div>
    </div>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
    {/* Section 1: Data Identitas */}
    <div 
        className="bg-white rounded-2xl shadow-lg p-6"
        style={{ borderRadius: '16px' }}
    >
        <div className="flex items-center gap-3 mb-6">
        <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#015023' }}
        >
            <User className="w-6 h-6 text-white" />
        </div>
        <div>
            <h2 
            className="text-xl font-bold"
            style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
            >
            Data Identitas
            </h2>
            <p 
            className="text-sm"
            style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}
            >
            Informasi pribadi dan identitas
            </p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Number */}
        <Field>
            <FieldLabel htmlFor="registration_number">
            Registration Number (NIM) <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Nomor induk mahasiswa
            </FieldDescription>
            <FieldContent>
            <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={profileData.registration_number}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.registration_number ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.registration_number ? 1 : 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
            {errors.registration_number && (
            <FieldError>{errors.registration_number}</FieldError>
            )}
        </Field>

        {/* Full Name */}
        <Field>
            <FieldLabel htmlFor="full_name">
            Nama Lengkap <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Nama lengkap sesuai KTP
            </FieldDescription>
            <FieldContent>
            <input
                type="text"
                id="full_name"
                name="full_name"
                value={profileData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.full_name ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.full_name ? 1 : 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
            {errors.full_name && (
            <FieldError>{errors.full_name}</FieldError>
            )}
        </Field>

        {/* Gender */}
        <Field>
            <FieldLabel htmlFor="gender">
            Jenis Kelamin <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Pilih jenis kelamin
            </FieldDescription>
            <FieldContent>
            <select
                id="gender"
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100 appearance-none cursor-pointer"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.gender ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.gender ? 1 : 0.7,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23015023' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem'
                }}
                disabled={isLoading}
            >
                <option value="">Pilih Jenis Kelamin</option>
                {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
                ))}
            </select>
            </FieldContent>
            {errors.gender && (
            <FieldError>{errors.gender}</FieldError>
            )}
        </Field>

        {/* Religion */}
        <Field>
            <FieldLabel htmlFor="religion">
            Agama <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Pilih agama
            </FieldDescription>
            <FieldContent>
            <select
                id="religion"
                name="religion"
                value={profileData.religion}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100 appearance-none cursor-pointer"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.religion ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.religion ? 1 : 0.7,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23015023' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem'
                }}
                disabled={isLoading}
            >
                <option value="">Pilih Agama</option>
                {religionOptions.map(option => (
                <option key={option} value={option}>{option}</option>
                ))}
            </select>
            </FieldContent>
            {errors.religion && (
            <FieldError>{errors.religion}</FieldError>
            )}
        </Field>

        {/* Tempat Lahir */}
        <Field>
            <FieldLabel htmlFor="tempat_lahir">
            Tempat Lahir <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Kota/Kabupaten tempat lahir
            </FieldDescription>
            <FieldContent>
            <input
                type="text"
                id="tempat_lahir"
                name="tempat_lahir"
                value={profileData.tempat_lahir}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.tempat_lahir ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.tempat_lahir ? 1 : 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
            {errors.tempat_lahir && (
            <FieldError>{errors.tempat_lahir}</FieldError>
            )}
        </Field>

        {/* Tanggal Lahir */}
        <Field>
            <FieldLabel htmlFor="tanggal_lahir">
            Tanggal Lahir <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Format: DD/MM/YYYY
            </FieldDescription>
            <FieldContent>
            <input
                type="date"
                id="tanggal_lahir"
                name="tanggal_lahir"
                value={profileData.tanggal_lahir}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.tanggal_lahir ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.tanggal_lahir ? 1 : 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
            {errors.tanggal_lahir && (
            <FieldError>{errors.tanggal_lahir}</FieldError>
            )}
        </Field>

        {/* NIK */}
        <Field>
            <FieldLabel htmlFor="nik">
            NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            16 digit NIK sesuai KTP
            </FieldDescription>
            <FieldContent>
            <input
                type="text"
                id="nik"
                name="nik"
                value={profileData.nik}
                onChange={handleChange}
                maxLength="16"
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.nik ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.nik ? 1 : 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
            {errors.nik && (
            <FieldError>{errors.nik}</FieldError>
            )}
        </Field>

        {/* Nomor Kartu Keluarga */}
        <Field>
            <FieldLabel htmlFor="nomor_kartu_keluarga">
            Nomor Kartu Keluarga
            </FieldLabel>
            <FieldDescription>
            16 digit nomor KK
            </FieldDescription>
            <FieldContent>
            <input
                type="text"
                id="nomor_kartu_keluarga"
                name="nomor_kartu_keluarga"
                value={profileData.nomor_kartu_keluarga}
                onChange={handleChange}
                maxLength="16"
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: '#015023',
                borderRadius: '12px',
                opacity: 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
        </Field>

        {/* Citizenship */}
        <Field>
            <FieldLabel htmlFor="citizenship">
            Kewarganegaraan
            </FieldLabel>
            <FieldDescription>
            WNI atau WNA
            </FieldDescription>
            <FieldContent>
            <select
                id="citizenship"
                name="citizenship"
                value={profileData.citizenship}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100 appearance-none cursor-pointer"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: '#015023',
                borderRadius: '12px',
                opacity: 0.7,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23015023' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem'
                }}
                disabled={isLoading}
            >
                <option value="">Pilih Kewarganegaraan</option>
                {citizenshipOptions.map(option => (
                <option key={option} value={option}>{option}</option>
                ))}
            </select>
            </FieldContent>
        </Field>
        </div>
    </div>

    {/* Section 2: Alamat */}
    <div 
        className="bg-white rounded-2xl shadow-lg p-6"
        style={{ borderRadius: '16px' }}
    >
        <div className="flex items-center gap-3 mb-6">
        <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#015023' }}
        >
            <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
            <h2 
            className="text-xl font-bold"
            style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
            >
            Alamat Lengkap
            </h2>
            <p 
            className="text-sm"
            style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}
            >
            Informasi tempat tinggal
            </p>
        </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
        {/* Alamat */}
        <Field>
            <FieldLabel htmlFor="alamat">
            Alamat <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Alamat lengkap tempat tinggal
            </FieldDescription>
            <FieldContent>
            <textarea
                id="alamat"
                name="alamat"
                value={profileData.alamat}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100 resize-none"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.alamat ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.alamat ? 1 : 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
            {errors.alamat && (
            <FieldError>{errors.alamat}</FieldError>
            )}
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dusun */}
            <Field>
            <FieldLabel htmlFor="dusun">
                Dusun
            </FieldLabel>
            <FieldContent>
                <input
                type="text"
                id="dusun"
                name="dusun"
                value={profileData.dusun}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px',
                    opacity: 0.7
                }}
                disabled={isLoading}
                />
            </FieldContent>
            </Field>

            {/* Kelurahan */}
            <Field>
            <FieldLabel htmlFor="kelurahan">
                Kelurahan/Desa
            </FieldLabel>
            <FieldContent>
                <input
                type="text"
                id="kelurahan"
                name="kelurahan"
                value={profileData.kelurahan}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px',
                    opacity: 0.7
                }}
                disabled={isLoading}
                />
            </FieldContent>
            </Field>

            {/* Kecamatan */}
            <Field>
            <FieldLabel htmlFor="kecamatan">
                Kecamatan
            </FieldLabel>
            <FieldContent>
                <input
                type="text"
                id="kecamatan"
                name="kecamatan"
                value={profileData.kecamatan}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px',
                    opacity: 0.7
                }}
                disabled={isLoading}
                />
            </FieldContent>
            </Field>

            {/* City/Regency */}
            <Field>
            <FieldLabel htmlFor="city_regency">
                Kota/Kabupaten
            </FieldLabel>
            <FieldContent>
                <input
                type="text"
                id="city_regency"
                name="city_regency"
                value={profileData.city_regency}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px',
                    opacity: 0.7
                }}
                disabled={isLoading}
                />
            </FieldContent>
            </Field>

            {/* Provinsi */}
            <Field>
            <FieldLabel htmlFor="provinsi">
                Provinsi
            </FieldLabel>
            <FieldContent>
                <input
                type="text"
                id="provinsi"
                name="provinsi"
                value={profileData.provinsi}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px',
                    opacity: 0.7
                }}
                disabled={isLoading}
                />
            </FieldContent>
            </Field>

            {/* Kode Pos */}
            <Field>
            <FieldLabel htmlFor="kode_pos">
                Kode Pos
            </FieldLabel>
            <FieldContent>
                <input
                type="text"
                id="kode_pos"
                name="kode_pos"
                value={profileData.kode_pos}
                onChange={handleChange}
                maxLength="5"
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px',
                    opacity: 0.7
                }}
                disabled={isLoading}
                />
            </FieldContent>
            </Field>
        </div>
        </div>
    </div>

    {/* Section 3: Data Keluarga & Pendidikan */}
    <div 
        className="bg-white rounded-2xl shadow-lg p-6"
        style={{ borderRadius: '16px' }}
    >
        <div className="flex items-center gap-3 mb-6">
        <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#015023' }}
        >
            <Users className="w-6 h-6 text-white" />
        </div>
        <div>
            <h2 
            className="text-xl font-bold"
            style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
            >
            Data Keluarga & Pendidikan
            </h2>
            <p 
            className="text-sm"
            style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}
            >
            Informasi keluarga dan riwayat pendidikan
            </p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Birth Order */}
        <Field>
            <FieldLabel htmlFor="birth_order">
            Anak Ke-
            </FieldLabel>
            <FieldDescription>
            Urutan kelahiran dalam keluarga
            </FieldDescription>
            <FieldContent>
            <input
                type="number"
                id="birth_order"
                name="birth_order"
                value={profileData.birth_order}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: '#015023',
                borderRadius: '12px',
                opacity: 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
        </Field>

        {/* Jumlah Saudara */}
        <Field>
            <FieldLabel htmlFor="jumlah_saudara">
            Jumlah Saudara
            </FieldLabel>
            <FieldDescription>
            Total jumlah saudara kandung
            </FieldDescription>
            <FieldContent>
            <input
                type="number"
                id="jumlah_saudara"
                name="jumlah_saudara"
                value={profileData.jumlah_saudara}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: '#015023',
                borderRadius: '12px',
                opacity: 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
        </Field>

        {/* Sekolah Asal */}
        <Field className="md:col-span-2">
            <FieldLabel htmlFor="sekolah_asal">
            Sekolah Asal
            </FieldLabel>
            <FieldDescription>
            Nama sekolah menengah atas terakhir
            </FieldDescription>
            <FieldContent>
            <input
                type="text"
                id="sekolah_asal"
                name="sekolah_asal"
                value={profileData.sekolah_asal}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: '#015023',
                borderRadius: '12px',
                opacity: 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
        </Field>
        </div>
    </div>

    {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <WarningButton
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="sm:min-w-[150px]"
        >
            Batal
            </WarningButton>
        
        <PrimaryButton
            type="submit"
            disabled={isLoading}
            className="sm:min-w-[150px]"
        >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </PrimaryButton>
        </div>
    </form>
    </div>
</div>
);
}

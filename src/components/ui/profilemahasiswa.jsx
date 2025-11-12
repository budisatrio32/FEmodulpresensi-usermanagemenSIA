'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, MapPin, Users, Eye, EyeOff, Upload, X, Lock } from 'lucide-react';
import { Field, FieldLabel, FieldContent, FieldDescription, FieldError } from '@/components/ui/field';
import { PrimaryButton, OutlineButton, WarningButton } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getStudentProfile, getStudentAddress, getStudentFamilyEducation } from '@/lib/profileApi';
import LoadingEffect from './loading-effect';

export default function ProfileMahasiswa() {
const router = useRouter();
const [isLoading, setIsLoading] = useState(false);
const [isFetching, setIsFetching] = useState(true);
const [errors, setErrors] = useState({});
const [showOldPassword, setShowOldPassword] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [imagePreview, setImagePreview] = useState(null);

// State untuk data profile mahasiswa
const [profileData, setProfileData] = useState({
    // Data yang bisa edit dan dilihat
    // profile umum
    registration_number: '',
    full_name: '',
    username: '',
    email: '',
    program: '', 

    //
    old_password: '',
    password: '',
    confirm_password: '',
    profile_image: null,
    alamat: '',
    dusun: '',
    kelurahan: '',
    kecamatan: '',
    city_regency: '',
    provinsi: '',
    kode_pos: '',

    // Data yang bisa edit dan dilihat
    gender: '',
    religion: '',
    tanggal_lahir: '',
    tempat_lahir: '',
    nik: '',
    nomor_kartu_keluarga: '',
    citizenship: '',
    birth_order: '',
    jumlah_saudara: '',
    sekolah_asal: '',
});

const [oldData, setOldData] = useState({
    // Data yang bisa edit dan dilihat
    // profile umum
    registration_number: '',
    full_name: '',
    username: '',
    email: '',
    program: '',

    //
    old_password: '',
    password: '',
    confirm_password: '',
    profile_image: null,
    alamat: '',
    dusun: '',
    kelurahan: '',
    kecamatan: '',
    city_regency: '',
    provinsi: '',
    kode_pos: '',

    // Data yang bisa edit dan dilihat
    gender: '',
    religion: '',
    tanggal_lahir: '',
    tempat_lahir: '',
    nik: '',
    nomor_kartu_keluarga: '',
    citizenship: '',
    birth_order: '',
    jumlah_saudara: '',
    sekolah_asal: '',
});

const [editableData, setEditableData] = useState({
    // Data yang bisa edit opsional kalo data di database null
    gender: false,
    tanggal_lahir: false,
    tempat_lahir: false,
    nik: false,
    nomor_kartu_keluarga: false,
    citizenship: false,
    birth_order: false,
    sekolah_asal: false,
});

useEffect(() => {
    fetchAll();
}, []);

const fetchAll = async () => {
    setErrors(prev => ({...prev, fetch: null}));
    setIsFetching(true);
    await Promise.all([
        FetchProfileData(),
        FetchAddressData(),
        FetchFamilyEducationData(),
    ]);
    setIsFetching(false);
};

const FetchProfileData = async () => {
    // alert('Debug: FetchProfileData dipanggil');
    try {
        const response = await getStudentProfile()
        if (response.status === 'success') {
            setProfileData(prev => ({
                ...prev, 
                registration_number: response.data.registration_number,
                full_name: response.data.name,
                username: response.data.username,
                email: response.data.email,
                profile_image: response.data.profile_image,
                program: response.data.program_name,
                gender: response.data.gender,
                religion: response.data.religion,
                tanggal_lahir: response.data.birth_date ? response.data.birth_date.slice(0, 10) : '',
                tempat_lahir: response.data.birth_place,
                nik: response.data.nik,
                nomor_kartu_keluarga: response.data.no_kk,
                citizenship: response.data.citizenship,
            }));
            setOldData(prev => ({
                ...prev,
                registration_number: response.data.registration_number,
                full_name: response.data.name,
                username: response.data.username,
                email: response.data.email,
                profile_image: response.data.profile_image,
                program: response.data.program_name,
                gender: response.data.gender,
                religion: response.data.religion,
                tanggal_lahir: response.data.birth_date ? response.data.birth_date.slice(0, 10) : '',
                tempat_lahir: response.data.birth_place,
                nik: response.data.nik,
                nomor_kartu_keluarga: response.data.no_kk,
                citizenship: response.data.citizenship,
            }));
            setEditableData(prev => ({
                ...prev,
                gender: response.data.editable_fields.gender,
                tanggal_lahir: response.data.editable_fields.birth_date,
                tempat_lahir: response.data.editable_fields.birth_place,
                nik: response.data.editable_fields.nik,
                nomor_kartu_keluarga: response.data.editable_fields.no_kk,
                citizenship: response.data.editable_fields.citizenship,
            }))
        } else {
            setErrors(prev => ({...prev, fetch: 'Gagal mengambil data profile: ' + response.message}));
        }
    } catch (error) {
        setErrors(prev => ({...prev, fetch: 'Gagal mengambil data profile: ' + error.message}));
    }
};

const FetchAddressData = async () => {
    try {
        const response = await getStudentAddress()
        if (response.status === 'success') {
            setProfileData(prev => ({
                ...prev,
                alamat: response.data.full_address,
                dusun: response.data.dusun,
                kelurahan: response.data.kelurahan,
                kecamatan: response.data.kecamatan,
                city_regency: response.data.city_regency,
                provinsi: response.data.provinsi,
                kode_pos: response.data.postal_code,
            }));
            setOldData(prev => ({
                ...prev,
                alamat: response.data.full_address,
                dusun: response.data.dusun,
                kelurahan: response.data.kelurahan,
                kecamatan: response.data.kecamatan,
                city_regency: response.data.city_regency,
                provinsi: response.data.provinsi,
                kode_pos: response.data.postal_code,
            }));
        } else {
            setErrors(prev => ({...prev, fetch: 'Gagal mengambil data alamat: ' + response.message}));
        }
    } catch (error) {
        setErrors(prev => ({...prev, fetch: 'Gagal mengambil data alamat: ' + error.message}));
    }
};

const FetchFamilyEducationData = async () => {
    try {
        const response = await getStudentFamilyEducation()
        if (response.status === 'success') {
            setProfileData(prev => ({
                ...prev,
                birth_order: response.data.birth_order,
                jumlah_saudara: response.data.number_of_siblings,
                sekolah_asal: response.data.previous_school,
            }));
            setOldData(prev => ({
                ...prev,
                birth_order: response.data.birth_order,
                jumlah_saudara: response.data.number_of_siblings,
                sekolah_asal: response.data.previous_school,
            }));
            setEditableData(prev => ({
                ...prev,
                birth_order: response.data.editable_fields.birth_order,
                sekolah_asal: response.data.editable_fields.previous_school,
            }))
        } else {
            setErrors(prev => ({...prev, fetch: 'Gagal mengambil data edukasi: ' + response.message}));
        }
    } catch (error) {
        setErrors(prev => ({...prev,  fetch: 'Gagal mengambil data edukasi: ' + error.message}))
    }
};

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

const handleImageChange = (e) => {
const file = e.target.files[0];
if (file) {
    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
    setErrors(prev => ({
        ...prev,
        profile_image: 'Ukuran file maksimal 2MB'
    }));
    return;
    }

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
    setErrors(prev => ({
        ...prev,
        profile_image: 'File harus berupa gambar'
    }));
    return;
    }

    setProfileData(prev => ({
    ...prev,
    profile_image: file
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
    setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear error
    if (errors.profile_image) {
    setErrors(prev => ({
        ...prev,
        profile_image: ''
    }));
    }
}
};

const handleRemoveImage = () => {
setProfileData(prev => ({
    ...prev,
    profile_image: null
}));
setImagePreview(null);
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

if (!profileData.username?.trim()) {
    newErrors.username = 'Username wajib diisi';
} else if (profileData.username.length < 3) {
    newErrors.username = 'Username minimal 3 karakter';
}

if (!profileData.email?.trim()) {
    newErrors.email = 'Email wajib diisi';
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
    newErrors.email = 'Format email tidak valid';
}

// Validasi password (opsional, hanya jika diisi)
if (profileData.password || profileData.old_password) {
    // Jika mengisi password baru, harus mengisi password lama
    if (profileData.password && !profileData.old_password) {
    newErrors.old_password = 'Password lama wajib diisi untuk mengubah password';
    }
    
    if (profileData.password && profileData.password.length < 6) {
    newErrors.password = 'Password minimal 6 karakter';
    }
    
    if (profileData.password !== profileData.confirm_password) {
    newErrors.confirm_password = 'Password tidak cocok';
    }
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
    
    // Clear password fields after successful submit
    setProfileData(prev => ({
        ...prev,
        old_password: '',
        password: '',
        confirm_password: ''
    }));
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
const handleBack = () => {
    router.back();
};

const genderOptions = ['Laki-laki', 'Perempuan'];
const religionOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
const citizenshipOptions = ['WNI', 'WNA'];

if (isFetching) {
    return (
        <LoadingEffect />
    );
}

if (errors.fetch) {
    return (
        <div className="min-h-screen bg-brand-light-sage">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
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
        <AvatarImage src={imagePreview} alt={profileData.full_name} />
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
            Nomor induk mahasiswa <span className="text-red-500">(tidak dapat diubah)</span>
            </FieldDescription>
            <FieldContent>
            <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={profileData.registration_number}
                className="w-full px-4 py-3 border-2 focus:outline-none cursor-not-allowed bg-gray-50"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: '#015023',
                borderRadius: '12px',
                opacity: 0.5
                }}
                disabled
                readOnly
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

        {/* Username */}
        <Field>
            <FieldLabel htmlFor="username">
            Username <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Username untuk login (min. 3 karakter)
            </FieldDescription>
            <FieldContent>
            <input
                type="text"
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 focus:outline-none focus:border-opacity-100"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.username ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: errors.username ? 1 : 0.7
                }}
                disabled={isLoading}
            />
            </FieldContent>
            {errors.username && (
            <FieldError>{errors.username}</FieldError>
            )}
        </Field>

        {/* Email */}
        <Field>
            <FieldLabel htmlFor="email">
            Email <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Email aktif untuk komunikasi <span className="text-red-500">(tidak dapat diubah)</span>
            </FieldDescription>
            <FieldContent>
            <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                className="w-full px-4 py-3 border-2 focus:outline-none cursor-not-allowed bg-gray-50"
                style={{
                fontFamily: 'Urbanist, sans-serif',
                borderColor: errors.email ? '#BE0414' : '#015023',
                borderRadius: '12px',
                opacity: 0.5
                }}
                disabled
                readOnly
            />
            </FieldContent>
            {errors.email && (
            <FieldError>{errors.email}</FieldError>
            )}
        </Field>

        {/* Profile Image */}
        <Field className="md:col-span-2">
            <FieldLabel htmlFor="profile_image">
            Foto Profil
            </FieldLabel>
            <FieldDescription>
            Upload foto profil (max. 2MB, format: JPG, PNG, JPEG)
            </FieldDescription>
            <FieldContent>
            <div className="flex items-center gap-4">
                {imagePreview && (
                <div className="relative">
                    <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover border-2"
                    style={{ borderColor: '#015023' }}
                    />
                    <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                    >
                    <X className="w-4 h-4" />
                    </button>
                </div>
                )}
                <label
                htmlFor="profile_image"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80"
                style={{
                    backgroundColor: '#015023',
                    color: 'white',
                    fontFamily: 'Urbanist, sans-serif'
                }}
                >
                <Upload className="w-5 h-5" />
                {imagePreview ? 'Ganti Foto' : 'Upload Foto'}
                </label>
                <input
                type="file"
                id="profile_image"
                name="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
                />
            </div>
            </FieldContent>
            {errors.profile_image && (
            <FieldError>{errors.profile_image}</FieldError>
            )}
        </Field>

        {/* Gender */}
        <Field>
            <FieldLabel htmlFor="gender">
            Jenis Kelamin <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldDescription>
            Pilih jenis kelamin <span className="text-red-500">{!editableData.gender ? '(tidak dapat diubah)' : ''}</span>
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
                opacity: !editableData.gender ? 0.5 : errors.gender ? 1 : 0.7,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23015023' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem'
                }}
                disabled={!editableData.gender || isLoading}
                readOnly={!editableData.gender}
            >
                <option value="" disabled>Pilih Jenis Kelamin</option>
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
                <option value="" disabled>Pilih Agama</option>
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
            Kota/Kabupaten tempat lahir <span className="text-red-500">{!editableData.tempat_lahir ? '(tidak dapat diubah)' : ''}</span>
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
                opacity: !editableData.tempat_lahir ? 0.5 : errors.tempat_lahir ? 1 : 0.7
                }}
                disabled={!editableData.tempat_lahir || isLoading}
                readOnly={!editableData.tempat_lahir}
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
            Format: DD/MM/YYYY <span className="text-red-500">{!editableData.tanggal_lahir ? '(tidak dapat diubah)' : ''}</span>
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
                opacity: !editableData.tanggal_lahir ? 0.5 : errors.tanggal_lahir ? 1 : 0.7
                }}
                disabled={!editableData.tanggal_lahir || isLoading}
                readOnly={!editableData.tanggal_lahir}
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
            16 digit NIK sesuai KTP <span className="text-red-500">{!editableData.nik ? '(tidak dapat diubah)' : ''}</span>
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
                opacity: !editableData.nik ? 0.5 : errors.nik ? 1 : 0.7
                }}
                disabled={!editableData.nik || isLoading}
                readOnly={!editableData.nik}
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
            16 digit nomor KK <span className="text-red-500">{!editableData.nomor_kartu_keluarga ? '(tidak dapat diubah)' : ''}</span>
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
                opacity: !editableData.nomor_kartu_keluarga ? 0.5 : 0.7
                }}
                disabled={!editableData.nomor_kartu_keluarga || isLoading}
                readOnly={!editableData.nomor_kartu_keluarga}
            />
            </FieldContent>
        </Field>

        {/* Citizenship */}
        <Field>
            <FieldLabel htmlFor="citizenship">
            Kewarganegaraan
            </FieldLabel>
            <FieldDescription>
            WNI atau WNA <span className="text-red-500">{!editableData.citizenship ? '(tidak dapat diubah)' : ''}</span>
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
                opacity: !editableData.citizenship ? 0.5 : 0.7,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23015023' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem'
                }}
                disabled={!editableData.citizenship || isLoading}
                readOnly={!editableData.citizenship}
            >
                <option value="" disabled>Pilih Kewarganegaraan</option>
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
            Urutan kelahiran dalam keluarga (1, 2, 3, dst.) <span className="text-red-500">{!editableData.birth_order ? '(tidak dapat diubah)' : ''}</span>
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
                opacity: !editableData.birth_order ? 0.5 : 0.7
                }}
                disabled={!editableData.birth_order || isLoading}
                readOnly={!editableData.birth_order}
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
            Nama sekolah menengah atas terakhir <span className="text-red-500">{!editableData.sekolah_asal ? '(tidak dapat diubah)' : ''}</span>
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
                opacity: !editableData.sekolah_asal ? 0.5 : 0.7
                }}
                disabled={!editableData.sekolah_asal || isLoading}
                readOnly={!editableData.sekolah_asal}
            />
            </FieldContent>
        </Field>
        </div>
    </div>

    {/* Section 4: Ubah Password */}
    <div 
        className="bg-white rounded-2xl shadow-lg p-6"
        style={{ borderRadius: '16px' }}
        >
        <div className="flex items-center gap-3 mb-6">
            <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#015023' }}
            >
            <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
            <h2 
                className="text-xl font-bold"
                style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
            >
                Ubah Password
            </h2>
            <p 
                className="text-sm"
                style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}
            >
                Kosongkan jika tidak ingin mengubah password
            </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Lama */}
            <Field className="md:col-span-2">
            <FieldLabel htmlFor="old_password">
                Password Lama
            </FieldLabel>
            <FieldDescription>
                Wajib diisi jika ingin mengubah password
            </FieldDescription>
            <FieldContent>
                <div className="relative">
                <input
                    type={showOldPassword ? "text" : "password"}
                    id="old_password"
                    name="old_password"
                    value={profileData.old_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 focus:outline-none focus:border-opacity-100"
                    style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: errors.old_password ? '#BE0414' : '#015023',
                    borderRadius: '12px',
                    opacity: errors.old_password ? 1 : 0.7
                    }}
                    disabled={isLoading}
                    placeholder="Masukkan password lama"
                />
                <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition"
                    style={{ color: '#015023' }}
                >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                </div>
            </FieldContent>
            {errors.old_password && (
                <FieldError>{errors.old_password}</FieldError>
            )}
            </Field>

            {/* Password Baru */}
            <Field>
            <FieldLabel htmlFor="password">
                Password Baru
            </FieldLabel>
            <FieldDescription>
                Minimal 6 karakter
            </FieldDescription>
            <FieldContent>
                <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 focus:outline-none focus:border-opacity-100"
                    style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: errors.password ? '#BE0414' : '#015023',
                    borderRadius: '12px',
                    opacity: errors.password ? 1 : 0.7
                    }}
                    disabled={isLoading}
                    placeholder="Masukkan password baru"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition"
                    style={{ color: '#015023' }}
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                </div>
            </FieldContent>
            {errors.password && (
                <FieldError>{errors.password}</FieldError>
            )}
            </Field>

            {/* Confirm Password */}
            <Field>
            <FieldLabel htmlFor="confirm_password">
                Konfirmasi Password Baru
            </FieldLabel>
            <FieldDescription>
                Masukkan ulang password baru
            </FieldDescription>
            <FieldContent>
                <div className="relative">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
                    value={profileData.confirm_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 focus:outline-none focus:border-opacity-100"
                    style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: errors.confirm_password ? '#BE0414' : '#015023',
                    borderRadius: '12px',
                    opacity: errors.confirm_password ? 1 : 0.7
                    }}
                    disabled={isLoading}
                    placeholder="Konfirmasi password baru"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition"
                    style={{ color: '#015023' }}
                >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                </div>
            </FieldContent>
            {errors.confirm_password && (
                <FieldError>{errors.confirm_password}</FieldError>
            )}
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

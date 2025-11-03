"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
ArrowLeft, 
Save, 
Calendar, 
Users, 
BookOpen, 
UserCheck,
X,
Plus,
Trash2
} from "lucide-react";
import AdminNavbar from "@/components/ui/admin-navbar";
import { Button } from "@/components/ui/button";
import LoadingEffect from "@/components/ui/loading-effect";
import { getClassById, getAcademicPeriods, getSubjects, getMahasiswa, getDosen, updateClass } from "@/lib/adminApi";
import { ErrorMessageBoxWithButton, SuccessMessageBox, ErrorMessageBox } from "@/components/ui/message-box";

export default function DetailKelas() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const kelasId = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updatedSuccess, setUpdatedSuccess] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [errors, setErrors] = useState({});

    // Data kelas
    const [formData, setFormData] = useState({
        kode_kelas: "",
        matkul: "",
        jumlah_mahasiswa: "0",
        maks_mahasiswa: "",
        hari: "",
        jam_mulai: "",
        jam_selesai: "",
        tanggal: "",
        is_active: true
    });

    // Data mata kuliah yang sudah di-assign
    const [assignedMatkul, setAssignedMatkul] = useState(null);

    // Data dosen yang sudah di-assign
    const [assignedDosen, setAssignedDosen] = useState([]);

    // Data mahasiswa yang sudah di-assign
    const [assignedMahasiswa, setAssignedMahasiswa] = useState([]);

    // Data jadwal kelas
    const [jadwalList, setJadwalList] = useState([]);

    // Dropdown options
    const [matkulOptions, setMatkulOptions] = useState([]);
    const [dosenOptions, setDosenOptions] = useState([]);
    const [mahasiswaOptions, setMahasiswaOptions] = useState([]);
    const [periodeOptions, setPeriodeOptions] = useState([]);

    // Modal states
    const [showDosenModal, setShowDosenModal] = useState(false);
    const [showMahasiswaModal, setShowMahasiswaModal] = useState(false);
    const [showGenerateJadwalModal, setShowGenerateJadwalModal] = useState(false);
    const [selectedDosenIds, setSelectedDosenIds] = useState([]);
    const [selectedMahasiswaIds, setSelectedMahasiswaIds] = useState([]);
    const [searchDosen, setSearchDosen] = useState("");
    const [searchMahasiswa, setSearchMahasiswa] = useState("");
    const [generateJadwalForm, setGenerateJadwalForm] = useState({
        jumlahPertemuan: "14",
        tanggalMulai: new Date().toISOString().split('T')[0]
    });

    //stats
    const [currentMaksMahasiswa, setCurrentMaksMahasiswa] = useState(0);
    const [currentJadwalKelas, setCurrentJadwalKelas] = useState({
        hari: '', 
        jam_mulai: '', 
        jam_selesai: ''
    });


    // Hari options
    const hariOptions = [
        {key: 1, label: "Senin"},
        {key: 2, label: "Selasa"},
        {key: 3, label: "Rabu"},
        {key: 4, label: "Kamis"},
        {key: 5, label: "Jumat"},
        {key: 6, label: "Sabtu"},
        {key: 7, label: "Minggu"}
    ];

    // Fetch data kelas saat component mount
    useEffect(() => {
    if (kelasId) {
        fetchAll();
    }
    }, [kelasId]);

    const fetchAll = async () => {
        setErrors(prev => ({...prev, fetch: null}));
        setIsFetching(true);
        await Promise.all([
            fetchDosenOptions(),
            fetchMahasiswaOptions(),
            fetchMatkulOptions(),
            fetchPeriodeOptions(),
            fetchKelasData()
        ]);
        setIsFetching(false);
    };

    const fetchKelasData = async () => {
        try {
            const response = await getClassById(kelasId);
            if (response.status === 'success') {
                // Set form data
                setFormData({
                    kode_kelas: response.data.code_class,
                    matkul: response.data.id_subject,
                    periode: response.data.id_academic_period,
                    jumlah_mahasiswa: response.data.jumlah_mahasiswa,
                    maks_mahasiswa: response.data.member_class,
                    hari: response.data.day_of_week,
                    jam_mulai: response.data.start_time,
                    jam_selesai: response.data.end_time,
                    tanggal: response.data.date,
                    is_active: response.data.is_active
                });
                setAssignedMatkul(response.data.subject);
                setAssignedDosen(response.data.lecturers);
                setAssignedMahasiswa(response.data.students);
                setJadwalList(response.data.schedules);
                setCurrentMaksMahasiswa(response.data.member_class);
                setCurrentJadwalKelas({
                    hari: response.data.day_of_week,
                    jam_mulai: response.data.start_time,
                    jam_selesai: response.data.end_time
                });
            } else {
                setErrors(prev => ({...prev, fetch: "Gagal mengambil data kelas: " + response.message}));
            }
        } catch (error) {
            setErrors(prev => ({...prev, fetch: "Gagal mengambil data kelas: " + error.message}));
        }
    }

    const fetchMatkulOptions = async () => {
        try {
            const response = await getSubjects();
            if (response.status === 'success') {
                setMatkulOptions(response.data);
            } else {
                setErrors(prev => ({...prev, fetch: "Gagal mengambil data " + response.message}));
            }
        } catch (error) {
            setErrors(prev => ({...prev, fetch: "Gagal mengambil data " + error.message}));
        }
    };

    const fetchDosenOptions = async () => {
        try {
            const response = await getDosen();
            if (response.status === 'success') {
                setDosenOptions(response.data);
            } else {
                setErrors(prev => ({...prev, fetch: "Gagal mengambil data " + response.message}));
            }
        } catch (error) {
            setErrors(prev => ({...prev, fetch: "Gagal mengambil data " + error.message}));
        }
    };

    const fetchMahasiswaOptions = async () => {
        try {
            const response = await getMahasiswa();
            if (response.status === 'success') {
                setMahasiswaOptions(response.data);
            } else {
                setErrors(prev => ({...prev, fetch: "Gagal mengambil data " + response.message}));
            }
        } catch (error) {
            setErrors(prev => ({...prev, fetch: "Gagal mengambil data " + error.message}));
        }
    };

    const fetchPeriodeOptions = async () => {
        try {
            const response = await getAcademicPeriods();
            if (response.status === 'success') {
                setPeriodeOptions(response.data);
            } else {
                setErrors(prev => ({...prev, fetch: "Gagal mengambil data " + response.message}));
            }
        } catch (error) {
            setErrors(prev => ({...prev, fetch: "Gagal mengambil data " + error.message}));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        if (errors.form) {
            setErrors(prev => ({ ...prev, form: null }));
        }
        if (updatedSuccess) {
            setUpdatedSuccess('');
        }
    };

    const handleToggleDosen = (dosenId) => {
    setSelectedDosenIds(prev => {
        if (prev.includes(dosenId)) {
        return prev.filter(id => id !== dosenId);
        } else {
        return [...prev, dosenId];
        }
    });
    };

    const handleAddDosen = async () => {
    if (selectedDosenIds.length === 0) {
        alert("Pilih minimal 1 dosen");
        return;
    }

    try {
        setIsLoading(true);

        const newDosen = dosenOptions.filter(d => selectedDosenIds.includes(d.id_user_si || d.id));
        const combinedDosen = [...assignedDosen];

        newDosen.forEach(dosen => {
        const dosenId = dosen.id_user_si || dosen.id;
        if (!combinedDosen.find(d => (d.id_user_si || d.id) === dosenId)) {
            combinedDosen.push(dosen);
        }
        });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: API call to save dosen data
        console.log("Saving dosen data:", combinedDosen);

        setAssignedDosen(combinedDosen);
        setSelectedDosenIds([]);
        setSearchDosen("");
        setShowDosenModal(false);
        
        alert(`Berhasil menyimpan ${newDosen.length} dosen pengampu!`);
    } catch (error) {
        alert("Gagal menyimpan data dosen: " + error.message);
    } finally {
        setIsLoading(false);
    }
    };

    const handleRemoveDosen = (dosenId) => {
    setAssignedDosen(assignedDosen.filter(d => (d.id_user_si || d.id) !== dosenId));
    };

    const handleToggleMahasiswa = (mahasiswaId) => {
    setSelectedMahasiswaIds(prev => {
        if (prev.includes(mahasiswaId)) {
            return prev.filter(id => id !== mahasiswaId);
        } else {
            return [...prev, mahasiswaId];
        }
    });
    };

    const handleAddMahasiswa = async () => {
        if (selectedMahasiswaIds.length === 0) {
            alert("Pilih minimal 1 mahasiswa");
            return;
        }

        try {
            setIsLoading(true);

            const newMahasiswa = mahasiswaOptions.filter(m => selectedMahasiswaIds.includes(m.id));
            const combinedMahasiswa = [...assignedMahasiswa];

            newMahasiswa.forEach(mahasiswa => {
            if (!combinedMahasiswa.find(m => m.id === mahasiswa.id)) {
                combinedMahasiswa.push(mahasiswa);
            }
            });

            // Check capacity
            if (combinedMahasiswa.length > parseInt(formData.maks_mahasiswa)) {
            alert(`Kapasitas maksimal ${formData.maks_mahasiswa} mahasiswa. Tidak dapat menambah lebih banyak.`);
            setIsLoading(false);
            return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // TODO: API call to save mahasiswa data
            console.log("Saving mahasiswa data:", combinedMahasiswa);

            setAssignedMahasiswa(combinedMahasiswa);
            setFormData(prev => ({
            ...prev,
            jumlah_mahasiswa: combinedMahasiswa.length.toString()
            }));
            setSelectedMahasiswaIds([]);
            setSearchMahasiswa("");
            setShowMahasiswaModal(false);
            
            alert(`Berhasil menyimpan ${newMahasiswa.length} mahasiswa!`);
        } catch (error) {
            alert("Gagal menyimpan data mahasiswa: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMahasiswa = (mahasiswaId) => {
        setAssignedMahasiswa(assignedMahasiswa.filter(m => m.id !== mahasiswaId));
        setFormData(prev => ({
            ...prev,
            jumlah_mahasiswa: (assignedMahasiswa.length - 1).toString()
        }));
    };

    const handleGenerateJadwal = async () => {
        const jumlah = parseInt(generateJadwalForm.jumlahPertemuan);
        
        if (isNaN(jumlah) || jumlah < 1 || jumlah > 20) {
            alert("Jumlah pertemuan harus antara 1-20");
            return;
        }

        if (!generateJadwalForm.tanggalMulai) {
            alert("Pilih tanggal mulai pertemuan");
            return;
        }

        try {
            setIsLoading(true);
            
            // Tanggal mulai dari form input
            const startDate = new Date(generateJadwalForm.tanggalMulai);
            const generatedJadwal = [];

            for (let i = 0; i < jumlah; i++) {
            const pertemuanDate = new Date(startDate);
            pertemuanDate.setDate(startDate.getDate() + (i * 7)); // +7 hari per pertemuan

            generatedJadwal.push({
                id: i + 1,
                pertemuan: i + 1,
                tanggal: pertemuanDate.toISOString().split('T')[0]
            });
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // TODO: API call to save jadwal
            console.log("Generated jadwal:", generatedJadwal);

            setJadwalList(generatedJadwal);
            setShowGenerateJadwalModal(false);
            alert(`Berhasil generate ${jumlah} jadwal pertemuan!`);
        } catch (error) {
            alert("Gagal generate jadwal: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.kode_kelas.trim()) {
            newErrors.kode_kelas = "Kode kelas harus diisi";
        }

        if (!formData.maks_mahasiswa) {
            newErrors.maks_mahasiswa = "Maksimal mahasiswa harus diisi";
        } else if (parseInt(formData.maks_mahasiswa) < 1) {
            newErrors.maks_mahasiswa = "Maksimal mahasiswa harus lebih besar dari 0";
        }

        if (!formData.periode) {
            newErrors.periode = "Periode akademik harus dipilih";
        } 

        if (!formData.matkul) {
            newErrors.matkul = "Mata kuliah harus dipilih";
        }

        if (!formData.hari) {
            newErrors.hari = "Hari harus dipilih";
        }
        if (!formData.jam_mulai) {
            newErrors.jam_mulai = "Jam mulai harus diisi";
        }
        if (!formData.jam_selesai) {
            newErrors.jam_selesai = "Jam selesai harus diisi";
        }
        if (parseInt(formData.jam_selesai.replace('.', '')) <= parseInt(formData.jam_mulai.replace('.', ''))) {
            newErrors.jam_selesai = "Jam selesai harus lebih besar dari jam mulai";
        }


        setErrors(prev => ({...prev, ...newErrors}));
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        const newErrors = {};
        try {
            const response = await updateClass(kelasId, {
                code_class: formData.kode_kelas,
                id_subject: formData.matkul,
                id_academic_period: formData.periode,
                member_class: parseInt(formData.maks_mahasiswa),
                day_of_week: parseInt(formData.hari),
                start_time: formData.jam_mulai.slice(0,5), 
                end_time: formData.jam_selesai.slice(0,5),
                is_active: formData.is_active
            });
            if (response.status === 'success') {
                setUpdatedSuccess("Data kelas berhasil diperbarui!");
                setCurrentMaksMahasiswa(parseInt(formData.maks_mahasiswa));
                setCurrentJadwalKelas({
                    hari: parseInt(formData.hari),
                    jam_mulai: formData.jam_mulai,
                    jam_selesai: formData.jam_selesai
                });
                setAssignedMatkul(matkulOptions.find(m => m.id_subject === formData.matkul));
            } else {
                newErrors.form = "Gagal memperbarui data: " + response.message;
            }
        } catch (error) {
            newErrors.form = "Gagal memperbarui data: " + error.message;
        } finally {
            setErrors(prev => ({...prev, ...newErrors}));
            setIsSubmitting(false);
        }
    };
    
    const handleBack = () => {
        router.push("/adminpage/tambahkelas");
    };

    if (isFetching) {
        return (
            <LoadingEffect message="Memuat data kelas..." />
        );
    } else if (errors.fetch) {
        return (
        <div className="min-h-screen bg-brand-light-sage">
            <AdminNavbar title="Dashboard Admin - Detail Kelas" />
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

    const percentage = (parseInt(assignedMahasiswa.length) / parseInt(formData.maks_mahasiswa)) * 100;

    return (
    <div className="min-h-screen bg-brand-light-sage">
        <AdminNavbar title="Dashboard Admin - Detail Kelas" />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
            <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 -ml-4"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
            </Button>
            
            <div className="flex items-center gap-4 mb-6">
            <div 
                className="w-2 h-16 rounded-full"
                style={{ backgroundColor: '#015023' }}
            />
            <div>
                <h1 
                className="text-4xl font-bold mb-2"
                style={{ 
                    fontFamily: 'Urbanist, sans-serif',
                    color: '#015023'
                }}
                >
                Detail & Edit Kelas
                </h1>
                <p 
                className="text-lg text-gray-600"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                {formData.kode_kelas}
                </p>
            </div>
            </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Mahasiswa Card */}
            <div className="bg-white p-6 shadow-lg" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" style={{ color: '#015023' }} />
            </div>
            <h3 className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                Mahasiswa
            </h3>
            <p className="text-3xl font-bold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {assignedMahasiswa.length}/{currentMaksMahasiswa}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                className="h-2 rounded-full transition-all" 
                style={{ 
                    width: `${percentage}%`,
                    backgroundColor: percentage >= 100 ? '#BE0414' : percentage >= 80 ? '#DABC4E' : '#16874B'
                }}
                />
            </div>
            </div>

            {/* Dosen Card */}
            <div className="bg-white p-6 shadow-lg" style={{ borderRadius: '12px' }}>
            <UserCheck className="w-8 h-8 mb-4" style={{ color: '#015023' }} />
            <h3 className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                Dosen Pengampu
            </h3>
            <p className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {assignedDosen.length}
            </p>
            </div>

            {/* Mata Kuliah Card */}
            <div className="bg-white p-6 shadow-lg" style={{ borderRadius: '12px' }}>
            <BookOpen className="w-8 h-8 mb-4" style={{ color: '#015023' }} />
            <h3 className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                Mata Kuliah
            </h3>
            <p className="text-xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {assignedMatkul ? assignedMatkul.name_subject : '-'}
            </p>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                {assignedMatkul ? assignedMatkul.code_subject : ''}
            </p>
            </div>

            {/* Jadwal Card */}
            <div className="bg-white p-6 shadow-lg" style={{ borderRadius: '12px' }}>
            <Calendar className="w-8 h-8 mb-4" style={{ color: '#015023' }} />
            <h3 className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                Jadwal
            </h3>
            <p className="text-lg font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {hariOptions.find(h => h.key === currentJadwalKelas.hari).label}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                {`${currentJadwalKelas.jam_mulai?.slice(0,5)} - ${currentJadwalKelas.jam_selesai?.slice(0,5)}`}
            </p>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-6">
            {/* Left Column - Form Data Kelas */}
            <div className="bg-white border-2 p-6 shadow-lg flex flex-col" style={{ borderColor: '#015023', borderRadius: '12px' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                Informasi Kelas
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Kode Kelas */}
                    <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        Kode Kelas <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="kode_kelas"
                        value={formData.kode_kelas}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 focus:outline-none uppercase"
                        style={{
                        fontFamily: 'Urbanist, sans-serif',
                        borderColor: errors.kode_kelas ? '#BE0414' : '#015023',
                        borderRadius: '12px',
                        opacity: 0.7
                        }}
                        disabled={isLoading}
                    />
                    {errors.kode_kelas && (
                        <p className="text-red-500 text-sm mt-1">{errors.kode_kelas}</p>
                    )}
                    </div>

                    {/* Mata Kuliah */}
                    <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        Mata Kuliah <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="matkul"
                        value={formData.matkul}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 focus:outline-none focus:border-opacity-100 appearance-none cursor-pointer"
                        style={{
                            fontFamily: 'Urbanist, sans-serif',
                            borderColor: errors.matkul ? '#BE0414' : '#015023',
                            borderRadius: '12px',
                            opacity: 0.7,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23015023' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.5rem'
                        }}
                        disabled={isLoading}
                    >
                        <option value="" disabled>Pilih Mata Kuliah</option>
                        {matkulOptions.map(matkul => (
                        <option key={matkul.id_subject} value={matkul.id_subject}>
                            {matkul.code_subject} - {matkul.name_subject}
                        </option>
                        ))}
                    </select>
                    {errors.matkul && (
                        <p className="text-red-500 text-sm mt-1">{errors.matkul}</p>
                    )}
                    </div>

                    {/* Academic Period */}
                    <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        Periode Akademik <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="periode"
                        value={formData.periode}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 focus:outline-none focus:border-opacity-100 appearance-none cursor-pointer"
                        style={{
                            fontFamily: 'Urbanist, sans-serif',
                            borderColor: errors.periode ? '#BE0414' : '#015023',
                            borderRadius: '12px',
                            opacity: 0.7,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23015023' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.5rem'
                        }}
                        disabled={isLoading}
                    >
                        <option value="" disabled>Pilih Periode Akademik</option>
                        {periodeOptions.map(periode => (
                        <option key={periode.id_academic_period} value={periode.id_academic_period}>
                            {periode.name}
                        </option>
                        ))}
                    </select>
                    {errors.periode && (
                        <p className="text-red-500 text-sm mt-1">{errors.periode}</p>
                    )}
                    </div>

                    {/* Maks Mahasiswa */}
                    <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        Maksimal Mahasiswa <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="maks_mahasiswa"
                        value={formData.maks_mahasiswa}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        className="w-full px-4 py-3 border-2 focus:outline-none"
                        style={{
                        fontFamily: 'Urbanist, sans-serif',
                        borderColor: errors.maks_mahasiswa ? '#BE0414' : '#015023',
                        borderRadius: '12px',
                        opacity: 0.7
                        }}
                        disabled={isLoading}
                    />
                    {errors.maks_mahasiswa && ( 
                        <p className="text-red-500 text-sm mt-1">{errors.maks_mahasiswa}</p>
                    )}
                    </div>

                    {/* Hari */}
                    <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        Hari <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="hari"
                        value={formData.hari}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 focus:outline-none focus:border-opacity-100 appearance-none cursor-pointer"
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
                        <option value="" disabled>Pilih Hari</option>
                        {hariOptions.map(hari => (
                        <option key={hari.key} value={hari.key}>{hari.label}</option>
                        ))}
                    </select>
                    {errors.hari && (
                        <p className="text-red-500 text-sm mt-1">{errors.hari}</p>
                    )}
                    </div>

                    {/* Jam Mulai & Selesai */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        Jam Mulai
                        </label>
                        <input
                        type="time"
                        name="jam_mulai"
                        value={formData.jam_mulai}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 focus:outline-none"
                        style={{
                            fontFamily: 'Urbanist, sans-serif',
                            borderColor: '#015023',
                            borderRadius: '12px',
                            opacity: 0.7
                        }}
                        disabled={isLoading}
                        />
                    {errors.jam_mulai && (
                        <p className="text-red-500 text-sm mt-1">{errors.jam_mulai}</p>
                    )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        Jam Selesai
                        </label>
                        <input
                        type="time"
                        name="jam_selesai"
                        value={formData.jam_selesai}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 focus:outline-none"
                        style={{
                            fontFamily: 'Urbanist, sans-serif',
                            borderColor: '#015023',
                            borderRadius: '12px',
                            opacity: 0.7
                        }}
                        disabled={isLoading}
                        />
                    {errors.jam_selesai && (
                        <p className="text-red-500 text-sm mt-1">{errors.jam_selesai}</p>
                    )}
                    </div>
                    </div>

                    {/* Status Active */}
                    <div className="flex items-center gap-3 p-4 border-2" style={{ borderColor: '#015023', borderRadius: '12px', opacity: 0.7 }}>
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-5 h-5 cursor-pointer"
                        disabled={isLoading}
                    />
                    <label className="font-semibold cursor-pointer" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        Status Aktif
                    </label>
                    </div>

                    {/* Success Message */}
                    {updatedSuccess && (
                        <SuccessMessageBox message={updatedSuccess} />
                    )}
                    {/* Error Message */}
                    {errors.form && (
                        <ErrorMessageBox message={errors.form} />
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/adminpage/tambahkelas")}
                        disabled={isSubmitting || isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-[200px]"
                    >
                        {isSubmitting ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            Menyimpan...
                        </>
                        ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            Simpan Perubahan
                        </>
                        )}
                    </Button>
                    </div>
                </form>
            </div>

            {/* Right Column - Dosen & Mahasiswa */}
            <div className="space-y-6">
                {/* Dosen Section */}
                <div className="bg-white border-2 p-6 shadow-lg" style={{ borderColor: '#015023', borderRadius: '12px', cursor: 'default' }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Dosen Pengampu
                    </h2>
                    <button
                    type="button"
                    onClick={() => setShowDosenModal(true)}
                    className="text-white px-4 py-2 text-sm font-medium transition shadow-md hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#015023', borderRadius: '12px' }}
                    >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Tambah
                    </button>
                </div>

                <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '280px' }}>
                    {assignedDosen.length === 0 ? (
                    <p className="text-gray-500 text-center py-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        Belum ada dosen pengampu
                    </p>
                    ) : (
                    assignedDosen.map(dosen => (
                        <div 
                        key={dosen.id_user_si || dosen.id} 
                        className="flex items-center justify-between p-3 border"
                        style={{ borderRadius: '8px', borderColor: '#E5E7EB' }}
                        >
                        <div>
                            <p className="font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                            {dosen.name}
                            </p>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                            {dosen.email}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveDosen(dosen.id_user_si || dosen.id)}
                            className="text-white p-2 hover:opacity-80 transition"
                            style={{ backgroundColor: '#BE0414', borderRadius: '8px' }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                    ))
                    )}
                </div>
                </div>

                {/* Mahasiswa Section */}
                <div className="bg-white border-2 p-6 shadow-lg" style={{ borderColor: '#015023', borderRadius: '12px', cursor: 'default' }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Daftar Mahasiswa
                    </h2>
                    <button
                    type="button"
                    onClick={() => setShowMahasiswaModal(true)}
                    className="text-white px-4 py-2 text-sm font-medium transition shadow-md hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#015023', borderRadius: '12px' }}
                    disabled={parseInt(formData.jumlah_mahasiswa) >= parseInt(formData.maks_mahasiswa)}
                    >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Tambah
                    </button>
                </div>

                <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '280px' }}>
                    {assignedMahasiswa.length === 0 ? (
                    <p className="text-gray-500 text-center py-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        Belum ada mahasiswa terdaftar
                    </p>
                    ) : (
                    assignedMahasiswa.map(mahasiswa => (
                        <div 
                        key={mahasiswa.id} 
                        className="flex items-center justify-between p-3 border"
                        style={{ borderRadius: '8px', borderColor: '#E5E7EB' }}
                        >
                        <div>
                            <p className="font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                            {mahasiswa.name}
                            </p>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                            NIM: {mahasiswa.nim} • {mahasiswa.email}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveMahasiswa(mahasiswa.id)}
                            className="text-white p-2 hover:opacity-80 transition"
                            style={{ backgroundColor: '#BE0414', borderRadius: '8px' }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                    ))
                    )}
                </div>
                </div>
            </div>
            </div>

            {/* Jadwal Kelas Section */}
            <div className="bg-white border-2 p-6 shadow-lg my-5" style={{ borderColor: '#015023', borderRadius: '12px', cursor: 'default' }}>
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Daftar Jadwal Kelas
                </h2>
                <button
                  type="button"
                  onClick={() => setShowGenerateJadwalModal(true)}
                  className="text-white px-4 py-2 text-sm font-medium transition shadow-md hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: '#DABC4E', color: '#015023', borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Generate Jadwal
                </button>
              </div>

                {jadwalList.length === 0 ? (
                <p className="text-gray-500 text-center py-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                  Belum ada jadwal kelas. Klik "Generate Jadwal" untuk membuat jadwal otomatis.
                </p>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                    <thead>
                        <tr style={{ backgroundColor: '#015023' }}>
                        <th className="px-4 py-3 text-center text-white font-bold" style={{ fontFamily: 'Urbanist, sans-serif', borderRadius: '12px 0 0 0' }}>
                            Pertemuan Ke
                        </th>
                        <th className="px-4 py-3 text-center text-white font-bold" style={{ fontFamily: 'Urbanist, sans-serif', borderRadius: '0 12px 0 0' }}>
                          Tanggal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        {jadwalList.map((jadwal, index) => (
                        <tr 
                            key={jadwal.id}
                            className="border-b hover:bg-gray-50 transition"
                            style={{ borderColor: '#E5E7EB' }}
                        >
                            <td className="px-4 py-3 text-center" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                            <div 
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold"
                                style={{ backgroundColor: '#015023', color: '#FFFFFF' }}
                            >
                                {jadwal.pertemuan}
                            </div>
                            </td>
                            <td className="px-4 py-3 text-center font-medium" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                            {new Date(jadwal.tanggal).toLocaleDateString('id-ID', { 
                                weekday: 'long',
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>

        {/* Modal Tambah Dosen */}
        {showDosenModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between mb-4">
                <div>
                <h3 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Tambah Dosen Pengampu
                </h3>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Pilih dosen yang akan mengampu kelas ini
                </p>
                </div>
                <button
                onClick={() => {
                    setShowDosenModal(false);
                    setSelectedDosenIds([]);
                    setSearchDosen("");
                }}
                className="text-gray-500 hover:text-gray-700 transition"
                >
                <X className="w-6 h-6" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                <input
                    type="text"
                    placeholder="Cari dosen berdasarkan nama atau email..."
                    value={searchDosen}
                    onChange={(e) => setSearchDosen(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border-2 focus:outline-none"
                    style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px'
                    }}
                />
                <UserCheck className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#015023' }} />
                </div>
            </div>

            {/* Selected Count */}
            {selectedDosenIds.length > 0 && (
                <div className="mb-3 px-4 py-2 text-sm font-semibold" style={{ backgroundColor: '#DABC4E', borderRadius: '8px', color: '#015023' }}>
                {selectedDosenIds.length} dosen dipilih
                </div>
            )}

            {/* Dosen List */}
            <div className="flex-1 overflow-y-auto mb-4 border-2 p-2" style={{ borderRadius: '12px', borderColor: '#E5E7EB' }}>
                <div className="space-y-2">
                {dosenOptions
                    .filter(d => !assignedDosen.find(ad => (ad.id_user_si || ad.id) === (d.id_user_si || d.id)))
                    .filter(d => 
                    d.name.toLowerCase().includes(searchDosen.toLowerCase()) ||
                    d.email.toLowerCase().includes(searchDosen.toLowerCase())
                    )
                    .map(dosen => {
                    const dosenId = dosen.id_user_si || dosen.id;
                    return (
                    <div
                        key={dosenId}
                        onClick={() => handleToggleDosen(dosenId)}
                        className={`p-4 border-2 cursor-pointer transition hover:shadow-md ${
                        selectedDosenIds.includes(dosenId) ? 'border-opacity-100' : 'border-opacity-30'
                        }`}
                        style={{
                        borderRadius: '12px',
                        borderColor: selectedDosenIds.includes(dosenId) ? '#015023' : '#E5E7EB',
                        backgroundColor: selectedDosenIds.includes(dosenId) ? '#F0F9F4' : 'white'
                        }}
                    >
                        <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={selectedDosenIds.includes(dosenId)}
                            onChange={() => handleToggleDosen(dosenId)}
                            className="w-5 h-5 cursor-pointer"
                            style={{ accentColor: '#015023' }}
                        />
                        <div className="flex-1">
                            <p className="font-bold text-lg" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                            {dosen.name}
                            </p>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                                {dosen.email}
                            </p>
                        </div>
                        </div>
                    </div>
                    );
                    })}
                {dosenOptions.filter(d => !assignedDosen.find(ad => (ad.id_user_si || ad.id) === (d.id_user_si || d.id))).length === 0 && (
                    <p className="text-center text-gray-500 py-8" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Semua dosen sudah ditambahkan
                    </p>
                )}
                {dosenOptions.filter(d => !assignedDosen.find(ad => ad.id === d.id))
                    .filter(d => 
                    d.name.toLowerCase().includes(searchDosen.toLowerCase()) ||
                    d.email.toLowerCase().includes(searchDosen.toLowerCase())
                    ).length === 0 && searchDosen && (
                    <p className="text-center text-gray-500 py-8" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Tidak ada dosen yang sesuai dengan pencarian "{searchDosen}"
                    </p>
                )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                onClick={() => {
                    setShowDosenModal(false);
                    setSelectedDosenIds([]);
                    setSearchDosen("");
                }}
                className="flex-1 px-6 py-3 border-2 font-semibold transition hover:bg-gray-50"
                style={{
                    borderColor: '#015023',
                    color: '#015023',
                    borderRadius: '12px',
                    fontFamily: 'Urbanist, sans-serif'
                }}
                >
                Batal
                </button>
                <button
                onClick={handleAddDosen}
                disabled={selectedDosenIds.length === 0 || isLoading}
                className="flex-1 px-6 py-3 text-white font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                    backgroundColor: '#16874B',
                    borderRadius: '12px',
                    fontFamily: 'Urbanist, sans-serif'
                }}
                >
                {isLoading ? (
                    <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                    </>
                ) : (
                    <>
                    <Save className="w-5 h-5 inline mr-2" />
                    Simpan Data ({selectedDosenIds.length})
                    </>
                )}
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Modal Tambah Mahasiswa */}
        {showMahasiswaModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-6 max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between mb-4">
                <div>
                <h3 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Tambah Mahasiswa ke Kelas
                </h3>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Pilih mahasiswa yang akan mengikuti kelas ini
                </p>
                </div>
                <button
                onClick={() => {
                    setShowMahasiswaModal(false);
                    setSelectedMahasiswaIds([]);
                    setSearchMahasiswa("");
                }}
                className="text-gray-500 hover:text-gray-700 transition"
                >
                <X className="w-6 h-6" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                <input
                    type="text"
                    placeholder="Cari mahasiswa berdasarkan nama, NIM, atau email..."
                    value={searchMahasiswa}
                    onChange={(e) => setSearchMahasiswa(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border-2 focus:outline-none"
                    style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px'
                    }}
                />
                <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#015023' }} />
                </div>
            </div>

            {/* Capacity Warning */}
            {parseInt(formData.jumlah_mahasiswa) + selectedMahasiswaIds.length > parseInt(formData.maks_mahasiswa) && (
                <div className="mb-3 px-4 py-3 text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: '#FEE', borderRadius: '8px', color: '#BE0414', border: '2px solid #BE0414' }}>
                <span>⚠️</span>
                <span>Kapasitas kelas akan terlampaui! ({parseInt(formData.jumlah_mahasiswa) + selectedMahasiswaIds.length}/{formData.maks_mahasiswa})</span>
                </div>
            )}

            {/* Selected Count */}
            {selectedMahasiswaIds.length > 0 && (
                <div className="mb-3 px-4 py-2 text-sm font-semibold flex items-center justify-between" style={{ backgroundColor: '#DABC4E', borderRadius: '8px', color: '#015023' }}>
                <span>{selectedMahasiswaIds.length} mahasiswa dipilih</span>
                <span>Kapasitas: {parseInt(formData.jumlah_mahasiswa) + selectedMahasiswaIds.length}/{formData.maks_mahasiswa}</span>
                </div>
            )}

            {/* Mahasiswa List */}
            <div className="flex-1 overflow-y-auto mb-4 border-2 p-2" style={{ borderRadius: '12px', borderColor: '#E5E7EB' }}>
                <div className="space-y-2">
                {mahasiswaOptions
                    .filter(m => !assignedMahasiswa.find(am => am.id === m.id))
                    .filter(m => 
                    m.name.toLowerCase().includes(searchMahasiswa.toLowerCase()) ||
                    m.nim.toLowerCase().includes(searchMahasiswa.toLowerCase()) ||
                    m.email.toLowerCase().includes(searchMahasiswa.toLowerCase())
                    )
                    .map(mahasiswa => (
                    <div
                        key={mahasiswa.id}
                        onClick={() => handleToggleMahasiswa(mahasiswa.id)}
                        className={`p-4 border-2 cursor-pointer transition hover:shadow-md ${
                        selectedMahasiswaIds.includes(mahasiswa.id) ? 'border-opacity-100' : 'border-opacity-30'
                        }`}
                        style={{
                        borderRadius: '12px',
                        borderColor: selectedMahasiswaIds.includes(mahasiswa.id) ? '#015023' : '#E5E7EB',
                        backgroundColor: selectedMahasiswaIds.includes(mahasiswa.id) ? '#F0F9F4' : 'white'
                        }}
                    >
                        <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={selectedMahasiswaIds.includes(mahasiswa.id)}
                            onChange={() => handleToggleMahasiswa(mahasiswa.id)}
                            className="w-5 h-5 cursor-pointer"
                            style={{ accentColor: '#015023' }}
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                            <p className="font-bold text-lg" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                                {mahasiswa.name}
                            </p>
                            <span 
                                className="px-2 py-0.5 text-xs font-semibold rounded"
                                style={{ backgroundColor: '#DABC4E', color: '#015023' }}
                            >
                                {mahasiswa.nim}
                            </span>
                            </div>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                                {mahasiswa.email}
                            </p>
                        </div>
                        {selectedMahasiswaIds.includes(mahasiswa.id) && (
                            <div 
                            className="px-3 py-1 text-xs font-bold rounded-full text-white"
                            style={{ backgroundColor: '#16874B' }}
                            >
                            ✓ Dipilih
                            </div>
                        )}
                        </div>
                    </div>
                    ))}
                {mahasiswaOptions.filter(m => !assignedMahasiswa.find(am => am.id === m.id)).length === 0 && (
                    <p className="text-center text-gray-500 py-8" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Semua mahasiswa sudah ditambahkan atau kelas sudah penuh
                    </p>
                )}
                {mahasiswaOptions.filter(m => !assignedMahasiswa.find(am => am.id === m.id))
                    .filter(m => 
                    m.name.toLowerCase().includes(searchMahasiswa.toLowerCase()) ||
                    m.nim.toLowerCase().includes(searchMahasiswa.toLowerCase()) ||
                    m.email.toLowerCase().includes(searchMahasiswa.toLowerCase())
                    ).length === 0 && searchMahasiswa && (
                    <p className="text-center text-gray-500 py-8" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Tidak ada mahasiswa yang sesuai dengan pencarian "{searchMahasiswa}"
                    </p>
                )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                onClick={() => {
                    setShowMahasiswaModal(false);
                    setSelectedMahasiswaIds([]);
                    setSearchMahasiswa("");
                }}
                className="flex-1 px-6 py-3 border-2 font-semibold transition hover:bg-gray-50"
                style={{
                    borderColor: '#015023',
                    color: '#015023',
                    borderRadius: '12px',
                    fontFamily: 'Urbanist, sans-serif'
                }}
                >
                Batal
                </button>
                <button
                onClick={handleAddMahasiswa}
                disabled={selectedMahasiswaIds.length === 0 || isLoading}
                className="flex-1 px-6 py-3 text-white font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                    backgroundColor: '#16874B',
                    borderRadius: '12px',
                    fontFamily: 'Urbanist, sans-serif'
                }}
                >
                {isLoading ? (
                    <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                    </>
                ) : (
                    <>
                    <Save className="w-5 h-5 inline mr-2" />
                    Simpan Data ({selectedMahasiswaIds.length})
                    </>
                )}
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Modal Generate Jadwal */}
        {showGenerateJadwalModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-6 max-w-md w-full shadow-2xl" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between mb-4">
                <div>
                <h3 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Generate Jadwal Kelas
                </h3>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Buat jadwal otomatis dengan sistem mingguan (+7 hari)
                </p>
                </div>
                <button
                onClick={() => {
                    setShowGenerateJadwalModal(false);
                    setGenerateJadwalForm({ 
                        jumlahPertemuan: "14",
                        tanggalMulai: new Date().toISOString().split('T')[0]
                    });
                }}
                className="text-gray-500 hover:text-gray-700 transition"
                >
                <X className="w-6 h-6" />
                </button>
            </div>

            {/* Form Generate Jadwal */}
            <div className="space-y-4 mb-6">
                {/* Jumlah Pertemuan */}
                <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Jumlah Pertemuan <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    min="1"
                    max="16"
                    value={generateJadwalForm.jumlahPertemuan}
                    onChange={(e) => setGenerateJadwalForm(prev => ({ ...prev, jumlahPertemuan: e.target.value }))}
                    className="w-full px-4 py-3 border-2 focus:outline-none"
                    style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px'
                    }}
                    placeholder="Masukkan jumlah pertemuan (1-16)"
                />
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Maksimal 16 pertemuan per semester
                </p>
                </div>

                {/* Tanggal Mulai Pertemuan */}
                <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    Tanggal Mulai Pertemuan <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={generateJadwalForm.tanggalMulai}
                    onChange={(e) => setGenerateJadwalForm(prev => ({ ...prev, tanggalMulai: e.target.value }))}
                    className="w-full px-4 py-3 border-2 focus:outline-none"
                    style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: '#015023',
                    borderRadius: '12px'
                    }}
                />
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    Pertemuan selanjutnya akan ditambahkan setiap +7 hari
                </p>
                </div>

                {/* Info Preview */}
                {generateJadwalForm.jumlahPertemuan && generateJadwalForm.tanggalMulai && (() => {
                const startDate = new Date(generateJadwalForm.tanggalMulai);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + (parseInt(generateJadwalForm.jumlahPertemuan) - 1) * 7);
                
                return (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF9E6', border: '2px solid #DABC4E' }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    📅 Preview Jadwal:
                    </p>
                    <p className="text-sm" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    • Jumlah: <span className="font-bold">{generateJadwalForm.jumlahPertemuan} pertemuan</span>
                    </p>
                    <p className="text-sm" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    • Mulai: <span className="font-bold">{startDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </p>
                    <p className="text-sm" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                    • Selesai: <span className="font-bold">{endDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    ℹ️ Pertemuan selanjutnya akan dijadwalkan setiap +7 hari
                    </p>
                </div>
                );
                })()}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                onClick={() => {
                    setShowGenerateJadwalModal(false);
                    setGenerateJadwalForm({ 
                        jumlahPertemuan: "14",
                        tanggalMulai: new Date().toISOString().split('T')[0]
                    });
                }}
                className="flex-1 px-6 py-3 border-2 font-semibold transition hover:bg-gray-50"
                style={{
                    borderColor: '#015023',
                    color: '#015023',
                    borderRadius: '12px',
                    fontFamily: 'Urbanist, sans-serif'
                }}
                >
                Batal
                </button>
                <button
                onClick={handleGenerateJadwal}
                disabled={!generateJadwalForm.jumlahPertemuan || !generateJadwalForm.tanggalMulai || isLoading}
                className="flex-1 px-6 py-3 text-white font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                    backgroundColor: '#DABC4E',
                    color: '#015023',
                    borderRadius: '12px',
                    fontFamily: 'Urbanist, sans-serif'
                }}
                >
                {isLoading ? (
                    <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generating...
                    </>
                ) : (
                    <>
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Generate Jadwal
                    </>
                )}
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
    );
}
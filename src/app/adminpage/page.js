'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { DashboardCard, StatCard } from '@/components/ui/dashboard-card'
import { PrimaryButton, SecondaryButton } from '@/components/ui/button'
import AdminNavbar from '@/components/ui/admin-navbar'
import Footer from '@/components/ui/footer'
import { getDashboardStatistics } from '@/lib/adminApi'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

// Icons - using icons from /public/icon folder
const PlusIcon = () => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
<path d="M12 5v14m-7-7h14"/>
</svg>
)

const BookIcon = () => (
<Image 
src="/icon/tabler_book.svg"
alt="Book Icon"
width={32}
height={32}
className="w-8 h-8"
style={{ filter: 'brightness(0) invert(1)' }}
/>
)

const ClassIcon = () => (
<Image 
src="/icon/mdi_google-classroom.svg"
alt="Classroom Icon"
width={32}
height={32}
className="w-8 h-8"
style={{ filter: 'brightness(0) invert(1)' }}
/>
)

const StudentIcon = () => (
<Image 
src="/icon/ph_student-fill.svg"
alt="Student Icon"
width={32}
height={32}
className="w-8 h-8"
style={{ filter: 'brightness(0) invert(1)' }}
/>
)

const TeacherIcon = () => (
<Image 
src="/icon/mdi_teacher.svg"
alt="Teacher Icon"
width={32}
height={32}
className="w-8 h-8"
style={{ filter: 'brightness(0) invert(1)' }}
/>
)

const ManagerIcon = () => (
<Image 
src="/icon/clarity_administrator-line.svg"
alt="Administrator Icon"
width={32}
height={32}
className="w-8 h-8"
style={{ filter: 'brightness(0) invert(1)' }}
/>
)


export default function AdminDashboard() {
// State untuk menyimpan data statistik dari API
const [statistics, setStatistics] = useState({
  total_subjects: 0,
  total_students: 0,
  total_lecturers: 0,
  total_classes: 0,
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch data statistik saat component mount
useEffect(() => {
  fetchStatistics();
}, []);

const fetchStatistics = async () => {
  setLoading(true);
  try {
    setError(null);

    // Panggil API untuk mendapatkan statistik
    const response = await getDashboardStatistics();
    
    // Periksa response dan set data statistik
    if (response.success) {
      setStatistics(response.data);
    } else {
      setError('Gagal mengambil data statistik');
    }
  } catch (err) {
    // Tangani error
    console.error('Error fetching statistics:', err);
    setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data');

  } finally {
    // Hentikan loading
    setLoading(false);
  }
};

const router = useRouter();
const handleCardClick = (actionType) => {
  if (actionType === 'add-course') {
    router.push('/adminpage/tambahmatkul');
  } else if (actionType === 'add-class') {
    router.push('/adminpage/tambahkelas');
  } else if (actionType === 'add-student') {
    router.push('/adminpage/tambahmahasiswa');
  } else if (actionType === 'add-manager') {
    router.push('/adminpage/tambahmanager');
  } else if (actionType === 'add-teacher') {
    router.push('/adminpage/tambahdosen');
  }
};

// Data untuk kartu manajemen
const managementCards = [
  {
    id: 'add-course',
    title: 'Tambah Mata Kuliah Baru',
    description: 'Tambahkan mata kuliah baru ke dalam sistem',
    icon: <BookIcon />,
    action: () => handleCardClick('add-course')
  },
  {
    id: 'add-class',
    title: 'Tambah Kelas Baru',
    description: 'Buat kelas baru untuk semester ini',
    icon: <ClassIcon />,
    action: () => handleCardClick('add-class')
  },
  {
    id: 'add-student',
    title: 'Tambah Mahasiswa Baru',
    description: 'Daftarkan mahasiswa baru ke sistem',
    icon: <StudentIcon />,
    action: () => handleCardClick('add-student')
  },
  // Card Tambah Akun Manajer hanya untuk admin
  ...(Cookies.get('roles') === 'admin' ? [{
    id: 'add-manager',
    title: 'Tambah Akun Manajer',
    description: 'Buat akun manajer untuk administrasi',
    icon: <ManagerIcon />,
    action: () => handleCardClick('add-manager')
  }] : []),
  {
    id: 'add-teacher',
    title: 'Tambah Dosen Baru',
    description: 'Tambahkan dosen baru ke dalam sistem',
    icon: <TeacherIcon />,
    action: () => handleCardClick('add-teacher')
  }
];

// Data statistik sekarang menggunakan data dari state (API)
const statisticsData = [
  {
    id: 'total-courses',
    title: 'Total Mata Kuliah',
    value: loading ? '...' : statistics.total_subjects.toLocaleString('id-ID'),
    subtitle: 'Mata kuliah aktif',
    icon: <BookIcon />,
  },
  {
    id: 'total-students',
    title: 'Total Mahasiswa',
    value: loading ? '...' : statistics.total_students.toLocaleString('id-ID'),
    subtitle: 'Mahasiswa aktif',
    icon: <StudentIcon />,
  },
  {
    id: 'total-teachers',
    title: 'Total Dosen',
    value: loading ? '...' : statistics.total_lecturers.toLocaleString('id-ID'),
    subtitle: 'Dosen aktif',
    icon: <TeacherIcon />,
  },
  {
    id: 'total-classes',
    title: 'Total Kelas',
    value: loading ? '...' : statistics.total_classes.toLocaleString('id-ID'),
    subtitle: 'Kelas aktif semester ini',
    icon: <ClassIcon />,
  }
]

return (
<div className="min-h-screen flex flex-col">
{/* Admin Navbar */}
<AdminNavbar title="Dashboard Admin" />

{/* Main Content */}
<main className="flex-1 bg-brand-light-sage">
<div className="p-6">
<div className="max-w-7xl mx-auto">
{/* Header */}
<div className="mb-8">
    <h1 
    className="text-3xl font-bold mb-2" 
    style={{ 
        color: '#015023',
        fontFamily: 'Urbanist, sans-serif'
    }}
    >
    Dashboard Admin
    </h1>
    <p 
    className="text-gray-600"
    style={{ fontFamily: 'Urbanist, sans-serif' }}
    >
    Kelola semua aspek sistem akademik universitas
    </p>
</div>

{/* Statistics Cards */}
<div className="mb-8">
    <h2 
    className="text-xl font-semibold mb-4" 
    style={{ 
        color: '#015023',
        fontFamily: 'Urbanist, sans-serif'
    }}
    >
    Statistik Sistem
    </h2>
    
    {/* Error Message */}
    {error && (
      <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
        <button 
          onClick={fetchStatistics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    )}
    
    {/* Statistics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {statisticsData.map((stat) => (
        <StatCard
        key={stat.id}
        title={stat.title}
        value={stat.value}
        subtitle={stat.subtitle}
        icon={stat.icon}
        />
    ))}
    </div>
</div>

{/* Management Cards */}
<div>
    <h2 
    className="text-xl font-semibold mb-4" 
    style={{ 
        color: '#015023',
        fontFamily: 'Urbanist, sans-serif'
    }}
    >
    Manajemen Sistem
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {managementCards.map((card) => (
        <DashboardCard
        key={card.id}
        title={card.title}
        description={card.description}
        icon={card.icon}
        onClick={card.action}
        >
        <PrimaryButton className="w-full mt-4">
            <PlusIcon />
            Tambah
        </PrimaryButton>
        </DashboardCard>
    ))}
    </div>
</div>
</div>
</div>
</main>

{/* Footer */}
<Footer />
</div>
)
}
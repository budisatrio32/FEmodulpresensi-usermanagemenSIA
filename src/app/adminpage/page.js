'use client'

import Image from 'next/image'
import { DashboardCard, StatCard } from '@/components/ui/dashboard-card'
import { PrimaryButton, SecondaryButton } from '@/components/ui/button'
import AdminNavbar from '@/components/ui/admin-navbar'
import Footer from '@/components/ui/footer'

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
const handleCardClick = (actionType) => {
console.log(`Clicked: ${actionType}`)
// Here you can add navigation or modal opening logic
}

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
{
id: 'add-manager',
title: 'Tambah Akun Manajer',
description: 'Buat akun manajer untuk administrasi',
icon: <ManagerIcon />,
action: () => handleCardClick('add-manager')
},
{
id: 'add-teacher',
title: 'Tambah Dosen Baru',
description: 'Tambahkan dosen baru ke dalam sistem',
icon: <TeacherIcon />,
action: () => handleCardClick('add-teacher')
}
]

const statisticsData = [
{
id: 'total-courses',
title: 'Total Mata Kuliah',
value: '156',
subtitle: 'Mata kuliah aktif',
icon: <BookIcon />,
},
{
id: 'total-students',
title: 'Total Mahasiswa',
value: '2,845',
subtitle: 'Mahasiswa aktif',
icon: <StudentIcon />,

},
{
id: 'total-teachers',
title: 'Total Dosen',
value: '89',
subtitle: 'Dosen aktif',
icon: <TeacherIcon />,
},
{
id: 'total-classes',
title: 'Total Kelas',
value: '234',
subtitle: 'Kelas aktif semester ini',
icon: <ClassIcon />,
}
]

return (
<div className="min-h-screen">
{/* Admin Navbar */}
<AdminNavbar title="Dashboard Admin" />

<div className="p-6 bg-brand-light-sage">
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
<Footer />
</div>
)
}
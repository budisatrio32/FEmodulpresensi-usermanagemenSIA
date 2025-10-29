'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, X, ArrowLeft } from 'lucide-react';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';

export default function StudentDashboard() {
const router = useRouter();
const [searchQuery, setSearchQuery] = useState('');
const [students, setStudents] = useState([
{ id: 1, role: 'mahasiswa', username: 'johndoe', email: 'john@example.com', password: '********', is_active: true, created_at: '2024-01-15' },
{ id: 2, role: 'mahasiswa', username: 'janedoe', email: 'jane@example.com', password: '********', is_active: true, created_at: '2024-01-16' },
{ id: 3, role: 'mahasiswa', username: 'bobsmith', email: 'bob@example.com', password: '********', is_active: true, created_at: '2024-01-17' },
{ id: 4, role: 'mahasiswa', username: 'alicelee', email: 'alice@example.com', password: '********', is_active: false, created_at: '2024-01-18' },
{ id: 5, role: 'mahasiswa', username: 'charlie', email: 'charlie@example.com', password: '********', is_active: true, created_at: '2024-01-19' },
{ id: 6, role: 'mahasiswa', username: 'davidkim', email: 'david@example.com', password: '********', is_active: true, created_at: '2024-01-20' },
{ id: 7, role: 'mahasiswa', username: 'emilytan', email: 'emily@example.com', password: '********', is_active: false, created_at: '2024-01-21' },
{ id: 8, role: 'mahasiswa', username: 'frankwu', email: 'frank@example.com', password: '********', is_active: true, created_at: '2024-01-22' },
]);

// Filter students berdasarkan search query
const filteredStudents = students.filter(student => {
  const query = searchQuery.toLowerCase();
  return (
    student.username.toLowerCase().includes(query) ||
    student.email.toLowerCase().includes(query) ||
    student.role.toLowerCase().includes(query) ||
    student.created_at.includes(query) ||
    (student.is_active ? 'active' : 'inactive').includes(query)
  );
});

// Define columns untuk table
const columns = [
{ key: 'role', label: 'Role' },
{ key: 'username', label: 'Username' },
{ key: 'email', label: 'Email' },
{ key: 'password', label: 'Password' },
{ key: 'is_active', label: 'Status' },
{ key: 'created_at', label: 'Created At' },
];

// Custom render untuk is_active status
const customRender = {
is_active: (value) => (
    <span 
    className="px-2 py-1 rounded text-xs font-semibold"
    style={{
        backgroundColor: value ? '#16874B' : '#BE0414',
        color: '#FFFFFF',
        borderRadius: '12px'
    }}
    >
    {value ? 'Active' : 'Inactive'}
    </span>
),
};

// Handle add new student
const handleAddStudent = () => {
router.push('/adminpage/tambahmahasiswa/addform');
};

// Handle search input change
const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
};

// Handle clear search
const handleClearSearch = () => {
  setSearchQuery('');
};

// Handle edit action
const handleEdit = (student, index) => {
console.log('Edit student:', student, 'at index:', index);
// Redirect ke halaman edit dengan ID mahasiswa
router.push(`/adminpage/tambahmahasiswa/editform?id=${student.id}`);
};

// Handle delete action
const handleDelete = async (student, index) => {
if (window.confirm(`Apakah Anda yakin ingin menghapus mahasiswa "${student.username}"?`)) {
    try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/mahasiswa/${student.id}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // });
    
    // if (!response.ok) throw new Error('Gagal menghapus data');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove student from state
    setStudents(prevStudents => prevStudents.filter((_, i) => i !== index));
    
    alert(`Mahasiswa "${student.username}" berhasil dihapus!`);
    } catch (error) {
    alert("Gagal menghapus data: " + error.message);
    }
}
};

return (
<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100" style={{ fontFamily: 'Urbanist, sans-serif' }}>
    {/* Admin Navbar */}
    <AdminNavbar title="Dashboard Admin - Mahasiswa" />

    {/* Main Content */}
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
    {/* Back Button */}
    <div className="mb-4">
        <button
        onClick={() => router.push('/adminpage')}
        className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition"
        style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
        >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Dashboard
        </button>
    </div>

    {/* Page Title */}
    <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#015023' }}>
            Statistik Mahasiswa
        </h2>
        <button 
            onClick={handleAddStudent}
            className="text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition shadow-md hover:opacity-90" 
            style={{ backgroundColor: '#015023', borderRadius: '12px' }}
        >
            + Tambah
        </button>
        </div>
    </div>

    {/* Stats Card */}
    <div className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl" style={{ background: 'linear-gradient(to bottom right, #015023, #013d1c)' }}>
        <div className="flex items-center justify-between">
        <div>
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Mahasiswa</h3>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-1">{filteredStudents.length}</p>
            <p className="text-sm" style={{ color: '#DABC4E' }}>
              {searchQuery ? 'Hasil pencarian' : 'Mahasiswa aktif'}
            </p>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl shadow-lg" style={{ backgroundColor: '#DABC4E' }}>
            <Users className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#015023' }} />
        </div>
        </div>
    </div>

    {/* Search Bar */}
    <div className="p-3 mb-4 flex items-center gap-2 shadow-sm" style={{ backgroundColor: '#DABC4E', borderRadius: '12px' }}>
        <Search className="w-5 h-5" style={{ color: '#015023' }} />
        <input
        type="text"
        placeholder="Cari mahasiswa..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="bg-transparent flex-1 outline-none text-sm text-gray-700"
        style={{ color: '#015023' }}
        />
        {searchQuery && (
          <button 
            onClick={handleClearSearch}
            className="hover:opacity-80 transition" 
            style={{ color: '#015023' }}
          >
            <X className="w-5 h-5" />
          </button>
        )}
    </div>

    {/* Table using DataTable component */}
    <DataTable
        columns={columns}
        data={filteredStudents}
        actions={['delete', 'edit']}
        pagination={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        customRender={customRender}
    />
    </div>
</div>
);
}
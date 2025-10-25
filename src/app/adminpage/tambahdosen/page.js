'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, X, ArrowLeft } from 'lucide-react';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';

export default function DosenDashboard() {
const router = useRouter();
const [searchQuery, setSearchQuery] = useState('');
const [dosens, setDosens] = useState([
{ id: 1, role: 'dosen', username: 'prof_ahmad', email: 'ahmad@example.com', password: '********', is_active: true, created_at: '2024-01-10' },
{ id: 2, role: 'dosen', username: 'dr_susan', email: 'susan@example.com', password: '********', is_active: true, created_at: '2024-01-11' },
{ id: 3, role: 'dosen', username: 'prof_budi', email: 'budi@example.com', password: '********', is_active: true, created_at: '2024-01-12' },
{ id: 4, role: 'dosen', username: 'dr_linda', email: 'linda@example.com', password: '********', is_active: false, created_at: '2024-01-13' },
{ id: 5, role: 'dosen', username: 'prof_rudi', email: 'rudi@example.com', password: '********', is_active: true, created_at: '2024-01-14' },
{ id: 6, role: 'dosen', username: 'dr_maya', email: 'maya@example.com', password: '********', is_active: true, created_at: '2024-01-15' },
{ id: 7, role: 'dosen', username: 'prof_andi', email: 'andi@example.com', password: '********', is_active: false, created_at: '2024-01-16' },
{ id: 8, role: 'dosen', username: 'dr_siti', email: 'siti@example.com', password: '********', is_active: true, created_at: '2024-01-17' },
]);

// Filter dosens berdasarkan search query
const filteredDosens = dosens.filter(dosen => {
  const query = searchQuery.toLowerCase();
  return (
    dosen.username.toLowerCase().includes(query) ||
    dosen.email.toLowerCase().includes(query) ||
    dosen.role.toLowerCase().includes(query) ||
    dosen.created_at.includes(query) ||
    (dosen.is_active ? 'active' : 'inactive').includes(query)
  );
});

// Define columns untuk table
const columns = [
{ key: 'role', label: 'Role', className: '' },
{ key: 'username', label: 'Username', className: '' },
{ key: 'email', label: 'Email', className: '' },
{ key: 'password', label: 'Password', className: '' },
{ key: 'is_active', label: 'Status', className: 'text-center', cellClassName: 'text-center' },
{ key: 'created_at', label: 'Created At', className: '' },
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

// Handle add new dosen
const handleAddDosen = () => {
router.push('/adminpage/tambahdosen/addform');
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
const handleEdit = (dosen, index) => {
console.log('Edit dosen:', dosen, 'at index:', index);
// Redirect ke halaman edit dengan ID dosen
router.push(`/adminpage/tambahdosen/editform?id=${dosen.id}`);
};

// Handle delete action
const handleDelete = async (dosen, index) => {
if (window.confirm(`Apakah Anda yakin ingin menghapus dosen "${dosen.username}"?`)) {
    try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/dosen/${dosen.id}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // });
    
    // if (!response.ok) throw new Error('Gagal menghapus data');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove dosen from state
    setDosens(prevDosens => prevDosens.filter((_, i) => i !== index));
    
    alert(`Dosen "${dosen.username}" berhasil dihapus!`);
    } catch (error) {
    alert("Gagal menghapus data: " + error.message);
    }
}
};

return (
<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100" style={{ fontFamily: 'Urbanist, sans-serif' }}>
    {/* Admin Navbar */}
    <AdminNavbar title="Dashboard Admin - Dosen" />

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
            Statistik Dosen
        </h2>
        <button 
            onClick={handleAddDosen}
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
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Dosen</h3>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-1">{filteredDosens.length}</p>
            <p className="text-sm" style={{ color: '#DABC4E' }}>
              {searchQuery ? 'Hasil pencarian' : 'Dosen aktif'}
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
        placeholder="Cari dosen..."
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
        data={filteredDosens}
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

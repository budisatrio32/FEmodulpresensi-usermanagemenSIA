'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCog, Search, X, ArrowLeft } from 'lucide-react';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';

export default function AkunManagerDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [managers, setManagers] = useState([
    { id: 1, username: 'manager_john', email: 'john.manager@example.com', password: '********', is_active: true, created_at: '2024-01-15' },
    { id: 2, username: 'manager_sarah', email: 'sarah.manager@example.com', password: '********', is_active: true, created_at: '2024-01-16' },
    { id: 3, username: 'manager_david', email: 'david.manager@example.com', password: '********', is_active: true, created_at: '2024-01-17' },
    { id: 4, username: 'manager_lisa', email: 'lisa.manager@example.com', password: '********', is_active: false, created_at: '2024-01-18' },
    { id: 5, username: 'manager_michael', email: 'michael.manager@example.com', password: '********', is_active: true, created_at: '2024-01-19' },
    { id: 6, username: 'manager_emma', email: 'emma.manager@example.com', password: '********', is_active: true, created_at: '2024-01-20' },
    { id: 7, username: 'manager_robert', email: 'robert.manager@example.com', password: '********', is_active: false, created_at: '2024-01-21' },
    { id: 8, username: 'manager_sophia', email: 'sophia.manager@example.com', password: '********', is_active: true, created_at: '2024-01-22' },
  ]);

  // Filter managers berdasarkan search query
  const filteredManagers = managers.filter(manager => {
    const query = searchQuery.toLowerCase();
    return (
      manager.username.toLowerCase().includes(query) ||
      manager.email.toLowerCase().includes(query) ||
      manager.created_at.includes(query) ||
      (manager.is_active ? 'active' : 'inactive').includes(query)
    );
  });

  // Define columns untuk table
  const columns = [
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

  // Handle add new manager
  const handleAddManager = () => {
    router.push('/adminpage/tambahakun/addform');
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
  const handleEdit = (manager, index) => {
    console.log('Edit manager:', manager, 'at index:', index);
    router.push(`/adminpage/tambahakun/editform?id=${manager.id}`);
  };

  // Handle delete action
  const handleDelete = async (manager, index) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun manager "${manager.username}"?`)) {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/manager/${manager.id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        
        // if (!response.ok) throw new Error('Gagal menghapus data');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove manager from state
        setManagers(prevManagers => prevManagers.filter((_, i) => i !== index));
        
        alert(`Akun manager "${manager.username}" berhasil dihapus!`);
      } catch (error) {
        alert("Gagal menghapus data: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-sage" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {/* Admin Navbar */}
      <AdminNavbar title="Dashboard Admin - Akun Manager" />

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
              Statistik Akun Manager
            </h2>
            <button 
              onClick={handleAddManager}
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
              <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Manager</h3>
              <p className="text-white text-3xl sm:text-4xl font-bold mb-1">{filteredManagers.length}</p>
              <p className="text-sm" style={{ color: '#DABC4E' }}>
                {searchQuery ? 'Hasil pencarian' : 'Manager terdaftar'}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl shadow-lg" style={{ backgroundColor: '#DABC4E' }}>
              <UserCog className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#015023' }} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 mb-4 flex items-center gap-2 shadow-sm" style={{ backgroundColor: '#DABC4E', borderRadius: '12px' }}>
          <Search className="w-5 h-5" style={{ color: '#015023' }} />
          <input
            type="text"
            placeholder="Cari akun manager..."
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
          data={filteredManagers}
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, X, ArrowLeft } from 'lucide-react';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';

export default function MatkulDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [matkuls, setMatkuls] = useState([
    { id: 1, name_subject: 'Algoritma dan Pemrograman', code_subject: 'CS101', sks: 3, created_at: '2024-01-15' },
    { id: 2, name_subject: 'Struktur Data', code_subject: 'CS102', sks: 3, created_at: '2024-01-16' },
    { id: 3, name_subject: 'Basis Data', code_subject: 'CS201', sks: 4, created_at: '2024-01-17' },
    { id: 4, name_subject: 'Jaringan Komputer', code_subject: 'CS202', sks: 3, created_at: '2024-01-18' },
    { id: 5, name_subject: 'Sistem Operasi', code_subject: 'CS203', sks: 3, created_at: '2024-01-19' },
    { id: 6, name_subject: 'Pemrograman Web', code_subject: 'CS301', sks: 4, created_at: '2024-01-20' },
    { id: 7, name_subject: 'Machine Learning', code_subject: 'CS401', sks: 3, created_at: '2024-01-21' },
    { id: 8, name_subject: 'Keamanan Sistem', code_subject: 'CS402', sks: 3, created_at: '2024-01-22' },
  ]);

  // Filter matkul berdasarkan search query
  const filteredMatkuls = matkuls.filter(matkul => {
    const query = searchQuery.toLowerCase();
    return (
      matkul.name_subject.toLowerCase().includes(query) ||
      matkul.code_subject.toLowerCase().includes(query) ||
      matkul.sks.toString().includes(query) ||
      matkul.created_at.includes(query)
    );
  });

  // Define columns untuk table
  const columns = [
    { key: 'no', label: 'No', className: 'text-center', cellClassName: 'text-center' },
    { key: 'name_subject', label: 'Nama Mata Kuliah', className: '' },
    { key: 'code_subject', label: 'Kode MK', className: '' },
    { key: 'sks', label: 'SKS', className: 'text-center', cellClassName: 'text-center' },
    { key: 'created_at', label: 'Created At', className: '' },
  ];

  // Custom render untuk nomor urut dan SKS
  const customRender = {
    no: (value, item, index) => (
      <span style={{ fontFamily: 'Urbanist, sans-serif', color: '#015023' }}>
        {index + 1}
      </span>
    ),
    sks: (value) => (
      <span 
        className="px-3 py-1 rounded font-semibold text-sm"
        style={{
          backgroundColor: '#015023',
          color: '#FFFFFF',
          borderRadius: '12px'
        }}
      >
        {value} SKS
      </span>
    ),
  };

  // Handle add new matkul
  const handleAddMatkul = () => {
    router.push('/adminpage/tambahkelas/addform');
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
  const handleEdit = (matkul, index) => {
    console.log('Edit matkul:', matkul, 'at index:', index);
    router.push(`/adminpage/tambahkelas/editform?id=${matkul.id}`);
  };

  // Handle delete action
  const handleDelete = async (matkul, index) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus mata kuliah "${matkul.name_subject}"?`)) {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/matkul/${matkul.id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        
        // if (!response.ok) throw new Error('Gagal menghapus data');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove matkul from state
        setMatkuls(prevMatkuls => prevMatkuls.filter((_, i) => i !== index));
        
        alert(`Mata kuliah "${matkul.name_subject}" berhasil dihapus!`);
      } catch (error) {
        alert("Gagal menghapus data: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-sage" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {/* Admin Navbar */}
      <AdminNavbar title="Dashboard Admin - Mata Kuliah" />

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
              Statistik Mata Kuliah
            </h2>
            <button 
              onClick={handleAddMatkul}
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
              <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Mata Kuliah</h3>
              <p className="text-white text-3xl sm:text-4xl font-bold mb-1">{filteredMatkuls.length}</p>
              <p className="text-sm" style={{ color: '#DABC4E' }}>
                {searchQuery ? 'Hasil pencarian' : 'Mata kuliah terdaftar'}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl shadow-lg" style={{ backgroundColor: '#DABC4E' }}>
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#015023' }} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 mb-4 flex items-center gap-2 shadow-sm" style={{ backgroundColor: '#DABC4E', borderRadius: '12px' }}>
          <Search className="w-5 h-5" style={{ color: '#015023' }} />
          <input
            type="text"
            placeholder="Cari mata kuliah..."
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
          data={filteredMatkuls}
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

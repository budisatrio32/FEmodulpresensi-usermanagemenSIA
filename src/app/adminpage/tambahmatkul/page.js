'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, X, ArrowLeft } from 'lucide-react';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';
import { getSubjects } from '@/lib/adminApi';

export default function MatkulDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [matkuls, setMatkuls] = useState([]);

  // Fetch subjects from API
  const indexMatkuls = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await getSubjects();
      if (response.status === 'success') {
        setMatkuls(response.data);
      } else {
        setError('Gagal mengambil data mata kuliah');
      }
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    indexMatkuls();
  }, []);

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
    { key: 'name_subject', label: 'Nama Mata Kuliah', className: '' },
    { key: 'code_subject', label: 'Kode MK', className: '' },
    { key: 'sks', label: 'SKS', className: 'text-center', cellClassName: 'text-center' },
    { key: 'created_at', label: 'Created At', className: '' },
  ];

  // Custom render untuk nomor urut dan SKS
  const customRender = {
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button 
              onClick={indexMatkuls}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Stats Card */}
        <div className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl" style={{ background: 'linear-gradient(to bottom right, #015023, #013d1c)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Mata Kuliah</h3>
              <p className="text-white text-3xl sm:text-4xl font-bold mb-1">{loading ? '...' : filteredMatkuls.length}</p>
              <p className="text-sm" style={{ color: '#DABC4E' }}>
                {loading ? 'Loading...' : searchQuery ? 'Hasil pencarian' : error ? error : 'Mata kuliah terdaftar'}
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
        {success === true && (
          <DataTable
            columns={columns}
            data={filteredMatkuls}
            actions={['delete', 'edit']}
            pagination={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            customRender={customRender}
          />
        )}
      </div>
    </div>
  );
}

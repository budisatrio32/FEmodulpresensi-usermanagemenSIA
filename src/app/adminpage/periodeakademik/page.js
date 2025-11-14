'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, X, ArrowLeft } from 'lucide-react';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';

export default function PeriodeAkademikDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [periods, setPeriods] = useState([]);

  // Dummy data periode akademik
  const dummyPeriods = [
    {
      id: 1,
      name: 'Semester Ganjil 2024/2025',
      start_date: '2024-09-01',
      end_date: '2025-01-31',
      active: true
    },
    {
      id: 2,
      name: 'Semester Genap 2023/2024',
      start_date: '2024-02-01',
      end_date: '2024-08-31',
      active: false
    },
    {
      id: 3,
      name: 'Semester Ganjil 2023/2024',
      start_date: '2023-09-01',
      end_date: '2024-01-31',
      active: false
    },
    {
      id: 4,
      name: 'Semester Genap 2022/2023',
      start_date: '2023-02-01',
      end_date: '2023-08-31',
      active: false
    }
  ];

  // Fetch periods from API
  const indexPeriods = async () => {
    setLoading(true);
    try {
      setError(null);
      // TODO: Replace with actual API call
      // const response = await getAcademicPeriods();
      setPeriods(dummyPeriods);
    } catch (error) {
      setError('Terjadi kesalahan saat mengambil data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    indexPeriods();
  }, []);

  // Filter periods berdasarkan search query
  const filteredPeriods = periods.filter(period => {
    const query = searchQuery.toLowerCase();
    return (
      period.name.toLowerCase().includes(query) ||
      period.start_date.includes(query) ||
      period.end_date.includes(query)
    );
  });

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Define columns untuk table
  const columns = [
    { key: 'name', label: 'Nama Periode' },
    { key: 'start_date', label: 'Tanggal Mulai' },
    { key: 'end_date', label: 'Tanggal Selesai' },
    { key: 'active', label: 'Status' },
  ];

  // Custom render untuk status dan tanggal
  const customRender = {
    start_date: (value) => formatDate(value),
    end_date: (value) => formatDate(value),
    active: (value) => (
      <span 
        className={`px-3 py-1 rounded-lg font-semibold text-sm`}
        style={{
          backgroundColor: value ? '#dcfce7' : '#fee2e2',
          color: value ? '#16874B' : '#991b1b',
          borderRadius: '12px'
        }}
      >
        {value ? 'Aktif' : 'Nonaktif'}
      </span>
    ),
  };

  // Handle add new period
  const handleAddPeriod = () => {
    router.push('/adminpage/periodeakademik/addform');
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
  const handleEdit = (period, index) => {
    console.log('Edit period:', period, 'at index:', index);
    router.push(`/adminpage/periodeakademik/editform?id=${period.id}`);
  };

  // Handle delete action
  const handleDelete = async (period, index) => {
    if (period.active) {
      alert('Tidak dapat menghapus periode yang sedang aktif!');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus periode "${period.name}"?`)) {
      try {
        // TODO: Replace with actual API call
        // await deleteAcademicPeriod(period.id);
        
        // Remove from local state
        setPeriods(prevPeriods => prevPeriods.filter((_, i) => i !== index));
        alert('Periode akademik berhasil dihapus!');
      } catch (error) {
        alert('Gagal menghapus periode akademik: ' + error.message);
      }
    }
  };

  // Handle back button
  const handleBack = () => {
    router.push('/adminpage');
  };

  return (
    <div className="min-h-screen bg-brand-light-sage" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      <AdminNavbar title="Dashboard Admin - Manajemen Periode Akademik" />
      
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={handleBack}
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
              Manajemen Periode Akademik
            </h2>
            <button 
              onClick={handleAddPeriod}
              disabled={loading}
              className="text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition shadow-md hover:opacity-90 disabled:opacity-50" 
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
              <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Periode Akademik</h3>
              <p className="text-white text-3xl sm:text-4xl font-bold mb-1">{loading ? '...' : filteredPeriods.length}</p>
              <p className="text-sm" style={{ color: '#DABC4E' }}>
                {loading ? 'Loading...' : searchQuery ? 'Hasil pencarian' : 'Periode terdaftar'}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl shadow-lg" style={{ backgroundColor: '#DABC4E' }}>
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#015023' }} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 mb-4 flex items-center gap-2 shadow-sm" style={{ backgroundColor: '#DABC4E', borderRadius: '12px' }}>
          <Search className="w-5 h-5" style={{ color: '#015023' }} />
          <input
            type="text"
            placeholder="Cari periode akademik..."
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

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredPeriods}
          actions={['edit', 'delete']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customRender={customRender}
        />
      </div>
    </div>
  );
}

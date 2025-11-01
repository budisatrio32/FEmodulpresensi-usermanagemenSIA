'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, X, ArrowLeft } from 'lucide-react';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';
import { getAllClasses } from '@/lib/ClassApi';
import { ErrorMessageBoxWithButton } from '@/components/ui/message-box';

export default function KelasDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [kelas, setKelas] = useState([
    { id: 1, code_class: 'A-CS101', mata_kuliah: 'Pemrograman Dasar', jumlah_mahasiswa: 35, maks_mahasiswa: 40, jadwal: 'Senin, 08.00 - 10.00', tanggal: '2024-11-04', is_active: true, created_at: '2024-01-15' },
    { id: 2, code_class: 'B-CS101', mata_kuliah: 'Pemrograman Dasar', jumlah_mahasiswa: 38, maks_mahasiswa: 40, jadwal: 'Selasa, 10.00 - 12.00', tanggal: '2024-11-05', is_active: true, created_at: '2024-01-16' },
    { id: 3, code_class: 'A-CS102', mata_kuliah: 'Struktur Data', jumlah_mahasiswa: 30, maks_mahasiswa: 35, jadwal: 'Rabu, 13.00 - 15.00', tanggal: '2024-11-06', is_active: true, created_at: '2024-01-17' },
    { id: 4, code_class: 'B-CS102', mata_kuliah: 'Struktur Data', jumlah_mahasiswa: 20, maks_mahasiswa: 35, jadwal: 'Kamis, 09.00 - 11.00', tanggal: '2024-11-07', is_active: false, created_at: '2024-01-18' },
    { id: 5, code_class: 'A-CS201', mata_kuliah: 'Algoritma dan Pemrograman', jumlah_mahasiswa: 28, maks_mahasiswa: 30, jadwal: 'Jumat, 08.00 - 10.00', tanggal: '2024-11-08', is_active: true, created_at: '2024-01-19' },
    { id: 6, code_class: 'B-CS201', mata_kuliah: 'Algoritma dan Pemrograman', jumlah_mahasiswa: 15, maks_mahasiswa: 30, jadwal: 'Senin, 13.00 - 15.00', tanggal: '2024-11-11', is_active: true, created_at: '2024-01-20' },
    { id: 7, code_class: 'A-CS301', mata_kuliah: 'Pemrograman Web', jumlah_mahasiswa: 10, maks_mahasiswa: 25, jadwal: 'Selasa, 15.00 - 17.00', tanggal: '2024-11-12', is_active: false, created_at: '2024-01-21' },
    { id: 8, code_class: 'B-CS301', mata_kuliah: 'Pemrograman Web', jumlah_mahasiswa: 22, maks_mahasiswa: 25, jadwal: 'Rabu, 08.00 - 10.00', tanggal: '2024-11-13', is_active: true, created_at: '2024-01-22' },
  ]);

  // ambil data kelas dari API
  const indexKelas = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await getAllClasses();
      if (response.status === 'success') {
        setSuccess(true);
        // setKelas(response.data);
      } else {
        setError('Gagal mengambil data kelas');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mengambil data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    indexKelas();
  }, []);

  // Filter kelas berdasarkan search query
  const filteredKelas = kelas.filter(kelasItem => {
    const query = searchQuery.toLowerCase();
    return (
      kelasItem.code_class.toLowerCase().includes(query) ||
      kelasItem.mata_kuliah.toLowerCase().includes(query) ||
      kelasItem.jumlah_mahasiswa.toString().includes(query) ||
      kelasItem.jadwal.toLowerCase().includes(query) ||
      kelasItem.tanggal.includes(query) ||
      (kelasItem.is_active ? 'active' : 'inactive').includes(query)
    );
  });

  // Define columns untuk table
  const columns = [
    { key: 'mata_kuliah', label: 'Mata Kuliah' },
    { key: 'code_class', label: 'Kode Kelas' },
    { key: 'jumlah_mahasiswa', label: 'Jumlah/Maks Mahasiswa' },
    { key: 'jadwal', label: 'Jadwal' },
    { key: 'is_active', label: 'Status' },
  ];

  // Custom render untuk jumlah_mahasiswa dan is_active status
  const customRender = {
    mata_kuliah: (value) => (
      <span 
        className="font-semibold text-sm"
        style={{ color: '#015023' }}
      >
        {value}
      </span>
    ),
    jumlah_mahasiswa: (value, rowData) => {
      const percentage = (value / rowData.maks_mahasiswa) * 100;
      const isAlmostFull = percentage >= 80;
      const isFull = percentage >= 100;
      
      return (
        <span 
          className="px-3 py-1 rounded font-semibold text-sm"
          style={{
            backgroundColor: isFull ? '#BE0414' : isAlmostFull ? '#DABC4E' : '#16874B',
            color: '#FFFFFF',
            borderRadius: '12px'
          }}
        >
          {value} / {rowData.maks_mahasiswa} Mhs
        </span>
      );
    },
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

  // Handle add new kelas
  const handleAddKelas = () => {
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

  // Handle detail action - redirect to detail page
  const handleDetail = (kelasItem, index) => {
    console.log('Detail kelas:', kelasItem, 'at index:', index);
    router.push(`/adminpage/tambahkelas/detail?id=${kelasItem.id}`);
  };

  // Handle delete action
  const handleActivate = async (kelasItem, index) => {
    if (window.confirm(`Apakah Anda yakin ingin mengaktifkan kelas "${kelasItem.kode_kelas}"?`)) {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/kelas/${kelasItem.id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        
        // if (!response.ok) throw new Error('Gagal menghapus data');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove kelas from state
        setKelas(prevKelas => prevKelas.filter((_, i) => i !== index));
        
        alert(`Kelas "${kelasItem.kode_kelas}" berhasil dihapus!`);
      } catch (error) {
        alert("Gagal menghapus data: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-sage" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {/* Admin Navbar */}
      <AdminNavbar title="Dashboard Admin - Kelas" />

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
              Statistik Kelas
            </h2>
            <button 
              onClick={handleAddKelas}
              className="text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition shadow-md hover:opacity-90" 
              style={{ backgroundColor: '#015023', borderRadius: '12px' }}
            >
              + Tambah
            </button>
          </div>
        </div>

        {error && (
          <ErrorMessageBoxWithButton message={error} action={indexKelas} />
        )}

        {/* Stats Card */}
        <div className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl" style={{ background: 'linear-gradient(to bottom right, #015023, #013d1c)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Kelas</h3>
              <p className="text-white text-3xl sm:text-4xl font-bold mb-1">{loading ? '...' : filteredKelas.length}</p>
              <p className="text-sm" style={{ color: '#DABC4E' }}>
                {loading ? 'Loading...' : (searchQuery ? 'Hasil pencarian' : error ? error : 'Kelas terdaftar')}
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
            placeholder="Cari kelas..."
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
        {success && (
          <DataTable
            columns={columns}
            data={filteredKelas}
            actions={['detail', 'activate']}
            pagination={true}
            onDetail={handleDetail}
            onActivate={handleActivate}
            customRender={customRender}
          />
        )}
      </div>
    </div>
  );
}

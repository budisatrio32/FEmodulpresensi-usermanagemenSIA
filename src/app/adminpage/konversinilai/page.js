'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';
import { Search, X, ArrowLeft, FileText } from 'lucide-react';

export default function KonversiNilaiPage() {
  const router = useRouter();
  
  // Dummy data - 12 grade conversion rules
  const [gradeRules, setGradeRules] = useState([
    { id: 1, min_grade: 95, max_grade: 100, letter: 'A', ip_skor: 4.00 },
    { id: 2, min_grade: 90, max_grade: 94, letter: 'A-', ip_skor: 3.75 },
    { id: 3, min_grade: 85, max_grade: 89, letter: 'B+', ip_skor: 3.50 },
    { id: 4, min_grade: 80, max_grade: 84, letter: 'B', ip_skor: 3.00 },
    { id: 5, min_grade: 75, max_grade: 79, letter: 'B-', ip_skor: 2.75 },
    { id: 6, min_grade: 70, max_grade: 74, letter: 'C+', ip_skor: 2.50 },
    { id: 7, min_grade: 65, max_grade: 69, letter: 'C', ip_skor: 2.00 },
    { id: 8, min_grade: 60, max_grade: 64, letter: 'C-', ip_skor: 1.75 },
    { id: 9, min_grade: 55, max_grade: 59, letter: 'D+', ip_skor: 1.50 },
    { id: 10, min_grade: 50, max_grade: 54, letter: 'D', ip_skor: 1.00 },
    { id: 11, min_grade: 40, max_grade: 49, letter: 'E', ip_skor: 0.50 },
    { id: 12, min_grade: 0, max_grade: 39, letter: 'F', ip_skor: 0.00 }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEdit = (rule) => {
    router.push(`/adminpage/konversinilai/editform?id=${rule.id}`);
  };

  const handleDelete = async (rule) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus konversi nilai untuk ${rule.letter}?`)) {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // await deleteGradeConversion(rule.id);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setGradeRules(prev => prev.filter(r => r.id !== rule.id));
      } catch (error) {
        setError('Gagal menghapus konversi nilai: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredRules = gradeRules.filter(rule => 
    rule.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.min_grade.toString().includes(searchQuery) ||
    rule.max_grade.toString().includes(searchQuery) ||
    rule.ip_skor.toString().includes(searchQuery)
  );

  const columns = [
    {
      key: 'min_grade',
      label: 'Nilai Minimal'
    },
    {
      key: 'max_grade',
      label: 'Nilai Maksimal'
    },
    {
      key: 'letter',
      label: 'Nilai Huruf'
    },
    {
      key: 'ip_skor',
      label: 'Nilai IP'
    }
  ];

  const customRender = {
    letter: (value) => (
      <span 
        className="px-3 py-1 rounded-full font-semibold"
        style={{
          backgroundColor: value.startsWith('A') ? '#E8F5E9' :
                         value.startsWith('B') ? '#E3F2FD' :
                         value.startsWith('C') ? '#FFF3E0' :
                         value.startsWith('D') ? '#FFE0B2' : '#FFEBEE',
          color: value.startsWith('A') ? '#2E7D32' :
                 value.startsWith('B') ? '#1565C0' :
                 value.startsWith('C') ? '#E65100' :
                 value.startsWith('D') ? '#E64A19' : '#C62828',
          fontFamily: 'Urbanist, sans-serif',
          borderRadius: '12px'
        }}
      >
        {value}
      </span>
    ),
    ip_skor: (value) => (
      <span 
        className="font-semibold"
        style={{ 
          color: '#015023',
          fontFamily: 'Urbanist, sans-serif'
        }}
      >
        {typeof value === 'number' ? value.toFixed(2) : value}
      </span>
    )
  };

  return (
    <div className="min-h-screen bg-brand-light-sage" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      <AdminNavbar title="Dashboard Admin - Manajemen Konversi Nilai" />
      
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
              Manajemen Konversi Nilai
            </h2>
            <button 
              onClick={() => router.push('/adminpage/konversinilai/addform')}
              disabled={isLoading}
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
              <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Konversi Nilai</h3>
              <p className="text-white text-3xl sm:text-4xl font-bold mb-1">{filteredRules.length}</p>
              <p className="text-sm" style={{ color: '#DABC4E' }}>
                {searchQuery ? 'Hasil pencarian' : 'Aturan konversi terdaftar'}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl shadow-lg" style={{ backgroundColor: '#DABC4E' }}>
              <FileText className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#015023' }} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 mb-4 flex items-center gap-2 shadow-sm" style={{ backgroundColor: '#DABC4E', borderRadius: '12px' }}>
          <Search className="w-5 h-5" style={{ color: '#015023' }} />
          <input
            type="text"
            placeholder="Cari konversi nilai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm text-gray-700"
            style={{ color: '#015023' }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
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
          data={filteredRules}
          actions={['edit', 'delete']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customRender={customRender}
        />
      </div>
    </div>
  );
}

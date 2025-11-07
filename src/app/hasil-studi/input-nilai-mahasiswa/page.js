'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText, Save } from 'lucide-react';
import DataTable from '@/components/ui/table';
import { PrimaryButton, OutlineButton } from '@/components/ui/button';
import Navbar from '@/components/ui/navigation-menu';

export default function InputNilaiMahasiswa() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Get params from URL
  const kodeMatkul = searchParams.get('kode') || 'IF101';
  const namaMatkul = searchParams.get('nama') || 'Pemrograman Dasar';
  const sks = searchParams.get('sks') || '3';

  // Data mahasiswa untuk input nilai
  const [mahasiswaData, setMahasiswaData] = useState([
    {
      id: 1,
      nim: '2021110001',
      nama: 'John Doe',
      nilai: 85
    },
    {
      id: 2,
      nim: '2021110002',
      nama: 'Jane Smith',
      nilai: 90
    },
    {
      id: 3,
      nim: '2021110003',
      nama: 'Bob Johnson',
      nilai: 78
    },
    {
      id: 4,
      nim: '2021110004',
      nama: 'Alice Williams',
      nilai: null
    },
    {
      id: 5,
      nim: '2021110005',
      nama: 'Charlie Brown',
      nilai: null
    },
  ]);

  // Handle nilai change - langsung update tanpa toggle
  const handleNilaiChange = (id, newNilai) => {
    const numValue = newNilai === '' ? null : parseInt(newNilai);
    setMahasiswaData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, nilai: numValue } : item
      )
    );
  };

  // Convert nilai to grade
  const nilaiToGrade = (nilai) => {
    if (nilai === null) return '-';
    if (nilai >= 85) return 'A';
    if (nilai >= 80) return 'A-';
    if (nilai >= 75) return 'B+';
    if (nilai >= 70) return 'B';
    if (nilai >= 65) return 'B-';
    if (nilai >= 60) return 'C+';
    if (nilai >= 55) return 'C';
    if (nilai >= 40) return 'D';
    return 'E';
  };

  // Custom render for nilai column
  const customRender = {
    nilai_akhir: (value, item) => {
      return (
        <div className="flex items-center justify-center">
          {item.nilai !== null ? (
            <span 
              className="px-6 py-2.5 rounded-lg font-bold text-xl"
              style={{ 
                backgroundColor: '#DABC4E', 
                color: '#015023',
                fontFamily: 'Urbanist, sans-serif' 
              }}
            >
              {nilaiToGrade(item.nilai)}
            </span>
          ) : (
            <span 
              className="px-4 py-2 rounded-lg font-medium"
              style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#6b7280',
                fontFamily: 'Urbanist, sans-serif' 
              }}
            >
              -
            </span>
          )}
        </div>
      );
    },
    input_nilai: (value, item) => {
      const isInvalid = item.nilai !== null && (item.nilai < 0 || item.nilai > 100);
      
      return (
        <div className="flex items-center justify-center">
          <input
            type="number"
            min="0"
            max="100"
            value={item.nilai === null ? '' : item.nilai}
            onChange={(e) => handleNilaiChange(item.id, e.target.value)}
            className="w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none text-center font-semibold transition"
            style={{
              fontFamily: 'Urbanist, sans-serif',
              borderColor: isInvalid ? '#BE0414' : '#015023',
              borderRadius: '12px',
              fontSize: '16px',
              maxWidth: '120px',
              backgroundColor: isInvalid ? '#fee2e2' : 'white'
            }}
            placeholder="0-100"
          />
        </div>
      );
    }
  };

  // Define table columns
  const columns = [
    { 
      key: 'nim', 
      label: 'NIM', 
      width: '150px',
      cellClassName: 'font-medium'
    },
    { 
      key: 'nama', 
      label: 'Nama Mahasiswa',
      className: 'text-left',
      cellClassName: 'text-left font-medium'
    },
    { 
      key: 'input_nilai', 
      label: 'Input Nilai', 
      width: '150px'
    },
    { 
      key: 'nilai_akhir', 
      label: 'Nilai Akhir', 
      width: '180px'
    },
  ];

  const handleSaveAll = async () => {
    const belumDinilai = mahasiswaData.filter(item => item.nilai === null);
    const nilaiInvalid = mahasiswaData.filter(item => 
      item.nilai !== null && (item.nilai < 0 || item.nilai > 100)
    );
    
    if (nilaiInvalid.length > 0) {
      alert('Ada nilai yang tidak valid (harus 0-100). Mohon perbaiki terlebih dahulu.');
      return;
    }
    
    if (belumDinilai.length > 0) {
      const confirm = window.confirm(
        `Masih ada ${belumDinilai.length} mahasiswa yang belum dinilai. Lanjutkan menyimpan?`
      );
      if (!confirm) return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Semua nilai berhasil disimpan!');
      router.back();
    } catch (error) {
      alert('Gagal menyimpan nilai: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-sage">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
          style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Daftar Mata Kuliah
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ borderRadius: '16px' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#015023' }}
              >
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 
                  className="text-3xl font-bold mb-2"
                  style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
                >
                  Input Nilai Akhir Mahasiswa
                </h1>
                <p 
                  className="text-lg"
                  style={{ color: '#015023', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}
                >
                  {kodeMatkul} - {namaMatkul} ({sks} SKS)
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Jumlah Mahasiswa
              </p>
              <p className="text-lg font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {mahasiswaData.length} Mahasiswa
              </p>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Sudah Dinilai
              </p>
              <p className="text-lg font-semibold" style={{ color: '#16874B', fontFamily: 'Urbanist, sans-serif' }}>
                {mahasiswaData.filter(item => item.nilai !== null).length} Mahasiswa
              </p>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                Belum Dinilai
              </p>
              <p className="text-lg font-semibold" style={{ color: '#BE0414', fontFamily: 'Urbanist, sans-serif' }}>
                {mahasiswaData.filter(item => item.nilai === null).length} Mahasiswa
              </p>
            </div>
          </div>
        </div>

        {/* Table Mahasiswa */}
        <div className="mb-6">
          <DataTable
            columns={columns}
            data={mahasiswaData}
            actions={[]}
            pagination={false}
            customRender={customRender}
          />
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
              <p className="font-medium">Keterangan Konversi Nilai:</p>
              <p className="text-gray-600 mt-1">
                A: 85-100 | A-: 80-84 | B+: 75-79 | B: 70-74 | B-: 65-69 | C+: 60-64 | C: 55-59 | D: 40-54 | E: 0-39
              </p>
            </div>

            <div className="flex gap-3">
              <OutlineButton
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Batal
              </OutlineButton>
              
              <PrimaryButton
                onClick={handleSaveAll}
                disabled={isLoading}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Menyimpan...' : 'Simpan Semua Nilai'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

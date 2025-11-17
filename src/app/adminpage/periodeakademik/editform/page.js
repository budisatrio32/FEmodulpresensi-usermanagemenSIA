'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Field, 
  FieldLabel, 
  FieldDescription, 
  FieldError, 
  FieldContent 
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import AdminNavbar from '@/components/ui/admin-navbar';
import { ArrowLeft, Save, X, Info } from 'lucide-react';
import { ErrorMessageBox, SuccessMessageBoxWithButton } from '@/components/ui/message-box';

export default function EditPeriodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    active: false
  });

  // Dummy data untuk simulasi
  const dummyPeriods = {
    1: {
      id: 1,
      name: 'Semester Ganjil 2024/2025',
      start_date: '2024-09-01',
      end_date: '2025-01-31',
      active: true
    },
    2: {
      id: 2,
      name: 'Semester Genap 2023/2024',
      start_date: '2024-02-01',
      end_date: '2024-08-31',
      active: false
    },
    3: {
      id: 3,
      name: 'Semester Ganjil 2023/2024',
      start_date: '2023-09-01',
      end_date: '2024-01-31',
      active: false
    },
    4: {
      id: 4,
      name: 'Semester Genap 2022/2023',
      start_date: '2023-02-01',
      end_date: '2023-08-31',
      active: false
    }
  };

  useEffect(() => {
    const fetchPeriod = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await getAcademicPeriod(periodId);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const period = dummyPeriods[periodId];
        
        if (period) {
          setFormData(period);
        } else {
          setErrors({ form: 'Periode tidak ditemukan' });
        }
      } catch (error) {
        setErrors({ form: 'Gagal mengambil data: ' + error.message });
      } finally {
        setLoading(false);
      }
    };

    if (periodId) {
      fetchPeriod();
    }
  }, [periodId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama periode harus diisi';
    } else if (formData.name.length < 5) {
      newErrors.name = 'Nama periode minimal 5 karakter';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Tanggal mulai harus diisi';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'Tanggal selesai harus diisi';
    }
    
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        newErrors.end_date = 'Tanggal selesai harus lebih besar dari tanggal mulai';
      }
    }
    
    setErrors(prev => ({...prev, ...newErrors}));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    const newErrors = {};
    try {
      // TODO: Replace with actual API call
      // const response = await updateAcademicPeriod(periodId, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Periode akademik berhasil diperbarui');
    } catch (error) {
      newErrors.form = 'Gagal memperbarui data: ' + (error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
      setErrors(prev => ({...prev, ...newErrors}));
    }
  };

  const handleCancel = () => {
    router.push('/adminpage/periodeakademik');
  };

  const handleFinish = () => {
    router.push('/adminpage/periodeakademik');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light-sage flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#015023] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            Memuat data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light-sage">
      <AdminNavbar title="Dashboard Admin - Edit Periode Akademik" />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => router.push('/adminpage/periodeakademik')}
            className="mb-6 -ml-4"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-2 h-16 rounded-full"
              style={{ backgroundColor: '#015023' }}
            />
            <div>
              <h1 
                className="text-4xl font-bold mb-2"
                style={{ 
                  color: '#015023',
                  fontFamily: 'Urbanist, sans-serif'
                }}
              >
                Edit Periode Akademik
              </h1>
              <p 
                className="text-gray-600 text-lg"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Perbarui informasi periode akademik
              </p>
            </div>
          </div>
        </div>

        {errors.form && (
          <div className="mb-6">
            <ErrorMessageBox message={errors.form} />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <SuccessMessageBoxWithButton
              message={success}
              action={handleFinish}
              btntext="Kembali ke Daftar"
            />
          </div>
        )}

        <div 
          className="bg-white rounded-3xl shadow-xl p-8"
          style={{ borderRadius: '24px' }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div 
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ backgroundColor: '#f0f9ff' }}
            >
              <Info 
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: '#015023' }}
              />
              <div>
                <p 
                  className="font-semibold mb-1"
                  style={{ 
                    color: '#015023',
                    fontFamily: 'Urbanist, sans-serif'
                  }}
                >
                  Informasi Penting
                </p>
                <p 
                  className="text-sm text-gray-700"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                  Pastikan tanggal periode tidak tumpang tindih dengan periode lain. Hanya satu periode yang bisa aktif dalam satu waktu.
                </p>
              </div>
            </div>

            <Field>
              <FieldLabel required>Nama Periode</FieldLabel>
              <FieldDescription>
                Masukkan nama periode akademik (contoh: Semester Ganjil 2024/2025)
              </FieldDescription>
              <FieldContent>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition"
                  style={{
                    fontFamily: 'Urbanist, sans-serif',
                    borderColor: errors.name ? '#BE0414' : '#015023',
                    borderRadius: '12px',
                    opacity: errors.name ? 1 : 0.7
                  }}
                  placeholder="Semester Ganjil 2024/2025"
                  disabled={isLoading}
                />
              </FieldContent>
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel required>Tanggal Mulai</FieldLabel>
                <FieldDescription>
                  Pilih tanggal mulai periode
                </FieldDescription>
                <FieldContent>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.start_date ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.start_date ? 1 : 0.7
                    }}
                    disabled={isLoading}
                  />
                </FieldContent>
                {errors.start_date && <FieldError>{errors.start_date}</FieldError>}
              </Field>

              <Field>
                <FieldLabel required>Tanggal Selesai</FieldLabel>
                <FieldDescription>
                  Pilih tanggal selesai periode
                </FieldDescription>
                <FieldContent>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.end_date ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.end_date ? 1 : 0.7
                    }}
                    disabled={isLoading}
                  />
                </FieldContent>
                {errors.end_date && <FieldError>{errors.end_date}</FieldError>}
              </Field>
            </div>

            <Field>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-gray-300 text-[#015023] focus:ring-[#015023] focus:ring-offset-0"
                  disabled={isLoading}
                />
                <label 
                  htmlFor="active"
                  className="font-semibold cursor-pointer"
                  style={{ 
                    color: '#015023',
                    fontFamily: 'Urbanist, sans-serif'
                  }}
                >
                  Aktifkan periode ini
                </label>
              </div>
              <FieldDescription className="mt-2 ml-8">
                Jika dicentang, periode ini akan menjadi periode aktif dan periode lain akan dinonaktifkan
              </FieldDescription>
            </Field>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                <X className="w-5 h-5 mr-2" />
                Batal
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                style={{
                  backgroundColor: '#015023',
                  color: 'white',
                  fontFamily: 'Urbanist, sans-serif'
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

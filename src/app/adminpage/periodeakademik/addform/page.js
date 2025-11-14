'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AddPeriodeForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    active: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: null }));
    }
    if (success) {
      setSuccess(null);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        active: false
      });
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
      // const response = await storeAcademicPeriod(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Periode akademik berhasil ditambahkan');
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        active: false
      });
    } catch (error) {
      newErrors.form = 'Gagal menambahkan data: ' + (error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
      setErrors(prev => ({...prev, ...newErrors}));
    }
  };

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang diisi akan hilang.')) {
      router.push('/adminpage/periodeakademik');
    }
  };

  const handleFinish = () => {
    router.push('/adminpage/periodeakademik');
  };

  return (
    <div className="min-h-screen bg-brand-light-sage">
      <AdminNavbar title="Dashboard Admin - Tambah Periode Akademik" />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
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
                Tambah Periode Akademik
              </h1>
              <p 
                className="text-gray-600 text-lg"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Isi form di bawah untuk menambahkan periode akademik baru
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.form && (
          <div className="mb-6">
            <ErrorMessageBox message={errors.form} />
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6">
            <SuccessMessageBoxWithButton
              message={success}
              action={handleFinish}
              btntext="Kembali ke Daftar"
            />
          </div>
        )}

        {/* Form Card */}
        <div 
          className="bg-white rounded-3xl shadow-xl p-8"
          style={{ borderRadius: '24px' }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Info Alert */}
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

            {/* Nama Periode */}
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#015023]'
                  }`}
                  placeholder="Semester Ganjil 2024/2025"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                  disabled={isLoading}
                />
              </FieldContent>
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            {/* Tanggal Mulai dan Selesai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tanggal Mulai */}
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
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.start_date 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#015023]'
                    }`}
                    style={{ fontFamily: 'Urbanist, sans-serif' }}
                    disabled={isLoading}
                  />
                </FieldContent>
                {errors.start_date && <FieldError>{errors.start_date}</FieldError>}
              </Field>

              {/* Tanggal Selesai */}
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
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.end_date 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#015023]'
                    }`}
                    style={{ fontFamily: 'Urbanist, sans-serif' }}
                    disabled={isLoading}
                  />
                </FieldContent>
                {errors.end_date && <FieldError>{errors.end_date}</FieldError>}
              </Field>
            </div>

            {/* Status Aktif */}
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

            {/* Action Buttons */}
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
                    Simpan
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

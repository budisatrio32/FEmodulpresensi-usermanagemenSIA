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
import {
  AlertConfirmationDialog,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PrimaryButton, OutlineButton, WarningButton } from '@/components/ui/button';
import { storeAcademicPeriod } from '@/lib/adminApi';

export default function AddPeriodeForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
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
      const response = await storeAcademicPeriod({
        name: formData.name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.active
      });
      if (response.status === 'success') {
        setSuccess('Periode akademik berhasil ditambahkan');
        setFormData({
          name: '',
          start_date: '',
          end_date: '',
          active: false
        });
      } else {
        newErrors.form = response.message || 'Unknown error';
      }
    } catch (error) {
      newErrors.form = error.message || 'Unknown error';
    } finally {
      setIsLoading(false);
      setErrors(prev => ({...prev, ...newErrors}));
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    router.push('/adminpage/periodeakademik');
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

        {/* Form Card */}
        <div 
          className="bg-white rounded-3xl shadow-xl p-8"
          style={{ 
            borderRadius: '24px',
            border: '2px solid #015023'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">

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

            {/* Status Aktif */}
            <Field>
              <div 
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  border: '2px solid #015023',
                  backgroundColor: formData.active ? 'rgba(1, 80, 35, 0.05)' : 'transparent'
                }}
              >
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-gray-300 text-[#015023] focus:ring-[#015023] focus:ring-offset-0"
                  disabled={isLoading}
                />
                <div className="flex-1">
                  <label 
                    htmlFor="active"
                    className="font-semibold cursor-pointer block"
                    style={{ 
                      color: '#015023',
                      fontFamily: 'Urbanist, sans-serif'
                    }}
                  >
                    Aktifkan periode ini
                  </label>
                  <p 
                    className="text-sm mt-1"
                    style={{ 
                      color: '#015023',
                      opacity: 0.7,
                      fontFamily: 'Urbanist, sans-serif'
                    }}
                  >
                    Jika dicentang, periode ini akan menjadi periode aktif dan periode lain akan dinonaktifkan
                  </p>
                </div>
              </div>
            </Field>

            {/* Error Message */}
            {errors.form && (
              <ErrorMessageBox message={errors.form} />
            )}

            {/* Success Message */}
            {success && (
              <SuccessMessageBoxWithButton
                message={success + ' Lihat Data atau tambahkan periode akademik lain.'}
                action={handleFinish}
                btntext="Lihat Data"
              />
            )}

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
                    <span className="animate-spin mr-2">⏳</span>
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
        {/* Info Box */}
        <div 
          className="mt-8 p-6 border-2 shadow-md"
          style={{
            borderColor: '#DABC4E',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FFFEF7 0%, #FFF9E6 100%)'
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: '#DABC4E',
                color: '#ffffffff'
              }}
            >
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 
                className="font-bold text-lg mb-2"
                style={{ 
                  fontFamily: 'Urbanist, sans-serif',
                  color: '#015023'
                }}
              >
                Catatan Penting
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{ 
                  fontFamily: 'Urbanist, sans-serif',
                  color: '#015023'
                }}
              >
                Pastikan tanggal periode tidak tumpang tindih dengan periode lain. Hanya satu periode yang bisa aktif dalam satu waktu.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Cancel Confirmation Dialog */}
      <AlertConfirmationDialog 
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Konfirmasi Pembatalan"
        description="Apakah Anda yakin ingin membatalkan? Data yang diisi akan hilang."
        onConfirm={confirmCancel}
        confirmText="Ya, Batalkan"
        cancelText="Lanjutkan Mengisi"
      />
    </div>
  );
}

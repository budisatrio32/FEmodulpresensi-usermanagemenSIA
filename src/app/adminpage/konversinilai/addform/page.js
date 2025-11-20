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
import { AlertConfirmationDialog } from '@/components/ui/alert-dialog';

export default function AddKonversiNilaiForm() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    min_grade: '',
    max_grade: '',
    letter: '',
    ip_skor: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For numeric fields, ensure only numbers and decimal points
    if (name === 'min_grade' || name === 'max_grade') {
      if (value && !/^\d*$/.test(value)) return;
    }
    
    if (name === 'ip_skor') {
      if (value && !/^\d*\.?\d*$/.test(value)) return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.min_grade) {
      newErrors.min_grade = 'Nilai minimal harus diisi';
    } else {
      const minGrade = parseFloat(formData.min_grade);
      if (minGrade < 0 || minGrade > 100) {
        newErrors.min_grade = 'Nilai minimal harus antara 0-100';
      }
    }
    
    if (!formData.max_grade) {
      newErrors.max_grade = 'Nilai maksimal harus diisi';
    } else {
      const maxGrade = parseFloat(formData.max_grade);
      if (maxGrade < 0 || maxGrade > 100) {
        newErrors.max_grade = 'Nilai maksimal harus antara 0-100';
      }
    }
    
    if (formData.min_grade && formData.max_grade) {
      const minGrade = parseFloat(formData.min_grade);
      const maxGrade = parseFloat(formData.max_grade);
      
      if (maxGrade <= minGrade) {
        newErrors.max_grade = 'Nilai maksimal harus lebih besar dari nilai minimal';
      }
    }
    
    if (!formData.letter.trim()) {
      newErrors.letter = 'Nilai huruf harus diisi';
    } else {
      const validLetters = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];
      if (!validLetters.includes(formData.letter.toUpperCase())) {
        newErrors.letter = 'Nilai huruf harus salah satu dari: A, A-, B+, B, B-, C+, C, C-, D+, D, E, F';
      }
    }
    
    if (!formData.ip_skor) {
      newErrors.ip_skor = 'Nilai IP harus diisi';
    } else {
      const ipSkor = parseFloat(formData.ip_skor);
      if (isNaN(ipSkor) || ipSkor < 0 || ipSkor > 4) {
        newErrors.ip_skor = 'Nilai IP harus antara 0.00-4.00';
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
      // const response = await createGradeConversion(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Konversi nilai berhasil ditambahkan');
    } catch (error) {
      newErrors.form = 'Gagal menyimpan data: ' + (error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
      setErrors(prev => ({...prev, ...newErrors}));
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    router.push('/adminpage/konversinilai');
  }

  const handleFinish = () => {
    router.push('/adminpage/konversinilai');
  };

  return (
    <div className="min-h-screen bg-brand-light-sage">
      <AdminNavbar title="Dashboard Admin - Tambah Konversi Nilai" />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={handleCancel}
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
                Tambah Konversi Nilai
              </h1>
              <p 
                className="text-gray-600 text-lg"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Tambahkan aturan konversi nilai baru
              </p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-3xl shadow-xl p-8"
          style={{ 
            borderRadius: '24px',
            border: '2px solid #015023'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel required>Nilai Minimal</FieldLabel>
                <FieldDescription>
                  Masukkan nilai minimal (0-100)
                </FieldDescription>
                <FieldContent>
                  <input
                    type="text"
                    name="min_grade"
                    value={formData.min_grade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.min_grade ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.min_grade ? 1 : 0.7
                    }}
                    placeholder="0"
                    disabled={isLoading}
                  />
                </FieldContent>
                {errors.min_grade && <FieldError>{errors.min_grade}</FieldError>}
              </Field>

              <Field>
                <FieldLabel required>Nilai Maksimal</FieldLabel>
                <FieldDescription>
                  Masukkan nilai maksimal (0-100)
                </FieldDescription>
                <FieldContent>
                  <input
                    type="text"
                    name="max_grade"
                    value={formData.max_grade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.max_grade ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.max_grade ? 1 : 0.7
                    }}
                    placeholder="100"
                    disabled={isLoading}
                  />
                </FieldContent>
                {errors.max_grade && <FieldError>{errors.max_grade}</FieldError>}
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel required>Nilai Huruf</FieldLabel>
                <FieldDescription>
                  Masukkan nilai huruf (contoh: A, B+, C)
                </FieldDescription>
                <FieldContent>
                  <input
                    type="text"
                    name="letter"
                    value={formData.letter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition uppercase"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.letter ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.letter ? 1 : 0.7
                    }}
                    placeholder="A"
                    disabled={isLoading}
                    maxLength={2}
                  />
                </FieldContent>
                {errors.letter && <FieldError>{errors.letter}</FieldError>}
              </Field>

              <Field>
                <FieldLabel required>Nilai IP</FieldLabel>
                <FieldDescription>
                  Masukkan nilai IP (0.00-4.00)
                </FieldDescription>
                <FieldContent>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100 transition"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.weight ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.weight ? 1 : 0.7
                    }}
                    placeholder="4.00"
                    disabled={isLoading}
                  />
                </FieldContent>
                {errors.ip_skor && <FieldError>{errors.ip_skor}</FieldError>}
              </Field>
            </div>

            <div 
              className="p-4 rounded-xl border-2"
              style={{ 
                backgroundColor: '#FFF8E1',
                borderColor: '#FFE082'
              }}
            >
              <p 
                className="text-sm font-semibold mb-2"
                style={{ 
                  color: '#F57F17',
                  fontFamily: 'Urbanist, sans-serif'
                }}
              >
                Contoh Konversi Nilai:
              </p>
              <ul 
                className="text-sm space-y-1"
                style={{ 
                  color: '#6D4C41',
                  fontFamily: 'Urbanist, sans-serif'
                }}
              >
                <li>• 95-100 = A (4.00)</li>
                <li>• 90-94 = A- (3.75)</li>
                <li>• 85-89 = B+ (3.50)</li>
                <li>• 80-84 = B (3.00)</li>
              </ul>
            </div>

            {/* error message */}
            {errors.form && (
              <ErrorMessageBox message={errors.form} />
            )}

            {/* success message */}
            {success && (
              <SuccessMessageBoxWithButton
                message={success}
                action={handleFinish}
                btntext="Kembali ke Daftar"
              />
            )}

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
                    Simpan Data
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
                Informasi Penting
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{ 
                  fontFamily: 'Urbanist, sans-serif',
                  color: '#015023'
                }}
              >
                Pastikan rentang nilai tidak tumpang tindih dengan konversi nilai yang sudah ada.<br />
                Nilai huruf yang valid: A, A-, B+, B, B-, C+, C, C-, D+, D, E, F.
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

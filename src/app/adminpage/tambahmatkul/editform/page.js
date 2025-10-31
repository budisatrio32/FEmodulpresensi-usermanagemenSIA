"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Field, 
  FieldLabel, 
  FieldDescription, 
  FieldError, 
  FieldContent 
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import AdminNavbar from "@/components/ui/admin-navbar";
import { ArrowLeft, Save, X, Info } from "lucide-react";
import { getSubjectById, updateSubject } from "@/lib/adminApi";
import LoadingEffect from "@/components/ui/loading-effect";

export default function EditMatkulForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matkulId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    name_subject: "",
    code_subject: "",
    sks: ""
  });

  // Fetch data matkul saat component mount
  useEffect(() => {
    if (matkulId) {
      fetchMatkulData();
    } else {
      alert("ID mata kuliah tidak ditemukan.");
      router.push("/adminpage/tambahmatkul");
    }
  }, [matkulId]);

  const fetchMatkulData = async () => {
    try {
      setIsFetching(true);
      
      // Call API untuk GET detail matkul
      const response = await getSubjectById(matkulId);
      
      if (response.success) {
        // Mengambil data dari database dan set ke form
        setFormData({
          name_subject: response.data.name_subject,
          code_subject: response.data.code_subject,
          sks: response.data.sks.toString()
        });
      } else {
        throw new Error(response.message || 'Gagal mengambil data');
      }

    } catch (error) {
      console.error('Error fetching subject:', error);
      alert("Error fetching subjects: " + (error.response?.data?.message || error.message));
      router.push("/adminpage/tambahmatkul");
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name_subject.trim()) {
      newErrors.name_subject = "Nama mata kuliah harus diisi";
    } else if (formData.name_subject.length < 3) {
      newErrors.name_subject = "Nama mata kuliah minimal 3 karakter";
    }
    
    if (!formData.code_subject.trim()) {
      newErrors.code_subject = "Kode mata kuliah harus diisi";
    } else if (formData.code_subject.length < 2) {
      newErrors.code_subject = "Kode mata kuliah minimal 2 karakter";
    }
    
    if (!formData.sks) {
      newErrors.sks = "SKS harus diisi";
    } else if (parseInt(formData.sks) < 1 || parseInt(formData.sks) > 6) {
      newErrors.sks = "SKS harus antara 1-6";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const payload = {
        name_subject: formData.name_subject.trim(),
        code_subject: formData.code_subject.trim().toUpperCase(),
        sks: parseInt(formData.sks)
      };
      
      // Call API untuk UPDATE
      const response = await updateSubject(matkulId, payload);
      
      if (response.success) {
        setSuccess('Mata kuliah berhasil diperbarui');
      } else {
        setErrors({ form: response.message || 'Gagal mengupdate data' });
      }
      
    } catch (error) {
      console.error('Error updating subject:', error);
      
      if (error.response?.data?.errors) {
        // Validasi error (422)
        setErrors(error.response.data.errors);
      } else {
        // Other errors
        setErrors({ 
          form: error.response?.data?.message || error.message || 'Gagal mengupdate data' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan? Perubahan tidak akan disimpan.")) {
      router.push("/adminpage/tambahmatkul");
    }
  };

  const handleFinish = () => {
    router.push("/adminpage/tambahmatkul");
  };

  if (isFetching) {
    return (
      <LoadingEffect/>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light-sage">
      <AdminNavbar title="Dashboard Admin - Edit Mata Kuliah" />
      
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white p-8 max-w-md w-full shadow-2xl"
            style={{ borderRadius: '16px' }}
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#16874B' }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ 
                  fontFamily: 'Urbanist, sans-serif',
                  color: '#015023'
                }}
              >
                Berhasil!
              </h3>
              <p 
                className="text-gray-600 mb-6"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                {success}
              </p>
              <button
                onClick={handleFinish}
                className="w-full text-white py-3 font-semibold hover:opacity-90 transition"
                style={{ 
                  backgroundColor: '#015023',
                  borderRadius: '12px',
                  fontFamily: 'Urbanist, sans-serif'
                }}
              >
                Kembali ke Daftar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => router.push("/adminpage/tambahmatkul")}
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
                  fontFamily: 'Urbanist, sans-serif',
                  color: '#015023'
                }}
              >
                Edit Data Mata Kuliah
              </h1>
              <p 
                className="text-lg text-gray-600"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Perbarui informasi mata kuliah di bawah ini
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div 
          className="bg-white border-2 p-8 md:p-10 shadow-lg"
          style={{ 
            borderColor: '#015023',
            borderRadius: '12px'
          }}
        >
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ 
                fontFamily: 'Urbanist, sans-serif',
                color: '#015023'
              }}
            >
              Informasi Mata Kuliah
            </h2>
            <div 
              className="w-20 h-1 rounded-full"
              style={{ backgroundColor: '#DABC4E' }}
            />
          </div>

          {/* Error Message */}
          {errors.form && (
            <div 
              className="mb-6 p-4 border-2 flex items-start gap-3"
              style={{
                backgroundColor: '#FEE2E2',
                borderColor: '#BE0414',
                borderRadius: '12px'
              }}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#BE0414' }}
              >
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <p 
                  className="font-semibold mb-1"
                  style={{ 
                    fontFamily: 'Urbanist, sans-serif',
                    color: '#BE0414'
                  }}
                >
                  Error
                </p>
                <p 
                  className="text-sm"
                  style={{ 
                    fontFamily: 'Urbanist, sans-serif',
                    color: '#BE0414'
                  }}
                >
                  {errors.form}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Subject Field */}
            <Field>
              <FieldLabel htmlFor="name_subject">
                Nama Mata Kuliah <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldDescription>
                Masukkan nama lengkap mata kuliah
              </FieldDescription>
              <FieldContent>
                <div className="relative">
                  <input
                    type="text"
                    id="name_subject"
                    name="name_subject"
                    value={formData.name_subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 focus:outline-none focus:border-opacity-100"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.name_subject ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.name_subject ? 1 : 0.7
                    }}
                    placeholder="Contoh: Algoritma dan Pemrograman"
                    disabled={isLoading}
                  />
                  {formData.name_subject && !errors.name_subject && formData.name_subject.length >= 3 && (
                    <div 
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: '#16874B' }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </FieldContent>
              {errors.name_subject && (
                <FieldError>{errors.name_subject}</FieldError>
              )}
            </Field>

            {/* Code Subject Field */}
            <Field>
              <FieldLabel htmlFor="code_subject">
                Kode Mata Kuliah <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldDescription>
                Kode unik untuk mata kuliah ini (huruf besar)
              </FieldDescription>
              <FieldContent>
                <div className="relative">
                  <input
                    type="text"
                    id="code_subject"
                    name="code_subject"
                    value={formData.code_subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 focus:outline-none focus:border-opacity-100 uppercase"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.code_subject ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.code_subject ? 1 : 0.7
                    }}
                    placeholder="Contoh: CS101"
                    disabled={isLoading}
                  />
                  {formData.code_subject && !errors.code_subject && formData.code_subject.length >= 2 && (
                    <div 
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: '#16874B' }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </FieldContent>
              {errors.code_subject && (
                <FieldError>{errors.code_subject}</FieldError>
              )}
            </Field>

            {/* SKS Field */}
            <Field>
              <FieldLabel htmlFor="sks">
                Jumlah SKS <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldDescription>
                Pilih jumlah SKS mata kuliah (1-6)
              </FieldDescription>
              <FieldContent>
                <div className="relative">
                  <select
                    id="sks"
                    name="sks"
                    value={formData.sks}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 focus:outline-none focus:border-opacity-100 appearance-none cursor-pointer"
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      borderColor: errors.sks ? '#BE0414' : '#015023',
                      borderRadius: '12px',
                      opacity: errors.sks ? 1 : 0.7,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23015023' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5rem'
                    }}
                    disabled={isLoading}
                  >
                    <option value="">Pilih SKS</option>
                    <option value="1">1 SKS</option>
                    <option value="2">2 SKS</option>
                    <option value="3">3 SKS</option>
                    <option value="4">4 SKS</option>
                    <option value="5">5 SKS</option>
                    <option value="6">6 SKS</option>
                  </select>
                  {formData.sks && !errors.sks && (
                    <div 
                      className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: '#16874B' }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </FieldContent>
              {errors.sks && (
                <FieldError>{errors.sks}</FieldError>
              )}
            </Field>

            {/* Action Buttons */}
            <div className="pt-8">
              <div 
                className="w-full h-px mb-8"
                style={{ 
                  background: 'linear-gradient(to right, transparent, #015023, transparent)',
                  opacity: 0.3
                }}
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading}
                  className="flex-1 sm:flex-none sm:min-w-[200px]"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Update Data
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none sm:min-w-[200px]"
                >
                  <X className="w-5 h-5 mr-2" />
                  Batal
                </Button>
              </div>
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
                color: '#015023'
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
                Pastikan semua perubahan data sudah benar sebelum menyimpan. 
                Perubahan kode mata kuliah dapat mempengaruhi data terkait lainnya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

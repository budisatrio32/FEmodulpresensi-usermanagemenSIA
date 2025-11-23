'use client';

import { useState, useEffect } from 'react';
import DetailNilaiMahasiswa from '@/components/ui/detail-nilai-mahasiswa';
import DetailNilaiDosen from '@/components/ui/detail-nilai-dosen';
import RoleSwitcher from '@/components/ui/role-switcher';
import Footer from '@/components/ui/footer';

export default function AkademikPage() {
const [userRole, setUserRole] = useState(null);
const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    // Simulasi get user role from cookies/auth
    // Dalam production, ambil dari cookies atau context
    const getUserRole = () => {
        // TODO: Replace dengan logic get role dari cookies
        // const role = getCookie('roles');
        
        // Untuk demo, set role berdasarkan localStorage atau default
        const role = localStorage.getItem('userRole') || 'mahasiswa';
        return role;
    };

    const role = getUserRole();
    setUserRole(role);
    setIsLoading(false);
    }, []);

    if (isLoading) {
    return (
        <div className="min-h-screen bg-brand-light-sage flex items-center justify-center">
        <div className="text-center">
            <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#015023', borderTopColor: 'transparent' }}
            />
            <p className="text-lg font-medium" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Memuat data...
            </p>
        </div>
        </div>
    );
    }

    // Render berdasarkan role user
    return (
    <>
        {userRole === 'mahasiswa' ? (
        <>
            <DetailNilaiMahasiswa />
            <Footer />
        </>
        ) : userRole === 'dosen' ? (
        <>
            <DetailNilaiDosen />
            <Footer />
        </>
        ) : (
        <div className="min-h-screen bg-brand-light-sage flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center" style={{ borderRadius: '16px' }}>
            <p className="text-lg font-medium" style={{ color: '#BE0414', fontFamily: 'Urbanist, sans-serif' }}>
                Role tidak dikenali. Silakan login kembali.
            </p>
            </div>
        </div>
        )}
        
        {/* Role Switcher for Development/Testing */}
        <RoleSwitcher />
    </>
    );
}
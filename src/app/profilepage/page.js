'use client';

import Navbar from '@/components/ui/navigation-menu';
import ProfileMahasiswa from '@/components/ui/profilemahasiswa';
import ProfileDMA from '@/components/ui/profileDMA';

export default function ProfilePage() {
  // TODO: Get user role from cookies/context
  // For now, hardcoded to 'dosen' to preview ProfileDMA
  // const userRole = Cookies.get('roles') || 'mahasiswa';
  const userRole = 'mahasiswa';

  // Function to render appropriate profile component based on role
  const renderProfileComponent = () => {
    switch (userRole) {
      case 'mahasiswa':
        return <ProfileMahasiswa />;
      
      case 'dosen':
      case 'manager':
      case 'admin':
        return <ProfileDMA />;
      
      default:
        return (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div 
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
              style={{ borderRadius: '16px' }}
            >
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: '#BE0414', fontFamily: 'Urbanist, sans-serif' }}
              >
                Role Tidak Dikenali
              </h2>
              <p 
                style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
              >
                Maaf, role pengguna Anda tidak dikenali. Silakan hubungi administrator.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      {renderProfileComponent()}
    </>
  );
}
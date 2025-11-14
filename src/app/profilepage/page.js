'use client';

import Navbar from '@/components/ui/navigation-menu';
import ProfileMahasiswa from '@/components/ui/profilemahasiswa';
import ProfileDMA from '@/components/ui/profileDMA';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const userRole = Cookies.get('roles');

  // Function to render appropriate profile component based on role
  const renderProfileComponent = () => {
    switch (userRole) {
      case 'mahasiswa':
        return <ProfileMahasiswa />;
      
      case 'dosen':
      case 'manager':
      case 'admin':
        return <ProfileDMA />;
    }
  };

  return (
    <>
      <Navbar />
      {renderProfileComponent()}
    </>
  );
}
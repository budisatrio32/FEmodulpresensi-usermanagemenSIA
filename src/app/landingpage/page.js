// src/app/landingpage/page.jsx
'use client';

import { Container, SectionTitle, Card, CardHeader, CardContent, ScheduleItem, NotificationItem } from '@/components/ui/container-lanpage';
import Navbar from '@/components/ui/navigation-menu';
import Footer from '@/components/ui/footer';
import { useState, useEffect } from 'react';
import { getMyClasses, formatTime, getDayName, formatDate } from '@/lib/scheduleApi';
import { getNotifications, markAsRead } from '@/lib/notificationApi';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { ArrowRight, Bell, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const [classes, setClasses] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState('mahasiswa');
    const [todayDate, setTodayDate] = useState('');
    const [error, setError] = useState(null);

    // Get today's date and user role
    useEffect(() => {
        const today = new Date();
        setTodayDate(formatDate(today));
        
        const role = Cookies.get('roles') || 'mahasiswa';
        setUserRole(role);
        
        fetchData(role);
    }, []);

    const fetchData = async (role) => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch classes and announcements in parallel
            const [classesRes, notificationsRes] = await Promise.all([
                getMyClasses(role),
                getNotifications({ type: 'announcement' })
            ]);

            if (classesRes.status === 'success') {
                setClasses(classesRes.data || []);
            } else {
                throw new Error(classesRes.message || 'Gagal mengambil data kelas');
            }

            if (notificationsRes.status === 'success') {
                setAnnouncements(notificationsRes.data.notifications || []);
            } else {
                throw new Error(notificationsRes.message || 'Gagal mengambil data pengumuman');
            }
        } catch (error) {
            console.error('Error fetching landing page data:', error);
            setError(error.response?.data?.message || error.message || 'Terjadi kesalahan saat memuat data');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter today's schedules from classes
    const getTodaySchedules = () => {
        const today = new Date();
        const todayName = getDayName(today.getDay());
        
        // Since API doesn't return schedules relation, we'll use the class data directly
        // This is a workaround - in production, backend should include schedules relation
        return classes;
    };

return (
<div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E6EEE9' }}>
    {/* Navbar */}
    <Navbar />
    
    {/* Main Content */}
    <main className="flex-1">
    <Container className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
            <div 
                className="mb-6 p-4 rounded-lg border"
                style={{
                    backgroundColor: '#FEE2E2',
                    borderColor: '#EF4444'
                }}
            >
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                    <div className="flex-1">
                        <h3 className="font-semibold mb-1" style={{ color: '#DC2626', fontFamily: 'Urbanist, sans-serif' }}>
                            Terjadi Kesalahan
                        </h3>
                        <p className="text-sm" style={{ color: '#991B1B', fontFamily: 'Urbanist, sans-serif' }}>
                            {error}
                        </p>
                    </div>
                    <button
                        onClick={() => fetchData(userRole)}
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                        style={{
                            backgroundColor: '#DC2626',
                            color: 'white',
                            fontFamily: 'Urbanist, sans-serif'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        )}
        
        {/* Jadwal Section */}
        <section className="mb-12">
        <SectionTitle>Jadwal Harian</SectionTitle>
        
        <Card>
            <CardHeader date={todayDate} />
            <CardContent>
            {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                    Memuat jadwal...
                </div>
            ) : error ? (
                <div className="text-center py-8 text-gray-500">
                    Gagal memuat data jadwal
                </div>
            ) : classes.length > 0 ? (
                classes.map((classItem) => (
                    <ScheduleItem
                        key={classItem.id_class}
                        matakuliah={classItem.name_subject || classItem.subject?.name_subject || '-'}
                        waktu="Lihat jadwal lengkap di halaman kelas"
                        kelas={`Kelas ${classItem.code_class}`}
                        dosen={`Dosen: ${classItem.lecturers?.map(lec => lec.name).join(', ') || '-'}`}
                        ruang="-"
                        sks={`${classItem.sks || classItem.subject?.sks || 0} SKS`}
                        kode={classItem.code_subject || classItem.subject?.code_subject || '-'}
                    />
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada data kelas tersedia
                </div>
            )}
            </CardContent>
        </Card>
        </section>

        {/* Notifikasi Section */}
        <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
            <SectionTitle>Pengumuman</SectionTitle>
            <Link 
                href="/notif" 
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#015023',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Urbanist, sans-serif',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
                Lihat semua pengumuman
                <ArrowRight size={20} />
            </Link>
        </div>
        
        <Card>
            <CardHeader date={todayDate} />
            <CardContent>
            {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                    Memuat pengumuman...
                </div>
            ) : error ? (
                <div className="text-center py-8 text-gray-500">
                    Gagal memuat data pengumuman
                </div>
            ) : announcements.length > 0 ? (
                announcements.slice(0, 3).map((notif) => (
                    <NotificationItem
                        key={notif.id_notification}
                        tag={notif.metadata?.class_code || 'Pengumuman Umum'}
                        title={notif.title || 'Pengumuman'}
                        content={notif.message}
                        date={notif.created_at}
                        pengumum={notif.pengumum || 'System'}
                        metadata={notif.metadata}
                        onClick={async () => {
                            // Mark as read
                            try {
                                await markAsRead(notif.id_notification);
                            } catch (err) {
                                console.error('Error marking as read:', err);
                            }
                            // Redirect to notif page with highlight
                            router.push(`/notif?highlight=${notif.id_notification}`);
                        }}
                    />
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada pengumuman baru
                </div>
            )}
            </CardContent>
        </Card>
        </section>
    </Container>
    </main>
    
    {/* Footer */}
    <Footer />
</div>
);
}
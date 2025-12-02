// src/app/landingpage/page.jsx
'use client';

import { Container, SectionTitle, Card, CardHeader, CardContent, ScheduleItem, NotificationItem } from '@/components/ui/container-lanpage';
import Navbar from '@/components/ui/navigation-menu';
import Footer from '@/components/ui/footer';
import { useState, useEffect } from 'react';
import { getMyClasses, formatTime, getDayName, formatDate } from '@/lib/scheduleApi';
import { getNotifications } from '@/lib/notificationApi';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function LandingPage() {
    const [classes, setClasses] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState('mahasiswa');
    const [todayDate, setTodayDate] = useState('');

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
        try {
            // Fetch classes and announcements in parallel
            const [classesRes, notificationsRes] = await Promise.all([
                getMyClasses(role),
                getNotifications({ type: 'announcement' })
            ]);

            if (classesRes.status === 'success') {
                setClasses(classesRes.data || []);
            }

            if (notificationsRes.status === 'success') {
                setAnnouncements(notificationsRes.data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching landing page data:', error);
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
<div className="min-h-screen flex flex-col bg-gray-50">
    {/* Navbar */}
    <Navbar />
    
    {/* Main Content */}
    <main className="flex-1">
    <Container className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                className="text-m font-semibold hover:underline transition-all"
                style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
            >
                Lihat semua pengumuman
            </Link>
        </div>
        
        <Card>
            <CardHeader date={todayDate} />
            <CardContent>
            {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                    Memuat pengumuman...
                </div>
            ) : announcements.length > 0 ? (
                announcements.slice(0, 5).map((notif) => (
                    <NotificationItem
                        key={notif.id_notification}
                        tag={notif.metadata?.subject_name || notif.metadata?.class_code || 'Pengumuman Umum'}
                        title={notif.title || 'Pengumuman'}
                        content={notif.message.length > 100 ? notif.message.substring(0, 100) + '...' : notif.message}
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
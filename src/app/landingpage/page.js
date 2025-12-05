// src/app/landingpage/page.jsx
'use client';

import { Container, SectionTitle, Card, CardHeader, CardContent, ScheduleItem, NotificationItem } from '@/components/ui/container-lanpage';
import Navbar from '@/components/ui/navigation-menu';
import Footer from '@/components/ui/footer';
import { useState, useEffect } from 'react';
import { getMySchedules, formatTime, getDayName, formatDate } from '@/lib/scheduleApi';
import { getNotifications, markAsRead } from '@/lib/notificationApi';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { ArrowRight, Bell, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ErrorMessageBoxWithButton } from '@/components/ui/message-box';

export default function LandingPage() {
    const router = useRouter();
    const [schedules, setSchedules] = useState([]);
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
            // Fetch schedules and announcements in parallel
            const [schedulesRes, notificationsRes] = await Promise.all([
                getMySchedules(role),
                getNotifications({ type: 'announcement' })
            ]);

            if (schedulesRes.status === 'success') {
                setSchedules(schedulesRes.data || []);
            } else {
                throw new Error(schedulesRes.message || 'Gagal mengambil data jadwal');
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

    // Filter today's schedules
    const getTodaySchedules = () => {
        const today = new Date();
        const todayDateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        // Filter schedules by today's date
        return schedules.filter(classItem => {
            if (!classItem.schedules || classItem.schedules.length === 0) return false;
            return classItem.schedules.some(schedule => schedule.date === todayDateString);
        });
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
            <ErrorMessageBoxWithButton 
                message={error}
                action={() => fetchData(userRole)}
            />
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
            ) : (() => {
                const todaySchedules = getTodaySchedules();
                return todaySchedules.length > 0 ? (
                    todaySchedules.map((classItem) => {
                        // Get today's schedules for this class
                        const today = new Date();
                        const todayDateString = today.toISOString().split('T')[0];
                        const todayClassSchedules = classItem.schedules?.filter(
                            schedule => schedule.date === todayDateString
                        ) || [];
                        
                        return todayClassSchedules.map((schedule, idx) => (
                            <ScheduleItem
                                key={`${classItem.id_class}-${idx}`}
                                matakuliah={classItem.subject?.name_subject || '-'}
                                waktu={classItem.start_time && classItem.end_time 
                                    ? `${formatTime(classItem.start_time)} - ${formatTime(classItem.end_time)}`
                                    : '-'
                                }
                                kelas={`Kelas ${classItem.code_class}`}
                                dosen={`Dosen: ${classItem.dosen || '-'}`}
                                sks={`${classItem.subject.sks || 0} SKS`}
                                kode={classItem.subject.code_subject || '-'}
                                pertemuan={`${schedule.pertemuan || 'Pertemuan Ke-'}`}
                            />
                        ));
                    })
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Tidak ada jadwal hari ini
                    </div>
                );
            })()}
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
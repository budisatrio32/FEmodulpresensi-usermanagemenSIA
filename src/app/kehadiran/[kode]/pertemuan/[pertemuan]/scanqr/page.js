'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import DataTable from '@/components/ui/table';
import { ArrowLeft, QrCode, CheckCircle, Clock, Users } from 'lucide-react';
import { PrimaryButton, OutlineButton } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import LoadingEffect from '@/components/ui/loading-effect';
import { AlertConfirmationDialog, AlertSuccessDialog, AlertErrorDialog } from '@/components/ui/alert-dialog';
import { openQRSession, getPresencesBySchedule, closeAttendanceSession, getClassDetail } from '@/lib/attendanceApi';

export default function ScanQRPage({ params }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { kode, pertemuan } = React.use(params);

    // Get params from previous page
    const id_schedule = searchParams.get('id_schedule') || '';
    const id_class = searchParams.get('id_class') || '';
    const nama = searchParams.get('nama') || '';
    const kelas = searchParams.get('kelas') || '';
    const tanggal = searchParams.get('tanggal') || '';

    // States
    const [qrCode, setQrCode] = useState('');
    const [scannedStudents, setScannedStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [echo, setEcho] = useState(null);

    // Alert states
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);

    // Initialize QR session and WebSocket
    useEffect(() => {
        if (!id_schedule) {
            setAlertMessage('ID Schedule tidak ditemukan!');
            setShowErrorDialog(true);
            return;
        }

        initializeQRSession();

        return () => {
            // Cleanup WebSocket on unmount
            const cleanup = async () => {
                if (echo) {
                    echo.leave(`attendance.${id_schedule}`);
                    const { disconnectEcho } = await import('@/lib/echo');
                    disconnectEcho();
                }
            };
            cleanup();
        };
    }, [id_schedule]);

    // Monitor QR code changes
    useEffect(() => {
        if (qrCode) {
            console.log('[QR State] QR Code updated to:', qrCode);
        }
    }, [qrCode]);

    const initializeQRSession = async () => {
        try {
            setLoading(true);

            console.log('Initializing QR session with:', { id_schedule, id_class });

            // Validate params
            if (!id_schedule || !id_class) {
                throw new Error('ID Schedule atau ID Class tidak ditemukan!');
            }

            // 1. Fetch class detail to get total students
            console.log('Fetching class detail...');
            const classDetailResponse = await getClassDetail(id_class);
            console.log('Class detail response:', classDetailResponse);

            if (classDetailResponse.status === 'success') {
                setAllStudents(classDetailResponse.data.students || []);
            }

            // 2. Open QR session FIRST
            console.log('[QR Init] Opening QR session with id_schedule:', id_schedule);
            const openResponse = await openQRSession(id_schedule);
            console.log('[QR Init] Open QR response:', openResponse);
            console.log('[QR Init] Response status:', openResponse?.status);
            console.log('[QR Init] Response data:', openResponse?.data);

            if (openResponse && openResponse.status === 'success' && openResponse.data) {
                console.log('[QR Init] Setting initial QR Key:', openResponse.data.key);
                setQrCode(openResponse.data.key);
            } else if (openResponse && openResponse.status === 'failed' && openResponse.data) {
                // Session sudah aktif, gunakan key yang ada
                console.log('[QR Init] Session already active, using existing key:', openResponse.data.key);
                setQrCode(openResponse.data.key);
            } else {
                throw new Error(openResponse?.message || 'Gagal membuka sesi QR - No data received');
            }

            // 3. Setup WebSocket connection (wait for it to complete)
            await setupWebSocket();

            // 4. Fetch existing presences (after QR session opened)
            await fetchPresences();

        } catch (error) {
            console.error('Error initializing QR session:', error);
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Gagal membuka sesi QR. Pastikan backend Laravel sudah berjalan di port 8000.';

            setAlertMessage(errorMessage);
            setShowErrorDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const setupWebSocket = async () => {
        try {
            console.log('[WebSocket] Setting up WebSocket for schedule:', id_schedule);

            // Dynamically import Echo only on client-side
            const { getEcho, disconnectEcho: disconnect } = await import('@/lib/echo');

            const echoInstance = getEcho();
            console.log('[WebSocket] Echo instance created:', echoInstance);

            setEcho(echoInstance);

            const channelName = `attendance.${id_schedule}`;
            console.log('[WebSocket] Subscribing to channel:', channelName);

            const channel = echoInstance.channel(channelName);

            console.log('[WebSocket] Channel object:', channel);

            // Debug: Log connection state
            if (echoInstance.connector && echoInstance.connector.pusher) {
                const pusher = echoInstance.connector.pusher;
                console.log('[WebSocket] Pusher state:', pusher.connection.state);

                pusher.connection.bind('connected', () => {
                    console.log('[WebSocket] ✅ Pusher connected!');
                });

                pusher.connection.bind('error', (err) => {
                    console.error('[WebSocket] ❌ Pusher connection error:', err);
                });
            }

            // Listen for QR rotation
            channel.listen('.qr.rotated', (data) => {
                console.log('========================================');
                console.log('[WebSocket] QR Code rotated event received!');
                console.log('[WebSocket] Event name: qr.rotated');
                console.log('[WebSocket] New key:', data.new_key);
                console.log('[WebSocket] Session ID:', data.session_id);
                console.log('[WebSocket] Schedule ID:', data.schedule_id);
                console.log('[WebSocket] Time start:', data.time_start);
                console.log('[WebSocket] Full data:', JSON.stringify(data, null, 2));
                console.log('[WebSocket] Current QR code:', qrCode);
                console.log('[WebSocket] Calling setQrCode with:', data.new_key);
                console.log('========================================');

                setQrCode(data.new_key);

                console.log('[WebSocket] setQrCode called successfully');
            });

            // Listen for new attendance scans
            channel.listen('.attendance.scanned', (data) => {
                console.log('[WebSocket] New attendance scanned event received!');
                console.log('[WebSocket] Student:', data.student_name);
                console.log('[WebSocket] Full data:', data);

                setScannedStudents(prev => {
                    // Check if student already exists
                    const exists = prev.some(s => s.id === data.student_id);
                    if (exists) return prev;

                    // Add new student to the list with proper numbering
                    const newStudent = {
                        no: prev.length + 1,
                        id: data.student_id,
                        nim: data.student_nim,
                        nama: data.student_name,
                        waktuScan: formatWaktuScan(data.scan_time),
                    };

                    return [newStudent, ...prev];
                });
            });

            // Debug: Check if subscription succeeded
            channel.subscription.bind('pusher:subscription_succeeded', () => {
                console.log('[WebSocket] ✅ Subscription to', channelName, 'SUCCEEDED!');
            });

            channel.subscription.bind('pusher:subscription_error', (error) => {
                console.error('[WebSocket] ❌ Subscription to', channelName, 'FAILED!', error);
            });

            console.log('[WebSocket] WebSocket setup completed successfully');
        } catch (error) {
            console.error('[WebSocket] Error setting up WebSocket:', error);
        }
    };

    const fetchPresences = async () => {
        try {
            const response = await getPresencesBySchedule(id_schedule);
            console.log('Fetch presences response:', response);

            if (response.status === 'success' && response.data) {
                // Check if data is array or if it's nested in response.data.students
                const presenceList = Array.isArray(response.data)
                    ? response.data
                    : response.data.students || [];

                console.log('Presence list:', presenceList);

                const students = presenceList.map((p, index) => ({
                    no: index + 1,
                    id: p.id_student || p.id_user_si,
                    nim: p.nim || p.username,
                    nama: p.name || 'Unknown',
                    waktuScan: p.time ? formatWaktuScan(p.time) : '-',
                }));

                setScannedStudents(students);
            }
        } catch (error) {
            console.error('Error fetching presences:', error);
            // Don't fail initialization if presences fetch fails
        }
    };

    const formatWaktuScan = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Format tanggal
    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayName}, ${day} ${month} ${year}`;
    };

    const handleSelesai = () => {
        setAlertMessage('Apakah Anda yakin ingin menutup sesi presensi QR ini?');
        setConfirmAction(() => closeSession);
        setShowConfirmDialog(true);
    };

    const closeSession = async () => {
        try {
            setShowConfirmDialog(false);
            setLoading(true);

            const response = await closeAttendanceSession(id_schedule);

            if (response.status === 'success') {
                // Disconnect WebSocket
                if (echo) {
                    echo.leave(`attendance.${id_schedule}`);
                    const { disconnectEcho } = await import('@/lib/echo');
                    disconnectEcho();
                }

                setAlertMessage('Sesi presensi berhasil ditutup!');
                setShowSuccessDialog(true);

                setTimeout(() => {
                    router.back();
                }, 1500);
            }
        } catch (error) {
            console.error('Error closing session:', error);
            setAlertMessage(error.response?.data?.message || 'Gagal menutup sesi presensi');
            setShowErrorDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'nim', label: 'NIM', width: '150px', cellClassName: 'font-medium' },
        { key: 'nama', label: 'Nama Mahasiswa', className: 'text-left', cellClassName: 'text-left font-medium' },
        { key: 'waktuScan', label: 'Waktu Scan', width: '150px', cellClassName: 'text-center' },
        { key: 'status', label: 'Status', width: '120px' },
    ];

    const customRender = {
        waktuScan: (value) => (
            <span className="font-semibold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {value}
            </span>
        ),
        status: () => (
            <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg font-medium"
                    style={{ backgroundColor: '#dcfce7', color: '#16874B', fontFamily: 'Urbanist, sans-serif' }}>
                    <CheckCircle className="w-4 h-4" />
                    Hadir
                </span>
            </div>
        ),
    };

    if (loading) {
        return <LoadingEffect />;
    }

    return (
        <div className="min-h-screen bg-brand-light-sage">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
                    style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali ke Input Presensi
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* QR Code Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl" style={{ backgroundColor: '#015023' }}>
                                <QrCode className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                                    QR Code Presensi
                                </h2>
                                <p className="text-sm" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                                    Scan untuk absen otomatis
                                </p>
                            </div>
                        </div>

                        {/* QR Code Display */}
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border-4" style={{ borderColor: '#015023' }}>
                                {qrCode ? (
                                    <QRCodeCanvas
                                        value={qrCode}
                                        size={256}
                                        level="H"
                                        includeMargin={true}
                                    />
                                ) : (
                                    <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <span className="text-gray-400">Loading QR...</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-xs" style={{ color: '#999', fontFamily: 'Urbanist, sans-serif' }}>
                                    QR akan berganti otomatis setiap 30 detik
                                </p>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-brand-light-sage rounded-xl p-4">
                            <p className="text-sm font-medium mb-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                                Informasi Pertemuan:
                            </p>
                            <div className="space-y-2 text-sm" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                                <p><span className="font-semibold">Mata Kuliah:</span> {kode} - {nama}</p>
                                <p><span className="font-semibold">Kelas:</span> {kelas}</p>
                                <p><span className="font-semibold">Pertemuan:</span> {pertemuan}</p>
                                <p><span className="font-semibold">Tanggal:</span> {formatTanggal(tanggal)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl" style={{ backgroundColor: '#16874B' }}>
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                                    Statistik Presensi
                                </h2>
                                <p className="text-sm" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                                    Update real-time
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-brand-light-sage rounded-xl p-4">
                                <p className="text-sm font-medium mb-1" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                                    Total Mahasiswa
                                </p>
                                <p className="text-3xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                                    {allStudents.length}
                                </p>
                            </div>

                            <div className="rounded-xl p-4" style={{ backgroundColor: '#dcfce7' }}>
                                <p className="text-sm font-medium mb-1" style={{ color: '#16874B', opacity: 0.8, fontFamily: 'Urbanist, sans-serif' }}>
                                    Sudah Scan
                                </p>
                                <p className="text-3xl font-bold" style={{ color: '#16874B', fontFamily: 'Urbanist, sans-serif' }}>
                                    {scannedStudents.length}
                                </p>
                            </div>
                        </div>

                        {/* Live Indicator */}
                        <div className="mb-6 flex items-center justify-center gap-2 text-sm" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                            <div className="relative">
                                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#16874B' }}></div>
                                <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#16874B', opacity: 0.5 }}></div>
                            </div>
                            <span className="font-semibold" style={{ color: '#16874B' }}>
                                Sesi scan QR aktif
                            </span>
                        </div>

                        {/* Daftar Mahasiswa yang Sudah Scan */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                                        Daftar Mahasiswa yang Sudah Presensi
                                    </h3>
                                    <p className="text-sm mt-1" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                                        {scannedStudents.length > 0
                                            ? `${scannedStudents.length} mahasiswa telah melakukan presensi`
                                            : 'Belum ada mahasiswa yang melakukan presensi'
                                        }
                                    </p>
                                </div>

                                {scannedStudents.length < allStudents.length && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
                                        <Clock className="w-4 h-4" style={{ color: '#92400e' }} />
                                        <span className="text-sm font-medium" style={{ color: '#92400e', fontFamily: 'Urbanist, sans-serif' }}>
                                            Sesi Aktif
                                        </span>
                                    </div>
                                )}
                            </div>

                            {scannedStudents.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={scannedStudents}
                                    actions={[]}
                                    pagination={false}
                                    customRender={customRender}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <QrCode className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                                    <p className="text-lg font-medium" style={{ color: '#6b7280', fontFamily: 'Urbanist, sans-serif' }}>
                                        Menunggu mahasiswa untuk scan QR Code...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: '16px' }}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                            <p className="font-medium">Keterangan:</p>
                            <p className="text-gray-600 mt-1">
                                • QR Code akan aktif selama sesi presensi dibuka<br />
                                • Mahasiswa scan QR menggunakan aplikasi mobile<br />
                                • Data akan <span className="font-semibold text-green-600">tersimpan otomatis</span> ke database saat scan<br />
                                • Klik "Akhiri Presensi" untuk menutup sesi scan QR
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <OutlineButton onClick={() => router.back()}>
                                Kembali
                            </OutlineButton>

                            <PrimaryButton
                                onClick={handleSelesai}
                                className="gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Akhiri Presensi
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert Dialogs */}
            <AlertConfirmationDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={confirmAction}
                title="Konfirmasi"
                description={alertMessage}
                confirmText="Ya, Tutup"
                cancelText="Batal"
            />

            <AlertSuccessDialog
                open={showSuccessDialog}
                onOpenChange={setShowSuccessDialog}
                title="Berhasil"
                description={alertMessage}
                closeText="OK"
            />

            <AlertErrorDialog
                open={showErrorDialog}
                onOpenChange={setShowErrorDialog}
                title="Error"
                description={alertMessage}
                closeText="Tutup"
            />
        </div>
    );
}

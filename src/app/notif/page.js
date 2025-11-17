'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/navigation-menu'
import Footer from '@/components/ui/footer'
import { ArrowLeft, Bell, MessageCircle } from 'lucide-react'

export default function NotifikasiPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all') // all, announcement, chat

  // Dummy notification data - replace with API call
  const allNotifications = [
    {
      id: 1,
      type: 'announcement',
      judul: 'Ujian Tengah Semester',
      isi: 'Ujian Tengah Semester akan dilaksanakan minggu depan. Harap mempersiapkan diri dengan baik.',
      tanggal: '2025-11-15',
      kelas: 'Pemrograman Web',
      pengumum: 'Dr. Ahmad Budiman',
      isRead: false
    },
    {
      id: 2,
      type: 'chat',
      judul: 'Pesan dari Dr. Ahmad Budiman',
      isi: 'Tugas yang dikumpulkan sudah saya terima, terima kasih. Silakan cek nilai di portal.',
      tanggal: '2025-11-15',
      pengumum: 'Dr. Ahmad Budiman',
      isRead: false
    },
    {
      id: 3,
      type: 'announcement',
      judul: 'Pengumpulan Tugas Akhir',
      isi: 'Batas pengumpulan tugas akhir adalah hari Jumat, 20 November 2025 pukul 23:59.',
      tanggal: '2025-11-14',
      kelas: 'Basis Data',
      pengumum: 'Prof. Siti Rahayu',
      isRead: false
    },
    {
      id: 4,
      type: 'chat',
      judul: 'Pesan dari Budi Santoso',
      isi: 'Halo, apakah sudah selesai mengerjakan tugas kelompok? Kalau sudah bisa kita kumpulkan hari ini.',
      tanggal: '2025-11-14',
      pengumum: 'Budi Santoso',
      isRead: true
    },
    {
      id: 5,
      type: 'announcement',
      judul: 'Perubahan Jadwal Kuliah',
      isi: 'Kuliah hari Kamis dipindahkan ke hari Jumat pada minggu ini.',
      tanggal: '2025-11-13',
      kelas: 'Algoritma & Struktur Data',
      pengumum: 'Dr. Budi Santoso',
      isRead: true
    },
    {
      id: 6,
      type: 'chat',
      judul: 'Pesan dari Siti Rahma',
      isi: 'Terima kasih atas bantuan nya dalam tugas kelompok kemarin!',
      tanggal: '2025-11-12',
      pengumum: 'Siti Rahma',
      isRead: true
    },
    {
      id: 7,
      type: 'announcement',
      judul: 'Seminar Teknologi Terkini',
      isi: 'Akan diadakan seminar dengan tema "AI dan Machine Learning" pada tanggal 25 November 2025.',
      tanggal: '2025-11-12',
      kelas: 'Umum',
      pengumum: 'Himpunan Mahasiswa',
      isRead: true
    }
  ]

  const filteredNotifications = filter === 'all' 
    ? allNotifications 
    : allNotifications.filter(notif => notif.type === filter)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
  }

  const unreadCount = allNotifications.filter(n => !n.isRead).length

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Urbanist, sans-serif' }}>
      <Navbar />
      
      <main style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '32px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={() => router.back()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#015023',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '16px',
                fontFamily: 'Urbanist, sans-serif'
              }}
            >
              <ArrowLeft size={20} />
              Kembali
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#015023', margin: 0 }}>
                  Notifikasi & Pengumuman
                </h1>
                <p style={{ fontSize: '16px', color: '#015023', opacity: 0.7, marginTop: '8px' }}>
                  {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '24px',
            borderBottom: '2px solid rgba(1, 80, 35, 0.1)',
            paddingBottom: '0'
          }}>
            {[
              { value: 'all', label: 'Semua', icon: Bell },
              { value: 'announcement', label: 'Pengumuman', icon: Bell },
              { value: 'chat', label: 'Chat', icon: MessageCircle }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  style={{
                    padding: '12px 24px',
                    background: 'none',
                    border: 'none',
                    borderBottom: filter === tab.value ? '3px solid #015023' : '3px solid transparent',
                    color: filter === tab.value ? '#015023' : 'rgba(1, 80, 35, 0.5)',
                    fontSize: '16px',
                    fontWeight: filter === tab.value ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Urbanist, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                  {tab.value === 'all' && allNotifications.length > 0 && (
                    <span style={{ 
                      marginLeft: '4px', 
                      fontSize: '14px',
                      opacity: 0.7
                    }}>
                      ({allNotifications.length})
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Notifications List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredNotifications.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center',
                border: '1px solid rgba(1, 80, 35, 0.1)'
              }}>
                <Bell size={48} style={{ color: '#015023', opacity: 0.3, margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', color: '#015023', opacity: 0.7 }}>
                  Tidak ada notifikasi
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const Icon = notif.type === 'chat' ? MessageCircle : Bell
                return (
                  <div
                    key={notif.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      border: notif.isRead ? '1px solid rgba(1, 80, 35, 0.1)' : '2px solid #015023',
                      boxShadow: notif.isRead ? 'none' : '0 2px 8px rgba(1, 80, 35, 0.1)',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Type Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '24px',
                      right: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {!notif.isRead && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#015023'
                        }} />
                      )}
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: notif.type === 'chat' ? '#DABC4E' : '#015023',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Icon size={14} />
                        {notif.type === 'chat' ? 'Chat' : 'Pengumuman'}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ paddingRight: '140px' }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#015023',
                        marginBottom: '8px'
                      }}>
                        {notif.judul}
                      </h3>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: '#015023',
                        opacity: 0.7
                      }}>
                        {notif.kelas && (
                          <>
                            <span>{notif.kelas}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{notif.pengumum}</span>
                        <span>•</span>
                        <span>{formatDate(notif.tanggal)}</span>
                      </div>

                      <p style={{
                        fontSize: '16px',
                        color: '#015023',
                        opacity: 0.8,
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        {notif.isi}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

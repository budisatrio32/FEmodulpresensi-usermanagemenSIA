'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/navigation-menu'
import Footer from '@/components/ui/footer'
import LoadingEffect from '@/components/ui/loading-effect'
import { ArrowLeft, Bell, MessageCircle, Check, X } from 'lucide-react'
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/lib/notificationApi'
import { AlertConfirmationDialog } from '@/components/ui/alert-dialog'

export default function NotifikasiPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all') // all, announcement, chat
  const [allNotifications, setAllNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [highlightId, setHighlightId] = useState(null)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
    
    // Check for highlight parameter in URL
    const params = new URLSearchParams(window.location.search)
    const highlight = params.get('highlight')
    if (highlight) {
      setHighlightId(parseInt(highlight))
      
      // Auto-scroll to highlighted notification with retry logic
      const scrollToNotification = () => {
        const element = document.getElementById(`notif-${highlight}`)
        if (element) {
          // Scroll with offset for better visibility
          const yOffset = -100 // Offset dari top (untuk spacing)
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightId(null)
            // Clean URL without reload
            window.history.replaceState({}, '', '/notif')
          }, 3000)
        } else {
          // Retry if element not found (data might still be loading)
          setTimeout(scrollToNotification, 100)
        }
      }
      
      // Wait for data to load and DOM to render
      setTimeout(scrollToNotification, 300)
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getNotifications()

      if (response.status === 'success') {
        const transformedNotifications = response.data.notifications.map(notif => ({
          id: notif.id_notification,
          type: notif.type,
          judul: notif.title,
          isi: notif.message,
          tanggal: notif.send_at,
          kelas: notif.metadata?.class_code || null,
          pengumum: notif.sender || 'System',
          isRead: notif.is_read,
          metadata: notif.metadata
        }))

        setAllNotifications(transformedNotifications)
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err.message || 'Gagal mengambil notifikasi')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId)

      setAllNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      )
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()

      setAllNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      )
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId)

      setAllNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      )
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const handleDeleteAll = () => {
    // Show confirmation dialog
    setShowDeleteAllDialog(true)
  }

  const confirmDeleteAll = async () => {
    try {
      setShowDeleteAllDialog(false)
      setLoading(true) // Set loading agar user tidak klik tombol berkali-kali
      
      // Delete all notifications one by one
      const deletePromises = allNotifications.map(notif => 
        deleteNotification(notif.id)
      )
      
      await Promise.all(deletePromises)

      // Clear local state
      setAllNotifications([])
    } catch (err) {
      console.error('Error deleting all notifications:', err)
      // Jika error, refresh data agar sinkron dengan server
      fetchNotifications() 
    } finally {
      setLoading(false)
    }
  }

  const filteredNotifications = filter === 'all'
    ? allNotifications
    : allNotifications.filter(notif => notif.type === filter)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
  }

  const unreadCount = allNotifications.filter(n => !n.isRead).length

  if (loading) {
    return <LoadingEffect message="Memuat notifikasi..." />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Urbanist, sans-serif' }}>
      <Navbar />

      <main style={{ flex: 1, backgroundColor: '#E6EEE9', padding: '32px 0' }}>
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

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Mark All as Read Button */}
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#015023',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'Urbanist, sans-serif',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    Tandai Semua Dibaca
                  </button>
                )}

                {/* Delete All Button */}
                {allNotifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#BE0414', // Warna merah untuk aksi destruktif
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'Urbanist, sans-serif',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    Hapus Semua
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '2px solid rgba(1, 80, 35, 0.1)',
            paddingBottom: '0',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
            className="hide-scrollbar"
          >
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
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: filter === tab.value ? '3px solid #015023' : '3px solid transparent',
                    color: filter === tab.value ? '#015023' : 'rgba(1, 80, 35, 0.5)',
                    fontSize: '14px',
                    fontWeight: filter === tab.value ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Urbanist, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <Icon size={16} />
                  <span style={{ fontSize: '14px' }}>{tab.label}</span>
                  {tab.value === 'all' && allNotifications.length > 0 && (
                    <span style={{
                      marginLeft: '2px',
                      fontSize: '12px',
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
                border: '2px solid rgba(1, 80, 35, 0.2)'
              }}>
                <Bell size={48} style={{ color: '#015023', opacity: 0.3, margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', color: '#015023', opacity: 0.7 }}>
                  Tidak ada notifikasi
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const Icon = notif.type === 'chat' ? MessageCircle : Bell;
                
                const isHighlighted = highlightId === notif.id;
                
                return (
                  <div 
                    key={notif.id}
                    id={`notif-${notif.id}`}
                    style={{
                      backgroundColor: isHighlighted ? '#FEF3C7' : (notif.isRead ? 'white' : '#F0FDF4'),
                      borderRadius: '16px',
                      padding: '24px',
                      border: isHighlighted ? '2px solid #DABC4E' : '1px solid rgba(1, 80, 35, 0.1)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      transition: 'all 0.3s ease',
                      boxShadow: isHighlighted ? '0 4px 12px rgba(218, 188, 78, 0.3)' : 'none'
                    }}
                  >
                    {/* Header Badge & Unread Dot */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    </div>

                    {/* Content */}
                    <div>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#015023',
                        marginBottom: '8px',
                        marginTop: 0
                      }}>
                        {notif.judul}
                      </h3>

                      {/* Date and sender info */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: '#015023',
                        opacity: 0.7
                      }}>
                        <span>{notif.pengumum}</span>
                        <span>•</span>
                        <span>{formatDate(notif.tanggal)}</span>
                      </div>

                      {/* Rich template untuk class announcement */}
                      {notif.type === 'announcement' && notif.metadata?.subject_name && (
                        <div style={{
                          marginBottom: '12px',
                          padding: '12px',
                          backgroundColor: '#F0FDF4',
                          borderRadius: '8px',
                          borderLeft: '4px solid #015023'
                        }}>
                          <p style={{
                            fontSize: '14px',
                            color: '#015023',
                            margin: 0,
                            marginBottom: '4px'
                          }}>
                            <strong>Yth.</strong> {notif.metadata.student_name || 'Mahasiswa'} ({notif.metadata.student_nim || 'NIM'})
                          </p>
                          <p style={{
                            fontSize: '14px',
                            color: '#015023',
                            margin: 0,
                            marginBottom: '4px'
                          }}>
                            <strong>Matakuliah:</strong> {notif.metadata.subject_code} - {notif.metadata.subject_name}
                          </p>
                          <p style={{
                            fontSize: '14px',
                            color: '#015023',
                            margin: 0,
                            marginBottom: '4px'
                          }}>
                            <strong>Kelas:</strong> {notif.metadata.class_code}
                          </p>
                          {notif.metadata.lecturer_name && (
                            <p style={{
                              fontSize: '14px',
                              color: '#015023',
                              margin: 0
                            }}>
                              <strong>Dosen:</strong> {notif.metadata.lecturer_name}
                            </p>
                          )}
                        </div>
                      )}

                      <p style={{
                        fontSize: '16px',
                        color: '#015023',
                        opacity: 0.8,
                        lineHeight: '1.6',
                        margin: 0,
                        marginBottom: '16px'
                      }}>
                        {notif.isi}
                      </p>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-end'
                      }}>
                        {/* Mark as Read Button - Only show if unread */}
                        {!notif.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notif.id)
                            }}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor: '#015023',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'opacity 0.2s',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                            title="Tandai sudah dibaca"
                          >
                            <Check size={20} strokeWidth={3} />
                          </button>
                        )}

                        {/* Dismiss Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNotification(notif.id)
                          }}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#BE0414',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'opacity 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}
                          title="Hapus notifikasi"
                        >
                          <X size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete All Confirmation Dialog */}
      <AlertConfirmationDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
        onConfirm={confirmDeleteAll}
        title="Hapus Semua Notifikasi"
        description="Apakah Anda yakin ingin menghapus SEMUA notifikasi? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
      />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/navigation-menu'
import Footer from '@/components/ui/footer'
import LoadingEffect from '@/components/ui/loading-effect'
import { ArrowLeft, Bell, MessageCircle, Check, X } from 'lucide-react'
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/lib/notificationApi'

export default function NotifikasiPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all') // all, announcement, chat
  const [allNotifications, setAllNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getNotifications()

      if (response.status === 'success') {
        // Transform API data to match component format
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

      // Update local state
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

      // Update local state
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

      // Remove from local state
      setAllNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      )
    } catch (err) {
      console.error('Error deleting notification:', err)
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
                {/* FIX: Removed extra ' in opacity */}
                <p style={{ fontSize: '18px', color: '#015023', opacity: 0.7 }}>
                  Tidak ada notifikasi
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const Icon = notif.type === 'chat' ? MessageCircle : Bell;
                
                return (
                  <div 
                    key={notif.id}
                    style={{
                      backgroundColor: notif.isRead ? 'white' : '#F0FDF4',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(1, 80, 35, 0.1)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      transition: 'background-color 0.2s'
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

                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: '#015023',
                        opacity: 0.7,
                        flexWrap: 'wrap'
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
    </div>
  )
}
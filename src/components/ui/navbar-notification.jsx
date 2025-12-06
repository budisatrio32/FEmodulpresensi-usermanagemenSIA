'use client';

import { useState, useEffect, useRef, useCallback, Fragment, forwardRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import Cookies from 'js-cookie';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChatContext } from '@/lib/chat-context';
import { getEcho } from '@/lib/echo';
import { getNotifications, markAsRead } from '@/lib/notificationApi';
import { getConversationDetail } from '@/lib/chatApi';

const NavbarNotification = forwardRef(({ className, isChatOpen, chatUser, setChatUser, setIsChatOpen }, ref) => {
  const router = useRouter();
  
  const { activeChatConversation, isChatOpen: isAnyChatOpenContext } = useChatContext();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Expose fetchNotifications untuk bisa dipanggil dari luar
  const fetchNotificationsRef = useRef(null);
  
  // Use refs to access latest chat state without re-subscribing
  const isChatOpenRef = useRef(isChatOpen);
  const chatUserRef = useRef(chatUser);
  const activeChatConversationRef = useRef(activeChatConversation);
  
  // Update refs when props or context change
  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
    chatUserRef.current = chatUser;
    activeChatConversationRef.current = activeChatConversation;
    
    console.log('[NavbarNotification] 🔄 State updated - isChatOpen:', isChatOpen, 'activeChatConv:', activeChatConversation);
  }, [isChatOpen, chatUser, activeChatConversation]);
  
  // Listen to chat notifications dismissed event
  useEffect(() => {
    const handleNotificationsDismissed = (e) => {
      const { notificationIds, conversationId } = e.detail || {};
      
      if (notificationIds && notificationIds.length > 0) {
        console.log('[NavbarNotification] 🗑️ Removing dismissed notifications:', notificationIds);
        
        // Optimistic UI update: Remove notifications from list
        setNotifications(prev => {
          const filtered = prev.filter(n => !notificationIds.includes(n.id));
          return filtered;
        });
        
        // Decrement unread count
        setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
        
        console.log('[NavbarNotification] ✅ UI updated optimistically');
        
        // ❌ DON'T fetch immediately - trust optimistic update!
        // Will fetch when chat closes or user manually refreshes
      } else {
        // Fallback: Just refresh if no IDs provided
        console.log('[NavbarNotification] 🔄 Refreshing notifications (no IDs provided)');
        if (fetchNotificationsRef.current) {
          fetchNotificationsRef.current();
        }
      }
    };
    
    // Listen to chat closed event - NOW fetch fresh data
    const handleChatClosed = () => {
      console.log('[NavbarNotification] 🔄 Chat closed, fetching fresh data');
      setTimeout(() => {
        if (fetchNotificationsRef.current) {
          fetchNotificationsRef.current();
        }
      }, 2000); // Small delay to ensure backend processed
    };
    
    window.addEventListener('chatNotificationsDismissed', handleNotificationsDismissed);
    window.addEventListener('chatModalClosed', handleChatClosed);
    
    return () => {
      window.removeEventListener('chatNotificationsDismissed', handleNotificationsDismissed);
      window.removeEventListener('chatModalClosed', handleChatClosed);
    };
  }, []);

  // Fetch notifications initial
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotifications();

      if (response.status === 'success') {
        // Set unread count dari backend
        setUnreadCount(response.data.unread_count || 0);
        
        // Limit notifikasi ke 10 items
        const transformed = response.data.notifications.slice(0, 10).map(notif => ({
          id: notif.id_notification,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          date: notif.sent_at,
          isRead: notif.is_read,
          metadata: notif.metadata
        }));
        setNotifications(transformed);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Store ref untuk bisa dipanggil dari custom event
  useEffect(() => {
    fetchNotificationsRef.current = fetchNotifications;
  }, [fetchNotifications]);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // WebSocket Real-time Notification Listener
  useEffect(() => {
    const echo = getEcho();
    if (!echo) {
      console.warn('[NavbarNotification] Echo not initialized');
      return;
    }

    // Get user ID - PRIORITY: Cookies, FALLBACK: localStorage
    let userId = null;
    
    // Try cookies first (recommended)
    const userIdFromCookie = Cookies.get('user_id');
    if (userIdFromCookie) {
      userId = userIdFromCookie;
      console.log('[NavbarNotification] User ID from cookies:', userId);
    } else {
      // Fallback to localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id_user_si;
          console.log('[NavbarNotification] User ID from localStorage (fallback):', userId);
        } catch (err) {
          console.error('[NavbarNotification] Failed to parse user data:', err);
        }
      }
    }

    if (!userId) {
      console.warn('[NavbarNotification] No user ID found in cookies or localStorage');
      return;
    }

    console.log('[NavbarNotification] Setting up subscription for user:', userId);

    let channel = null;
    let isSubscribed = false;

    // Wait for connection to be established
    const setupSubscription = () => {
      const pusher = echo.connector?.pusher;
      if (!pusher) {
        console.error('[NavbarNotification] Pusher instance not found');
        return;
      }

      const state = pusher.connection.state;
      console.log('[NavbarNotification] Current connection state:', state);

      if (state === 'connected') {
        subscribeToChannel();
      } else {
        console.log('[NavbarNotification] Waiting for connection...');
        pusher.connection.bind('connected', subscribeToChannel);
      }
    };

    const subscribeToChannel = () => {
      if (isSubscribed) {
        console.log('[NavbarNotification] Already subscribed, skipping');
        return;
      }

      console.log('[NavbarNotification] Subscribing to private channel: user.' + userId);
      
      try {
        channel = echo.private(`user.${userId}`);
        isSubscribed = true;

        channel
          .listen('.NewNotification', (event) => {
            console.log('[NavbarNotification] ✅ New notification received:', event);
            
            // Jangan tampilkan notifikasi chat jika modal terbuka untuk conversation yang sama
            const notifType = event.notification?.type || event.type;
            const notifMetadata = event.notification?.metadata || event.metadata;
            
            console.log('[NavbarNotification] 🔍 Debug - Type:', notifType, 'Metadata:', notifMetadata);
            
            // Use context ref to get latest active conversation
            const activeConvId = activeChatConversationRef.current;
            
            console.log('[NavbarNotification] 🔍 Active conversation from context:', activeConvId);
            
            if (notifType === 'chat' && activeConvId && notifMetadata?.id_conversation) {
              if (String(notifMetadata.id_conversation) === String(activeConvId)) {
                  
                console.log('Sedang chatting, notifikasi disembunyikan dari UI');

                // Kita harus lapor ke Backend bahwa notifikasi ini sudah "auto-read"
                // karena user sedang melihat layarnya.
                const notifId = event.notification?.id_notification || event.id_notification;
                
                if (notifId) {
                    // Panggil API markAsRead secara background (tanpa await biar ga blocking)
                    markAsRead(notifId).catch(err => console.error('Gagal auto-read:', err));
                }

                return; // Stop, jangan lanjut update state unreadCount
              }
            }
            
            setNotifications(prev => {
              // Generate id yg unik dengan Math.random() biar Key ngga tabrakan
              // Backend ngirim id_notification: null, jadi butuh tempID yang bagus dan kuat
              const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const rawNotifId = event.notification?.id_notification;
              // Convert ke string untuk konsistensi
              const notifId = rawNotifId ? String(rawNotifId) : tempId;
              
              // Cek duplikat berdasarkan ID (jika ada) atau title+message+type dalam 5 detik terakhir
              const isDuplicate = prev.some(n => {
                // Convert n.id juga ke string untuk comparison
                const nId = String(n.id);
                // Jika ada ID yang sama dan bukan temp ID, pasti duplikat
                if (nId === notifId && !notifId.startsWith('temp-')) {
                  console.log('[NavbarNotification] ⚠️ Duplicate by ID:', notifId);
                  return true;
                }
                // Cek duplikat konten (title + message + type) dalam 5 detik terakhir
                const isSameContent = n.type === event.notification.type &&
                                     n.title === event.notification.title && 
                                     n.message === event.notification.message;
                const timeDiff = Date.now() - new Date(n.date).getTime();
                const isRecent = timeDiff < 5000; // 5 seconds
                
                if (isSameContent && isRecent) {
                  console.log('[NavbarNotification] ⚠️ Duplicate by content (age:', timeDiff, 'ms)');
                  return true;
                }
                
                return false;
              });

              if (isDuplicate) {
                console.log('[NavbarNotification] ⚠️ Duplicate notification ignored:', event.notification.title);
                return prev;
              }

              const newNotif = {
                id: notifId,
                type: event.notification.type,
                title: event.notification.title,
                message: event.notification.message,
                date: event.notification.sentAt,
                isRead: event.notification.isRead,
                metadata: event.notification.metadata
              };
              
              console.log('[NavbarNotification] Adding notification to list:', newNotif);
              
              // Increment unread count jika notifikasi baru belum dibaca
              if (!newNotif.isRead) {
                setUnreadCount(prevCount => prevCount + 1);
              }
              
              // Add to top and limit to 10 items
              return [newNotif, ...prev].slice(0, 10);
            })
          })
          .error((error) => {
            console.error('[NavbarNotification] ❌ Channel subscription error:', error);
            isSubscribed = false;
          });

        console.log('[NavbarNotification] ✅ Subscription setup complete');
      } catch (err) {
        console.error('[NavbarNotification] ❌ Failed to subscribe:', err);
        isSubscribed = false;
      }
    };

    setupSubscription();

    return () => {
      console.log('[NavbarNotification] Cleaning up subscription');
      if (channel && userId) {
        try {
          echo.leave(`user.${userId}`);
        } catch (err) {
          console.error('[NavbarNotification] Error leaving channel:', err);
        }
      }
    };
  }, []); // Empty dependency - subscribe once, use refs for latest state 

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    // Cek apakah ini ID sementara (string)?
    const isTempId = typeof notificationId === 'string' && notificationId.startsWith('temp-');

    // Cek apakah notifikasi ini belum dibaca sebelumnya
    const notification = notifications.find(n => n.id === notificationId);
    const wasUnread = notification && !notification.isRead;

    // Update UI dulu (Optimistic UI)
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    
    // Decrement unread count jika notifikasi sebelumnya unread
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    // Jika ID sementara, JANGAN panggil API (karena belum ada di DB atau backend belum sync)
    if (isTempId) {
      console.log('[Navbar] Skipping API call for temporary ID:', notificationId);
      return;
    }

    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Error marking as read:', err);
      // Opsional: Revert UI jika gagal (tapi biasanya tidak perlu untuk UX 'read')
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          ref={ref}
          className={cn(
            "relative text-brand-yellow hover:opacity-80 transition-colors duration-200 focus:outline-none",
            className
          )}
          style={{ color: '#DABC4E' }}
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" fill="currentColor" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold cursor-pointer">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto hide-scrollbar"
      >
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold" style={{ color: 'brand-green', fontFamily: 'Urbanist, sans-serif' }}>
              Notifikasi
            </span>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#BE0414', color: 'white', fontFamily: 'Urbanist, sans-serif' }}>
                {unreadCount} baru
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="p-4 text-center text-sm" style={{ color: 'brand-green', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Memuat...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: 'brand-green', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Tidak ada notifikasi
          </div>
        ) : (
          notifications.map((notification, index) => (
            <Fragment key={notification.id}>
              <DropdownMenuItem
                className="flex-col items-start p-3 cursor-pointer"
                onClick={async () => {
                  // Mark as read first
                  if (!notification.isRead) {
                    await handleMarkAsRead(notification.id);
                  }
                  
                  if (notification.type === 'chat' && notification.metadata?.id_conversation) {
                    try {
                      const response = await getConversationDetail(notification.metadata.id_conversation);
                      const otherParticipant = response.data?.conversation?.other_participant;
                      
                      setChatUser({
                        id: otherParticipant?.id_user_si?.toString() || '',
                        name: otherParticipant?.name || 'User',
                        nim: otherParticipant?.nim || '',
                        conversationId: notification.metadata.id_conversation.toString()
                      });
                      setIsChatOpen(true);
                      
                      // Remove chat notification immediately
                      setTimeout(() => {
                        setNotifications(prev => prev.filter(n => n.id !== notification.id));
                        console.log('[NavbarNotification] 🗑️ Removed chat notification from UI:', notification.id);
                      }, 100);
                    } catch (err) {
                      console.error('Error fetching conversation:', err);
                    }
                  } else {
                    router.push(`/notif?highlight=${notification.id}`);
                  }
                }}
              >
                <div>
                  <div className="flex items-start justify-between w-full mb-1">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="px-2 py-0.5 rounded text-xs font-semibold shrink-0"
                        style={{
                          backgroundColor: notification.type === 'chat' ? '#DABC4E' : '#015023',
                          color: 'white'
                        }}
                      >
                        {notification.type === 'chat' ? 'Chat' : 'Info'}
                      </div>
                      <p className="font-semibold text-sm line-clamp-1" style={{ color: 'brand-green', fontFamily: 'Urbanist, sans-serif' }}>
                        {notification.title}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5 ml-2" />
                    )}
                  </div>
                  <p className="text-xs mb-2 line-clamp-2" style={{ color: 'brand-green', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}>
                    {notification.message}
                  </p>
                  <p className="text-xs" style={{ color: 'brand-green', opacity: 0.5, fontFamily: 'Urbanist, sans-serif' }}>
                    {formatDate(notification.date)}
                  </p>
                </div>
              </DropdownMenuItem>
              {index < notifications.length - 1 && <DropdownMenuSeparator />}
            </Fragment>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notif" className="text-center w-full cursor-pointer font-semibold text-sm py-2" style={{ color: 'brand-green', fontFamily: 'Urbanist, sans-serif' }}>
            Lihat Semua Notifikasi
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

NavbarNotification.displayName = "NavbarNotification";

export default NavbarNotification;

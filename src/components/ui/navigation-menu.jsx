"use client"

import * as React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bell, User, UserCog, LogOut, Menu, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertConfirmationDialog,
} from '@/components/ui/alert-dialog'
import { logout } from '@/lib/sessionApi'
import { getNotifications, markAsRead } from '@/lib/notificationApi'
import { getConversationDetail } from '@/lib/chatApi'
import ChatModal from '@/components/ui/chatmodal'
import { getEcho } from '@/lib/echo'
import Cookies from 'js-cookie'

const NavbarBrand = React.forwardRef(({ className, ...props }, ref) => (
  <Link
    href="/landingpage"
    ref={ref}
    className={cn("flex items-center gap-2 sm:gap-3", className)}
    {...props}
  >
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center p-1 shrink-0">
      <Image
        src="/Logo.png"
        alt="UGN Logo"
        width={80}
        height={80}
        className="rounded-full"
      />
    </div>
    <span className="text-brand-yellow font-semibold text-sm sm:text-base md:text-lg tracking-wide hidden sm:inline" style={{ color: '#DABC4E' }}>
      Universitas Global Nusantara
    </span>
  </Link>
))

const NavbarMenu = React.forwardRef(({ className, isMobileMenuOpen, setIsMobileMenuOpen, ...props }, ref) => (
  <>
    {/* Desktop Menu */}
    <div
      ref={ref}
      className={cn("hidden md:flex items-center gap-4 lg:gap-6", className)}
      {...props}
    >
      <NavbarMenuItem href="/akademik">Akademik</NavbarMenuItem>
      <NavbarMenuItem href="/kehadiran">Kehadiran</NavbarMenuItem>
      <NavbarMenuItem href="/hasil-studi">Hasil Studi</NavbarMenuItem>
    </div>

    {/* Mobile Menu Overlay */}
    {isMobileMenuOpen && (
      <div 
        className="fixed inset-0 z-40 md:hidden"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )}

    {/* Mobile Menu Sidebar */}
    <div
      className={cn(
        "fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden w-64",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Mobile Menu Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: '#015023' }}>
        <span className="text-white font-semibold text-lg">Menu</span>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Mobile Menu Items */}
      <div className="flex flex-col p-4 gap-2">
        <MobileNavMenuItem 
          href="/akademik" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Akademik
        </MobileNavMenuItem>
        <MobileNavMenuItem 
          href="/kehadiran" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Kehadiran
        </MobileNavMenuItem>
        <MobileNavMenuItem 
          href="/hasil-studi" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Hasil Studi
        </MobileNavMenuItem>
      </div>
    </div>
  </>
))

const MobileNavMenuItem = React.forwardRef(({ className, href, children, onClick, ...props }, ref) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      ref={ref}
      onClick={onClick}
      className={cn(
        "px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200",
        isActive 
          ? "bg-green-50 text-green-700" 
          : "text-gray-700 hover:bg-gray-50",
        className
      )}
      style={isActive ? { backgroundColor: '#E6F4EA', color: '#015023' } : {}}
      {...props}
    >
      {children}
    </Link>
  );
})

const NavbarMenuItem = React.forwardRef(({ className, href, children, ...props }, ref) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isActive = pathname === href;
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Link
      href={href}
      ref={ref}
      className={cn(
        "text-white hover:text-brand-yellow transition-colors duration-200 font-medium text-sm lg:text-base relative pb-1",
        className
      )}
      style={{ '--hover-color': '#DABC4E' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
      {(isActive || isHovered) && (
        <span 
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-opacity duration-200"
          style={{ backgroundColor: '#DABC4E' }}
        />
      )}
    </Link>
  );
})

const NavbarActions = React.forwardRef(({ className, ...props }, ref) => {
  // Chat modal state - shared between NavbarNotification and other components
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [chatUser, setChatUser] = React.useState({ id: '', name: '', nim: '', conversationId: '' });

  return (
    <>
      <div
        ref={ref}
        className={cn("flex items-center gap-4 sm:gap-6 lg:gap-10", className)}
        {...props}
      >
        <NavbarNotification 
          setChatUser={setChatUser}
          setIsChatOpen={setIsChatOpen}
        />
        <NavbarProfile />
      </div>
      
      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userId={chatUser.id}
        userName={chatUser.name}
        userNim={chatUser.nim}
        conversationId={chatUser.conversationId}
      />
    </>
  );
})

const NavbarNotification = React.forwardRef(({ className, setChatUser, setIsChatOpen, ...props }, ref) => {
  const router = useRouter();

  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Fetch notifications initial
  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotifications();

      if (response.status === 'success') {
        const transformed = response.data.notifications.slice(0, 5).map(notif => ({
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

  // Fetch on mount
  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // WebSocket Real-time Notification Listener
  React.useEffect(() => {
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
            
            setNotifications(prev => {
              // Biar ngecek duplikat. Jangan masukin kalo notifikasi dengan judul & pesan sama sudah ada
              const isDuplicate = prev.some(n => 
                n.title === event.notification.title && 
                n.message === event.notification.message &&
                // Fungsi tambahan biar ngecek waktu juga biar ngga blok notif sama yang beda waktu
                (Date.now() - new Date(n.date).getTime() < 5000) 
              );

              if (isDuplicate) {
                console.log('[Navbar] Duplicate notification ignored');
                return prev;
              }

              // Generate id yg unik dengan Math.random() biar Key ngga tabrakan
              // Backend ngirim id_notification: null, jadi butuh tempID yang bagus dan kuat
              const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              
              const newNotif = {
                id: event.notification.id_notification || tempId,
                type: event.notification.type,
                title: event.notification.title,
                message: event.notification.message,
                date: event.notification.sentAt,
                isRead: event.notification.isRead,
                metadata: event.notification.metadata
              };
              
              console.log('[NavbarNotification] Adding notification to list:', newNotif);
              // Add to top and limit to 5 items
              return [newNotif, ...prev].slice(0, 5);
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
  }, []); // Empty dependency - run once on mount 

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
  // Cek apakah ini ID sementara (string)?
  const isTempId = typeof notificationId === 'string' && notificationId.startsWith('temp-');

  // Update UI dulu (Optimistic UI)
  setNotifications(prev =>
    prev.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    )
  );

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

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
          {...props}
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
            <span className="text-base font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
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
          <div className="p-4 text-center text-sm" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Memuat...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Tidak ada notifikasi
          </div>
        ) : (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <DropdownMenuItem
                className="flex-col items-start p-3 cursor-pointer"
                onClick={async () => {
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
                      <p className="font-semibold text-sm line-clamp-1" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                        {notification.title}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5 ml-2" />
                    )}
                  </div>
                  <p className="text-xs mb-2 line-clamp-2" style={{ color: '#015023', opacity: 0.7, fontFamily: 'Urbanist, sans-serif' }}>
                    {notification.message}
                  </p>
                  <p className="text-xs" style={{ color: '#015023', opacity: 0.5, fontFamily: 'Urbanist, sans-serif' }}>
                    {formatDate(notification.date)}
                  </p>
                </div>
              </DropdownMenuItem>
              {index < notifications.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notif" className="text-center w-full cursor-pointer font-semibold text-sm py-2" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
            Lihat Semua Notifikasi
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
})

const NavbarProfile = React.forwardRef(({ className, userName, userImage, Name, ...props }, ref) => {
  const router = useRouter()
  const { user, logoutLocal } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const displayuserName = userName || user.username || '...';
  const displayName = Name || user.name || '...';
  const displayImage = userImage || user.image;

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    let serverMessage = '';
    try {
      const response = await logout();
      if (response.status !== 'success') {
        serverMessage = response.message || '';
      }
    } catch (error) {
      console.error('Error saat logout:', error);
      serverMessage = error?.message || error?.response?.data?.message || '';
    } finally {
      logoutLocal();
      if (serverMessage) console.warn('Logout info:', serverMessage);
      router.push('/loginpage');
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            ref={ref}
            className={cn(
              "transition-all duration-200 hover:scale-105 hover:opacity-90 cursor-pointer focus:outline-none",
              className
            )}
            {...props}
          >
            <Avatar className="size-9 sm:size-10">
              <AvatarImage src={displayImage} alt={displayuserName} />
              <AvatarFallback>
                {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
                {displayName}
              </p>
              <p className="text-xs" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
                {displayuserName}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profilepage" className="flex items-center cursor-pointer">
              <UserCog className="mr-2 h-4 w-4" />
              <span>Profile Management</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setShowLogoutDialog(true)}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title='Konfirmasi Logout'
        description='Apakah Anda yakin ingin keluar dari sistem?'
        confirmText='Logout'
        onConfirm={confirmLogout}
      />
    </>
  )
})

const Navbar = React.forwardRef(({ className, ...props }, ref) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu on window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav
      ref={ref}
      className={cn("bg-brand-green shadow-md rounded-b-[12px] sm:rounded-b-[18px]", className)}
      style={{ backgroundColor: '#015023' }}
      {...props}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button - Only visible on mobile/tablet (<800px) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-gray-200 transition-colors p-2"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <NavbarBrand />
          </div>
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-13">
            <NavbarMenu 
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <NavbarActions />
          </div>
        </div>
      </div>
    </nav>
  );
})

NavbarBrand.displayName = "NavbarBrand"
NavbarMenu.displayName = "NavbarMenu"
NavbarMenuItem.displayName = "NavbarMenuItem"
MobileNavMenuItem.displayName = "MobileNavMenuItem"
NavbarActions.displayName = "NavbarActions"
NavbarNotification.displayName = "NavbarNotification"
NavbarProfile.displayName = "NavbarProfile"
Navbar.displayName = "Navbar"

export {
  Navbar,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuItem,
  MobileNavMenuItem,
  NavbarActions,
  NavbarNotification,
  NavbarProfile
}

export default Navbar
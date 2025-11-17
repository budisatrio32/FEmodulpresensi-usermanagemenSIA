"use client"

import * as React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bell, User, UserCog, LogOut } from 'lucide-react'
import { cn, buildImageUrl } from "@/lib/utils"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PrimaryButton, OutlineButton } from '@/components/ui/button'
import { logout } from '@/lib/sessionApi'

const NavbarBrand = React.forwardRef(({ className, ...props }, ref) => (
  <Link 
    href="/landingpage" 
    ref={ref}
    className={cn("flex items-center gap-2 sm:gap-3", className)}
    {...props}
  >
    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center p-1 flex-shrink-0">
      <Image 
        src="/Logo.png"
        alt="UGN Logo"
        width={100}
        height={100}
        className="rounded-full"
      />
    </div>
    <span className="text-brand-yellow font-semibold text-sm sm:text-base md:text-lg tracking-wide hidden sm:inline" style={{color: '#DABC4E'}}>
      Universitas Global Nusantara
    </span>
  </Link>
))

const NavbarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("hidden md:flex items-center gap-4 lg:gap-6", className)}
    {...props}
  >
    <NavbarMenuItem href="/akademik">Akademik</NavbarMenuItem>
    <NavbarMenuItem href="/kehadiran">Kehadiran</NavbarMenuItem>
    <NavbarMenuItem href="/hasil-studi">Hasil Studi</NavbarMenuItem>
  </div>
))

const NavbarMenuItem = React.forwardRef(({ className, href, children, ...props }, ref) => (
  <Link 
    href={href}
    ref={ref}
    className={cn(
      "text-white hover:text-brand-yellow transition-colors duration-200 font-medium text-sm lg:text-base",
      className
    )}
    style={{'--hover-color': '#DABC4E'}}
    {...props}
  >
    {children}
  </Link>
))

const NavbarActions = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("flex items-center gap-4 sm:gap-6 lg:gap-10", className)}
    {...props}
  >
    <NavbarNotification />
    <NavbarProfile />
  </div>
))

const NavbarNotification = React.forwardRef(({ className, ...props }, ref) => {
  // Dummy data notifikasi (pengumuman dan chat)
  const [notifications] = React.useState([
    {
      id: 1,
      type: 'announcement',
      title: 'Pengumuman Ujian Tengah Semester',
      message: 'UTS akan dilaksanakan pada tanggal 20-25 November 2025',
      date: '2025-11-15',
      isRead: false
    },
    {
      id: 2,
      type: 'chat',
      title: 'Pesan dari Dr. Ahmad Budiman',
      message: 'Tugas yang dikumpulkan sudah saya terima, terima kasih',
      date: '2025-11-15',
      isRead: false
    },
    {
      id: 3,
      type: 'announcement',
      title: 'Perubahan Jadwal Kuliah',
      message: 'Mata kuliah Pemrograman Web dipindah ke hari Rabu',
      date: '2025-11-14',
      isRead: false
    },
    {
      id: 4,
      type: 'chat',
      title: 'Pesan dari Budi Santoso',
      message: 'Halo, apakah sudah selesai mengerjakan tugas kelompok?',
      date: '2025-11-14',
      isRead: true
    },
    {
      id: 5,
      type: 'announcement',
      title: 'Pengumpulan Tugas Akhir',
      message: 'Batas akhir pengumpulan tugas proyek adalah 30 November 2025',
      date: '2025-11-13',
      isRead: true
    },
  ]);

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
          style={{color: '#DABC4E'}}
          {...props}
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
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
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
            Tidak ada notifikasi
          </div>
        ) : (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer hover:bg-gray-50" asChild>
                <div>
                  <div className="flex items-start justify-between w-full mb-1">
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0"
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
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5 ml-2" />
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

    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin keluar dari sistem?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <OutlineButton>Batal</OutlineButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <PrimaryButton onClick={confirmLogout}>Logout</PrimaryButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
})

const Navbar = React.forwardRef(({ className, ...props }, ref) => (
  <nav 
    ref={ref}
    className={cn("bg-brand-green shadow-md rounded-b-[12px] sm:rounded-b-[18px]", className)} 
    style={{backgroundColor: '#015023'}}
    {...props}
  >
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <NavbarBrand />
        <div className="flex items-center gap-6 sm:gap-10 lg:gap-13">
          <NavbarMenu />
          <NavbarActions />
        </div>
      </div>
    </div>
  </nav>
))

NavbarBrand.displayName = "NavbarBrand"
NavbarMenu.displayName = "NavbarMenu"
NavbarMenuItem.displayName = "NavbarMenuItem"
NavbarActions.displayName = "NavbarActions"
NavbarNotification.displayName = "NavbarNotification"
NavbarProfile.displayName = "NavbarProfile"
Navbar.displayName = "Navbar"

export {
  Navbar,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuItem,
  NavbarActions,
  NavbarNotification,
  NavbarProfile
}

export default Navbar
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
import { logout } from '@/lib/sessionApi'

const NavbarBrand = React.forwardRef(({ className, ...props }, ref) => (
  <Link 
    href="/" 
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

const NavbarNotification = React.forwardRef(({ className, ...props }, ref) => (
  <Link 
    href="/notifications"
    ref={ref}
    className={cn(
      "relative text-brand-yellow hover:opacity-80 transition-colors duration-200",
      className
    )}
    style={{color: '#DABC4E'}}
    {...props}
  >
    <Bell className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
    {/* Notification Badge - uncomment jika ada notif */}
    {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
      3
    </span> */}
  </Link>
))

const NavbarProfile = React.forwardRef(({ className, userName, userImage, Name, ...props }, ref) => {
  const router = useRouter()
  const { user, logoutLocal } = useAuth();
  const displayuserName = userName || user.username || '...';
  const displayName = Name || user.name || '...';
  const displayImage = userImage || user.image;

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
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
  }

  return (
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
              {displayuserName}
            </p>
            <p className="text-xs" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
              {displayName || 'Akun Pengguna'}
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
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
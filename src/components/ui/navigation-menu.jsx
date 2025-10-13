import * as React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { Bell, User } from 'lucide-react'
import { cn } from "@/lib/utils"

const NavbarBrand = React.forwardRef(({ className, ...props }, ref) => (
  <Link 
    href="/" 
    ref={ref}
    className={cn("flex items-center gap-3", className)}
    {...props}
  >
    <div className="w-16 h-16 rounded-full flex items-center justify-center p-1">
      <Image 
        src="/Logo.png"
        alt="UGN Logo"
        width={100}
        height={100}
        className="rounded-full"
      />
    </div>
    <span className="text-brand-yellow font-semibold text-lg tracking-wide" style={{color: '#DABC4E'}}>
      Universitas Global Nusantara
    </span>
  </Link>
))

const NavbarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("flex items-center gap-17", className)}
    {...props}
  >
    <NavbarMenuItem href="/jadwal">Jadwal</NavbarMenuItem>
    <NavbarMenuItem href="/presensi">Presensi</NavbarMenuItem>
    <NavbarMenuItem href="/akademik">Akademik</NavbarMenuItem>
    <NavbarMenuItem href="/adminpage">Admin</NavbarMenuItem>
  </div>
))

const NavbarMenuItem = React.forwardRef(({ className, href, children, ...props }, ref) => (
  <Link 
    href={href}
    ref={ref}
    className={cn(
      "text-white hover:text-brand-yellow transition-colors duration-200 font-medium",
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
    className={cn("flex items-center gap-10", className)}
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
    <Bell className="w-6 h-6" fill="currentColor" />
    {/* Notification Badge - uncomment jika ada notif */}
    {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
      3
    </span> */}
  </Link>
))

const NavbarProfile = React.forwardRef(({ className, ...props }, ref) => (
  <Link 
    href="/profile"
    ref={ref}
    className={cn(
      "bg-brand-yellow hover:opacity-90 text-brand-green p-2.5 rounded-full transition-all duration-200 hover:scale-105",
      className
    )}
    style={{backgroundColor: '#DABC4E', color: '#015023'}}
    {...props}
  >
    <User className="w-5 h-5" strokeWidth={2.5} />
  </Link>
))

const Navbar = React.forwardRef(({ className, ...props }, ref) => (
  <nav 
    ref={ref}
    className={cn("bg-brand-green shadow-md rounded-b-[18px]", className)} 
    style={{backgroundColor: '#015023'}}
    {...props}
  >
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center h-20">
        <NavbarBrand />
        <div className="flex items-center gap-13">
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
"use client"

import * as React from "react"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, UserCog } from 'lucide-react'
import { cn, buildImageUrl } from "@/lib/utils"
import { logout } from '@/lib/sessionApi';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminNavbarBrand = React.forwardRef(({ className, ...props }, ref) => (
<div 
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
<span className="text-brand-yellow font-semibold text-sm sm:text-base md:text-lg tracking-wide hidden sm:inline" style={{color: '#DABC4E', fontFamily: 'Urbanist, sans-serif'}}>
    Universitas Global Nusantara
</span>
</div>
))

const AdminNavbarTitle = React.forwardRef(({ className, title = "Dashboard Admin", ...props }, ref) => (
<div 
ref={ref}
className={cn("text-right", className)}
{...props}
>
<span 
    className="font-semibold text-sm sm:text-base md:text-lg tracking-wide" 
    style={{
    color: '#FFFFFF',
    fontFamily: 'Urbanist, sans-serif'
    }}
>
    {title}
</span>
</div>
))

const AdminNavbar = React.forwardRef(({ className, title, userName, Name, ...props }, ref) => {
const router = useRouter()
const { user, logoutLocal } = useAuth();
const displayuserName = (userName || user.username || '...');
const displayName = (Name || user.name || '...');
const displayImage = user.image;

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
  <nav 
    ref={ref}
    className={cn("bg-brand-green shadow-md rounded-b-[18px]", className)} 
    style={{backgroundColor: '#015023'}}
    {...props}
  >
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <AdminNavbarBrand />
        <div className="flex items-center gap-3 sm:gap-4">
          <AdminNavbarTitle title={title} />
          
          {/* Avatar Profile with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="transition-all duration-200 hover:scale-105 hover:opacity-90 cursor-pointer focus:outline-none"
              >
                <Avatar className="size-10 sm:size-12">
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
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>  
  </nav>
)
})

AdminNavbarBrand.displayName = "AdminNavbarBrand"
AdminNavbarTitle.displayName = "AdminNavbarTitle"
AdminNavbar.displayName = "AdminNavbar"

export {
AdminNavbar,
AdminNavbarBrand,
AdminNavbarTitle
}

export default AdminNavbar
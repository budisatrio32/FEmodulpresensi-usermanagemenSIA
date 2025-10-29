import * as React from "react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"

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

const AdminNavbar = React.forwardRef(({ className, title, ...props }, ref) => {
const router = useRouter()

const handleLogout = () => {
  // Tambahkan logika logout di sini (clear session, token, etc)
  // Untuk sementara langsung redirect ke home
  if (confirm('Apakah Anda yakin ingin logout?')) {
    // Clear any session/token if needed
    // localStorage.removeItem('token')
    // sessionStorage.clear()
    router.push('/')
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
        <div className="flex items-center gap-4">
          <AdminNavbarTitle title={title} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: '#BE0414',
              color: '#FFFFFF',
              fontFamily: 'Urbanist, sans-serif'
            }}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-sm sm:text-base">Logout</span>
          </button>
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
import * as React from "react"
import Image from 'next/image'
import { cn } from "@/lib/utils"

const AdminNavbarBrand = React.forwardRef(({ className, ...props }, ref) => (
<div 
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
<span className="text-brand-yellow font-semibold text-lg tracking-wide" style={{color: '#DABC4E', fontFamily: 'Urbanist, sans-serif'}}>
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
    className="font-semibold text-lg tracking-wide" 
    style={{
    color: '#FFFFFF',
    fontFamily: 'Urbanist, sans-serif'
    }}
>
    {title}
</span>
</div>
))

const AdminNavbar = React.forwardRef(({ className, title, ...props }, ref) => (
<nav 
ref={ref}
className={cn("bg-brand-green shadow-md rounded-b-[18px]", className)} 
style={{backgroundColor: '#015023'}}
{...props}
>
<div className="container mx-auto px-6">
    <div className="flex justify-between items-center h-20">
    <AdminNavbarBrand />
    <AdminNavbarTitle title={title} />
    </div>
</div>  
</nav>
))

AdminNavbarBrand.displayName = "AdminNavbarBrand"
AdminNavbarTitle.displayName = "AdminNavbarTitle"
AdminNavbar.displayName = "AdminNavbar"

export {
AdminNavbar,
AdminNavbarBrand,
AdminNavbarTitle
}

export default AdminNavbar

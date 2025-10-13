import * as React from "react"
import { cn } from "@/lib/utils"

const DashboardCard = React.forwardRef(({ 
className, 
children, 
title,
description,
icon,
onClick,
...props 
}, ref) => (
<div
ref={ref}
className={cn(
    "bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-6 flex flex-col items-center text-center",
    className
)}
style={{ borderRadius: '12px' }}
onClick={onClick}
{...props}
>
{icon && (
    <div className="mb-4 p-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#015023' }}>
    <div className="w-8 h-8 text-white flex items-center justify-center" style={{ color: '#FFFFFF' }}>
        {icon}
    </div>
    </div>
)}
{title && (
    <h3 className="font-medium text-lg mb-2" style={{ 
    color: '#015023',
    fontFamily: 'Urbanist, sans-serif'
    }}>
    {title}
    </h3>
)}
{description && (
    <p className="text-sm text-gray-600 mb-4" style={{
    fontFamily: 'Urbanist, sans-serif'
    }}>
    {description}  
    </p>
)}
{children}
</div>
))

DashboardCard.displayName = "DashboardCard"

const StatCard = React.forwardRef(({ 
className, 
title,
value,
subtitle,
icon,
...props 
}, ref) => (
<div
ref={ref}
className={cn(
    "bg-white border border-gray-200 shadow-lg p-6",
    className
)}
style={{ borderRadius: '12px' }}
{...props}
>
<div className="flex items-center justify-between mb-4">
    <h3 className="font-medium text-lg" style={{ 
    color: '#015023',
    fontFamily: 'Urbanist, sans-serif' 
    }}>
    {title}
    </h3>
    {icon && (
    <div className="p-2 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DABC4E' }}>
        <div className="w-6 h-6 flex items-center justify-center" style={{ color: '#015023' }}>
        {icon}
        </div>
    </div>
    )}
</div>
<div className="space-y-2">
    <div className="text-3xl font-bold" style={{ 
    color: '#015023',
    fontFamily: 'Urbanist, sans-serif'
    }}>
    {value}
    </div>
    {subtitle && (
    <p className="text-sm text-gray-600" style={{
        fontFamily: 'Urbanist, sans-serif'
    }}>
        {subtitle}
    </p>
    )}
</div>
</div>
))

StatCard.displayName = "StatCard"

export { DashboardCard, StatCard }
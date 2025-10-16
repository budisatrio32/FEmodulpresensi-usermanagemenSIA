// ===== Card Component =====
// src/components/ui/Card.jsx
export function Card({ children, className = '' }) {
return (
<article className={`bg-white shadow-lg overflow-hidden border border-gray-200 ${className}`} style={{ borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}>
    {children}
</article>
);
}

// ===== Card Header Component =====
// src/components/ui/CardHeader.jsx
import { Calendar } from 'lucide-react';

export function CardHeader({ date, onCalendarClick, className = '' }) {
return (
<header className={`text-white px-6 py-4 flex items-center justify-between ${className}`} style={{ backgroundColor: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
    <div className="flex items-center gap-2">
    <Calendar className="w-5 h-5" />
    <h2 className="font-semibold">{date}</h2>
    </div>
    {onCalendarClick && (
    <button 
        onClick={onCalendarClick}
        className="hover:opacity-80 transition-colors"
        style={{ color: '#DABC4E' }}
        aria-label="Open calendar"
    >
        <Calendar className="w-5 h-5" />
    </button>
    )}
</header>
);
}

// ===== Card Content Component =====
// src/components/ui/CardContent.jsx
export function CardContent({ children, className = '' }) {
return (
<div className={`divide-y divide-gray-200 ${className}`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
    {children}
</div>
);
}

// ===== Badge Component =====
// src/components/ui/Badge.jsx
export function Badge({ children, variant = 'primary', size = 'md', className = '' }) {
const getVariantStyles = (variant) => {
const styles = {
    primary: { backgroundColor: '#015023', color: '#FFFFFF' },
    gold: { backgroundColor: '#DABC4E', color: '#015023' },
    outline: { backgroundColor: 'transparent', color: '#015023', border: '2px solid #015023' },
};
return styles[variant] || styles.primary;
};

const sizes = {
sm: 'px-3 py-1 text-xs',
md: 'px-4 py-2 text-sm',
lg: 'px-5 py-2.5 text-base',
};

return (
<span 
    className={`${sizes[size]} font-semibold whitespace-nowrap ${className}`} 
    style={{ 
    ...getVariantStyles(variant), 
    borderRadius: '12px',
    fontFamily: 'Urbanist, sans-serif'
    }}
>
    {children}
</span>
);
}

// ===== Schedule Item Component =====
// src/components/ui/ScheduleItem.jsx
import { MapPin } from 'lucide-react';

export function ScheduleItem({ 
matakuliah, 
waktu, 
kelas, 
dosen, 
ruang, 
sks, 
kode,
className = '' 
}) {
return (
<div className={`p-6 bg-gray-50 hover:bg-gray-100 transition-colors ${className}`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    {/* Left Side - Info */}
    <div className="flex-1">
        <h3 className="text-lg font-bold mb-3" style={{ color: '#015023' }}>
        {matakuliah}
        </h3>
        
        <div className="space-y-1 text-sm text-gray-700">
        <p>{waktu}</p>
        <p>{kelas}</p>
        <p>{dosen}</p>
        <div className="flex items-center gap-2 mt-2">
            <MapPin className="w-4 h-4" style={{ color: '#015023' }} />
            <p className="font-medium">{ruang}</p>
        </div>
        </div>
    </div>

    {/* Right Side - Badges */}
    <div className="flex flex-wrap gap-3 items-center">
        <Badge variant="primary">{sks}</Badge>
        <Badge variant="primary">{kode}</Badge>
    </div>
    </div>
</div>
);
}

// ===== Notification Item Component =====
// src/components/ui/NotificationItem.jsx

export function NotificationItem({ 
tag, 
title, 
content, 
className = '' 
}) {
return (
<div className={`p-6 bg-gray-50 ${className}`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
    {/* Tag Badge */}
    <div className="flex justify-end mb-4">
    <Badge variant="primary" size="sm">
        {tag}
    </Badge>
    </div>

    {/* Content */}
    <div className="space-y-4">
    <h4 className="font-bold text-lg" style={{ color: '#015023' }}>
        {title}
    </h4>
    
    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
        {content}
    </div>
    </div>
</div>
);
}

// ===== Section Title Component =====
// src/components/ui/SectionTitle.jsx
export function SectionTitle({ children, className = '' }) {
return (
<h1 className={`text-3xl font-bold mb-6 ${className}`} style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
    {children}
</h1>
);
}

// ===== Container Component =====
// src/components/ui/Container.jsx
export function Container({ children, className = '' }) {
return (
<div className={`container mx-auto px-6 py-8 ${className}`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
    {children}
</div>
);
}
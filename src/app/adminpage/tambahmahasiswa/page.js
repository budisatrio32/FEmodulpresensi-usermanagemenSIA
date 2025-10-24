'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import DataTable from '@/components/ui/table';
import AdminNavbar from '@/components/ui/admin-navbar';

export default function StudentDashboard() {
const students = [
{ id: 1, username: 'johndoe', email: 'john@example.com', password: '********', phone: '0812345678', createdAt: '2024-01-15' },
{ id: 2, username: 'janedoe', email: 'jane@example.com', password: '********', phone: '0823456789', createdAt: '2024-01-16' },
{ id: 3, username: 'bobsmith', email: 'bob@example.com', password: '********', phone: '0834567890', createdAt: '2024-01-17' },
{ id: 4, username: 'alicelee', email: 'alice@example.com', password: '********', phone: '0845678901', createdAt: '2024-01-18' },
{ id: 5, username: 'charlie', email: 'charlie@example.com', password: '********', phone: '0856789012', createdAt: '2024-01-19' },
{ id: 6, username: 'davidkim', email: 'david@example.com', password: '********', phone: '0867890123', createdAt: '2024-01-20' },
{ id: 7, username: 'emilytan', email: 'emily@example.com', password: '********', phone: '0878901234', createdAt: '2024-01-21' },
{ id: 8, username: 'frankwu', email: 'frank@example.com', password: '********', phone: '0889012345', createdAt: '2024-01-22' },
{ id: 9, username: 'graceli', email: 'grace@example.com', password: '********', phone: '0890123456', createdAt: '2024-01-23' },
];

// Define columns untuk table
const columns = [
{ key: 'username', label: 'Username', className: '' },
{ key: 'email', label: 'Email', className: '' },
{ key: 'password', label: 'Password', className: '' },
{ key: 'phone', label: 'No_Telepon', className: '' },
{ key: 'createdAt', label: 'Created_at', className: '' },
];

// Handle edit action
const handleEdit = (student, index) => {
console.log('Edit student:', student, 'at index:', index);
// Implement edit logic here
};

// Handle delete action
const handleDelete = (student, index) => {
console.log('Delete student:', student, 'at index:', index);
// Implement delete logic here
};

return (
<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100" style={{ fontFamily: 'Urbanist, sans-serif' }}>
    {/* Admin Navbar */}
    <AdminNavbar title="Dashboard Admin - Mahasiswa" />

    {/* Main Content */}
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
    {/* Page Title */}
    <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#015023' }}>
            Statistik Mahasiswa
        </h2>
        <button className="text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition shadow-md hover:opacity-90" style={{ backgroundColor: '#015023', borderRadius: '12px' }}>
            + Tambah
        </button>
        </div>
    </div>

    {/* Stats Card */}
    <div className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl" style={{ background: 'linear-gradient(to bottom right, #015023, #013d1c)' }}>
        <div className="flex items-center justify-between">
        <div>
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Total Mahasiswa</h3>
            <p className="text-white text-3xl sm:text-4xl font-bold mb-1">2,913</p>
            <p className="text-sm" style={{ color: '#DABC4E' }}>Mahasiswa aktif</p>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl shadow-lg" style={{ backgroundColor: '#DABC4E' }}>
            <Users className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#015023' }} />
        </div>
        </div>
    </div>

    {/* Search Bar */}
    <div className="p-3 mb-4 flex items-center gap-2 shadow-sm" style={{ backgroundColor: '#DABC4E', borderRadius: '12px' }}>
        <span className="text-sm" style={{ color: '#015023' }}>🔍</span>
        <input
        type="text"
        placeholder="Cari mahasiswa..."
        className="bg-transparent flex-1 outline-none text-sm text-gray-700"
        style={{ color: '#015023' }}
        />
        <button className="hover:opacity-80" style={{ color: '#015023' }}>×</button>
    </div>

    {/* Table using DataTable component */}
    <DataTable
        columns={columns}
        data={students}
        actions={['delete', 'edit']}
        pagination={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
    />
    </div>
</div>
);
}
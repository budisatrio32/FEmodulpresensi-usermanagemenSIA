"use client";
import React from 'react';
import { AuthProvider } from '@/lib/auth-context';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

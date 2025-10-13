import { Urbanist } from 'next/font/google';
import './globals.css';

const urbanist = Urbanist({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-urbanist',
});

export const metadata = {
  title: 'SIAKAD - Universitas Global Nusantara',
  description: 'Sistem Informasi Akademik UGN',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${urbanist.variable} font-urbanist`}>
        {children}
      </body>
    </html>
  );
}
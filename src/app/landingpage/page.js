// src/app/landingpage/page.jsx
import { Container, SectionTitle, Card, CardHeader, CardContent, ScheduleItem, NotificationItem } from '@/components/ui/container-lanpage';
import Navbar from '@/components/ui/navigation-menu';
import Footer from '@/components/ui/footer';

export default function LandingPage() {
return (
<div className="min-h-screen flex flex-col bg-gray-50">
    {/* Navbar */}
    <Navbar />
    
    {/* Main Content */}
    <main className="flex-1">
    <Container className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Jadwal Section */}
        <section className="mb-12">
        <SectionTitle>Jadwal Harian</SectionTitle>
        
        <Card>
            <CardHeader date="Jumat, 26 September 2025" />
            <CardContent>
            <ScheduleItem
                matakuliah="Rekayasa Kebutuhan Perangkat Lunak"
                waktu="Senin, 09:25 - 12:00 WIB"
                kelas="Kelas 3A-IMA | KP 5"
                dosen="Dosen: P. Suwirno"
                ruang="Lokasi: Gedung D3 (D3) | CU 207"
                sks="2.00 SKS"
                kode="SVPLI2345"
            />
            <ScheduleItem
                matakuliah="Basis Data Lanjut"
                waktu="Selasa, 13:00 - 15:30 WIB"
                kelas="Kelas 3A-IMA | KP 3"
                dosen="Dosen: Dr. Ahmad"
                ruang="Lokasi: Gedung A1 (A1) | Lab 202"
                sks="3.00 SKS"
                kode="BDLJ2234"
            />
            </CardContent>
        </Card>
        </section>

        {/* Notifikasi Section */}
        <section className="mb-12">
        <SectionTitle>Notifikasi</SectionTitle>
        
        <Card>
            <CardHeader date="Jumat, 26 September 2025" />
            <CardContent>
            <NotificationItem
                tag="Indonesian Environmental & Energy"
                title="Yth Dear Sultan Nathaya"
                content="Get ready! The 2025-2026 Indonesian Environmental..."
            />
            </CardContent>
        </Card>
        </section>
    </Container>
    </main>
    
    {/* Footer */}
    <Footer />
</div>
);
}
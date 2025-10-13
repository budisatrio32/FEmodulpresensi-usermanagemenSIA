import Image from 'next/image';

export default function Footer() {
return (
<footer style={{backgroundColor: '#015023'}}>
    {/* Main Footer Content */}
    <div className="container mx-auto px-20 py-8">
    <div className="flex justify-between items-start">
            <div className="text-white">
                <h3 className="font-semibold text-lg">Tentang</h3>
                <p className="text-base text-white/90 text-lg">
                Universitas Global Nusantara
                </p>
            </div>

            {/* Right Section - Logo & Contact */}
        <div className="flex items-start gap-2">
            {/* Logo */}
            <div className="w-20 h-18 flex items-center justify-center p-1 flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center">
                    <Image 
                        src="/Logo.png"
                        alt="UGN Logo"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                </div>
            </div>
            
            {/* University Info */}
        <div className="text-white flex flex-col justify-center">
            <h3 className="font-semibold text-base text-lg">
            Universitas Global Nusantara
            </h3>
            <a className="text-sm text-white/90 hover:text-brand-yellow transition-colors">
                Sleman, Yogyakarta, Indonesia
            </a>

            <a 
            className="text-sm text-white/90 hover:text-brand-yellow transition-colors"
            style={{'--hover-color': '#DABC4E'}}
            >
            Email: admin@globalnusantara.ac.id 
            </a>
        </div>
        </div>
    </div>
    </div>

    {/* Bottom Copyright Bar */}
    <div className="border-t border-white/10" style={{backgroundColor: 'rgba(1, 80, 35, 0.8)'}}>
    <div className="container mx-auto px-6 py-3">
        <p className="text-white/80 text-sm text-center">
        Copyright © Universitas Global Nusantara. All rights reserved
        </p>
    </div>
    </div>
</footer>
);
}
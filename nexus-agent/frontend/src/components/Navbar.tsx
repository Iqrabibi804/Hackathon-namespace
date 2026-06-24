'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  const { isConnected } = useAccount();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', label: '🛡️ Telemetry' },
    { name: 'Scan Contract', path: '/scan', label: '🔍 Rug Scan' },
    { name: 'Simulate Incident', path: '/simulate', label: '☣️ Sim Mode' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#0F172A]/8 bg-[#F5F7FB]/75 backdrop-blur-md px-8 py-4 flex justify-between items-center font-sans shadow-sm">
      {/* Brand Logo with Inline SVG */}
      <Link href="/" className="flex items-center gap-2 group">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="url(#logo-grad-nav)" stroke="#7C6FE0" strokeWidth="1.5" />
          <circle cx="12" cy="11" r="2" fill="#06B6D4" />
          <line x1="12" y1="5" x2="12" y2="9" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="1,1" />
          <line x1="7" y1="13" x2="10.5" y2="11.5" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="1,1" />
          <line x1="17" y1="13" x2="13.5" y2="11.5" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="1,1" />
          <defs>
            <linearGradient id="logo-grad-nav" x1="3" y1="2" x2="21" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(124, 111, 224, 0.2)" />
              <stop offset="1" stopColor="rgba(6, 182, 212, 0.05)" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-lg font-bold tracking-wider">
          <span className="text-[#7C6FE0] group-hover:text-[#0F172A] transition-colors">NEXUS</span>
          <span className="text-[#0F172A] group-hover:text-[#7C6FE0] transition-colors">AGENT</span>
        </span>
      </Link>

      {/* Nav Links */}
      {isConnected && (
        <div className="hidden md:flex items-center gap-1 bg-[#0F172A]/3 p-1 rounded-full border border-[#0F172A]/5">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-xs px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#7C6FE0] text-white font-semibold shadow-lg shadow-[#7C6FE0]/25'
                    : 'text-gray-500 hover:text-[#0F172A] hover:bg-[#0F172A]/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Connect Button Wrap */}
      <div className="flex items-center gap-4">
        <ConnectButton chainStatus="icon" showBalance={false} />
      </div>
    </nav>
  );
}

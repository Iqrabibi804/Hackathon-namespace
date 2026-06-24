'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, Shield, Settings } from 'lucide-react'

const TABS = [
  { href: '/dashboard', icon: Home, label: 'home' },
  { href: '/dashboard/wallet', icon: Wallet, label: 'wallet' },
  { href: '/dashboard/threats', icon: Shield, label: 'threats' },
  { href: '/dashboard/settings', icon: Settings, label: 'settings' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: '1px solid var(--border-light)',
      display: 'flex', zIndex: 40,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }} className="show-mobile">
      {TABS.map(tab => {
        const active = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href}
            style={{ flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', padding: '10px 0',
              textDecoration: 'none', minHeight: 56,
              color: active ? '#F59E0B' : '#9CA3AF',
              transition: 'color 0.2s' }}>
            <tab.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: 500, marginTop: 3,
              color: active ? '#F59E0B' : '#9CA3AF' }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

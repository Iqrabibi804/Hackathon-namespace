'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Home, Wallet, Shield, Grid3X3, CheckSquare,
  Bot, BarChart2, FileText, Settings, HelpCircle, Sun, Moon,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/wallet', icon: Wallet, label: 'Wallets' },
  { href: '/dashboard/threats', icon: Shield, label: 'Threats' },
  { href: '/dashboard/risk-matrix', icon: Grid3X3, label: 'Risk Matrix' },
  { href: '/dashboard/approvals', icon: CheckSquare, label: 'Approvals' },
  { href: '/dashboard/agents', icon: Bot, label: 'Agents' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{
      width: collapsed ? 64 : 220, minHeight: '100vh',
      background: '#1F2937', display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease', flexShrink: 0,
      boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 0' : '20px 16px', display: 'flex',
        alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
        <div style={{ width: 32, height: 32, background: '#2563EB', borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: collapsed ? '0 auto' : 0 }}>
          <Shield size={16} color="white" />
        </div>
        {!collapsed && (
          <span style={{ color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 15,
            whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            NexusAgent
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!collapsed && (
          <p style={{ fontSize: 10, fontWeight: 600, color: '#6B7280',
            letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 8px 8px', marginTop: 4 }}>
            Menu
          </p>
        )}
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ backgroundColor: '#374151' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '10px 0' : '9px 10px',
                  borderRadius: 8, cursor: 'pointer',
                  background: active ? '#374151' : 'transparent',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'background 0.15s',
                }}>
                <item.icon size={18} color={active ? 'white' : '#9CA3AF'} strokeWidth={active ? 2.5 : 2} />
                {!collapsed && (
                  <span style={{ fontSize: 14, fontWeight: active ? 600 : 400,
                    color: active ? 'white' : '#9CA3AF', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && active && (
                  <div style={{ marginLeft: 'auto', width: 4, height: 4,
                    borderRadius: '50%', background: '#3B82F6' }} />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom: help + theme toggle (Image 2 exact) */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Help */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8,
          cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <HelpCircle size={18} color="#9CA3AF" />
          {!collapsed && (
            <>
              <span style={{ fontSize: 13, color: '#9CA3AF', flex: 1 }}>Help & getting started</span>
              <span style={{ background: '#3B82F6', color: 'white', borderRadius: 12,
                padding: '1px 7px', fontSize: 11, fontWeight: 600 }}>8</span>
            </>
          )}
        </div>

        {/* Theme toggle — Image 2 exact style */}
        {!collapsed && (
          <div style={{ display: 'flex', background: '#374151', borderRadius: 24,
            padding: 3, marginTop: 8 }}>
            {(['light','dark'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 6, padding: '6px 0', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: theme === t ? 'white' : 'transparent',
                  color: theme === t ? '#1F2937' : '#9CA3AF',
                  fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}>
                {t === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

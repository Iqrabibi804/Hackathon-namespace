'use client'
import { motion } from 'framer-motion'

// SVG icons that look like 3D objects (blue metallic feel)
const ICONS = [
  { x: '20%', y: '20%', size: 80, delay: 0,    rotation: -15 },
  { x: '75%', y: '15%', size: 72, delay: 0.3,  rotation: 10 },
  { x: '10%', y: '55%', size: 64, delay: 0.6,  rotation: -8 },
  { x: '80%', y: '50%', size: 68, delay: 0.9,  rotation: 12 },
  { x: '45%', y: '10%', size: 56, delay: 1.2,  rotation: -5 },
]

function LockIcon({ size, color = '#3B82F6' }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 72" fill="none">
      <defs>
        <linearGradient id={`lock-grad-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Lock body */}
      <rect x={4} y={28} width={52} height={40} rx={8}
        fill={`url(#lock-grad-${size})`} opacity={0.95} />
      {/* Lock shackle */}
      <path d="M15 28V20C15 10 45 10 45 20V28" stroke="#93C5FD"
        strokeWidth={5} strokeLinecap="round" fill="none" />
      {/* Keyhole */}
      <circle cx={30} cy={46} r={6} fill="rgba(255,255,255,0.6)" />
      <rect x={27} y={46} width={6} height={10} rx={3} fill="rgba(255,255,255,0.6)" />
      {/* Shine */}
      <ellipse cx={22} cy={36} rx={6} ry={3} fill="rgba(255,255,255,0.3)" transform="rotate(-30 22 36)" />
    </svg>
  )
}

function ShieldIcon({ size }: { size: number }) {
  return (
    <svg width={size * 1.1} height={size} viewBox="0 0 80 90" fill="none">
      <defs>
        <linearGradient id={`shield-grad-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      <path d="M40 4L8 16V44C8 62 22 78 40 86C58 78 72 62 72 44V16L40 4Z"
        fill={`url(#shield-grad-${size})`} />
      <path d="M40 4L8 16V44C8 62 22 78 40 86C58 78 72 62 72 44V16L40 4Z"
        fill="none" stroke="#93C5FD" strokeWidth={1.5} strokeOpacity={0.6} />
      {/* Center line */}
      <line x1={40} y1={4} x2={40} y2={86} stroke="#93C5FD" strokeWidth={1} strokeOpacity={0.4} />
      {/* Shine */}
      <path d="M20 20L30 16V50C26 45 20 36 20 20Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  )
}

export default function FloatingIcons() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: 900 }}>
      {ICONS.map((icon, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: icon.x, top: icon.y,
            filter: 'drop-shadow(0 8px 24px rgba(37,99,235,0.35))',
          }}
          initial={{ opacity: 0, scale: 0.6, rotate: icon.rotation }}
          animate={{ opacity: 1, scale: 1, rotate: icon.rotation }}
          transition={{ delay: icon.delay, duration: 0.8, ease: [0.4,0,0.2,1] }}>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: 'easeInOut', delay: i * 0.2 }}>
            {i % 2 === 0 ? <LockIcon size={icon.size} /> : <ShieldIcon size={icon.size} />}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

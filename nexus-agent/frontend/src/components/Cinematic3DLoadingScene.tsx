'use client';
import { motion } from 'framer-motion';

export default function Cinematic3DLoadingScene() {
  return (
    <div className="relative w-72 h-72 flex items-center justify-center select-none">

      {/* Glowing ambient bg */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-blue-500/30 blur-[60px] animate-pulse" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-violet-500/20 blur-[40px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Outermost slowly rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute w-72 h-72 rounded-full border border-blue-400/20"
        style={{ borderStyle: 'dashed' }}
      >
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_4px_rgba(96,165,250,0.6)]" />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_3px_rgba(34,211,238,0.5)]" />
      </motion.div>

      {/* Middle ring - counter clockwise */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute w-56 h-56 rounded-full border border-violet-400/25"
      >
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_3px_rgba(167,139,250,0.5)]" />
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-300" />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute w-40 h-40 rounded-full border border-cyan-400/30"
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_3px_rgba(103,232,249,0.6)]" />
      </motion.div>

      {/* Shield */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            rotateY: [-8, 8, -8],
            y: [-4, 4, -4],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <svg width="110" height="130" viewBox="0 0 110 130" fill="none" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="shieldFront" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="shieldEdge" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="shieldGlow" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4"/>
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="innerGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Glow backdrop */}
            <path
              d="M55 8 L98 26 L98 70 C98 100 55 122 55 122 C55 122 12 100 12 70 L12 26 Z"
              fill="url(#shieldGlow)"
              filter="url(#glow)"
              opacity="0.5"
              transform="scale(1.05) translate(-2.6, -0.4)"
            />

            {/* Right face (3D depth) */}
            <path
              d="M98 26 L107 30 L107 74 C107 104 55 126 55 126 L55 122 C55 122 98 100 98 70 Z"
              fill="#1d3a7a"
              opacity="0.9"
            />
            {/* Bottom face (3D depth) */}
            <path
              d="M12 70 C12 100 55 122 55 122 L55 126 C55 126 3 104 3 74 L3 30 L12 26 Z"
              fill="#162d65"
              opacity="0.9"
            />

            {/* Main shield face */}
            <path
              d="M55 8 L98 26 L98 70 C98 100 55 122 55 122 C55 122 12 100 12 70 L12 26 Z"
              fill="url(#shieldFront)"
            />

            {/* Top highlight stripe */}
            <path
              d="M55 8 L98 26 L85 22 L55 12 L25 22 L12 26 Z"
              fill="rgba(255,255,255,0.15)"
            />
            {/* Left specular highlight */}
            <path
              d="M12 26 L12 70 C12 85 20 98 30 108 L28 40 Z"
              fill="rgba(255,255,255,0.08)"
            />

            {/* Inner shield panel */}
            <path
              d="M55 20 L86 33 L86 68 C86 92 55 110 55 110 C55 110 24 92 24 68 L24 33 Z"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />

            {/* Checkmark */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
              d="M38 65 L49 76 L72 52"
              stroke="#10b981"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#innerGlow)"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Floating padlocks */}
      {[
        { x: -105, y: -50, delay: 0, size: 0.9 },
        { x: 90, y: -35, delay: 1.2, size: 0.8 },
        { x: -90, y: 55, delay: 2.1, size: 0.75 },
        { x: 95, y: 60, delay: 0.6, size: 0.85 },
      ].map((lock, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.8, 1],
            y: [0, -12, 0],
            scale: lock.size,
          }}
          transition={{
            opacity: { delay: 0.5 + lock.delay * 0.3, duration: 0.5 },
            y: { duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: lock.delay * 0.4 },
            scale: { duration: 0 }
          }}
          className="absolute"
          style={{ transform: `translate(${lock.x}px, ${lock.y}px) scale(${lock.size})` }}
        >
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none" className="drop-shadow-xl">
            <defs>
              <linearGradient id={`lockGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa"/>
                <stop offset="100%" stopColor="#1d4ed8"/>
              </linearGradient>
            </defs>
            {/* Lock body */}
            <rect x="4" y="18" width="28" height="22" rx="5" fill={`url(#lockGrad${i})`} />
            <rect x="4" y="18" width="28" height="22" rx="5" stroke="#93c5fd" strokeWidth="1.5" strokeOpacity="0.5" />
            {/* Shackle */}
            <path d="M10 18V12A8 8 0 0 1 26 12V18" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Keyhole */}
            <circle cx="18" cy="28" r="4" fill="rgba(255,255,255,0.3)" />
            <rect x="16.5" y="28" width="3" height="6" rx="1.5" fill="rgba(255,255,255,0.3)" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

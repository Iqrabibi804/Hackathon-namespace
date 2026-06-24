'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import DemoModal from './DemoModal'

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } },
  item: {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } }
  }
}

export default function HeroSection() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme === 'dark'

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-24 overflow-hidden">

      {/* === ANIMATED BACKGROUND === */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 to-white dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 transition-colors duration-500" />
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 80, 0], scale: [1, 1.3, 0.85, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] left-[15%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-400/20 dark:bg-blue-600/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -80, 60, 0], y: [0, 80, -60, 0], scale: [1, 1.4, 0.9, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[5%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-violet-400/20 dark:bg-violet-600/15 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 50, -80, 0], y: [0, -80, 40, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[40%] right-[25%] w-[25vw] h-[25vw] max-w-[350px] max-h-[350px] rounded-full bg-cyan-400/15 dark:bg-cyan-500/10 blur-[90px]"
        />
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? '#3b82f6' : '#2563eb'} 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* === HERO CONTENT === */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl w-full mx-auto px-6 text-center"
      >
        {/* Live badge */}
        <motion.div variants={stagger.item} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/60 dark:border-blue-700/50 dark:text-blue-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
            Live · AI-Powered Threat Detection
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={stagger.item}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8"
        >
          <span className="text-slate-900 dark:text-white">Secure Your</span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 dark:from-blue-400 dark:via-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
            On-Chain Assets
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Anytime, Anywhere</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={stagger.item}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-12"
        >
          Enterprise-grade Web3 threat intelligence. Protect your wallets from rug pulls, flash loans and malicious contracts with real-time AI monitoring.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={stagger.item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(37,99,235,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/30 transition-colors w-full sm:w-auto text-center"
          >
            Start Free Trial — No Credit Card
          </motion.a>
          <motion.button
            onClick={() => setIsDemoOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-base rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform text-xs">▶</span>
            Watch 2-min Demo
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={stagger.item}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {['24/7 Monitoring', 'AI Explainability', 'Rug Pull Defense', 'Zero Fund Access', 'Multi-Chain'].map((badge, i) => (
            <motion.span
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="px-4 py-2 text-sm font-medium rounded-full bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm"
            >
              <span className="text-emerald-500 mr-1.5 font-bold">✓</span>{badge}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          variants={stagger.item}
          className="mt-20 grid grid-cols-3 gap-4 max-w-xl mx-auto"
        >
          {[
            { val: '$4.2B+', label: 'Value Protected' },
            { val: '2.4M+', label: 'Threats Blocked' },
            { val: '99.7%', label: 'Accuracy' },
          ].map((s) => (
            <div key={s.label} className="text-center py-4 px-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{s.val}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* === 3D INTERACTIVE DEMO MODAL === */}
      <AnimatePresence>
        {isDemoOpen && <DemoModal onClose={() => setIsDemoOpen(false)} />}
      </AnimatePresence>
    </section>
  )
}

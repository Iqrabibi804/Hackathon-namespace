'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function Reference1Showcase() {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-center select-none shadow-xl transition-colors duration-500">
      {/* Volumetric background lights */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Fine grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto relative z-10">
        
        {/* Left Side: Centered Glassmorphic Window Mock */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-left">
            {/* Mac buttons */}
            <div className="flex gap-1.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            </div>

            {/* Inner Content Block */}
            <div className="space-y-5 text-center py-4">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
                Real-Time Smart Contract<br />Vulnerability Auditing
              </h2>
              
              {/* Checkmark Subtitle pill */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 shadow-sm">
                <span className="text-emerald-400 font-bold text-xs">✓</span>
                <span className="text-[10px] text-emerald-300 font-mono tracking-wide uppercase font-semibold">
                  Zero-Day Threat Intercepted
                </span>
              </div>

              {/* Security Terminal Mock Layout lines */}
              <div className="border border-white/5 rounded-xl p-4 bg-white/[0.02] space-y-3 mt-2 text-left font-mono text-[9px] text-slate-400">
                <div className="flex gap-2 items-center">
                  <span className="text-blue-400">root@nexus:~$</span>
                  <span className="text-slate-300">scan_contract 0x8f...2a</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center bg-white/5 p-1 rounded">
                    <span>Checking reentrancy guards...</span>
                    <span className="text-emerald-400">[PASS]</span>
                  </div>
                  <div className="flex justify-between items-center bg-red-500/10 border border-red-500/20 p-1 rounded">
                    <span className="text-red-400">Analyzing flash loan vectors...</span>
                    <span className="text-red-500 font-bold">[CRITICAL]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Animated SVG 3D Elements */}
        <div className="lg:col-span-5 flex justify-center items-center h-[280px] relative perspective-[1000px]">
          
          {/* Animated 3D Security Core */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotateY: [0, 360]
            }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            className="absolute z-20 w-32 h-32"
            style={{ transformStyle: 'preserve-3d', right: '35%', top: '25%' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <defs>
                <linearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>
                <linearGradient id="coreEdge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              {/* Core Body (Hexagon/Cube look) */}
              <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="url(#coreGrad)" stroke="#60A5FA" strokeWidth="1" />
              {/* Inner details */}
              <polygon points="50,15 80,30 80,70 50,85 20,70 20,30" fill="url(#coreEdge)" opacity="0.5" />
              <circle cx="50" cy="50" r="10" fill="#FFF" className="animate-pulse" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4 4">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
          </motion.div>

          {/* Animated Malicious Code Block being intercepted */}
          <motion.div
            animate={{ 
              x: [40, 0, 40],
              y: [20, 0, 20],
              rotateZ: [45, 0, 45],
              opacity: [1, 0, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-10 w-16 h-16"
            style={{ right: '5%', bottom: '25%' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              <rect x="20" y="20" width="60" height="60" rx="8" fill="#7F1D1D" stroke="#EF4444" strokeWidth="3" />
              <path d="M40 40 L60 60 M60 40 L40 60" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Connection Laser */}
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
            className="absolute w-24 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444]"
            style={{ right: '20%', bottom: '40%', transform: 'rotate(25deg)' }}
          />

        </div>
      </div>
    </div>
  );
}

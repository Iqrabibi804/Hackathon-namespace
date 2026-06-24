'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, ShieldAlert, Cpu, Network, Zap, CheckCircle2, Shield } from 'lucide-react';

// Elaborate video-like scenes
const TIMELINE_DURATION = 20000; // 20 seconds total fake video

export default function DemoModal({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeMs, setTimeMs] = useState(0);
  const lastUpdate = useRef<number>(Date.now());
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      if (isPlaying) {
        const now = Date.now();
        const delta = now - lastUpdate.current;
        setTimeMs(t => {
          let next = t + delta;
          if (next >= TIMELINE_DURATION) next = TIMELINE_DURATION;
          return next;
        });
        lastUpdate.current = now;
      } else {
        lastUpdate.current = Date.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setTimeMs(0);
    setIsPlaying(true);
    lastUpdate.current = Date.now();
  };

  const progress = timeMs / TIMELINE_DURATION;

  // Determine current phase based on time
  let phase = 0;
  if (progress > 0.8) phase = 4; // Final Defense
  else if (progress > 0.6) phase = 3; // Intervention
  else if (progress > 0.35) phase = 2; // Exploit Detection
  else if (progress > 0.15) phase = 1; // Deep Analysis
  else phase = 0; // Connection & Initial Scan

  // Sub-animations (tick for rotation etc)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-5xl bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative"
        style={{ height: '80vh', maxHeight: '800px' }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/50 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              <span className="text-white/90 font-mono text-xs tracking-[0.2em] font-bold uppercase">NEXUS_SIMULATION_V3.0</span>
            </div>
            <div className="hidden md:flex gap-2 text-[10px] font-mono text-slate-500 border-l border-slate-700 pl-4">
              <span>LATENCY: 12ms</span>
              <span>NODES: 142 ACTIVE</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Cinematic Content Area */}
        <div className="flex-1 relative bg-[#050B14] overflow-hidden flex">
          
          {/* LEFT SIDE: Visuals */}
          <div className="flex-1 relative flex items-center justify-center p-8 border-r border-slate-800/50">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div key="p0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[400px] h-[400px] rounded-full border border-blue-500/20" />
                    <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-500/30 border-dashed animate-[spin_20s_linear_infinite]" />
                    <div className="absolute w-[200px] h-[200px] rounded-full bg-blue-500/5 blur-xl" />
                  </div>
                  <div className="z-10 text-center space-y-6">
                    <Network className="w-16 h-16 text-blue-400 mx-auto opacity-80" />
                    <div className="space-y-2">
                      <div className="text-blue-400 font-mono text-sm tracking-widest uppercase">INITIALIZING TELEMETRY</div>
                      <div className="text-3xl font-extrabold text-white tracking-tight">Connecting Wallet...</div>
                    </div>
                    <div className="h-1.5 w-64 bg-slate-800 rounded-full overflow-hidden mx-auto">
                      <motion.div className="h-full bg-blue-500" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: (TIMELINE_DURATION * 0.15) / 1000, ease: 'linear' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 1 && (
                <motion.div key="p1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col justify-center relative px-12">
                  <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] text-violet-500/10" />
                  <h3 className="text-violet-400 font-mono text-sm tracking-widest mb-8 uppercase text-center relative z-10">DEEP BYTECODE SCAN</h3>
                  <div className="grid grid-cols-2 gap-4 relative z-10 w-full max-w-2xl mx-auto">
                    {[
                      { l: 'ERC20 Allowances', s: 'CHECKING...' },
                      { l: 'Liquidity Pools', s: 'VERIFYING...' },
                      { l: 'Proxy Upgrades', s: 'ANALYZING...' },
                      { l: 'Flash Loan Exposure', s: 'SIMULATING...' }
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-900/80 border border-violet-500/30 p-4 rounded-xl flex justify-between items-center backdrop-blur-md">
                        <span className="text-slate-300 font-mono text-xs">{item.l}</span>
                        <motion.span 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}
                          className="text-violet-400 font-mono text-[10px] font-bold"
                        >
                          {tick % 10 < 5 && i === 3 ? 'SIMULATING...' : 'SECURE'}
                        </motion.span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 mx-auto font-mono text-[10px] text-slate-500 flex flex-col gap-1 items-center max-h-32 overflow-hidden mask-image-bottom relative z-10">
                    {Array.from({length: 8}).map((_, i) => (
                      <div key={i} className="opacity-50">0x{Math.random().toString(16).substr(2, 40)} ... OK</div>
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === 2 && (
                <motion.div key="p2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                  <div className="relative">
                    <ShieldAlert className="w-32 h-32 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 border-2 border-red-500 rounded-full" />
                  </div>
                  <div className="mt-8 text-center space-y-4 relative z-10">
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 font-mono text-xs px-4 py-1.5 rounded-full inline-block font-bold">
                      ANOMALY DETECTED IN MEMPOOL
                    </div>
                    <h2 className="text-4xl font-extrabold text-white">Malicious Contract Interaction</h2>
                    <div className="bg-slate-900 border border-red-500/30 p-4 rounded-xl font-mono text-[11px] text-left max-w-md mx-auto text-red-200">
                      <span className="text-red-500 font-bold">EXPLOIT SIGNATURE:</span> 0x8a7f9b...<br/><br/>
                      A pending transaction in the mempool is attempting to exploit a reentrancy vulnerability in an approved contract.
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 3 && (
                <motion.div key="p3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center relative px-8">
                  <div className="w-full max-w-xl">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                        <Zap size={16} /> INITIATING COUNTERMEASURES
                      </div>
                      <div className="text-slate-400 font-mono text-[10px]">T - 14ms</div>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl relative">
                      <div className="absolute top-0 left-0 h-full w-1 bg-cyan-500" />
                      <div className="p-4 border-b border-slate-800 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                          <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">Nexus Auto-Revoke Protocol</div>
                          <div className="text-slate-400 text-xs font-mono">Executing protective transaction...</div>
                        </div>
                      </div>
                      <div className="p-6 space-y-3 font-mono text-[11px]">
                        <div className="flex justify-between text-slate-300"><span>Target:</span> <span className="text-red-400">0xMalicious...99a1</span></div>
                        <div className="flex justify-between text-slate-300"><span>Action:</span> <span className="text-cyan-400">revokeAllowance(0)</span></div>
                        <div className="flex justify-between text-slate-300"><span>Gas Priority:</span> <span className="text-yellow-400">MAX_FEE (Front-running)</span></div>
                        
                        <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-cyan-400" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 4 && (
                <motion.div key="p4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 bg-emerald-500/5" />
                  <div className="relative mb-8">
                    <CheckCircle2 className="w-32 h-32 text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]" />
                    <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 border-2 border-emerald-500 rounded-full" />
                  </div>
                  <h2 className="text-4xl font-extrabold text-white mb-4">Threat Neutralized</h2>
                  <p className="text-emerald-400 font-mono text-sm max-w-md text-center">Funds are 100% secure. The malicious contract approval was revoked 3.2 seconds before the exploit could be executed.</p>
                  
                  <button onClick={reset} className="mt-12 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold font-mono text-xs hover:bg-slate-200 transition-colors flex items-center gap-2">
                    <RotateCcw size={14} /> RESTART SIMULATION
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Narrative / Explanation */}
          <div className="w-80 bg-slate-950 border-l border-slate-800/50 flex flex-col relative z-20">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-white font-bold tracking-wide">Operation Breakdown</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">Live commentary on AI actions</p>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {[
                { p: 0, title: "1. Wallet Connection", desc: "NexusAgent connects via read-only telemetry. We map your entire on-chain history instantly." },
                { p: 1, title: "2. Deep Scanning", desc: "The AI engine analyzes every smart contract you've ever approved, looking for hidden backdoors." },
                { p: 2, title: "3. Exploit Detection", desc: "A bad actor attempts to exploit a vulnerability in a pool you're exposed to. NexusAgent spots it in the mempool." },
                { p: 3, title: "4. Front-Run Defense", desc: "NexusAgent automatically crafts a transaction with a higher gas fee to revoke your allowance before the hack." },
                { p: 4, title: "5. Fully Secured", desc: "The threat is neutralized. You receive a full post-mortem report via Telegram." },
              ].map((step, i) => {
                const isActive = phase === step.p;
                const isPast = phase > step.p;
                return (
                  <div key={i} className={`relative pl-6 transition-opacity duration-300 ${isActive ? 'opacity-100' : isPast ? 'opacity-40' : 'opacity-20'}`}>
                    {/* Timeline line */}
                    {i !== 4 && <div className="absolute left-[7px] top-6 bottom-[-24px] w-0.5 bg-slate-800" />}
                    {/* Bullet point */}
                    <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-colors
                      ${isActive ? 'border-blue-500' : isPast ? 'border-slate-500' : 'border-slate-800'}
                    `}>
                      {isPast && <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />}
                      {isActive && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                    </div>
                    
                    <h4 className={`text-sm font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`}>{step.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-mono">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Video Controls */}
        <div className="bg-[#02060D] border-t border-slate-800 p-4 flex flex-col gap-3 relative z-20">
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full cursor-pointer relative group" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const p = (e.clientX - rect.left) / rect.width;
            setTimeMs(p * TIMELINE_DURATION);
          }}>
            <div className="absolute h-full bg-blue-500 rounded-full" style={{ width: `${progress * 100}%` }} />
            {/* Scrubber handle */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow blur-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress * 100}% - 6px)` }} />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center bg-white text-slate-900 rounded-full hover:scale-105 transition-transform">
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-1" />}
              </button>
              <div className="text-xs font-mono text-slate-400">
                00:{(timeMs / 1000).toFixed(1).padStart(4, '0')} / 00:{(TIMELINE_DURATION / 1000).toFixed(1)}
              </div>
            </div>
            
            <a href="#pricing" onClick={onClose} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono rounded-lg transition-colors">
              START FREE TRIAL
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

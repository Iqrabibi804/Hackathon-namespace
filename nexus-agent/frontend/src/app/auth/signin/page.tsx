'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, ArrowRight, Activity, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background decorations - High-end cyber theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617]/80 to-[#020617]" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{ 
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`, 
            backgroundSize: '60px 60px' 
          }} 
        />

        {/* Ambient Glowing Orbs */}
        <motion.div 
          animate={{ x: [0, 40, -30, 0], y: [0, -50, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[130px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 30, 0], y: [0, 50, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[130px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Core Auth Card */}
        <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
          
          {/* Inner ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/20 blur-[60px]" />
          
          <div className="flex flex-col items-center text-center relative z-10">
            
            {/* Logo/Icon */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-8 relative"
            >
              <div className="absolute inset-0 rounded-2xl border border-white/10 animate-ping opacity-20" />
              <Shield className="w-10 h-10 text-blue-400" />
            </motion.div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Nexus<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Agent</span>
            </h1>
            
            <p className="text-slate-400 font-mono text-xs leading-relaxed mb-10 max-w-sm">
              Initialize secure connection to the defense matrix. Real-time threat detection and multi-chain telemetry.
            </p>

            {/* Action Buttons */}
            <div className="w-full space-y-6">
              <div className="flex justify-center w-full transform transition-all hover:scale-[1.02]">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
                        })}
                        className="w-full"
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button onClick={openConnectModal} type="button" className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 border border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <Lock className="w-5 h-5 relative z-10" />
                                <span className="relative z-10 tracking-wide">CONNECT SECURE WALLET</span>
                              </button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button onClick={openChainModal} type="button" className="w-full flex items-center justify-center gap-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 py-4 px-6 rounded-2xl font-bold transition-all">
                                Wrong Network
                              </button>
                            );
                          }

                          return (
                            <div className="flex flex-col gap-4">
                              <button onClick={openAccountModal} type="button" className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:border-blue-500/50 text-white py-4 px-6 rounded-2xl font-mono text-sm transition-all">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  {account.displayName}
                                </div>
                                <span className="text-slate-400">{account.displayBalance}</span>
                              </button>
                              
                              <button 
                                onClick={() => router.push('/dashboard')}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/25 border border-white/10 group"
                              >
                                ENTER COCKPIT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] text-slate-500 font-mono tracking-widest uppercase">or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full bg-transparent hover:bg-white/5 text-slate-300 border border-white/10 py-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-widest"
              >
                Access Demo Mode
              </button>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          System Status: Nominal
        </div>
      </motion.div>
    </div>
  );
}

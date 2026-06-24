'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencyDefense() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [defenseTriggered, setDefenseTriggered] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push('/');
    }
  }, [mounted, isConnected, router]);

  const runDefenseAction = (type: string) => {
    setDefenseTriggered(type);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  if (!mounted || !isConnected) return null;

  const mockApprovals = [
    { token: 'USDC', spender: 'Uniswap V3 Router', allowance: 'Infinite', risk: 'Medium' },
    { token: 'USDT', spender: 'Unknown ERC-20 Spender', allowance: '1,000,000 USDT', risk: 'High' },
    { token: 'WETH', spender: 'Aave V3 Pool', allowance: '10 WETH', risk: 'Low' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0F172A] flex">
      <Sidebar beginnerMode={beginnerMode} setBeginnerMode={setBeginnerMode} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-8 max-w-6xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
              <span>Autonomous Emergency Defense Protocols</span>
              <span className="text-xs bg-[#EF4444]/10 text-[#EF4444] px-2.5 py-1 rounded font-mono font-semibold uppercase tracking-wider">
                Shield Active
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">
              Execute high-priority protective commands to evacuate capital or revoke malicious permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Approvals Control Panel */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-panel p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 font-mono mb-4">
                  [ ACTIVE WALLET APPROVALS ]
                </h3>
                <div className="space-y-3">
                  {mockApprovals.map((app, idx) => (
                    <div key={idx} className="bg-white border border-[#0F172A]/8 p-4 rounded-xl flex justify-between items-center shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#0F172A]">{app.token}</span>
                          <span className="text-[10px] text-gray-400 font-mono">Spender: {app.spender}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Allowance: {app.allowance}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold uppercase border ${
                        app.risk === 'High' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                        app.risk === 'Medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                        'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                      }`}>
                        {app.risk} Risk
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Action triggers */}
            <div className="space-y-6">
              <div className="glass-panel p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#EF4444]"></div>
                
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#EF4444] font-mono mb-2">[ ACTION TRIGGERS ]</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans mb-6">
                    Evacuate all liquid funds to a pre-defined secure cold vault or immediately clear vulnerability approvals.
                  </p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => runDefenseAction('Revocation')}
                    className="w-full bg-[#F59E0B] text-white py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#d68502] transition-colors font-mono shadow-sm"
                  >
                    🔐 Force Revoke All
                  </button>
                  <button 
                    onClick={() => runDefenseAction('Evacuation')}
                    className="w-full bg-[#EF4444] text-white py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#c93636] transition-colors font-mono shadow-sm"
                  >
                    ☣️ Trigger Asset Evacuation
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Telemetry Overlay */}
          <AnimatePresence>
            {defenseTriggered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#030307]/40 backdrop-blur-md flex items-center justify-center p-6"
              >
                <div className="glass-panel p-8 max-w-md w-full relative overflow-hidden text-center bg-white">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-[#EF4444]"></div>
                  
                  <span className="text-3xl mb-4 block">🚨</span>
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest font-mono mb-2">Executing Defense Action</h3>
                  <p className="text-xs text-gray-500 mb-6 font-mono">Telemetry Protocol: {defenseTriggered} in progress</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-black/5 mb-6">
                    <div className="bg-[#EF4444] h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>

                  <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest space-y-1">
                    <p>Securing private endpoints...</p>
                    <p>Broadcasting contract call payload...</p>
                    {progress >= 100 && <p className="text-[#10B981] font-bold">Execution complete. Telemetry Nominal.</p>}
                  </div>

                  {progress >= 100 && (
                    <button 
                      onClick={() => setDefenseTriggered(null)}
                      className="mt-6 px-6 py-2 bg-gray-100 border border-black/5 hover:bg-gray-200 text-xs font-mono rounded"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}

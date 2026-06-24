'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { motion } from 'framer-motion';

export default function OperationsCenter() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push('/');
    }
  }, [mounted, isConnected, router]);

  if (!mounted || !isConnected) return null;

  const mockAudits = [
    { time: '14:23:45', action: 'Scan Contract', target: '0x323c...11a2', status: 'MEDIUM RISK' },
    { time: '13:05:12', action: 'Simulate Oracle Depeg', target: 'Aave V3 Feed', status: 'INJECTED' },
    { time: '12:45:00', action: 'Evacuate Wallet', target: '0x992a...f423', status: 'COMPLETED' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0F172A] flex">
      <Sidebar beginnerMode={beginnerMode} setBeginnerMode={setBeginnerMode} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-8 max-w-6xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
              <span>Operations & Audit Center</span>
              <span className="text-xs bg-[#7C6FE0]/10 text-[#7C6FE0] px-2.5 py-1 rounded font-mono font-semibold uppercase tracking-wider">
                Admin Node
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">
              Track global operations metadata logs, audit trails, and security simulation records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Live Database Status */}
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 font-mono">[ NETWORK METADATA ]</h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-[#0F172A]/5 pb-2">
                  <span className="text-gray-400">Node Status</span>
                  <span className="text-[#10B981] font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between border-b border-[#0F172A]/5 pb-2">
                  <span className="text-gray-400">Scanned Contracts</span>
                  <span className="text-[#0F172A]">1,424</span>
                </div>
                <div className="flex justify-between border-b border-[#0F172A]/5 pb-2">
                  <span className="text-gray-400">Flagged Incidents</span>
                  <span className="text-[#EF4444] font-bold">14 Active</span>
                </div>
              </div>
            </div>

            {/* Audit Log list */}
            <div className="md:col-span-2 glass-panel p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 font-mono mb-4">[ INTERNAL AUDIT TRAIL ]</h3>
              <div className="space-y-3 font-mono text-xs">
                {mockAudits.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white border border-[#0F172A]/5 p-3 rounded-lg shadow-sm">
                    <div className="flex gap-4">
                      <span className="text-gray-400">{item.time}</span>
                      <span className="text-[#0F172A] font-semibold">{item.action}</span>
                      <span className="text-gray-500">{item.target}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      item.status === 'MEDIUM RISK' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' :
                      item.status === 'INJECTED' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20' :
                      'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function TimelinePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const timelineEvents = [
    {
      time: '14:32:01',
      date: 'May 28, 2026',
      title: 'Oracle price deviance warning isolated',
      desc: 'MakerDAO oracle feeds deviance flagged. Re-routed price data references through secondary nodes.',
      type: 'warning',
      badgeColor: '#CA8A04',
      badgeBg: '#FEFCE8'
    },
    {
      time: '12:24:18',
      date: 'May 28, 2026',
      title: 'New WETH allowance spending limit approved',
      desc: 'Approved spender routing access on Uniswap V3 pool contract. Safe status calculated low risk.',
      type: 'info',
      badgeColor: '#3B82F6',
      badgeBg: '#EFF6FF'
    },
    {
      time: '10:05:42',
      date: 'May 28, 2026',
      title: 'Critical reentrancy vector attempt isolated',
      desc: 'Flash loan signature borrowing 4,500,000 USDC targeted Aave collateral reserve pools. Intercept module isolated execution pipeline.',
      type: 'critical',
      badgeColor: '#DC2626',
      badgeBg: '#FEF2F2'
    },
    {
      time: '08:12:11',
      date: 'May 28, 2026',
      title: 'Full node security check completed nominal',
      desc: 'Validator checks compiled 100% nominal telemetry sync. Network response benchmark checked: 14ms.',
      type: 'success',
      badgeColor: '#10B981',
      badgeBg: '#ECFDF5'
    },
    {
      time: '18:50:33',
      date: 'May 27, 2026',
      title: 'Creator ownership transfer rug pull risk isolated',
      desc: 'Identified creator liqudity withdrawal pattern preceding LP pool depletion. Alerts routed to telegram webhook successfully.',
      type: 'critical',
      badgeColor: '#DC2626',
      badgeBg: '#FEF2F2'
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Wallet Timeline</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mt-1">Chronological Threat Log & Activity Telemetry</p>
          </div>

          {/* Interactive Timeline Events */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">[ EVENT LOG INDEX ]</span>
              <span className="text-xs text-gray-500 font-mono">Syncing block height: #19,847,302</span>
            </div>

            {/* Vertical timeline line container */}
            <div className="relative border-l-2 border-gray-100 dark:border-white/5 ml-4 pl-8 space-y-12">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative group">
                  {/* Glowing bubble anchor */}
                  <span 
                    className="absolute -left-12 top-1.5 h-6 w-6 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ backgroundColor: event.badgeColor, boxShadow: `0 4px 10px -2px ${event.badgeColor}` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                  </span>

                  {/* Content details */}
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-gray-400">
                        [{event.date} - {event.time}]
                      </span>
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider inline-block"
                        style={{ backgroundColor: event.badgeBg, color: event.badgeColor, border: `1px solid ${event.badgeColor}20` }}
                      >
                        {event.type}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {event.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

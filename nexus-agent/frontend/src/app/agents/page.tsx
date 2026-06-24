'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function AgentsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'security' | 'wallet' | 'threats' | 'analytics'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  // AI Agents detailed database matching prompt
  const [agentsList, setAgentsList] = useState([
    {
      id: 1,
      name: 'Wallet Guardian',
      category: 'wallet',
      desc: 'Monitors specified wallet addresses for on-chain threats and anomalous asset transfer signatures 24/7.',
      status: 'Active',
      lastAction: 'Scanned block #19,847,302',
      logoText: 'WG',
      color: '#7C3AED'
    },
    {
      id: 2,
      name: 'Rug Pull Detector',
      category: 'security',
      desc: 'Scans newly deployed token routers and protocol liquidity ratios. Flags creator liquidity drain patterns.',
      status: 'Learning',
      lastAction: 'Analysing Uniswap liquidity weights',
      logoText: 'RP',
      color: '#3B82F6'
    },
    {
      id: 3,
      name: 'Approval Auditor',
      category: 'wallet',
      desc: 'Continually reviews historical spender allowances and flags unverified routers holding high limit permissions.',
      status: 'Active',
      lastAction: 'Audited active delegations database',
      logoText: 'AA',
      color: '#10B981'
    },
    {
      id: 4,
      name: 'Flash Loan Sentinel',
      category: 'threats',
      desc: 'Monitors real-time collateral pools on lending pools. Isolates multi-million reentrancy arbitrage exploit sequences.',
      status: 'Active',
      lastAction: 'Isolated MakerDAO price deviances',
      logoText: 'FL',
      color: '#EF4444'
    },
    {
      id: 5,
      name: 'Phishing Blocker',
      category: 'security',
      desc: 'Interprets bytecode patterns in transactions and validates target domain signatures against phishing blacklists.',
      status: 'Inactive',
      lastAction: 'Offline. Ready to deploy',
      logoText: 'PB',
      color: '#CA8A04'
    },
    {
      id: 6,
      name: 'Risk Analyst',
      category: 'analytics',
      desc: 'Utilises Claude AI filter parameters to compile comprehensive weekly wallet security health score reports.',
      status: 'Active',
      lastAction: 'Compiled telemetry risk log report',
      logoText: 'RA',
      color: '#EC4899'
    }
  ]);

  if (!mounted) return null;

  const toggleAgent = (id: number) => {
    setAgentsList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'Inactive' ? 'Active' : 'Inactive' }
          : item
      )
    );
  };

  const filteredAgents = agentsList.filter(
    agent => activeFilter === 'all' || agent.category === activeFilter
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Header strip */}
          <div className="text-left space-y-4 max-w-xl">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-sans">
              Which <span className="text-blue-600">Agent</span> Would You Like to Choose Today?
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-mono uppercase tracking-wider">
              Autonomous AI telemetry agents specializing in multi-chain DeFi defense
            </p>
          </div>

          {/* Pill category filter selector */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'all', label: 'All Agents' },
              { id: 'security', label: 'Security' },
              { id: 'wallet', label: 'Wallet' },
              { id: 'threats', label: 'Threats' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all uppercase font-sans border ${
                  activeFilter === tab.id
                    ? 'bg-gray-900 dark:bg-slate-800 border-gray-900 dark:border-slate-800 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Agent Card Grid layout (3 cols desktop, 2 tablet, 1 mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent) => (
              <div 
                key={agent.id} 
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 transition-all relative overflow-hidden group"
              >
                {/* Status dot in top right */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    agent.status === 'Active' ? 'bg-emerald-500 animate-pulse' : agent.status === 'Learning' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400">
                    {agent.status}
                  </span>
                </div>

                {/* Illustrated SVG Line-art Logo */}
                <div className="space-y-4">
                  <div 
                    className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold font-mono text-white text-sm shadow-md select-none group-hover:scale-105 transition-all"
                    style={{ backgroundColor: agent.color, boxShadow: `0 8px 20px -6px ${agent.color}` }}
                  >
                    {agent.logoText}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white font-sans tracking-tight">
                      {agent.name}
                    </h3>
                    <span className="text-[9px] font-mono bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                      {agent.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed min-h-[48px]">
                    {agent.desc}
                  </p>
                </div>

                {/* Bottom row action controls & info */}
                <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-xs gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[8px] text-gray-400 font-mono uppercase block">Last Action</span>
                    <span className="text-[10px] text-gray-700 dark:text-gray-300 font-semibold truncate block font-mono">
                      {agent.lastAction}
                    </span>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => toggleAgent(agent.id)}
                    className={`font-bold text-[9px] font-mono uppercase tracking-widest px-3 py-2 rounded-xl transition-all shrink-0 ${
                      agent.status === 'Active'
                        ? 'bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    }`}
                  >
                    {agent.status === 'Active' ? 'Deactivate' : '+ Deploy'}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}

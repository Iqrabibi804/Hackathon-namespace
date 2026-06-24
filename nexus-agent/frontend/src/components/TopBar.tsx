'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function TopBar() {
  const { address } = useAccount();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/wallet?scan=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Get initials from address
  const getInitials = (addr?: string) => {
    if (!addr) return 'NA';
    return addr.slice(2, 4).toUpperCase();
  };

  const mockNotifications = [
    { id: 1, title: 'Critical Risk Alert', text: 'Reentrancy exploit signal detected on Base pool.', time: '2m ago', type: 'critical' },
    { id: 2, title: 'Scan Completed', text: 'Arbitrum Mainnet scan completed with excellent integrity.', time: '10m ago', type: 'info' },
    { id: 3, title: 'New Threat Blocked', text: 'Phishing signature from malicious proxy isolated.', time: '24m ago', type: 'warning' },
  ];

  return (
    <>
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/5 flex justify-between items-center px-8 sticky top-0 z-40 font-sans shadow-sm transition-colors">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 bg-gray-100/80 dark:bg-slate-800 px-3.5 py-2 rounded-xl w-80 border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
        <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Enter contract or wallet address to scan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleScan}
          className="bg-transparent border-none text-xs w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none font-medium"
        />
        <span className="text-[9px] font-bold text-gray-400 bg-gray-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono shrink-0 select-none">
          ENTER
        </span>
      </div>

      {/* Right Action strip */}
      <div className="flex items-center gap-5">
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center text-gray-500 dark:text-gray-400"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Deploy Agent
        </button>

        {/* Notifications list trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center text-gray-500 dark:text-gray-400 relative"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-left">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100 dark:border-white/5">
                <span className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Alert Center</span>
                <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-mono font-bold uppercase animate-pulse">
                  3 Active
                </span>
              </div>
              <div className="space-y-3">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-start gap-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${
                        notif.type === 'critical' ? 'text-red-500' : notif.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                      }`}>
                        {notif.title}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono font-semibold">{notif.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-normal mt-0.5">{notif.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User initials bubble & RainbowKit Button */}
        <div className="flex items-center gap-3">
          <div className="h-8.5 w-8.5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs shadow-inner uppercase tracking-wider shrink-0 select-none ring-2 ring-blue-500/25">
            {getInitials(address)}
          </div>
          <ConnectButton chainStatus="none" showBalance={false} />
        </div>
      </div>
    </header>

    {/* Deploy Agent Modal */}
    {showCreateModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl relative text-white">
          <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white font-mono text-xs">
            [ESC]
          </button>
          <h3 className="text-xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Deploy AI Agent
          </h3>
          <p className="text-xs text-gray-400 font-mono mb-6">Initialize a new autonomous telemetry node on your selected network.</p>
          
          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-2">
              <label className="text-gray-400 block">Agent Type</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                <option>Wallet Guardian (Monitoring)</option>
                <option>Rug Pull Detector (DeFi)</option>
                <option>Smart Contract Auditor</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-gray-400 block">Target Network</label>
              <div className="flex gap-2">
                {['Ethereum', 'Arbitrum', 'Base'].map((net) => (
                  <button 
                    key={net}
                    onClick={() => setSelectedNetwork(net)}
                    className={`flex-1 py-2 rounded-lg border transition-colors ${
                      selectedNetwork === net 
                        ? 'bg-blue-600 text-white border-blue-500' 
                        : 'bg-slate-800 text-gray-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => {
                setDeploying(true);
                setTimeout(() => {
                  setDeploying(false);
                  setShowCreateModal(false);
                }, 2000);
              }}
              disabled={deploying}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs"
            >
              {deploying ? 'Deploying to Node...' : 'Confirm Deployment'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

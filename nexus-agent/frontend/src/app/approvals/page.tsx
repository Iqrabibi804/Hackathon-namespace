'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function ApprovalsPage() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [panicActive, setPanicActive] = useState(false);
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [approvalsList, setApprovalsList] = useState([
    { id: 1, token: 'Wrapped Ether', symbol: 'WETH', spender: 'Uniswap V3 Router proxy (0x68b3...23c0)', amount: 'Unlimited', risk: 'LOW', riskColor: '#10B981', txHash: '0x1a2b...3c4d' },
    { id: 2, token: 'USD Coin', symbol: 'USDC', spender: 'Aave V3 pool proxy (0x7d27...1a2b)', amount: '10,000 USDC', risk: 'LOW', riskColor: '#10B981', txHash: '0x5e6f...7h8i' },
    { id: 3, token: 'Tether USD', symbol: 'USDT', spender: 'SushiSwap Router v2 (0xd9e1...5f6a)', amount: 'Unlimited', risk: 'MEDIUM', riskColor: '#CA8A04', txHash: '0x9j1k...2l3m' },
    { id: 4, token: 'Shiba Inu', symbol: 'SHIB', spender: 'Unknown Custom deployer proxy (0x7c2a...888a)', amount: 'Unlimited', risk: 'HIGH', riskColor: '#EA580C', txHash: '0x4n5o...6p7q' },
    { id: 5, token: 'Pepe Coin', symbol: 'PEPE', spender: 'Malicious Spender Contract (0xbc1f...a23c)', amount: 'Unlimited', risk: 'CRITICAL', riskColor: '#DC2626', txHash: '0x8r9s...0t1u' }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRevoke = (id: number) => {
    setRevokingId(id);
    // Simulate transaction delay
    setTimeout(() => {
      setApprovalsList(prev => prev.filter(item => item.id !== id));
      setRevokingId(null);
    }, 1500);
  };

  const handlePanicRevokeAll = () => {
    setPanicActive(true);
    setTimeout(() => {
      setApprovalsList([]);
      setPanicActive(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header section with panic trigger */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Allowance approvals</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mt-1">Audit active spender delegations & reset exposure bounds</p>
            </div>

            <button
              onClick={handlePanicRevokeAll}
              disabled={panicActive || approvalsList.length === 0}
              className={`font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                panicActive 
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
              }`}
            >
              {panicActive ? 'Invoking Circuit Breaker...' : '🔴 EMERGENCY PANIC REVOKE ALL'}
            </button>
          </div>

          {/* Quick instructions alert block */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-3xl p-5 flex items-start gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[4px] h-full bg-blue-600"></div>
            <div className="h-9 w-9 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-blue-900 dark:text-blue-300 uppercase text-xs">What is allowance revocation?</h4>
              <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-normal max-w-2xl font-medium">
                Allowance revocation constructs a contract transaction payload setting target spender approvals to exactly zero. 
                This guarantees unverified third-party routers cannot execute transferFrom methods to pull assets out of your wallet address.
              </p>
            </div>
          </div>

          {/* Approvals Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">[ ACTIVE SPENDER AUTHORIZATIONS ]</span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                Active approvals: {approvalsList.length}
              </span>
            </div>

            {approvalsList.length > 0 ? (
              <div className="overflow-x-auto border border-gray-100 dark:border-white/5 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono text-[9px]">
                      <th className="p-4 font-bold">Asset Token</th>
                      <th className="p-4 font-bold">Authorized Spender proxy</th>
                      <th className="p-4 font-bold">Allowance limit</th>
                      <th className="p-4 font-bold">Vulnerability risk</th>
                      <th className="p-4 font-bold">Allowance creation tx</th>
                      <th className="p-4 font-bold text-right">Emergency mitigation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                    {approvalsList.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-[10px] uppercase font-mono shadow-inner select-none">
                              {item.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <span className="font-extrabold text-gray-800 dark:text-white block">{item.token}</span>
                              <span className="text-[9px] text-gray-400 font-mono uppercase block">{item.symbol}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-gray-500 dark:text-gray-400">{item.spender}</td>
                        <td className="p-4 font-mono text-gray-700 dark:text-gray-300 font-bold">{item.amount}</td>
                        <td className="p-4">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider inline-block"
                            style={{ backgroundColor: `${item.riskColor}10`, color: item.riskColor, border: `1px solid ${item.riskColor}20` }}
                          >
                            {item.risk}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-gray-400">{item.txHash}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleRevoke(item.id)}
                            disabled={revokingId === item.id}
                            className="bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold uppercase font-mono tracking-widest text-[9px] px-3.5 py-2 rounded-lg transition-all border border-red-200/50 dark:border-red-500/20 active:scale-95 disabled:opacity-50"
                          >
                            {revokingId === item.id ? 'Revoking...' : 'Force Revoke'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500 space-y-3">
                <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-white">Workspace exposure nominal</h4>
                <p className="text-[11px] max-w-xs mx-auto leading-normal">
                  All active spender token approvals have been successfully reset. Your wallet holds excellent security profile metrics.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

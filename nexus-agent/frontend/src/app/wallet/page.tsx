'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import SecurityShield3D from '../../components/SecurityShield3D';

export default function WalletAnalysis() {
  const { address: connectedAddress, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [scanAddress, setScanAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState<'eth' | 'arb' | 'base' | 'polygon'>('eth');
  
  // Scanning state
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [approvalsList, setApprovalsList] = useState<any[]>([]);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const handleDownloadReport = () => {
    if (!results) return;
    const reportData = `NEXUS AGENT TELEMETRY PROOF\n===========================\nTimestamp: ${new Date().toISOString()}\nWallet: ${scanAddress}\nRisk Score: ${results.riskScore}\nThreats Found: ${results.metrics.threatsFound}\nNetwork: ${selectedChain.toUpperCase()}`;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus_telemetry_${scanAddress.substring(0,8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRevoke = (id: number) => {
    setRevokingId(id);
    setTimeout(() => {
      setApprovalsList(prev => prev.filter(item => item.id !== id));
      setRevokingId(null);
    }, 1500);
  };

  const handlePanicRevokeAll = () => {
    setRevokingId(-1); // Use -1 to indicate 'panic all'
    setTimeout(() => {
      setApprovalsList([]);
      setRevokingId(null);
    }, 2500);
  };

  useEffect(() => {
    setMounted(true);
    
    const urlScan = searchParams?.get('scan');
    if (urlScan) {
      setScanAddress(urlScan);
      // Wait for mount then run scan
      setTimeout(() => performScan(urlScan), 500);
    } else if (isConnected && connectedAddress) {
      setScanAddress(connectedAddress);
    }
  }, [mounted, isConnected, connectedAddress, searchParams]);

  if (!mounted) return null;

  const performScan = (addressToScan: string) => {
    if (!addressToScan || !/^0x[a-fA-F0-9]{40}$/i.test(addressToScan)) {
      alert('Please enter a valid Ethereum address format.');
      return;
    }

    setScanning(true);
    setScanStep(0);
    setProgress(15);
    setResults(null);

    // Simulate 3-stage scanning loading screen
    setTimeout(() => {
      setScanStep(1);
      setProgress(45);
    }, 1000);

    setTimeout(() => {
      setScanStep(2);
      setProgress(75);
    }, 2000);

    setTimeout(() => {
      setScanStep(3);
      setProgress(100);
    }, 3200);

    setTimeout(() => {
      setScanning(false);
      
      // Calculate risk factors deterministically for demo
      const hashVal = addressToScan.toLowerCase();
      const isCritical = hashVal.endsWith('a') || hashVal.endsWith('8') || hashVal.endsWith('3');
      const isMedium = hashVal.endsWith('5') || hashVal.endsWith('9') || hashVal.endsWith('c');
      
      let riskScore = 23;
      let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      let aiExplanation = 'Your DeFi wallet health score indicates excellent asset integrity. No high-risk open contract approvals or malicious spender delegations found.';

      if (isCritical) {
        riskScore = 89;
        level = 'CRITICAL';
        aiExplanation = 'CRITICAL RISK DETECTED: We found unlimited token approval delegated to a suspected phishing proxy address. Emergency force revoke transaction payload recommended to protect your WETH positions.';
      } else if (isMedium) {
        riskScore = 56;
        level = 'HIGH';
        aiExplanation = 'HIGH RISK DETECTED: Elevated exposure found due to active historical approvals with unverified routers. Several older spender addresses possess withdraw permissions.';
      }

      setResults({
        riskScore,
        level,
        aiExplanation,
        metrics: {
          balance: isCritical ? '0.042 ETH' : '4.821 ETH',
          threatsFound: isCritical ? 6 : isMedium ? 3 : 0,
          approvalsFound: isCritical ? 14 : isMedium ? 8 : 2,
          lastScan: 'Just now'
        }
      });
      setApprovalsList([
        { id: 1, token: 'Wrapped ETH (WETH)', spender: 'Uniswap V3 Router proxy', amount: 'Unlimited', risk: 'LOW', riskColor: '#10B981' },
        { id: 2, token: 'USDC Coin (USDC)', spender: 'Aave V3 Collateral pool', amount: '10,000 USDC', risk: 'LOW', riskColor: '#10B981' },
        { id: 3, token: 'Pepe Token (PEPE)', spender: 'Unknown Custom deployer proxy (0x7c...88a)', amount: 'Unlimited', risk: isCritical || isMedium ? 'CRITICAL' : 'LOW', riskColor: isCritical || isMedium ? '#DC2626' : '#10B981' },
      ]);
    }, 3800);
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    performScan(scanAddress);
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return '#10B981'; // Green
    if (score < 60) return '#CA8A04'; // Yellow
    if (score < 80) return '#EA580C'; // Orange
    return '#DC2626'; // Red
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header section */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Wallet Analysis
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mt-1">
              Deterministic Security Scans & Threat Audits
            </p>
          </div>

          {/* Scanner Input Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-6">
            <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 items-center">
              {/* Chain select tab pills */}
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/5 self-stretch md:self-auto">
                {(['eth', 'arb', 'base', 'polygon'] as const).map((chain) => (
                  <button
                    key={chain}
                    type="button"
                    onClick={() => setSelectedChain(chain)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      selectedChain === chain
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                    }`}
                  >
                    {chain}
                  </button>
                ))}
              </div>

              {/* Address input */}
              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  placeholder="Paste Ethereum wallet address (0x...)"
                  value={scanAddress}
                  onChange={(e) => setScanAddress(e.target.value)}
                  disabled={scanning}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none rounded-2xl px-5 py-3 text-sm font-semibold tracking-wide placeholder-gray-400 disabled:opacity-50 transition-all font-mono"
                />
              </div>

              {/* Scan Button */}
              <button
                type="submit"
                disabled={scanning || !scanAddress}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 w-full md:w-auto"
              >
                {scanning ? 'Auditing...' : 'Scan Wallet'}
              </button>
            </form>
          </div>

          {/* 3-Stage Scanning Loading Interface */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-md text-center space-y-6 max-w-xl mx-auto"
              >
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                  {/* Rotating Scanner circle */}
                  <svg className="absolute w-full h-full animate-spin duration-3000" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="rgba(37, 99, 235, 0.1)" strokeWidth="3" fill="none" />
                    <circle cx="50" cy="50" r="45" stroke="#2563EB" strokeWidth="3" fill="none" strokeDasharray="25,75" />
                  </svg>
                  <span className="text-xl font-bold font-mono text-blue-600">{progress}%</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 dark:text-white font-mono">
                    {scanStep === 0 && '🔍 Extracting on-chain historical transfers...'}
                    {scanStep === 1 && '🧠 Querying Claude AI security filters...'}
                    {scanStep === 2 && '🛡️ Analysing spender allowance risks...'}
                    {scanStep === 3 && '🚀 Formulating defense profile reports...'}
                  </h3>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan Results Layout */}
          {results && !scanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 animate-fade-in"
            >
              {/* Row 1: KPI Cards with custom SVG mini donuts */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Risk Telemetry Score', value: `${results.riskScore}/100`, progress: results.riskScore, color: getScoreColor(results.riskScore), trend: results.level },
                  { label: 'Threats Identified', value: results.metrics.threatsFound, progress: results.metrics.threatsFound > 0 ? 80 : 0, color: '#DC2626', trend: 'Isolated' },
                  { label: 'Open Approvals', value: results.metrics.approvalsFound, progress: 45, color: '#3B82F6', trend: 'Active' },
                  { label: 'Balance Monitored', value: results.metrics.balance, progress: 95, color: '#10B981', trend: 'Secured' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm flex justify-between items-center relative overflow-hidden group hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 transition-all">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block">{kpi.label}</span>
                      <h4 className="text-2xl font-extrabold tracking-tight font-mono text-gray-900 dark:text-white">{kpi.value}</h4>
                      <span className="text-[10px] bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 inline-block font-mono">
                        {kpi.trend}
                      </span>
                    </div>

                    {/* Circular custom progress indicator */}
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="28" cy="28" r="22" stroke="rgba(0,0,0,0.03)" strokeWidth="3" fill="none" />
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke={kpi.color}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 22}
                          strokeDashoffset={2 * Math.PI * 22 * (1 - kpi.progress / 100)}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-bold font-mono" style={{ color: kpi.color }}>{kpi.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: Score circular gauge + Claude explanation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score gauge */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase w-full text-left mb-6">
                    [ EXPOSURE GRADIENT ]
                  </span>
                  
                  <div className="relative w-44 h-44 flex items-center justify-center my-4">
                    <svg className="transform -rotate-90 w-full h-full">
                      <circle cx="88" cy="88" r="70" stroke="rgba(0,0,0,0.03)" strokeWidth="8" fill="none" />
                      <circle
                        cx="88"
                        cy="88"
                        r="70"
                        stroke={getScoreColor(results.riskScore)}
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 70}
                        strokeDashoffset={2 * Math.PI * 70 * (1 - results.riskScore / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-extrabold tracking-tight font-mono" style={{ color: getScoreColor(results.riskScore) }}>
                        {results.riskScore}
                      </span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold mt-1">RISK RATING</span>
                    </div>
                  </div>

                  <div className="text-xs font-mono font-semibold uppercase mt-2">
                    Security Level:{' '}
                    <span style={{ color: getScoreColor(results.riskScore) }} className="font-extrabold">
                      {results.level}
                    </span>
                  </div>
                </div>

                {/* Claude explainer */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-1 rounded-full uppercase flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-ping"></span>
                        Claude-3.5 explainability module
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide">Confidence: 98%</span>
                    </div>

                    <div className="h-[1px] bg-gray-100 dark:bg-white/5"></div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic font-medium bg-gray-50/70 dark:bg-slate-800/70 border border-gray-100 dark:border-white/5 p-5 rounded-2xl font-serif">
                      "{results.aiExplanation}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-between items-center pt-2">
                    <span className="text-[10px] text-gray-400 font-mono">Telemetry database refreshed: 12ms ago</span>
                    <button 
                      onClick={handleDownloadReport}
                      className="bg-gray-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Allowance/approvals table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 dark:text-white font-mono">
                      Active Allowances & Delegations
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Smart contracts capable of calling transferFrom on your wallet</p>
                  </div>
                  <button 
                    onClick={handlePanicRevokeAll}
                    disabled={approvalsList.length === 0 || revokingId === -1}
                    className="text-xs font-mono text-red-500 font-bold uppercase hover:underline disabled:opacity-50"
                  >
                    {revokingId === -1 ? 'Invoking Panic Revoke...' : 'Panic Revoke All'}
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-100 dark:border-white/5 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono text-[9px]">
                        <th className="p-4 font-bold">Token Asset</th>
                        <th className="p-4 font-bold">Authorized Spender</th>
                        <th className="p-4 font-bold">Allowance Limit</th>
                        <th className="p-4 font-bold">Exposure risk</th>
                        <th className="p-4 font-bold text-right">Emergency mitigation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
                      {approvalsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500 font-mono text-sm">No active allowances found.</td>
                        </tr>
                      ) : approvalsList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 font-bold text-gray-800 dark:text-white">{item.token}</td>
                          <td className="p-4 font-mono text-gray-500 dark:text-gray-400">{item.spender}</td>
                          <td className="p-4 font-mono text-gray-700 dark:text-gray-300">{item.amount}</td>
                          <td className="p-4">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider inline-block"
                              style={{ backgroundColor: `${item.riskColor}10`, color: item.riskColor, border: `1px solid ${item.riskColor}20` }}
                            >
                              {item.risk}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleRevoke(item.id)}
                              disabled={revokingId === item.id || revokingId === -1}
                              className="bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold uppercase font-mono tracking-widest text-[9px] px-3.5 py-1.5 rounded-lg transition-all border border-red-200/50 dark:border-red-500/20 disabled:opacity-50"
                            >
                              {revokingId === item.id ? 'Revoking...' : 'Force Revoke'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Initial / Empty state when not scanned */}
          {!results && !scanning && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-10 text-center shadow-sm space-y-4 max-w-2xl mx-auto my-12">
              <div className="flex justify-center mx-auto">
                <SecurityShield3D />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Deterministic Allowance Telemetry</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                  Paste any public EVM wallet address to fetch instant historical transaction metadata and compute interactive safety dashboards.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

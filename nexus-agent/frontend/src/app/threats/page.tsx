'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function ThreatMap() {
  const [mounted, setMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'24h' | 'week' | 'month'>('week');
  const [caseFilter, setCaseFilter] = useState<'open' | 'denoised'>('open');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high'>('all');
  const [selectedRing, setSelectedRing] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Concentric ring categories data
  const ringData = [
    { name: 'Flash Loan Exploit', count: 12, color: '#DC2626', radius: 85, strokeWidth: 10, percent: 78 },
    { name: 'Liquidity Rug Pull', count: 8, color: '#EA580C', radius: 70, strokeWidth: 10, percent: 62 },
    { name: 'Whale Transaction Dump', count: 18, color: '#F97316', radius: 55, strokeWidth: 10, percent: 45 },
    { name: 'Phishing Signature Attempt', count: 24, color: '#CA8A04', radius: 40, strokeWidth: 10, percent: 91 }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Threat Map</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mt-1">Concentric Threat Telemetry & Attack Isolation</p>
            </div>

            {/* Bubble Button Time Selector */}
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm">
              {[
                { id: '24h', label: 'Last 24 Hrs' },
                { id: 'week', label: 'Last Week' },
                { id: 'month', label: 'Last Month' }
              ].map((time) => (
                <button
                  key={time.id}
                  onClick={() => setTimeFilter(time.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    timeFilter === time.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top KPI Metrics Strip (5 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Time Saved', value: '2.4 Hours', sub: 'Projected monthly' },
              { label: 'Dollars Saved', value: '$1.8k USD', sub: 'Average weekly value' },
              { label: 'System Health', value: '16/16 Nodes', sub: 'Strict validator checks' },
              { label: 'Denoised Ratio', value: '73%', sub: 'False alert suppression' },
              { label: 'Malicious Blocks', value: '5 Attacks', sub: 'Isolated at execution' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-mono font-bold tracking-widest uppercase block">{kpi.label}</span>
                <h4 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight mt-1">{kpi.value}</h4>
                <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono mt-0.5 block">{kpi.sub}</span>
              </div>
            ))}
          </div>

          {/* Core Content Grid: Left Panel + Center Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Filter Panel (4 columns / 280px-like wide) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Category Count Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block">All Case Types</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-white/5">
                    <span className="text-gray-600 dark:text-gray-300 font-semibold">Email Threats</span>
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-gray-800 dark:text-gray-300">32</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-white/5">
                    <span className="text-gray-600 dark:text-gray-300 font-semibold">Cloud Assets</span>
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-gray-800 dark:text-gray-300">48</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-600 dark:text-gray-300 font-semibold">DeFi Endpoints</span>
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-gray-800 dark:text-gray-300">12</span>
                  </div>
                </div>
              </div>

              {/* Status Radio Filters */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block">Conclusion Filter</span>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'open', label: 'Open Incidents' },
                    { id: 'denoised', label: 'Denoised / Filtered' }
                  ].map((radio) => (
                    <label key={radio.id} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="case-status"
                        checked={caseFilter === radio.id}
                        onChange={() => setCaseFilter(radio.id as any)}
                        className="h-4 w-4 text-blue-600 border-gray-300 dark:border-slate-600 focus:ring-blue-500 bg-white dark:bg-slate-900"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">{radio.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Severity filter dot controls */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block">Severity Levels</span>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'all', label: 'All Severities', color: '#3B82F6' },
                    { id: 'critical', label: 'Critical Only', color: '#DC2626' },
                    { id: 'high', label: 'High Severity', color: '#EA580C' }
                  ].map((sev) => (
                    <button
                      key={sev.id}
                      onClick={() => setSeverityFilter(sev.id as any)}
                      className={`flex items-center gap-2.5 w-full text-left py-1 rounded transition-colors ${
                        severityFilter === sev.id ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sev.color }}></span>
                      <span>{sev.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Center Concentric Threat Map Rings (9 columns / remains) */}
            <div className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm flex flex-col justify-between items-center relative overflow-hidden min-h-[480px]">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase self-start">[ RADIAL THREAT TELEMETRY ]</span>
              
              {/* Concentric rings rendered beautifully with inline SVG */}
              <div className="relative w-72 h-72 flex items-center justify-center my-6">
                
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Backdrop concentric circle guides */}
                  {ringData.map((ring, idx) => (
                    <circle
                      key={`bg-${idx}`}
                      cx="100"
                      cy="100"
                      r={ring.radius}
                      stroke="rgba(0,0,0,0.03)"
                      strokeWidth={ring.strokeWidth}
                      fill="none"
                    />
                  ))}

                  {/* Colored telemetry data segments */}
                  {ringData.map((ring, idx) => {
                    const circum = 2 * Math.PI * ring.radius;
                    const offset = circum * (1 - ring.percent / 100);
                    return (
                      <circle
                        key={`val-${idx}`}
                        cx="100"
                        cy="100"
                        r={ring.radius}
                        stroke={ring.color}
                        strokeWidth={ring.strokeWidth}
                        strokeDasharray={circum}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="none"
                        className="cursor-pointer transition-all duration-300 hover:opacity-80"
                        style={{
                          transformOrigin: 'center',
                          opacity: selectedRing === ring.name ? 1 : selectedRing ? 0.25 : 0.85
                        }}
                        onMouseEnter={() => setSelectedRing(ring.name)}
                        onMouseLeave={() => setSelectedRing(null)}
                      />
                    );
                  })}
                </svg>

                {/* Concentric Ring Central Telemetry display */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-mono">
                    {selectedRing ? ringData.find(r => r.name === selectedRing)?.count : 62}
                  </span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest font-mono font-bold mt-1 max-w-[100px] leading-tight">
                    {selectedRing ? selectedRing : 'Total Active Threats'}
                  </span>
                </div>

              </div>

              {/* Dotted indicator stats for Open / Denoised totals */}
              <div className="flex gap-8 justify-center w-full border-t border-gray-100 dark:border-white/5 pt-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
                  <span className="text-gray-500 dark:text-gray-400">Overall Open:</span>
                  <span className="font-bold text-gray-900 dark:text-white">172 Cases (27%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                  <span className="text-gray-500 dark:text-gray-400">Overall Denoised:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-300">929 Cases (73%)</span>
                </div>
              </div>

              {/* Interactive Tooltip feedback area */}
              <div className="text-[10px] text-gray-400 font-mono text-center mt-3">
                {selectedRing
                  ? `👉 Category: ${selectedRing} represents ${ringData.find(r => r.name === selectedRing)?.percent}% of computed DeFi exploits.`
                  : 'ℹ️ Hover over any concentric color ring to isolate specific category threat rates.'}
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

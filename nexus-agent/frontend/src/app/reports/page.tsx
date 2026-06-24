'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [reportFrequency, setReportFrequency] = useState<'weekly' | 'monthly' | 'custom'>('weekly');
  const [compiling, setCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [reportsList, setReportsList] = useState([
    { id: 'rep-0921', name: 'Nexus Wallet Security Audit', date: 'May 28, 2026', size: '284 KB', type: 'ZK Proof', hash: '0x1a2b...c4d5' },
    { id: 'rep-0847', name: 'Allowance Approval Exposure Report', date: 'May 21, 2026', size: '142 KB', type: 'ZK Proof', hash: '0x5e6f...g7h8' },
    { id: 'rep-0731', name: 'DeFi Protocol Collateral Health Log', date: 'May 14, 2026', size: '512 KB', type: 'ZK Proof', hash: '0x9j1k...l2m3' }
  ]);

  // Selected sections
  const [sections, setSections] = useState({
    allowances: true,
    riskLogs: true,
    nodeHealth: true,
    aiExplain: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCompile = (e: React.FormEvent) => {
    e.preventDefault();
    setCompiling(true);
    setCompileProgress(10);

    const interval = setInterval(() => {
      setCompileProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCompiling(false);
            // Append a new compiled report to the index
            const newRepId = `rep-${Math.floor(Math.random() * 9000) + 1000}`;
            setReportsList(prevReps => [
              {
                id: newRepId,
                name: 'Custom Telemetry Defense Report',
                date: 'Just now',
                size: '312 KB',
                type: 'ZK Proof',
                hash: '0xbc4e...98f2'
              },
              ...prevReps
            ]);
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Heading */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Telemetry & ZK Proofs</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mt-1">Compile custom security audit logs & zero-knowledge telemetry proofs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left compiler config card (7 columns) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block">[ COMPILER WORKBENCH ]</span>

                {/* Compile form */}
                <form onSubmit={handleCompile} className="space-y-6">
                  
                  {/* Frequency pills */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block uppercase font-mono tracking-wide">Automated Scheduler Frequency</label>
                    <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/5">
                      {[
                        { id: 'weekly', label: 'Weekly Reports' },
                        { id: 'monthly', label: 'Monthly Logs' },
                        { id: 'custom', label: 'Manual/Custom' }
                      ].map((freq) => (
                        <button
                          key={freq.id}
                          type="button"
                          onClick={() => setReportFrequency(freq.id as any)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                            reportFrequency === freq.id
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                          }`}
                        >
                          {freq.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section selection checkboxes */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block uppercase font-mono tracking-wide">Included Report Sections</label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { id: 'allowances', label: 'Active approvals & spender limits', state: sections.allowances },
                        { id: 'riskLogs', label: 'Vulnerability threat logs index', state: sections.riskLogs },
                        { id: 'nodeHealth', label: 'Strict validator telemetry records', state: sections.nodeHealth },
                        { id: 'aiExplain', label: 'Claude AI security explanation blocks', state: sections.aiExplain }
                      ].map((sec) => (
                        <label 
                          key={sec.id} 
                          className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100/80 dark:hover:bg-slate-800 p-3 rounded-xl border border-gray-200/40 dark:border-white/5 cursor-pointer select-none transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={sec.state}
                            onChange={() => setSections(prev => ({ ...prev, [sec.id]: !prev[sec.id as keyof typeof prev] }))}
                            className="h-4 w-4 rounded text-blue-600 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-blue-500"
                          />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{sec.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </form>
              </div>

              {/* Compile progress trigger */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                {compiling && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-blue-600 uppercase tracking-widest animate-pulse">Computing Zero-Knowledge Proof...</span>
                      <span className="text-gray-500 dark:text-gray-400 font-bold">{compileProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${compileProgress}%` }}></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCompile}
                  disabled={compiling}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest w-full py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Generate Telemetry ZK-Proof
                </button>
              </div>

            </div>

            {/* Right compiled report history list (5 columns) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col space-y-6">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">[ COMPILED REPORTS INDEX ]</span>

              <div className="space-y-3 overflow-y-auto flex-1 max-h-[360px] pr-2">
                {reportsList.map((rep) => (
                  <div key={rep.id} className="p-3 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100/80 dark:hover:bg-slate-800 rounded-2xl border border-gray-200/30 dark:border-white/5 flex justify-between items-center gap-4 transition-all group">
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-extrabold text-gray-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {rep.name}
                      </h4>
                      <div className="flex gap-2 text-[9px] font-mono text-gray-400 uppercase font-semibold">
                        <span>{rep.date}</span>
                        <span>•</span>
                        <span>{rep.size}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setDownloadingId(rep.id);
                        setTimeout(() => {
                          setDownloadingId(null);
                          // Trigger actual dummy file download
                          const blob = new Blob([`Dummy ZK-Proof Telemetry Data for ${rep.name}\nGenerated on: ${new Date().toISOString()}`], { type: 'text/plain' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${rep.id}-zk-proof.txt`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        }, 1500);
                      }}
                      disabled={downloadingId === rep.id}
                      className="bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold uppercase font-mono tracking-widest text-[9px] px-3 py-2 rounded-xl transition-all border border-gray-200 dark:border-white/10 shadow-sm active:scale-95 shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {downloadingId === rep.id ? (
                        <div className="w-3 h-3 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
                      ) : (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                      {downloadingId === rep.id ? 'DL...' : 'PDF'}
                    </button>
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

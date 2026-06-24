'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function RiskMatrix() {
  const [mounted, setMounted] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: string; col: string; name: string; val: number; desc: string } | null>(null);
  const [isSettingMode, setIsSettingMode] = useState<'none' | 'likelihood' | 'risk'>('none');
  const [isolating, setIsolating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Likelihood & Consequence labels
  const likelihoods = ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'];
  const consequences = ['Very Light', 'Light', 'Medium', 'Heavy', 'Very Heavy'];

  // Matrix cell styling colors
  const DkGreen = '#15803D';
  const Green = '#16A34A';
  const Yellow = '#CA8A04';
  const Orange = '#D97706';
  const Red = '#DC2626';

  // 5x5 Matrix cells mapping corresponding to Image 7 exact grid colors and values
  const matrixCells: Record<string, Record<string, { color: string; label: string; value: number; desc: string }>> = {
    Always: {
      'Very Light': { color: Yellow, label: 'Moderate', value: 11, desc: 'Frequent tiny price shifts or mild gas fee gas spikes.' },
      Light: { color: Orange, label: 'Significant', value: 16, desc: 'Repeated liquidity lockup anomalies across newer liquidity pools.' },
      Medium: { color: Orange, label: 'Significant', value: 17, desc: 'Persistent oracle latency deviance in secondary collateral price feeds.' },
      Heavy: { color: Red, label: 'Very Significant', value: 21, desc: 'Constant active flash loan manipulation attempts targeting stable weights.' },
      'Very Heavy': { color: Red, label: 'Very Significant', value: 22, desc: 'Immediate direct token contract bytecode exploit vulnerability identified.' }
    },
    Often: {
      'Very Light': { color: Green, label: 'Minor', value: 6, desc: 'Common mild developer key actions on-chain.' },
      Light: { color: Yellow, label: 'Moderate', value: 12, desc: 'Periodic protocol slippage deviation warning limits reached.' },
      Medium: { color: Orange, label: 'Significant', value: 18, desc: 'Active multi-chain bridging downtime risks affecting redemption rates.' },
      Heavy: { color: Orange, label: 'Significant', value: 19, desc: 'Spender allowance proxy retains high limit permissions on unverified contracts.' },
      'Very Heavy': { color: Red, label: 'Very Significant', value: 23, desc: 'Major liquidity drain / creator ownership transfer precursor to rug pull.' }
    },
    Sometimes: {
      'Very Light': { color: Green, label: 'Minor', value: 7, desc: 'Intermittent block validation delays affecting transaction latency.' },
      Light: { color: Yellow, label: 'Moderate', value: 13, desc: 'Occasional collateral backing models fluctuating around target pegs.' },
      Medium: { color: Yellow, label: 'Moderate', value: 14, desc: 'Occasional high value transaction routing anomalies.' },
      Heavy: { color: Orange, label: 'Significant', value: 20, desc: 'Unsecured developer multisig threshold changes identified.' },
      'Very Heavy': { color: Orange, label: 'Significant', value: 24, desc: 'High exposure to destabilized secondary lending collateral cascades.' }
    },
    Rarely: {
      'Very Light': { color: DkGreen, label: 'Insignificant', value: 1, desc: 'Baseline normal on-chain telemetry status.' },
      Light: { color: Green, label: 'Minor', value: 8, desc: 'Isolated transaction execution reverts under heavy mempool loads.' },
      Medium: { color: Yellow, label: 'Moderate', value: 15, desc: 'Rare minor proxy upgrades called by authorized devs.' },
      Heavy: { color: Yellow, label: 'Moderate', value: 25, desc: 'Rare structural liquidations occurring during flash crashes.' },
      'Very Heavy': { color: Orange, label: 'Significant', value: 5, desc: 'Unusual external malicious address scanner signals flagged.' }
    },
    Never: {
      'Very Light': { color: DkGreen, label: 'Insignificant', value: 2, desc: 'Zero exposure nominal baseline state.' },
      Light: { color: DkGreen, label: 'Insignificant', value: 3, desc: 'Ideal standard router approval security parameters.' },
      Medium: { color: Green, label: 'Minor', value: 9, desc: 'Occasional nominal testing script smart contract calls.' },
      Heavy: { color: Green, label: 'Minor', value: 10, desc: 'Minor isolated gas anomalies with zero risk vectors.' },
      'Very Light ': { color: Yellow, label: 'Moderate', value: 4, desc: 'Extremely rare proxy migrations on audited stable versions.' }, // fallback key
      'Very Heavy': { color: Yellow, label: 'Moderate', value: 4, desc: 'Extremely rare proxy migrations on audited stable versions.' }
    }
  };

  const handleCellClick = (row: string, col: string) => {
    const cell = matrixCells[row]?.[col];
    if (cell) {
      setSelectedCell({
        row,
        col,
        name: cell.label,
        val: cell.value,
        desc: cell.desc
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header Strip with Action buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Risk Matrix</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mt-1">Consequence vs Likelihood Telemetry Matrix</p>
            </div>

            <div className="flex gap-3">
              <button className="bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-widest px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Table View
              </button>
              <button 
                onClick={() => setIsSettingMode(isSettingMode === 'likelihood' ? 'none' : 'likelihood')}
                className={`${isSettingMode === 'likelihood' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-md active:scale-95`}
              >
                Set Likelihood
              </button>
              <button 
                onClick={() => setIsSettingMode(isSettingMode === 'risk' ? 'none' : 'risk')}
                className={`${isSettingMode === 'risk' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-md active:scale-95`}
              >
                Set Risk Level
              </button>
            </div>
          </div>

          {isSettingMode !== 'none' && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-4 rounded-2xl text-xs font-mono flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0"></span>
              {isSettingMode === 'likelihood' ? 'Select a row to calibrate likelihood weights.' : 'Select a cell to override risk scoring algorithm.'}
            </div>
          )}

          {/* Interactive risk grid layout */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* 5x5 Grid matrix (X, Y labels included) */}
            <div className="flex-1 flex flex-col min-w-0">
              
              {/* Y Axis Label and grid area */}
              <div className="flex-1 flex items-stretch">
                
                {/* Left Y Axis Label (Vertical layout) */}
                <div className="w-10 flex flex-col justify-center items-center relative shrink-0">
                  <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase text-gray-400 rotate-270 absolute">
                    Likelihood (Probability)
                  </span>
                </div>

                {/* Y Axis Labels + Grid mapping */}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  
                  {/* Grid Rows */}
                  {likelihoods.map((row) => (
                    <div key={row} className="flex gap-1 items-stretch min-h-[72px]">
                      
                      {/* Row Label (left) */}
                      <div className="w-20 pr-3 flex items-center justify-end font-mono text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase select-none">
                        {row}
                      </div>

                      {/* 5 Cells in this row */}
                      {consequences.map((col) => {
                        const cell = matrixCells[row]?.[col] || { color: '#CBD5E1', label: 'N/A', value: 0 };
                        return (
                          <motion.div
                            key={col}
                            onClick={() => handleCellClick(row, col)}
                            whileHover={{ scale: 1.03 }}
                            className="flex-1 rounded-xl p-3 text-white cursor-pointer select-none flex flex-col justify-between transition-shadow relative overflow-hidden active:scale-97 shadow-sm hover:shadow-md"
                            style={{ backgroundColor: cell.color }}
                          >
                            <span className="text-[12px] font-extrabold tracking-tight block truncate">
                              {cell.label}
                            </span>
                            <span className="text-[10px] opacity-90 font-mono font-bold self-end mt-2">
                              Val: {cell.value}
                            </span>
                          </motion.div>
                        );
                      })}

                    </div>
                  ))}

                </div>

              </div>

              {/* Bottom X Axis Consequence Labels */}
              <div className="h-10 mt-2 flex items-stretch select-none">
                <div className="w-30 shrink-0"></div> {/* spacer */}
                <div className="flex-1 flex gap-1">
                  {consequences.map((col) => (
                    <div key={col} className="flex-1 text-center font-mono text-[10px] font-bold text-gray-500 uppercase pt-2">
                      {col}
                    </div>
                  ))}
                </div>
              </div>

              {/* X Axis Label */}
              <div className="text-center font-mono text-[10px] font-extrabold tracking-widest uppercase text-gray-400 mt-2">
                Consequence (Severity Impact)
              </div>

            </div>

            {/* Matrix click tooltip / description card panel */}
            <div className="w-full lg:w-80 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-inner shrink-0 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block">
                  [ MATRIX EXPLAINER ]
                </span>

                <AnimatePresence mode="wait">
                  {selectedCell ? (
                    <motion.div
                      key={`${selectedCell.row}-${selectedCell.col}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-white/10">
                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase">
                          {selectedCell.name}
                        </h4>
                        <span className="bg-gray-900 dark:bg-black text-white font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
                          Val: {selectedCell.val}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono font-semibold text-gray-500 uppercase">
                        <div>
                          <span className="block text-gray-400 font-normal">Likelihood:</span>
                          <span className="text-gray-700">{selectedCell.row}</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 font-normal">Consequence:</span>
                          <span className="text-gray-700">{selectedCell.col}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-white/10 p-4 rounded-xl font-medium">
                        {selectedCell.desc}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="text-center py-10 text-gray-400 space-y-3">
                      <svg className="h-10 w-10 mx-auto opacity-40 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      <p className="text-xs">Click on any cell in the risk matrix to view its telemetry description and vulnerability profile mapping.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {selectedCell && (
                <button 
                  onClick={() => {
                    setIsolating(true);
                    setTimeout(() => setIsolating(false), 1500);
                  }}
                  disabled={isolating}
                  className={`${isolating ? 'bg-red-600' : 'bg-gray-900 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600'} text-white font-bold text-xs uppercase tracking-widest w-full py-3 rounded-xl transition-all shadow-md active:scale-95 font-mono disabled:opacity-50`}
                >
                  {isolating ? 'ISOLATING...' : 'Isolate Exposure'}
                </button>
              )}

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

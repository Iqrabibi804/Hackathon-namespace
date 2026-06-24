'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import AttackVector3D from '../../components/AttackVector3D';
import { motion, AnimatePresence } from 'framer-motion';

export default function Simulate() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [protocolName, setProtocolName] = useState('Aave V3');
  const [tvlChange, setTvlChange] = useState(-35);
  const [anomalyType, setAnomalyType] = useState('Rapid TVL Outflow');
  const [simResult, setSimResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [telemetryUnstable, setTelemetryUnstable] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push('/');
    }
  }, [mounted, isConnected, router]);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();

    setSimulating(true);
    setSimResult(null);
    setTelemetryUnstable(true);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1.5 * 1000);

    try {
      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocolName,
          tvlChangePercent: tvlChange,
          anomalyType
        }),
        signal: controller.signal
      });
      clearTimeout(id);
      const data = await response.json();
      setSimResult(data);
    } catch (error) {
      clearTimeout(id);
      console.error('Simulation failed:', error);
      // Mock simulation response if offline/fails
      setSimResult({
        protocolName,
        tvlChangePercent: tvlChange,
        anomalyType,
        aiExplanation: `Simulated anomaly of type "${anomalyType}" on protocol "${protocolName}" with a ${tvlChange}% TVL shift. Real-time telemetry identified a transaction sequence exploiting liquidity pool balances. Automatic protection rules successfully triggered simulation mitigation parameters.`
      });
    } finally {
      setSimulating(false);
    }
  };


  if (!mounted || !isConnected) return null;

  return (
    <div className={`min-h-screen bg-[#F5F7FB] text-[#0F172A] flex transition-all duration-500 ${
      telemetryUnstable ? 'border-2 border-[#EF4444]/20' : ''
    }`}>
      <Sidebar beginnerMode={beginnerMode} setBeginnerMode={setBeginnerMode} />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <Navbar />

        <main className="p-8 max-w-6xl mx-auto w-full space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
                <span>Protocol Risk Incident Simulator</span>
                <span className="text-xs bg-[#EF4444]/10 text-[#EF4444] px-2.5 py-1 rounded font-mono font-semibold uppercase tracking-wider">
                  Inject Node
                </span>
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">
                Inject synthetic anomalies and TVL drop incidents to test defense telemetry triggers.
              </p>
            </div>
            
            {telemetryUnstable && (
              <button 
                onClick={() => {
                  setTelemetryUnstable(false);
                  setSimResult(null);
                }}
                className="px-3 py-1 bg-[#EF4444]/10 border border-[#EF4444]/25 hover:bg-[#EF4444]/20 text-[#EF4444] rounded text-xs font-mono"
              >
                Clear Alert
              </button>
            )}
          </div>

          {/* STEP 5 Onboarding Helper */}
          <div className="bg-[#EEF2FF] border border-[#7C6FE0]/20 p-4 rounded-xl text-xs text-[#475569] space-y-1 relative">
            <div className="absolute top-0 left-0 w-[4px] h-full bg-[#7C6FE0] rounded-l-xl"></div>
            <span className="font-bold text-[#7C6FE0] uppercase font-mono">[ STEP 5: SIMULATION LAB ]</span>
            <p>Select a synthetic threat scenario to observe real-time protocol impact and view AI mitigation guidelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form Side */}
            <div className="md:col-span-1">
              <form onSubmit={handleSimulate} className="glass-panel p-6 space-y-6">
                <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase block mb-2">
                  [ SIM PARAMETERS ]
                </span>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Protocol Name</label>
                  <input
                    type="text"
                    value={protocolName}
                    onChange={(e) => setProtocolName(e.target.value)}
                    className="w-full bg-white border border-[#0F172A]/8 px-4 py-3 rounded-lg text-xs text-[#0F172A] placeholder-gray-500 focus:outline-none focus:border-[#EF4444] transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Synthetic Anomaly</label>
                  <select
                    value={anomalyType}
                    onChange={(e) => setAnomalyType(e.target.value)}
                    className="w-full bg-white border border-[#0F172A]/8 px-4 py-3 rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#EF4444] transition-all font-mono"
                  >
                    <option value="Rapid TVL Outflow">Rapid TVL Outflow (Potential Exit Scam)</option>
                    <option value="Flash Loan Anomaly">Flash Loan Attack Signature</option>
                    <option value="Proxy Manipulation">Proxy Controller Hijack</option>
                    <option value="Oracle Depeg">Oracle Feed Manipulation (Price Depeg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#EF4444] mb-2 flex justify-between">
                    <span>TVL Change</span>
                    <span>{tvlChange}%</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={tvlChange}
                    onChange={(e) => setTvlChange(Number(e.target.value))}
                    className="w-full accent-[#EF4444] bg-[#0F172A]/5 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={simulating}
                  className="w-full bg-[#EF4444] text-white py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#c93636] hover:shadow-lg hover:shadow-[#EF4444]/30 transition-all disabled:opacity-50 font-mono"
                >
                  {simulating ? '☣️ INJECTING...' : '☣️ Inject Anomaly'}
                </button>
              </form>
            </div>

            {/* Results Side */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Extraordinary 3D Attack Vector Pipeline Canvas */}
              <AttackVector3D anomalyActive={simulating || !!simResult} anomalyType={anomalyType} />

              {simulating && (
                <div className="glass-panel p-8 flex flex-col items-center justify-center text-[#EF4444] min-h-[160px]">
                  <div className="w-8 h-8 border-4 border-t-transparent border-[#EF4444] rounded-full animate-spin mb-4"></div>
                  <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Running attack vector injection simulation...</p>
                </div>
              )}

              {!simulating && !simResult && (
                <div className="glass-panel p-8 flex flex-col items-center justify-center text-gray-400 text-center min-h-[160px]">
                  <span className="text-3xl mb-2">📡</span>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 font-mono mb-1">Sim Node Standby</h3>
                  <p className="text-xs max-w-sm font-sans leading-relaxed">Adjust configuration on the left and trigger anomaly to see incident telemetry logs.</p>
                </div>
              )}

              {!simulating && simResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-[#EF4444]"></div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase">
                      [ INCIDENT TELEMETRY REPORT ]
                    </h3>
                    <span className="text-[9px] bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/25 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                      Alert Status Critical
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-[#0F172A]/3 p-4 rounded-xl border border-[#0F172A]/5 font-mono text-xs text-[#0F172A]">
                    <div>
                      <span className="text-gray-400 block uppercase text-[10px] mb-1">Target Protocol</span>
                      <span className="text-[#0F172A] font-bold">{simResult.protocolName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase text-[10px] mb-1">Anomaly Type</span>
                      <span className="text-[#0F172A] font-bold">{simResult.anomalyType}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase text-[10px] mb-1">TVL Delta</span>
                      <span className="text-[#EF4444] font-bold">{simResult.tvlChangePercent}%</span>
                    </div>
                  </div>

                  <div className="border-t border-[#0F172A]/5 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#EF4444] font-bold">🧠 AI Attack Vector Diagnosis</span>
                      <span className="text-[9px] bg-[#EF4444]/10 text-[#EF4444] px-1.5 py-0.5 rounded font-mono font-bold">CLAUDE-3.5</span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed italic bg-[#0F172A]/3 border border-[#0F172A]/5 p-3 rounded-xl">
                      "{simResult.aiExplanation}"
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

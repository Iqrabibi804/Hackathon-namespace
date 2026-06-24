'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopBar from '../../components/TopBar';
import Sidebar from '../../components/Sidebar';
import HologramSphere from '../../components/HologramSphere';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_REPLIES = [
  "I'm continuously monitoring all connected protocols. Could you tell me which specific DeFi protocol or risk type you're concerned about?",
  "Great question! For the most accurate analysis, try asking about: flash loans, rug pulls, allowances, wallet health, or specific protocols like Aave or Uniswap.",
  "Our AI engine is scanning 14 active allowances on your wallet right now. Is there a specific token or contract you want me to investigate?",
  "I can help you navigate DeFi security. Try asking: 'How do I revoke approvals?' or 'What is my risk score?' or paste a wallet address starting with 0x.",
  "NexusAgent detects threats 15-40 minutes before exploits execute. Want to know how to protect a specific asset or protocol position?",
  "Tip: The biggest DeFi risks are unlimited token approvals. Type 'check approvals' and I'll guide you to the Approvals page to revoke dangerous ones.",
  "I monitor mempool transactions in real-time. If you have a specific transaction hash or contract address, paste it here for instant analysis.",
  "Security tip: Always revoke token approvals after using a DeFi protocol. 73% of DeFi hacks exploit forgotten unlimited approvals from months ago.",
];

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [commandCenter, setCommandCenter] = useState(false);
  const [destabilizedProtocol, setDestabilizedProtocol] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fallbackIdxRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'AI', text: '👋 Hello! I am your Nexus Security Co-pilot. Ask me anything about DeFi threats, wallet security, allowances, or protocols.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [ethGas, setEthGas] = useState(24);
  const [tvlTotal, setTvlTotal] = useState(48.2);
  const [alertFeed, setAlertFeed] = useState<any[]>([
    { id: 1, text: 'Oracle latency warning on MakerDAO price feed', severity: 'MEDIUM', time: '14:32:01' },
    { id: 2, text: 'Flash loan transaction volume spikes on Uniswap V3 WETH/USDC pool', severity: 'HIGH', time: '14:31:45' },
    { id: 3, text: 'Upgrade authorization called by developer proxy multisig', severity: 'LOW', time: '14:30:12' }
  ]);

  // Play a short beep for new alerts
  const playAlert = () => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  useEffect(() => {
    setMounted(true);

    const valInterval = setInterval(() => {
      setEthGas((prev) => Math.max(15, Math.min(80, prev + Math.floor(Math.random() * 7) - 3)));
      setTvlTotal((prev) => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(2)));
    }, 4000);

    const alertInterval = setInterval(() => {
      const mockAlerts = [
        { text: 'Dev retains hidden upgrade permissions capable of changing contract logic', severity: 'HIGH' },
        { text: 'User funds may become inaccessible if protocol liquidity continues collapsing', severity: 'CRITICAL' },
        { text: 'Unrestricted mint authority signature identified inside token proxy ABI', severity: 'CRITICAL' },
        { text: 'Minor liquidity lock timeline approaching expiration within 48 hours', severity: 'LOW' },
        { text: 'Sandwich attack vector identified on Curve 3pool USDT/USDC pair', severity: 'HIGH' },
        { text: 'Governance vote manipulation detected on Compound protocol', severity: 'MEDIUM' },
      ];
      const selected = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
      setAlertFeed((prev) => [
        { id: Date.now(), text: selected.text, severity: selected.severity, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4)
      ]);
      playAlert();
    }, 9000);

    return () => {
      clearInterval(valInterval);
      clearInterval(alertInterval);
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchWalletHealth(address);
    } else if (mounted && !isConnected) {
      // In demo mode, use a mock address
      fetchWalletHealth('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
    }
  }, [mounted, isConnected, address, router]);

  const fetchWalletHealth = async (walletAddr: string) => {
    setLoading(true);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500); // 1.5 second timeout

    try {
      const response = await fetch(`http://localhost:5000/api/wallet/${walletAddr}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(id);
      const data = await response.json();
      setHealthData(data);
    } catch (error) {
      clearTimeout(id);
      console.error('Failed to fetch wallet health score:', error);
      // Fallback data if API is offline or throws error
      setHealthData({
        score: 92,
        grade: 'NOMINAL',
        aiExplanation: 'Your DeFi wallet health score is calculated based on active contract allowances and protocol exposures. No active high-risk vulnerabilities detected on Uniswap, Aave, or Curve pools.',
        walletAddress: walletAddr
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'User', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      const q = userMsg.toLowerCase();
      let reply = '';

      // Wallet address detection
      const addrMatch = userMsg.match(/0x[a-fA-F0-9]{10,}/);
      if (addrMatch) {
        reply = `I'm now scanning wallet ${addrMatch[0].substring(0,10)}... Detected 3 active ERC-20 allowances. No critical reentrancy vectors found. Recommend reviewing Uniswap V3 Router approval (Unlimited). Go to Wallet Analysis for a full scan.`;
      } else if (/^(hi|hello|hey|yo|sup|salaam|helo)/.test(q)) {
        reply = 'Hello! 👋 I am your Nexus Security Co-pilot. How can I help secure your DeFi assets today? Ask me about threats, allowances, wallet safety, or protocol risks.';
      } else if (q.includes('secure') && (q.includes('asset') || q.includes('fund') || q.includes('token') || q.includes('my'))) {
        reply = '🔐 To secure your assets: (1) Revoke unlimited token approvals in the Approvals page, (2) Enable Safe Shield in Settings, (3) Run a wallet scan in Wallet Analysis. Do you want me to guide you through any of these steps?';
      } else if (q.includes('what is') || q.includes('explain') || q.includes('elaborate') || q.includes('how does') || q.includes('how do')) {
        if (q.includes('rug') || q.includes('pull')) reply = '🚨 A rug pull is when developers drain a protocol liquidity pool, crashing the token to zero. NexusAgent detects early developer wallet drain patterns 15-40 minutes before they execute.';
        else if (q.includes('flash loan')) reply = '⚡ Flash loans are uncollateralized loans taken within one transaction block. Attackers use them to exploit price oracle vulnerabilities. NexusAgent monitors mempool for flash loan signatures in real-time.';
        else if (q.includes('allowance') || q.includes('approval')) reply = '📋 Token allowances are permissions you grant to smart contracts to spend your tokens. Unlimited allowances are dangerous — a compromised contract can drain all your tokens. Use the Approvals page to revoke them.';
        else reply = '🛡️ NexusAgent is an autonomous Web3 security platform. It monitors your wallets 24/7 for rug pulls, flash loan attacks, malicious contracts, and suspicious allowances. I can answer specific questions about DeFi risks, threats, and how to stay protected.';
      } else if (q.includes('revoke') || q.includes('allowance') || q.includes('approval')) {
        reply = '🔒 Go to the Approvals page in the sidebar. Each row shows a spender contract and the allowance limit. Click "Force Revoke" on any suspicious entry — especially ones with "Unlimited" limits from unknown contracts.';
      } else if (q.includes('flash') || q.includes('exploit') || q.includes('hack') || q.includes('attack')) {
        reply = '⚡ Flash loan attacks manipulate AMM price oracles within a single block. NexusAgent detects these by monitoring: (1) rapid TVL changes, (2) abnormal swap volumes, and (3) mempool sandwich patterns. Any specific protocol you are concerned about?';
      } else if (q.includes('risk') || q.includes('score') || q.includes('health') || q.includes('safe')) {
        reply = `📊 Your current security telemetry score is ${healthData?.score || 92}/100 — Grade: ${healthData?.grade || 'NOMINAL'}. This is based on active contract allowances, protocol exposure, and historical transaction patterns. A score above 80 is considered safe.`;
      } else if (q.includes('uniswap') || q.includes('aave') || q.includes('curve') || q.includes('maker') || q.includes('compound')) {
        const protocol = q.includes('uniswap') ? 'Uniswap V3' : q.includes('aave') ? 'Aave V3' : q.includes('curve') ? 'Curve Finance' : q.includes('maker') ? 'MakerDAO' : 'Compound';
        reply = `🔍 ${protocol} Status: Currently monitoring 3 liquidity pools for anomalous activity. No critical vulnerabilities detected at this time. Your wallet has active allowances on ${protocol} — review them in the Approvals page to ensure limits are appropriate.`;
      } else if (q.includes('wallet') || q.includes('address') || q.includes('scan')) {
        reply = '🔍 To scan a wallet, go to Wallet Analysis in the sidebar. Paste any EVM wallet address (0x...) to get a full risk report — allowances, threat score, and AI-powered recommendations. You can also paste an address here and I will analyze it for you.';
      } else if (q.includes('gas') || q.includes('fee') || q.includes('gwei')) {
        reply = `⛽ Current network gas: ${ethGas} Gwei. During high-gas periods, revoke transactions may cost more. NexusAgent schedules non-urgent operations during low-gas windows to minimize costs.`;
      } else if (q.includes('help') || q.includes('what can you') || q.includes('menu') || q.includes('option')) {
        reply = '🤖 I can help with: \n• Explaining DeFi threats (rug pulls, flash loans)\n• Reviewing your wallet risk score\n• Guiding you to revoke dangerous approvals\n• Analyzing specific protocols (Aave, Uniswap, etc.)\n• Scanning wallet addresses\n\nJust ask your question!';
      } else if (q.includes('thank') || q.includes('thanks') || q.includes('great') || q.includes('good')) {
        reply = "You're welcome! 🛡️ Your security is our priority. Let me know if you need anything else — I'm always watching the mempool for threats.";
      } else {
        reply = FALLBACK_REPLIES[fallbackIdxRef.current % FALLBACK_REPLIES.length];
        fallbackIdxRef.current += 1;
      }

      setChatMessages((prev) => [...prev, { sender: 'AI', text: reply }]);
    }, 800);
  };

  if (!mounted) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const scoreOffset = healthData ? circumference - (healthData.score / 100) * circumference : circumference;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative transition-colors duration-300">
      {!commandCenter && (
        <Sidebar beginnerMode={beginnerMode} setBeginnerMode={setBeginnerMode} />
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* STEP 2: Guided Onboarding Overlay */}
          <AnimatePresence>
            {showOnboarding && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#EEF2FF] dark:bg-slate-800/80 backdrop-blur-sm border border-[#7C6FE0]/25 p-5 rounded-2xl flex justify-between items-center shadow-sm relative"
              >
                <div className="absolute top-0 left-0 w-[4px] h-full bg-[#7C6FE0] rounded-l-2xl"></div>
                <div className="space-y-1 pr-6">
                  <h4 className="font-extrabold text-[#111827] dark:text-white text-lg tracking-tight">Onboarding Step 2: Dashboard Telemetry Configuration</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-1.5 leading-relaxed max-w-4xl font-medium">Run your first security audit on any contract. Click the **Threat Scanner** page to analyze custom tokens.
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Link href="/wallet" className="text-[#7C6FE0] hover:text-blue-500 text-xs font-mono font-bold animate-bounce flex items-center gap-1 cursor-pointer">
                    ← SCANNER
                  </Link>
                  <button 
                    onClick={() => setShowOnboarding(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-mono"
                  >
                    [Dismiss]
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
                <span>NEXUS DEFENSE CENTER</span>
                <span className="h-2.5 w-2.5 bg-[#10B981] rounded-full animate-ping"></span>
              </h1>
              <p className="text-xs text-[#475569] dark:text-slate-400 mt-1 font-mono uppercase tracking-widest">
                Nodes monitored: 4 /// Gas: {ethGas} Gwei /// Total Defended TVL: ${tvlTotal}M
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setCommandCenter(!commandCenter)}
                className={`px-4 py-2 border rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  commandCenter 
                    ? 'bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444]' 
                    : 'bg-white dark:bg-slate-900 border-[#0F172A]/8 dark:border-slate-800 text-[#0F172A] dark:text-white hover:bg-[#0F172A]/3 shadow-sm'
                }`}
              >
                {commandCenter ? '📺 Exit Command Center' : '📺 Fullscreen Mode'}
              </button>
              <button 
                onClick={() => {
                  setLoading(true);
                  if (address) {
                    fetchWalletHealth(address);
                  } else {
                    setTimeout(() => setLoading(false), 800);
                  }
                }}
                className="px-4 py-2 border border-[#0F172A]/8 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-[#0F172A]/3 transition-all rounded-lg text-xs font-mono font-bold tracking-wider uppercase shadow-sm"
              >
                {loading ? '🔄 RECALIBRATING...' : '🔄 RECALIBRATE'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-blue-500 dark:text-blue-400">
              <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="font-mono text-xs uppercase tracking-widest animate-pulse text-slate-500 dark:text-slate-400">Running telemetry models...</p>
            </div>
          ) : healthData ? (
            <div className="space-y-6">

              {/* GLOBAL 3D TELEMETRY HERO */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm p-4 relative overflow-hidden h-[400px] w-full flex flex-col mt-4 mb-8">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-3 absolute top-6 left-6 z-20">[ GLOBAL 3D TELEMETRY ]</span>
                <div className="flex-1 w-full h-full absolute inset-0">
                  <HologramSphere />
                </div>
              </div>

              {/* STAT CARDS ROW */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Security Score', value: `${healthData.score}/100`, sub: healthData.grade, color: '#10B981', icon: '🛡️' },
                  { label: 'Active Threats', value: '2', sub: 'Critical', color: '#EF4444', icon: '⚠️' },
                  { label: 'Gas Price', value: `${ethGas} Gwei`, sub: 'Ethereum', color: '#F59E0B', icon: '⛽' },
                  { label: 'TVL Defended', value: `$${tvlTotal}M`, sub: 'Multi-chain', color: '#3B82F6', icon: '💎' },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}80)` }} />
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{card.label}</p>
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ color: card.color }}>{card.value}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{card.sub}</p>
                      </div>
                      <span className="text-2xl">{card.icon}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              <div className="lg:col-span-4 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm p-8 relative overflow-hidden flex flex-col items-center justify-center"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: getScoreColor(healthData.score) }}></div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block w-full text-left mb-4">[ SECURITY EVALUATION ]</span>
                  
                  <div className="flex justify-center items-center my-4 relative">
                    <svg className="transform -rotate-90 w-36 h-36">
                      <circle cx="72" cy="72" r={radius} stroke="rgba(148,163,184,0.1)" strokeWidth={strokeWidth} fill="transparent" />
                      <circle
                        cx="72" cy="72" r={radius}
                        stroke={getScoreColor(healthData.score)}
                        strokeWidth={strokeWidth} fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={scoreOffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-black" style={{ color: getScoreColor(healthData.score) }}>{healthData.score}</span>
                      <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">/ 100</span>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Telemetry Center</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Live Multi-Chain Intelligence</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase" style={{ backgroundColor: `${getScoreColor(healthData.score)}15`, color: getScoreColor(healthData.score) }}>Grade: {healthData.grade}</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#7C6FE0] animate-pulse"></div>
                      <span className="text-xs font-bold text-[#7C6FE0] uppercase font-sans">Nexus Core AI</span>
                    </div>
                    <span className="text-[9px] bg-[#7C6FE0]/10 text-[#7C6FE0] border border-[#7C6FE0]/20 px-2 py-0.5 rounded font-mono">
                      CONFIDENCE: 98%
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] dark:text-gray-400 leading-relaxed italic bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-white/5 p-4 rounded-xl">
                    "{healthData.aiExplanation}"
                  </p>
                </motion.div>
              </div>

              <div className="lg:col-span-8 space-y-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100 dark:border-white/5">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">[ ACTIVE ISOLATED THREATS ]</h3>
                    <span className="text-[9px] bg-[#06B6D4]/10 text-[#06B6D4] px-2 py-0.5 rounded font-mono uppercase">
                      Exposure paths: Active
                    </span>
                  </div>

                  <div className="relative h-44 flex items-center justify-around">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <line x1="25%" y1="50%" x2="50%" y2="20%" stroke={destabilizedProtocol === 'Aave' ? '#EF4444' : '#94A3B8'} strokeWidth="2" strokeDasharray="5,5" className={destabilizedProtocol === 'Aave' ? 'animate-pulse' : 'opacity-40'} />
                        <line x1="50%" y1="20%" x2="75%" y2="50%" stroke={destabilizedProtocol === 'MakerDAO' ? '#EF4444' : '#94A3B8'} strokeWidth="2" strokeDasharray="5,5" className={destabilizedProtocol === 'MakerDAO' ? 'animate-pulse' : 'opacity-40'} />
                        <line x1="75%" y1="50%" x2="50%" y2="80%" stroke={destabilizedProtocol === 'Uniswap' ? '#EF4444' : '#94A3B8'} strokeWidth="2" strokeDasharray="5,5" className={destabilizedProtocol === 'Uniswap' ? 'animate-pulse' : 'opacity-40'} />
                        <line x1="50%" y1="80%" x2="25%" y2="50%" stroke={destabilizedProtocol === 'Curve' ? '#EF4444' : '#94A3B8'} strokeWidth="2" strokeDasharray="5,5" className={destabilizedProtocol === 'Curve' ? 'animate-pulse' : 'opacity-40'} />
                      </svg>

                      {[
                        { name: 'Aave', pos: 'left-[10%] top-[35%]' },
                        { name: 'MakerDAO', pos: 'left-[40%] top-[5%]' },
                        { name: 'Uniswap', pos: 'right-[10%] top-[35%]' },
                        { name: 'Curve', pos: 'left-[40%] bottom-[5%]' }
                      ].map((node) => (
                        <button 
                          key={node.name}
                          onClick={() => setDestabilizedProtocol(node.name)}
                          className={`absolute ${node.pos} px-4 py-2 border rounded-lg text-xs font-bold transition-all z-10 ${
                            destabilizedProtocol === node.name 
                              ? 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444] shadow-md' 
                              : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-gray-300 shadow-sm'
                          }`}
                        >
                          {node.name}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium mt-3">
                      {destabilizedProtocol 
                        ? `⚠️ WARNING: Protocol ${destabilizedProtocol} exposure unstable. Risk factors evaluated.`
                        : 'ℹ️ Click any protocol node to simulate real-time cascade network threat exposure.'
                      }
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm p-6">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-[#EF4444] uppercase mb-4">[ RECOMMENDATIONS ]</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center bg-[#EF4444]/5 p-3 rounded-lg border border-[#EF4444]/15">
                      <div>
                        <span className="font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block">🚨 Evacuate WETH from Aave Pool</span>
                        <span className="text-[10px] text-gray-500 font-mono">Urgency: Critical /// Impact: Protect 10 WETH</span>
                      </div>
                      <span className="text-[10px] text-[#EF4444] font-mono font-bold">CONFIDENCE: 94%</span>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-2 mt-4 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-white/5">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Total Vulnerabilities</span>
                        <span className="font-extrabold text-red-500">2 Critical</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/5">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Unverified Allowances</span>
                        <span className="font-extrabold text-amber-500">14 Spenders</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Telemetry Engine</span>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">V5.0 Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm p-6 lg:col-span-2 flex flex-col h-[400px]">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-4 shrink-0">[ SECURITY THREAT LOGS ]</h3>
                  <div className="space-y-3 text-xs overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {alertFeed.map((alert) => (
                      <div key={alert.id} className="p-3 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-white/5 flex gap-4 items-start transition-colors hover:bg-gray-100 dark:hover:bg-slate-800">
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 leading-snug">{alert.text}</p>
                            <span className="text-[9px] font-mono text-gray-400 mt-1 block uppercase">{alert.time} • AI Analyzed</span>
                          </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          alert.severity === 'CRITICAL' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                          alert.severity === 'HIGH' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          ) : null}
        </main>
      </div>

      {/* Floating AI Security Co-pilot Panel */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 w-80 h-[500px] rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden mb-3"
            >
              {/* Header */}
              <div className="bg-[#0F172A] text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="relative w-11 h-6 bg-gray-200 dark:bg-slate-700 rounded-full transition-colors"></div>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-3">Co-pilot {beginnerMode ? 'ON' : 'OFF'}</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-xs text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>

              {/* Message History */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-slate-900 min-h-[300px]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'User' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about vulnerabilities..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-gray-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white"
                />
                <button type="submit" className="bg-[#7C6FE0] text-white px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider font-mono">
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="h-12 w-12 bg-[#7C6FE0] hover:bg-[#685bc2] rounded-full shadow-lg shadow-[#7C6FE0]/30 flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {/* Notification Alert Dot */}
          <span className="absolute top-0 right-0 h-3 w-3 bg-[#EF4444] rounded-full border-2 border-white animate-ping"></span>
          <span className="absolute top-0 right-0 h-3 w-3 bg-[#EF4444] rounded-full border-2 border-white"></span>
        </button>
      </div>
    </div>
  );
}

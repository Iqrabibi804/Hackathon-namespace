'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import HologramSphere from '../components/HologramSphere';
import ThreatGlobe3D from '../components/ThreatGlobe3D';
import Volumetric3DHeroScene from '../components/Volumetric3DHeroScene';
import SecurityShield3D from '../components/SecurityShield3D';
import Cinematic3DLoadingScene from '../components/Cinematic3DLoadingScene';
import Reference1Showcase from '../components/Reference1Showcase';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';

// Inline Custom SVG Icons to remove lucide-react dependency and prevent compile errors
const Shield = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const Zap = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const Radar = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="12" x2="12.01" y2="12" />
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 6a6 6 0 1 0 6 6" />
    <path d="M12 10a2 2 0 1 0 2 2" />
  </svg>
);

const Brain = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const ShieldCheck = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11 11 13 15 9" />
  </svg>
);

const GitBranch = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const TrendingDown = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const Wallet = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const Scan = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
  </svg>
);

const MessageCircle = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const ChevronDown = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUp = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export default function Home() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // SECTION 1: Loading Screen states
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);

  // SECTION 8: Interactive Workflow state
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // SECTION 9: Live Threat Simulation states
  const [activeSimulationAttack, setActiveSimulationAttack] = useState(null);
  const [simulationConsole, setSimulationConsole] = useState([
    'SYSTEM: Telemetry nodes initialized. Awaiting trigger signal...'
  ]);

  // SECTION 10: Interactive Wallet Demo states
  const [demoAddress, setDemoAddress] = useState('');
  const [demoStep, setDemoStep] = useState(0);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoTxCount, setDemoTxCount] = useState(0);
  const [demoScore, setDemoScore] = useState(0);
  const [demoResult, setDemoResult] = useState(null);

  // SECTION 11: AI Explainability Core states
  const [activeCoreTab, setActiveCoreTab] = useState('flash');
  const [coreTypewriterText, setCoreTypewriterText] = useState('');
  const coreWaveformRef = useRef(null);

  // SECTION 12: Dashboard Mock Alerts
  const [dashboardAlerts, setDashboardAlerts] = useState([
    'Approved Uniswap V3 Router spending limit on WETH.',
    'Wallet risk rating recalibrated to low risk.',
    'System synced with block #19,847,300.'
  ]);

  // SECTION 13: Developer SDK Code Tab
  const [sdkTab, setSdkTab] = useState('js');

  // SECTION 14: Pricing Toggle and checkout states
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Custom states for Starter / Enterprise forms & fallback simulation
  const [mockPaymentActive, setMockPaymentActive] = useState(false);
  const [mockPaymentStep, setMockPaymentStep] = useState('idle');
  const [enterpriseEmail, setEnterpriseEmail] = useState('');
  const [enterpriseCompany, setEnterpriseCompany] = useState('');
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);

  const startMockPayment = () => {
    setMockPaymentActive(true);
    setMockPaymentStep('pending');
    setTimeout(() => {
      setMockPaymentStep('confirming');
    }, 1000);
    setTimeout(() => {
      setMockPaymentStep('confirmed');
    }, 2500);
  };

  // SECTION 16: FAQ Accordion open index
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Real Wagmi Send Transaction hook
  const { sendTransaction, data: txHash, error: txError, isPending: txPending, reset: resetTx } = useSendTransaction();

  // Watch block confirmations in real-time
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Loading timer sequence (Section 1)
  useEffect(() => {
    setMounted(true);
    if (booting) {
      const timers = [
        setTimeout(() => setBootStep(1), 500),
        setTimeout(() => setBootStep(2), 1000),
        setTimeout(() => setBootStep(3), 1500),
        setTimeout(() => setBooting(false), 2200)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [booting]);

  // Redirect to Dashboard if connected (unless checkout is active)
  useEffect(() => {
    // Disabled auto-redirect to allow connected users to browse landing page details and pricing tiers.
    // They can navigate via the "Launch App" button in the navigation header.
  }, [mounted, booting, isConnected, router, selectedPlan]);

  // AI Explainability Core Typewriter effect + Waveform
  useEffect(() => {
    let index = 0;
    const textMap = {
      flash: 'A flash loan was initiated borrowing $2.3M USDC from Aave Protocol. Exploit signature: reentrancy vector targeting liquidity pools. Target isolated.',
      rug: 'Early developer liquidity withdrawal pattern identified. Creator wallet transfer of ownership triggers 94% risk flag. Revoking approval recommended.',
      whale: 'Sudden high-volume transaction routing through decentralized pools. 84,000 token liquidity swap detected. Position slippage alert active.',
      depeg: 'Stablecoin collateral backing model deviated by 4.2%. Telemetry monitoring peg ratio. Auto-redeem safe assets triggered.'
    };
    const activeText = textMap[activeCoreTab];
    setCoreTypewriterText('');

    const interval = setInterval(() => {
      setCoreTypewriterText((prev) => prev + activeText.charAt(index));
      index++;
      if (index >= activeText.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [activeCoreTab]);

  // AI Explainability Canvas Sine Wave
  useEffect(() => {
    const canvas = coreWaveformRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let angle = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'url(#wave-grad)';
      ctx.lineWidth = 2.5;
      
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, '#7C6FE0');
      grad.addColorStop(1, '#06B6D4');
      ctx.strokeStyle = grad;

      ctx.beginPath();
      for (let x = 0; x <= canvas.width - 1; x++) {
        const amplitude = activeSimulationAttack ? 25 : 12; // Amplified during attack
        const y = canvas.height / 2 + Math.sin(x * 0.03 + angle) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      angle += 0.08;
      frameId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(frameId);
  }, [activeSimulationAttack]);

  // Dashboard Auto-scrolling mock alerts (Section 12)
  useEffect(() => {
    const interval = setInterval(() => {
      const liveAlerts = [
        'Detected flash loan call to contract 0x7c...1f.',
        'Analyzing smart contract bytecode size parameters...',
        'Blocked spender allowance authorization limit.',
        'Synchronized telemetry node network latency check: 14ms.',
        'Mempool analysis: Reentrancy check status: CLEAR.'
      ];
      const randomAlert = liveAlerts[Math.floor(Math.random() * liveAlerts.length)];
      setDashboardAlerts(prev => [randomAlert, ...prev.slice(0, 2)]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Section 9: Click triggers for Simulation
  const triggerSimulation = (type: string) => {
    setActiveSimulationAttack(type);
    const messages = {
      flash: [
        'TELEMETRY: Mempool scanned block #19,847,301.',
        'DETECTED: Flash loan signature borrowing 4,500,000 USDC.',
        'ANALYZING: Running execution simulation on Aave V3 pools...',
        'SHIELD ACTIVE: Reentrancy trace blocked at offset 0x4B. Treasury SECURED!'
      ],
      rug: [
        'TELEMETRY: Listening to deployer wallet actions...',
        'ALERT: Owner revoked proxy ownership to unverified contract.',
        'WARNING: Creator removing LP pool balances in single transaction.',
        'SHIELD ACTIVE: Automatic alert sent to Connected Wallets. Action isolated!'
      ],
      depeg: [
        'TELEMETRY: Collateral index calculation active.',
        'ALERT: Secondary stablecoin reserve ratio dropped below 0.96.',
        'WARNING: Depeg confidence index 92%. Liquidity withdrawal proposed.',
        'SHIELD ACTIVE: Safety threshold triggered. Withdrawals routed nominal.'
      ],
      whale: [
        'TELEMETRY: Analyzing whale wallets on Uniswap V3 pools...',
        'ALERT: Wallet 0x8a...4b swapping 45,000 ETH for stable reserves.',
        'WARNING: Projected slippage threshold exceeded by 3.2%.',
        'SHIELD ACTIVE: Swap router liquidity warnings active.'
      ]
    };
    
    setSimulationConsole([
      `SYSTEM: Initializing ${type.toUpperCase()} attack vector...`,
      ...messages[type as keyof typeof messages]
    ]);
  };

  // Section 10: Wallet Sandbox scan trigger
  const runDemoScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoAddress) return;
    setDemoStep(1); // progress step 1
    setDemoProgress(20);
    setDemoTxCount(0);
    setDemoScore(0);
    setDemoResult(null);

    // Timeline steps simulate scanning
    setTimeout(() => {
      setDemoStep(2);
      setDemoProgress(40);
      setDemoTxCount(240);
    }, 600);

    setTimeout(() => {
      setDemoStep(3);
      setDemoProgress(65);
      setDemoTxCount(590);
    }, 1100);

    setTimeout(() => {
      setDemoStep(4);
      setDemoProgress(85);
      setDemoTxCount(847);
    }, 1600);

    setTimeout(() => {
      setDemoStep(5);
      setDemoProgress(100);
      const score = demoAddress.toLowerCase().endsWith('a') || demoAddress.toLowerCase().endsWith('8') ? 34 : 92;
      setDemoScore(score);
      setDemoResult({
        score,
        status: score <= 49 ? 'HIGH RISK DETECTED' : 'EXCELLENT INTEGRITY',
        reason: score <= 49 
          ? 'Unprotected high-limit allowance authorization granted to unverified proxy contract 0x7c...88a.' 
          : 'Zero suspicious smart contract access approvals or reentrancy exposures found.'
      });
    }, 2200);
  };

  const startCheckout = (planName: string) => {
    resetTx();
    setMockPaymentActive(false);
    setMockPaymentStep('idle');
    setEnterpriseSubmitted(false);
    setEnterpriseEmail('');
    setEnterpriseCompany('');
    setSelectedPlan(planName);
  };

  const handleRealPayment = () => {
    if (!address) return;
    sendTransaction({
      to: address,
      value: parseEther('0.00001'),
    });
  };

  const faqItems = [
    {
      q: 'What exactly is a rug pull?',
      a: 'A rug pull is when developers withdraw all liquidity from a pool, crashing the token price to near zero. NexusAgent detects early liquidity drain patterns that precede rug pulls — typically 15–40 minutes before they execute.'
    },
    {
      q: 'How does AI explainability work?',
      a: 'Every threat alert includes a three-part explanation: (1) WHAT happened in plain English, (2) WHY it is dangerous based on historical attack signatures, and (3) WHAT action you should take next. No jargon, no guesswork.'
    },
    {
      q: 'Is my wallet actually secure with NexusAgent?',
      a: 'NexusAgent is a monitoring and alerting system — we never have access to your private keys or the ability to move funds. We connect via read-only blockchain telemetry. Think of us as a security camera, not a vault.'
    },
    {
      q: 'Can NexusAgent move my funds automatically?',
      a: 'No. We never touch your funds. NexusAgent is 100% read-only. We can alert you, notify your Telegram, and flag risks — but all transaction execution remains under your control.'
    },
    {
      q: 'How is the risk score calculated?',
      a: 'Risk scores (0–100) are generated by our AI model trained on 2.4M+ historical DeFi transactions, including 18,000+ documented exploits. We analyze 200+ signals including wallet history, protocol exposure, contract patterns, and on-chain behavior anomalies.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-x-hidden font-sans flex flex-col antialiased transition-colors duration-500">
      {/* SECTION 1 - CINEMATIC 3D CYBER LOADING SCREEN */}
      <AnimatePresence>
        {booting && (
          <motion.div 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col items-center justify-center p-8 select-none overflow-hidden"
          >
            {/* Volumetric background blur glows (Reference 1 & 2 styles) */}
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            {/* Thin background wireframe grid mesh for depth (Reference 1) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

            {/* Rotating 3D Security Shield right in the center! */}
            <div className="relative">
              <Cinematic3DLoadingScene />
            </div>

            {/* Loading text & stages */}
            <div className="max-w-md w-full text-center space-y-6 z-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-[0.35em] font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  NEXUSAGENT
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">
                  Initializing autonomous DeFi defense...
                </p>
              </div>

              {/* Dynamic checklist container with dark glassmorphism */}
              <div className="text-left bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-xl dark:shadow-2xl text-[11px] font-mono space-y-2.5 max-w-[280px] mx-auto">
                <div className="flex items-center gap-2">
                  <span className={bootStep >= 1 ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-slate-400 dark:text-slate-700'}>
                    {bootStep >= 1 ? '[✓]' : '[ ]'}
                  </span>
                  <span className={bootStep >= 1 ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                    Security Core loaded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={bootStep >= 2 ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-slate-400 dark:text-slate-700'}>
                    {bootStep >= 2 ? '[✓]' : '[ ]'}
                  </span>
                  <span className={bootStep >= 2 ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                    Threat Intelligence connected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={bootStep >= 3 ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-slate-400 dark:text-slate-700'}>
                    {bootStep >= 3 ? '[✓]' : '[ ]'}
                  </span>
                  <span className={bootStep >= 3 ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                    AI Systems online
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Landing Page View */}
      {!booting && (
        <>
          <Navbar />
          <HeroSection />

          {/* SECTION 3B — TWO DETAILED GRID CARDS (Responsive style) */}
          <section className="max-w-5xl mx-auto w-full px-6 md:px-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
            {/* Card 1: 24/7 Security Monitoring */}
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="space-y-2 text-left mb-8">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">24/7 Security Monitoring</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Advanced threat detection and real-time monitoring to keep your business safe around the clock.
                </p>
              </div>

              {/* Mock Dashboard Preview */}
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm space-y-3 font-mono text-[9px] text-left">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="font-bold text-blue-600 dark:text-cyan-400">🛡️ SYSTEM ACTIVE</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold animate-pulse">● LIVE</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between bg-white dark:bg-white/[0.02] p-1.5 rounded border border-slate-100 dark:border-transparent">
                    <span className="text-slate-600 dark:text-slate-500">01:14 Uniswap Swap</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-bold">[SECURED]</span>
                  </div>
                  <div className="flex justify-between bg-red-50 dark:bg-red-950/20 p-1.5 rounded border border-red-100 dark:border-transparent">
                    <span className="text-red-500 dark:text-red-400">01:09 Phishing Spender</span>
                    <span className="text-red-600 dark:text-red-500 font-bold">[REVOKED]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: User Roles & Access */}
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="space-y-2 text-left mb-8">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">User Roles & Access</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Define clear access levels for Admins, Teams, and Members. Add, edit, or deactivate users with just a few clicks.
                </p>
              </div>

              {/* Mock User Management Preview */}
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm font-mono text-[9px] space-y-2.5 text-left">
                <div className="flex justify-between items-center text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[7px] pb-1 border-b border-slate-200 dark:border-white/5">
                  <span>User / Operator</span>
                  <span>Role</span>
                  <span>Status</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Alice (0x3a...8a)</span>
                  <span className="bg-blue-100 dark:bg-cyan-950/30 text-blue-600 dark:text-cyan-400 px-2 py-0.5 rounded font-bold uppercase text-[7px]">Admin</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Bob (0x7c...2c)</span>
                  <span className="bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase text-[7px]">Member</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">Active</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3C — REFERENCE 1 SHOWCASE (2026's Top AI SAS Website Builders style) */}
          <section className="max-w-5xl mx-auto w-full px-6 md:px-8 pb-16 z-10 relative">
            <Reference1Showcase />
          </section>

          {/* SECTION 4 — PROTOCOL COVERAGE STRIP */}
          <section className="bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 py-5 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 mb-3 text-center">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-semibold">
                Monitoring 40+ DeFi Protocols in Real Time
              </span>
            </div>
            <div className="flex w-[200%] gap-12 items-center select-none overflow-hidden py-1">
              <div className="flex gap-16 animate-marquee shrink-0 items-center justify-around w-full font-mono text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Uniswap</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Aave</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Compound</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Curve</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">MakerDAO</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Lido</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Balancer</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">1inch</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">dYdX</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Synthetix</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Yearn</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Convex</span>
              </div>
              <div className="flex gap-16 animate-marquee shrink-0 items-center justify-around w-full font-mono text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Uniswap</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Aave</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Compound</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Curve</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">MakerDAO</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Lido</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Balancer</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">1inch</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">dYdX</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Synthetix</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Yearn</span>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default">Convex</span>
              </div>
            </div>
          </section>

          {/* SECTION 5 — STATS / TRUST SECTION */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { val: '$4.2B+', label: 'Total Value Protected', icon: Shield },
                { val: '2.4M+', label: 'Threats Analyzed', icon: Radar },
                { val: '99.7%', label: 'Detection Accuracy', icon: Brain },
                { val: '14ms', label: 'Average Detection Time', icon: Zap }
              ].map((stat, idx) => (
                <div key={idx} className="p-8 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-slate-700/30 relative group overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <stat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-4" />
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white block">
                    {stat.val}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mt-1 block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6 — WHY NEXUSAGENT */}
          <section id="why-us" className="max-w-7xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Panel: Animated Network Graph visualization */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-black/5 rounded-3xl p-8 shadow-md dark:shadow-sm flex items-center justify-center relative overflow-hidden h-96 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7C6FE0]/10 via-transparent to-[#06B6D4]/10 dark:from-[#7C6FE0]/5 dark:to-[#06B6D4]/5"></div>
              
              {/* Custom SVG network graph representing node isolation */}
              <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="line-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop stopColor="#7C6FE0" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                {/* Node paths */}
                <line x1="100" y1="40" x2="60" y2="80" stroke="url(#line-glow)" strokeWidth="2.5" className="animate-pulse" />
                <line x1="100" y1="40" x2="140" y2="80" stroke="url(#line-glow)" strokeWidth="2.5" />
                <line x1="60" y1="80" x2="100" y2="120" stroke="url(#line-glow)" strokeWidth="2.5" />
                <line x1="140" y1="80" x2="100" y2="120" stroke="url(#line-glow)" strokeWidth="2.5" />
                <line x1="100" y1="120" x2="100" y2="160" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3" className="animate-pulse" />

                {/* Nodes */}
                <circle cx="100" cy="40" r="10" fill="#7C6FE0" />
                <circle cx="60" cy="80" r="10" fill="#06B6D4" />
                <circle cx="140" cy="80" r="10" fill="#06B6D4" />
                <circle cx="100" cy="120" r="10" fill="#7C6FE0" />
                
                {/* Danger Threat Isolated Node */}
                <circle cx="100" cy="160" r="12" fill="#EF4444" className="animate-ping" style={{ transformOrigin: '100px 160px' }} />
                <circle cx="100" cy="160" r="8" fill="#EF4444" />
                
                <text x="120" y="164" fill="#EF4444" fontSize="8" fontWeight="bold" fontFamily="monospace">THREAT ISOLATED</text>
              </svg>
            </div>

            {/* Right Feature List */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-[#7C6FE0] font-mono font-bold block">
                  LIGHTNING SECURE INFRASTRUCTURE
                </span>
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Autonomous Security Systems Built Differently.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Real-Time Threat Intelligence', desc: 'Monitor wallets and protocols for anomalies 24/7 with sub-second latency.' },
                  { name: 'AI-Powered Explainability', desc: 'Every alert includes a plain-English explanation of what happened and why.' },
                  { name: 'Autonomous Wallet Defense', desc: 'Automatic isolation and flagging — no manual intervention required.' },
                  { name: 'Rug Pull Detection', desc: 'Liquidity drain patterns identified before your funds are at risk.' },
                  { name: 'Transaction Risk Scoring', desc: 'Every transaction scored 0–100 for risk before it executes.' },
                  { name: 'Protocol Health Monitoring', desc: 'Continuous health checks across smart contracts and liquidity pools.' }
                ].map((feat, idx) => (
                  <div key={idx} className="space-y-1.5 border-l-2 border-transparent hover:border-blue-500 dark:hover:border-violet-500 pl-4 transition-all duration-300">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{feat.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed block">{feat.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7 — AI THREAT INTELLIGENCE FEATURES */}
          <section id="features" className="max-w-7xl mx-auto px-6 md:px-8 py-16 text-center">
            <div className="max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-violet-400 font-mono font-bold block">
                INTELLIGENCE LAYER
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Comprehensive Vector Shielding
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">Six layers of AI-powered defense protecting your assets 24/7</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { title: 'Flash Loan Detection', desc: 'Identify flash loan exploit patterns across 40+ protocols in real time.', icon: Zap, href: '#explainability', color: 'from-yellow-500 to-orange-500' },
                { title: 'Rug Pull Radar', desc: 'Liquidity drain detection with 94% accuracy before execution.', icon: Radar, href: '#explainability', color: 'from-red-500 to-pink-500' },
                { title: 'Wallet Behavior Analysis', desc: 'AI learns your wallet\'s normal behavior and flags deviations instantly.', icon: Brain, href: '#explainability', color: 'from-violet-500 to-purple-600' },
                { title: 'Smart Contract Audit', desc: 'Automated vulnerability scanning against 200+ known exploit signatures.', icon: ShieldCheck, href: '#explainability', color: 'from-blue-500 to-cyan-500' },
                { title: 'Stablecoin Depeg Alert', desc: 'Real-time monitoring of peg stability with early warning triggers.', icon: TrendingDown, href: '#explainability', color: 'from-emerald-500 to-teal-500' },
                { title: 'Cross-Chain Monitoring', desc: 'Unified threat view across Ethereum, Arbitrum, Polygon, Base, and more.', icon: GitBranch, href: '#why-us', color: 'from-blue-600 to-violet-600' }
              ].map((card, idx) => (
                <a key={idx} href={card.href} className="group block p-6 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                  <div className="space-y-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <span className="text-base font-bold text-slate-900 dark:text-white block">{card.title}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed block">{card.desc}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 mt-5 group-hover:gap-2 transition-all">
                    Learn more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* SECTION 8 — INTERACTIVE SECURITY WORKFLOW */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 py-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-violet-400 font-mono font-bold block">
                OPERATION WORKFLOW
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Four Steps to Absolute Defense
              </h2>
            </div>

            {/* Stepper buttons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {[
                { num: '01', title: 'Connect Wallet', desc: 'Securely link any EVM wallet. Read-only access — NexusAgent never moves funds.', icon: Wallet },
                { num: '02', title: 'Threat Analysis', desc: 'Our engine analyzes 200+ risk signals across your transaction history.', icon: Scan },
                { num: '03', title: 'AI Explains', desc: 'No jargon. Every threat explained clearly — what it is, why it matters.', icon: MessageCircle },
                { num: '04', title: 'Defend & Shield', desc: 'One-click isolation, alert routing to Telegram/Slack, and protocol blacklisting.', icon: Shield }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`p-6 rounded-2xl cursor-pointer border transition-all duration-300 relative ${
                    activeWorkflowStep === idx 
                      ? 'border-blue-500 dark:border-blue-500 bg-white dark:bg-slate-800 shadow-lg dark:shadow-blue-500/10' 
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs font-mono font-bold ${activeWorkflowStep === idx ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{step.num}</span>
                    <step.icon className={`h-4 w-4 ${activeWorkflowStep === idx ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block mb-2">{step.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block">{step.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 9 — LIVE THREAT SIMULATION */}
          <section id="simulation" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white py-16 relative overflow-hidden transition-all duration-500">
            <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left simulation controls */}
              <div className="lg:col-span-4 space-y-6 text-left">
                <span className="text-xs bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase inline-block">
                  🚨 DEFENSE CONTROL INTERFACE
                </span>
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Live Exploit Simulator
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                  Trigger mock transaction anomalies to see how NexusAgent intercept arrays decompile code blocks in milliseconds.
                </p>

                <div className="space-y-3 pt-4 font-mono">
                  {[
                    { id: 'flash', label: 'Flash Loan Reentrancy' },
                    { id: 'rug', label: 'LP Liquidity Drain (Rug)' },
                    { id: 'depeg', label: 'Collateral Peg Deficit' },
                    { id: 'whale', label: 'Extreme Pool Slippage' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => triggerSimulation(btn.id)}
                      className={`w-full text-left px-5 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider border transition-all ${
                        activeSimulationAttack === btn.id
                          ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20'
                          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10'
                      }`}
                    >
                      💥 Trigger {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center: 3D Threat Globe map */}
              <div className="lg:col-span-4 flex justify-center items-center">
                <ThreatGlobe3D activeAttack={activeSimulationAttack} />
              </div>

              {/* Right console output log */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 font-mono text-[11px] h-72 flex flex-col justify-between shadow-2xl relative">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-3">
                  <span className="text-red-500 dark:text-red-400 font-bold">● SYSTEM ALERTS</span>
                  <span className="text-slate-500 uppercase tracking-widest text-[9px]">REAL-TIME LOG</span>
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto text-left text-slate-600 dark:text-slate-300 font-mono">
                  {simulationConsole.map((log, idx) => (
                    <p key={idx} className={log.startsWith('DETECTED') || log.startsWith('ALERT') ? 'text-red-400 font-bold' : log.startsWith('SHIELD') ? 'text-emerald-400 font-bold' : ''}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 10 — INTERACTIVE WALLET DEMO */}
          <section id="demo" className="max-w-7xl mx-auto px-6 md:px-8 py-16">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-violet-400 font-mono font-bold block">
                SANDBOX SCANNER
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Try It Now — No Signup Required
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                🔒 Read-only analysis. We never store your address.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-lg transition-colors duration-500">
              <form onSubmit={runDemoScan} className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  required
                  placeholder="Enter wallet address (e.g., 0x742d...a)"
                  value={demoAddress}
                  onChange={(e) => setDemoAddress(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-3 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-inner transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="bg-blue-600 dark:bg-blue-600 text-white px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-blue-700 transition-all font-mono shadow-md hover:shadow-lg"
                >
                  Scan Wallet
                </button>
              </form>

              {/* Progress and status workflow */}
              {demoStep > 0 && (
                <div className="space-y-5 font-mono text-xs">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 dark:bg-blue-500 h-1.5 transition-all duration-500 shadow-[0_0_8px_#3b82f6]" style={{ width: `${demoProgress}%` }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left font-mono bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block uppercase text-[9px] tracking-wider mb-1">Transactions Scanned</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">{demoTxCount}+</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block uppercase text-[9px] tracking-wider mb-1">Scan Status</span>
                      <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                        {demoStep === 1 && 'Connecting...'}
                        {demoStep === 2 && 'Analyzing histories...'}
                        {demoStep === 3 && 'Checking protocols...'}
                        {demoStep === 4 && 'Generating AI report...'}
                        {demoStep === 5 && 'Scan Complete'}
                      </span>
                    </div>
                  </div>

                  {demoResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 p-6 rounded-2xl border text-left space-y-4 ${
                        demoResult.score < 50 
                          ? 'bg-red-50/50 border-red-100' 
                          : 'bg-green-50/50 border-green-100'
                      }`}
                    >
                      <div className="flex justify-between items-center font-mono">
                        <span className={`font-bold uppercase tracking-wider text-[10px] ${
                          demoResult.score < 50 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          🚨 {demoResult.status}
                        </span>
                        <span className="font-bold text-gray-600">Integrity Rating: {demoResult.score}/100</span>
                      </div>
                      <p className="text-xs text-gray-700 italic">"{demoResult.reason}"</p>
                      
                      <div className="pt-2 font-mono">
                        <a 
                          href="#pricing" 
                          className="bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors inline-block"
                        >
                          Get Full Report — Create Free Account
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 11 — AI EXPLAINABILITY — NEXUS CORE */}
          <section id="explainability" className="max-w-7xl mx-auto px-6 md:px-8 py-12">
            <div className="glass-panel p-8 bg-slate-100 dark:bg-[#0B0F19] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden transition-colors duration-500 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#7C6FE0] to-[#06B6D4]"></div>

              {/* Left Side: Waveform and indicators */}
              <div className="lg:col-span-5 flex flex-col justify-between items-center text-center space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-[#7C6FE0] font-bold w-full text-left">
                  [ PROPRIETARY INTELLIGENCE ENGINE ]
                </span>

                {/* SVG thinking orb */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute w-32 h-32 rounded-full border border-[#7C6FE0]/25 animate-spin duration-3000"></div>
                  <div className="absolute w-24 h-24 rounded-full border border-dashed border-[#06B6D4]/30 animate-spin duration-2000" style={{ animationDirection: 'reverse' }}></div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7C6FE0]/40 to-[#06B6D4]/40 blur-[8px] animate-pulse"></div>
                  <span className="absolute font-mono text-[9px] font-bold tracking-wider uppercase mt-1 text-cyan-400">NEXUS CORE</span>
                </div>

                {/* Waveform visualizer */}
                <div className="w-full space-y-2">
                  <canvas ref={coreWaveformRef} width={260} height={60} className="w-full opacity-80" />
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Core Telemetry Pulse</span>
                </div>

                {/* Status dots */}
                <div className="w-full text-left space-y-1 font-mono text-[9px] text-gray-400">
                  <div className="flex justify-between">
                    <span>● Telemetry Sync</span>
                    <span className="text-[#10B981] font-bold">ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>● Threat Models</span>
                    <span className="text-cyan-400">v4.2.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>● Confidence Engine</span>
                    <span className="text-[#10B981] font-bold">ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Tab explanations */}
              <div className="lg:col-span-7 space-y-6 text-left flex flex-col justify-between">
                <div className="flex flex-wrap gap-2 border-b border-slate-300 dark:border-white/10 pb-4 font-mono">
                  {[
                    { id: 'flash', label: 'Flash Loan Exploit' },
                    { id: 'rug', label: 'Rug Pull Backdoor' },
                    { id: 'whale', label: 'Slippage Alert' },
                    { id: 'depeg', label: 'Collateral Peg Risk' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCoreTab(tab.id as any)}
                      className={`px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all duration-300 ${
                        activeCoreTab === tab.id
                          ? 'bg-[#7C6FE0] text-white shadow-md'
                          : 'bg-white dark:bg-white/5 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-xs bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] px-2.5 py-1 rounded uppercase font-bold">
                      ⚠️ CRITICAL ALERT
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold">CONFIDENCE: 94%</span>
                  </div>

                  <div className="font-mono text-xs space-y-2 p-5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-mono">
                      {coreTypewriterText}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[9px] font-mono text-gray-500 uppercase border-t border-white/10 pt-4">
                  <div>
                    <span>Block target</span>
                    <span className="block font-bold text-gray-300">#19,847,291</span>
                  </div>
                  <div>
                    <span>Gas Cost</span>
                    <span className="block font-bold text-gray-300">847,293</span>
                  </div>
                  <div>
                    <span>Severity</span>
                    <span className="block font-bold text-red-500">CRITICAL</span>
                  </div>
                  <div>
                    <span>Latency</span>
                    <span className="block font-bold text-cyan-400">14ms</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 12 — DASHBOARD PREVIEW */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 py-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#7C6FE0] font-mono font-bold block">
                COCKPIT SYSTEM PREVIEW
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Designed for Complete Transparency
              </h2>
            </div>

            <div className="glass-panel p-6 max-w-5xl mx-auto bg-white/80 dark:bg-slate-900/80 shadow-xl border border-black/5 dark:border-white/5 rounded-3xl relative overflow-hidden">
              {/* Window controls bar */}
              <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                  <span className="text-[10px] font-mono text-gray-400 ml-4">NEXUSAGENT SECURE OPERATIONS INTERFACE</span>
                </div>
                <span className="text-[10px] font-mono font-extrabold text-[#7C6FE0] bg-[#7C6FE0]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  MONITOR ACTIVE
                </span>
              </div>

              {/* Mock Dashboard Layout grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                {/* Sidebar mock */}
                <div className="lg:col-span-3 bg-gray-50/60 dark:bg-slate-800/60 rounded-xl p-4 space-y-3 font-mono text-[11px] text-gray-600 dark:text-slate-300">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-bold block mb-2">[ SECTIONS ]</span>
                  <a href="#explainability" className="block bg-white dark:bg-slate-700 px-3 py-2 rounded-lg font-bold border border-black/5 dark:border-slate-600 text-[#7C6FE0] dark:text-violet-400 hover:shadow-sm">🛡️ Core Telemetry</a>
                  <a href="#simulation" className="block px-3 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg cursor-pointer">💥 Attack Simulation</a>
                  <a href="#pricing" className="block px-3 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg cursor-pointer">💳 Subscriptions</a>
                  <a href="#demo" className="block px-3 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg cursor-pointer">🌐 Sandbox Demo</a>
                </div>


                {/* Main area mock */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 border border-black/5 dark:border-slate-700 p-4 rounded-xl shadow-sm text-center">
                      <span className="text-[9px] font-mono text-gray-400 dark:text-slate-400 block uppercase">[ WALLET SECURITY SCORE ]</span>
                      <span className="text-2xl font-bold text-[#10B981] font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>92/100</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-black/5 dark:border-slate-700 p-4 rounded-xl shadow-sm text-center">
                      <span className="text-[9px] font-mono text-gray-400 dark:text-slate-400 block uppercase">[ ACTIVE THREAT ALERTS ]</span>
                      <span className="text-2xl font-bold text-red-500 font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>0</span>
                    </div>
                  </div>

                  {/* Recent table */}
                  <div className="bg-white dark:bg-slate-800 border border-black/5 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                    <span className="text-[9px] font-mono text-gray-400 dark:text-slate-400 block uppercase mb-3">[ CONNECTED CONTRACT APPROVALS ]</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-slate-700">
                        <span className="text-gray-600 dark:text-slate-300 font-mono">Uniswap V3 WETH Spender</span>
                        <span className="text-green-600 dark:text-emerald-400 font-bold font-mono">SECURE</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-slate-700">
                        <span className="text-gray-600 dark:text-slate-300 font-mono">Aave V3 Reserve Router</span>
                        <span className="text-green-600 dark:text-emerald-400 font-bold font-mono">SECURE</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-gray-600 dark:text-slate-300 font-mono">Unknown ERC20 Token Spender</span>
                        <span className="text-red-500 font-bold font-mono">REVOCATION REQ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side alert stream */}
                <div className="lg:col-span-3 bg-gray-900 border border-white/10 rounded-xl p-4 font-mono text-[9px] text-[#A7F3D0] space-y-3 h-52 lg:h-auto overflow-y-auto">
                  <span className="text-gray-500 font-bold block border-b border-white/5 pb-1 uppercase tracking-wider">[ RUNNING PROCESS LOG ]</span>
                  {dashboardAlerts.map((logAlert, index) => (
                    <div key={index} className="flex gap-2">
                      <span>&gt;</span>
                      <span className="leading-relaxed">{logAlert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 13 — DEVELOPER API SECTION */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs uppercase tracking-widest text-[#7C6FE0] font-mono font-bold block">
                FOR DEVELOPERS
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Integrate in Minutes
              </h2>
              <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed">
                The NexusAgent API gives your dApp real-time threat intelligence with a single function call. REST and WebSocket streams supported natively.
              </p>

              <div className="flex gap-3 text-[10px] font-mono text-gray-500">
                <span>→ REST API</span>
                <span>→ WebSockets</span>
                <span>→ Webhook Alerts</span>
              </div>
            </div>

            {/* Right dark terminal code block */}
            <div className="lg:col-span-7 bg-[#0F172A] rounded-2xl p-6 text-white font-mono text-xs overflow-x-auto shadow-2xl border border-white/5 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSdkTab('js')}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${sdkTab === 'js' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                  >
                    JavaScript
                  </button>
                  <button 
                    onClick={() => setSdkTab('py')}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${sdkTab === 'py' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                  >
                    Python
                  </button>
                </div>
                <span className="text-[9px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-gray-400">sdk</span>
              </div>

              {sdkTab === 'js' && (
                <pre className="text-gray-300 text-[11px] leading-relaxed font-mono">
{`import { NexusAgent } from '@nexusagent/sdk';

const nexus = new NexusAgent({
  apiKey: process.env.NEXUS_API_KEY
});

// Scan a wallet for threat vectors
const analysis = await nexus.scanWallet({
  address: '0x742d35Cc6634C0532...',
  depth: 'full'
});

console.log(analysis.riskScore);   // 23 (Low Risk)
console.log(analysis.explanation); // "No threats detected..."`}
                </pre>
              )}

              {sdkTab === 'py' && (
                <pre className="text-gray-300 text-[11px] leading-relaxed font-mono">
{`from nexusagent import NexusAgent

nexus = NexusAgent(api_key="your_api_key")

# Scan active wallet address
analysis = nexus.scan_wallet(
    address="0x742d35Cc6634C0532...",
    depth="full"
)

print(analysis.risk_score)       # 23
print(analysis.explanation)      # "No threats..."`}
                </pre>
              )}
            </div>
          </section>

          {/* SECTION 14 — PRICING */}
          <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-8 py-12">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#7C6FE0] font-mono font-bold block">
                SUBSCRIPTION LICENSES
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Flexible Protection Plans
              </h2>

              {/* Monthly / Annual toggle */}
              <div className="flex justify-center items-center gap-3 pt-4">
                <span className={`text-xs font-mono uppercase tracking-wider ${!isAnnual ? 'text-[#0F172A] dark:text-white font-bold' : 'text-gray-400'}`}>Monthly</span>
                <button 
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="w-12 h-6 bg-[#7C6FE0] rounded-full p-1 transition-all duration-300 relative"
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
                <span className={`text-xs font-mono uppercase tracking-wider ${isAnnual ? 'text-[#0F172A] dark:text-white font-bold' : 'text-gray-400'}`}>
                  Annual <span className="text-[#10B981] font-bold">(Save 20%)</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              
              {/* Starter tier */}
              <div className="glass-panel p-8 bg-white/60 dark:bg-slate-800/60 flex flex-col justify-between rounded-2xl border border-[#7C6FE0]/20 dark:border-slate-700 text-left">
                <div>
                  <span className="text-xs font-bold text-gray-400 font-mono tracking-widest uppercase">STARTER</span>
                  <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-white mt-2 font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    $0 <span className="text-xs font-normal text-gray-500">/ forever</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-4 leading-relaxed">Basic rug-pull contract scanner, wallet score recalibration, and core telemetry alerts.</p>
                  <ul className="space-y-2 mt-6 text-xs text-gray-600 dark:text-slate-300 font-mono">
                    <li>✓ 1 wallet monitored</li>
                    <li>✓ Basic threat alerts</li>
                    <li>✓ 7-day transaction history</li>
                    <li className="text-gray-300">✗ AI explanations</li>
                  </ul>
                </div>
                <button 
                  onClick={() => startCheckout('Starter')}
                  className="mt-8 w-full bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-lg text-xs font-bold font-mono hover:bg-blue-600 transition-colors uppercase tracking-wider shadow-md"
                >
                  Get Started Free
                </button>
              </div>

              {/* Recommended Pro tier */}
              <div className="glass-panel p-8 bg-white dark:bg-slate-800 border-2 border-[#7C6FE0] relative flex flex-col justify-between shadow-lg shadow-[#7C6FE0]/10 rounded-2xl text-left">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#7C6FE0] text-white text-[9px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-widest">
                  MOST POPULAR
                </div>
                <div>
                  <span className="text-xs font-bold text-[#7C6FE0] font-mono tracking-widest uppercase">PRO</span>
                  <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-white mt-2 font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    ${isAnnual ? '39' : '49'} <span className="text-xs font-normal text-gray-500">/ month</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-4 leading-relaxed">Everything in standard plus unlimited bytecode decompiles, active simulation lab nodes, and webhook notifications.</p>
                  <ul className="space-y-2 mt-6 text-xs text-gray-600 dark:text-slate-300 font-mono">
                    <li>✓ 10 wallets monitored</li>
                    <li>✓ Real-time AI threat analysis</li>
                    <li>✓ Full AI explanations</li>
                    <li>✓ Telegram + Slack alerts</li>
                  </ul>
                </div>
                <button 
                  onClick={() => startCheckout('Pro')}
                  className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg text-xs font-bold font-mono hover:bg-blue-700 transition-colors uppercase tracking-wider shadow-lg shadow-blue-500/25"
                >
                  Start Free Trial
                </button>
              </div>

              {/* Enterprise tier */}
              <div className="glass-panel p-8 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm text-left">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-gray-400 font-mono tracking-widest uppercase">ENTERPRISE</span>
                  <h3 className="text-3xl font-extrabold mt-2 font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Custom</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-4 leading-relaxed">Enterprise protection with sub-14ms API response latency, dedicated node architecture, and 24/7 dedicated support.</p>
                  <ul className="space-y-2 mt-6 text-xs text-slate-600 dark:text-gray-300 font-mono">
                    <li>✓ Unlimited wallets</li>
                    <li>✓ Custom threat models</li>
                    <li>✓ Full API access</li>
                    <li>✓ Dedicated SLA support</li>
                  </ul>
                </div>
                <button 
                  onClick={() => startCheckout('Enterprise')}
                  className="mt-8 w-full bg-slate-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg text-xs font-bold font-mono hover:bg-blue-600 dark:hover:bg-gray-100 transition-colors uppercase tracking-wider shadow-md"
                >
                  Talk to Sales
                </button>
              </div>
            </div>
          </section>

          {/* Checkout transaction modal */}
          <AnimatePresence>
            {selectedPlan && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#030307]/50 backdrop-blur-md flex items-center justify-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className={`p-8 max-w-md w-full rounded-3xl relative overflow-hidden shadow-2xl transition-all duration-300 ${
                    selectedPlan === 'Enterprise' 
                      ? 'bg-slate-900 border border-white/10 text-white' 
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-[#7C6FE0]"></div>
                  
                  <button 
                    onClick={() => setSelectedPlan(null)} 
                    className={`absolute top-4 right-4 text-xs font-mono transition-colors ${
                      selectedPlan === 'Enterprise' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                    }`}
                  >
                    [Close]
                  </button>

                  <h3 className="text-lg font-bold tracking-tight mb-2">Activate {selectedPlan} License</h3>
                  <p className={`text-xs mb-6 font-mono ${selectedPlan === 'Enterprise' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Contract Telemetry License Pipeline
                  </p>

                  {/* Summary Details */}
                  {selectedPlan !== 'Enterprise' && (
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-600 dark:text-slate-400">Selected plan</span>
                        <span className="font-bold text-blue-500 uppercase">{selectedPlan} Tier</span>
                      </div>

                      <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-600 dark:text-slate-400">Verification Amount</span>
                        <span className="font-mono text-slate-800 dark:text-slate-300">
                          {selectedPlan === 'Starter' ? '0.00 ETH (Free)' : '0.00001 ETH / POL'}
                        </span>
                      </div>

                      {selectedPlan !== 'Starter' && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Status</span>
                          {isConnected ? (
                            <span className="text-[#10B981] font-mono uppercase font-bold">Wallet Connected</span>
                          ) : (
                            <span className="text-red-500 font-mono uppercase font-bold">Disconnected</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Modal Body depending on plan */}
                  <div className={`p-5 rounded-2xl mb-6 text-xs text-center font-mono border ${
                    selectedPlan === 'Enterprise' 
                      ? 'bg-white/5 border-white/5' 
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                  }`}>
                    {(() => {
                      if (selectedPlan === 'Starter') {
                        return (
                          <div className="space-y-4">
                            {mockPaymentStep === 'confirmed' ? (
                              <div className="space-y-3 text-[#10B981]">
                                <span className="text-xl">✅</span>
                                <p className="font-bold">License Activated Successfully!</p>
                                <p className="text-[10px] text-gray-400">Free starter configuration initialized. Telemetry active.</p>
                                <button 
                                  onClick={() => {
                                    setSelectedPlan(null);
                                    router.push('/dashboard');
                                  }}
                                  className="w-full bg-[#0F172A] text-white py-2.5 rounded-xl text-xs font-bold font-mono hover:bg-gray-800 transition-colors uppercase"
                                >
                                  Go to Dashboard
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-gray-500 leading-normal">
                                  The Starter Tier is 100% free forever. No blockchain verification transaction required.
                                </p>
                                <button
                                  onClick={() => {
                                    setMockPaymentStep('confirmed');
                                  }}
                                  className="w-full bg-[#0F172A] text-white py-3 rounded-xl text-xs font-bold font-mono hover:bg-gray-800 transition-colors uppercase tracking-wider"
                                >
                                  Activate Free Plan
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      if (selectedPlan === 'Enterprise') {
                        if (enterpriseSubmitted) {
                          return (
                            <div className="space-y-3 text-[#10B981] py-2">
                              <span className="text-xl">✉️</span>
                              <p className="font-bold uppercase tracking-wider">Request Received!</p>
                              <p className="text-[10px] text-gray-400 leading-normal">
                                Dedicated private node provision request queued. Our engineering team will email you at <span className="font-bold text-white">{enterpriseEmail}</span> shortly.
                              </p>
                              <button 
                                onClick={() => setSelectedPlan(null)}
                                className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-xs font-bold font-mono transition-colors"
                              >
                                Return to Website
                              </button>
                            </div>
                          );
                        } else {
                          return (
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              if (!enterpriseEmail) return;
                              setEnterpriseSubmitted(true);
                            }} className="space-y-3 text-left">
                              <p className="text-[11px] text-gray-400 leading-relaxed text-center mb-2 font-sans">
                                Enter details to provision custom node SLA & API dashboard keys.
                              </p>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase block font-mono">Work Email</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="marcus@company.com"
                                  value={enterpriseEmail}
                                  onChange={(e) => setEnterpriseEmail(e.target.value)}
                                  className="w-full bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-xs placeholder-gray-500 text-white focus:outline-none focus:border-[#7C6FE0] font-mono shadow-sm"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase block font-mono">Company Name</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="YieldLabs Finance"
                                  value={enterpriseCompany}
                                  onChange={(e) => setEnterpriseCompany(e.target.value)}
                                  className="w-full bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-xs placeholder-gray-500 text-white focus:outline-none focus:border-[#7C6FE0] font-mono shadow-sm"
                                />
                              </div>
                              <button
                                type="submit"
                                className="w-full mt-3 bg-white text-[#0F172A] py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors uppercase tracking-wider font-mono"
                              >
                                Request Custom Provisioning
                              </button>
                            </form>
                          );
                        }
                      }
                      
                      // Pro Plan: Render real or mock payment
                      if (mockPaymentActive) {
                        if (mockPaymentStep === 'pending') {
                          return (
                            <div className="flex flex-col items-center justify-center text-[#7C6FE0] py-4">
                              <div className="w-5 h-5 border-2 border-t-transparent border-[#7C6FE0] rounded-full animate-spin mb-2"></div>
                              <span>Simulating wallet signature request...</span>
                            </div>
                          );
                        }
                        if (mockPaymentStep === 'confirming') {
                          return (
                            <div className="flex flex-col items-center justify-center text-[#06B6D4] py-4">
                              <div className="w-5 h-5 border-2 border-t-transparent border-[#06B6D4] rounded-full animate-spin mb-2"></div>
                              <span>Waiting for simulated block validation...</span>
                            </div>
                          );
                        }
                        return (
                          <div className="space-y-3 text-[#10B981]">
                            <span className="text-xl">✅</span>
                            <p className="font-bold">License Activated Successfully!</p>
                            <p className="text-[10px] text-gray-400">Pro on-chain license active. 24/7 telemetry monitoring enabled.</p>
                            <button 
                              onClick={() => {
                                setSelectedPlan(null);
                                router.push('/dashboard');
                              }}
                              className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold font-mono hover:bg-blue-700 transition-colors shadow-md"
                            >
                              Go to Dashboard
                            </button>
                          </div>
                        );
                      }
                      
                      if (!isConnected) {
                        return (
                          <div className="space-y-3">
                            <p className="text-gray-500">Please connect your wallet first to proceed with verification.</p>
                            <div className="flex justify-center">
                              <ConnectButton />
                            </div>
                            <div className="border-t border-black/5 pt-3">
                              <button 
                                onClick={startMockPayment}
                                className="text-[10px] text-[#7C6FE0] underline uppercase tracking-wider font-bold hover:text-[#685bc2] transition-colors"
                              >
                                Simulate Demo Checkout (No Wallet Needed)
                              </button>
                            </div>
                          </div>
                        );
                      }
                      
                      if (txPending) {
                        return (
                          <div className="flex flex-col items-center justify-center text-[#7C6FE0] py-2">
                            <div className="w-5 h-5 border-2 border-t-transparent border-[#7C6FE0] rounded-full animate-spin mb-2"></div>
                            <span>Check wallet to authorize transaction...</span>
                          </div>
                        );
                      }
                      
                      if (isConfirming) {
                        return (
                          <div className="flex flex-col items-center justify-center text-[#06B6D4] py-2">
                            <div className="w-5 h-5 border-2 border-t-transparent border-[#06B6D4] rounded-full animate-spin mb-2"></div>
                            <span>Waiting for block confirmation...</span>
                            {txHash && (
                              <span className="text-[10px] text-gray-400 mt-2 break-all font-mono">
                                Tx Hash: {txHash.substring(0, 16)}...
                              </span>
                            )}
                          </div>
                        );
                      }
                      
                      if (isConfirmed) {
                        return (
                          <div className="space-y-3 text-[#10B981]">
                            <span className="text-xl">✅</span>
                            <p className="font-bold">License Activated Successfully!</p>
                            <p className="text-[10px] text-gray-400">Transaction confirmed on-chain. Telemetry nominal.</p>
                            <button 
                              onClick={() => {
                                setSelectedPlan(null);
                                router.push('/dashboard');
                              }}
                              className="w-full bg-[#0F172A] text-white py-2.5 rounded-xl text-xs font-bold font-mono hover:bg-gray-800 transition-colors"
                            >
                              Finish Setup
                            </button>
                          </div>
                        );
                      }
                      
                      if (txError) {
                        return (
                          <div className="space-y-3 text-red-500">
                            <p className="font-bold">Transaction Failed / Rejected</p>
                            <p className="text-[10px] text-gray-400 leading-normal">{txError.message || "User denied transaction signature"}</p>
                            <div className="flex flex-col gap-2">
                              <button 
                                onClick={handleRealPayment}
                                className="w-full bg-[#7C6FE0] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#685bc2] transition-colors"
                              >
                                Retry Payment
                              </button>
                              <button 
                                onClick={startMockPayment}
                                className="w-full bg-gray-100 text-gray-600 py-1.5 rounded-xl text-[10px] font-bold hover:bg-gray-200 transition-colors"
                              >
                                Bypass via Demo Simulation
                              </button>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="space-y-3 animate-fade-in">
                          <p className="text-gray-600 leading-normal">
                            NexusAgent verification sends a tiny safe transaction (0.00001 ETH/POL) to your own address to verify key authorization.
                          </p>
                          <button 
                            onClick={handleRealPayment}
                            className="w-full bg-[#7C6FE0] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#685bc2] transition-all uppercase tracking-wider font-mono"
                          >
                            Confirm & Authorize
                          </button>
                          <div className="border-t border-black/5 pt-2">
                            <button 
                              onClick={startMockPayment}
                              className="text-[9px] text-gray-400 hover:text-[#7C6FE0] underline"
                            >
                              Simulate with Demo Checkout (No Gas)
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 15 — TESTIMONIALS */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 bg-[#EEF2FF]/60 dark:bg-slate-800/30 border border-[#7C6FE0]/10 dark:border-slate-700/50 rounded-3xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#7C6FE0] dark:text-violet-400 font-mono font-bold block">
                TRUST VERIFICATION
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Real Protection Verified by Developers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Marcus Chen', role: 'Protocol Security Lead', company: 'DeFi Collective', avatar: 'MC', quote: 'NexusAgent flagged a suspicious liquidity drain on our Curve pool 23 minutes before $340K was withdrawn. We had time to act.', tag: 'Aave user' },
                { name: 'Priya Nair', role: 'DeFi Trader', company: 'Independent', avatar: 'PN', quote: 'The AI explanation feature alone is worth it. I finally understand WHY a transaction is risky, not just that it is.', tag: 'Uniswap LP' },
                { name: 'David Okafor', role: 'CTO', company: 'YieldLabs Finance', avatar: 'DO', quote: 'We integrated the API in under 2 hours. The WebSocket stream is incredibly reliable — zero missed alerts in 3 months.', tag: 'Synthetix LP' }
              ].map((t, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-black/5 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between text-left">
                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center justify-between border-t border-black/5 dark:border-slate-700 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7C6FE0]/10 flex items-center justify-center text-xs font-bold text-[#7C6FE0] dark:text-violet-400 uppercase">
                        {t.avatar}
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-gray-800 dark:text-white">{t.name}</span>
                        <span className="text-[9px] text-gray-400 dark:text-slate-500 font-mono block uppercase">{t.role}, {t.company}</span>
                      </div>
                    </div>
                    <span className="text-[8px] bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">{t.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 16 — FAQ */}
          <section id="faq" className="max-w-3xl mx-auto px-6 md:px-8 py-12">
            <div className="text-center mb-16 space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#7C6FE0] font-mono font-bold block">
                QUESTIONS & ANSWERS
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="bg-white dark:bg-slate-800 border border-black/5 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                    <button 
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-slate-200"
                    >
                      <span>{item.q}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-[#7C6FE0]" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </button>
                    
                    <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
                      <p className="px-6 pb-6 text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-mono">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 17 — FINAL CTA */}
          <section className="max-w-7xl mx-auto px-6 py-12 relative overflow-hidden text-center rounded-3xl bg-gradient-to-tr from-[#7C6FE0]/10 via-slate-50 dark:via-slate-900 to-[#06B6D4]/10 border border-[#7C6FE0]/15">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white font-display" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Secure the Future of Your DeFi Assets
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-mono leading-relaxed">
                Join 2,400+ wallets already protected by NexusAgent. Free to start. No card required.
              </p>
              
              <div className="flex justify-center gap-4 pt-4">
                <a 
                  href="#demo"
                  className="bg-[#7C6FE0] text-white px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#685bc2] transition-colors font-mono inline-block shadow-sm"
                >
                  Scan My Wallet Free
                </a>
                <a 
                  href="#pricing"
                  className="border border-[#7C6FE0]/25 text-[#7C6FE0] dark:text-[#A78BFA] hover:bg-[#7C6FE0]/5 px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest font-bold transition-colors font-mono inline-block bg-white dark:bg-transparent"
                >
                  Book a Demo
                </a>
              </div>

              <p className="text-[10px] text-gray-400 font-mono tracking-wider pt-2">
                🔒 Read-only access · No funds at risk · Cancel anytime
              </p>
            </div>
          </section>

          {/* SECTION 18 — FOOTER */}
          <footer className="bg-[#0F172A] text-white py-12 mt-16 border-t border-[#7C6FE0]/20 relative text-left">
            <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
              
              {/* Logo block */}
              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-[#7C6FE0]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity="0.15" />
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="#7C6FE0" strokeWidth="1.5" />
                  </svg>
                  <span className="text-sm font-bold tracking-widest font-mono">NEXUSAGENT</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                  Autonomous DeFi risk defense operating system shielding Web3 treasuries against contract exploits and developer traps.
                </p>
              </div>

              {/* Product */}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#7C6FE0] uppercase block mb-4">PRODUCT</span>
                <ul className="space-y-2 text-[11px] text-gray-400 font-mono uppercase tracking-wider">
                  <li><a href="#why-us" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#explainability" className="hover:text-white transition-colors">Dashboard</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>

              {/* Security */}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block mb-4">SECURITY</span>
                <ul className="space-y-2 text-[11px] text-gray-400 font-mono uppercase tracking-wider">
                  <li><a href="#simulation" className="hover:text-white transition-colors">Threat Map</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Audit Logs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Bug Bounty</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block mb-4">RESOURCES</span>
                <ul className="space-y-2 text-[11px] text-gray-400 font-mono uppercase tracking-wider">
                  <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API Keys</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
                </ul>
              </div>

              {/* System node Status */}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-300 uppercase block mb-4">SYSTEM NOMINAL</span>
                <div className="flex items-center gap-2 text-[11px] text-[#10B981] font-mono">
                  <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></div>
                  <span>ALL NODES CONNECTED</span>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 font-mono uppercase tracking-wider gap-4">
              <span>© 2026 NexusAgent Inc. All rights reserved.</span>
              <span>Autonomous Defense Core v1.0.0</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';

export default function HologramSphere() {
  const [mounted, setMounted] = useState(false);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const protocols = [
    { name: 'Uniswap V3', x: 250, y: 50, color: '#FF007A' },
    { name: 'Aave', x: 350, y: 150, color: '#2EBAC6' },
    { name: 'Curve', x: 250, y: 250, color: '#FA0202' },
    { name: 'MakerDAO', x: 150, y: 150, color: '#1AAB9B' }
  ];

  return (
    <div className="relative w-full h-full min-h-[350px] flex items-center justify-center overflow-hidden font-sans rounded-2xl bg-gradient-to-b from-transparent to-blue-900/5">
      <svg viewBox="0 0 500 350" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </linearGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* 3D Isometric Cube definition */}
          <g id="isoCube">
            <polygon points="0,15 20,5 40,15 20,25" fill="currentColor" fillOpacity="0.9" />
            <polygon points="0,15 20,25 20,45 0,35" fill="currentColor" fillOpacity="0.7" />
            <polygon points="20,25 40,15 40,35 20,45" fill="currentColor" fillOpacity="0.5" />
            <polygon points="0,15 20,5 40,15 20,25" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
          </g>

          <g id="isoCenter">
            <polygon points="0,20 30,5 60,20 30,35" fill="#3B82F6" fillOpacity="0.9" />
            <polygon points="0,20 30,35 30,65 0,50" fill="#2563EB" fillOpacity="0.7" />
            <polygon points="30,35 60,20 60,50 30,65" fill="#1D4ED8" fillOpacity="0.5" />
            <path d="M 20,25 L 40,15 L 40,35 L 20,45 Z" fill="#60A5FA" opacity="0.4" filter="url(#strongGlow)"/>
          </g>
        </defs>

        {/* 3D Floor Grid */}
        <g transform="translate(250, 200) scale(1, 0.4) rotate(45)">
          <g className="animate-[spin_60s_linear_infinite] origin-center">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`hx-${i}`} x1="-200" y1={-200 + i * 20} x2="200" y2={-200 + i * 20} stroke="#3b82f6" strokeWidth="1" opacity={0.15 - Math.abs(10 - i) * 0.01} />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`vx-${i}`} x1={-200 + i * 20} y1="-200" x2={-200 + i * 20} y2="200" stroke="#3b82f6" strokeWidth="1" opacity={0.15 - Math.abs(10 - i) * 0.01} />
            ))}
          </g>
        </g>

        {/* Connection Lines */}
        {protocols.map((p, i) => (
          <g key={`line-${i}`}>
            {/* Background line */}
            <line 
              x1="250" y1="175" 
              x2={p.x} y2={p.y + 25} 
              stroke="#475569" strokeWidth="2" strokeDasharray="4,4" opacity="0.3"
            />
            {/* Active scan line */}
            <line 
              x1="250" y1="175" 
              x2={p.x} y2={p.y + 25} 
              stroke={activeNode === i ? '#3B82F6' : 'transparent'} 
              strokeWidth="3" 
              strokeDasharray="10,6"
              className={activeNode === i ? "animate-[dash_1s_linear_infinite]" : ""}
              filter="url(#glow)"
            />
          </g>
        ))}

        {/* Central Wallet Node */}
        <g transform="translate(220, 145)">
          <use href="#isoCenter" filter="url(#strongGlow)" />
          <use href="#isoCenter" />
          <text x="30" y="-15" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="2">CORE WALLET</text>
          
          {/* Scanning rings */}
          <ellipse cx="30" cy="35" rx="50" ry="25" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.5" className="animate-ping" />
        </g>

        {/* Peripheral Protocol Nodes */}
        {protocols.map((p, i) => (
          <g key={`node-${i}`} transform={`translate(${p.x - 20}, ${p.y + 5})`}>
            {/* Protocol Cube */}
            <g style={{ color: p.color }}>
              <use href="#isoCube" filter={activeNode === i ? 'url(#glow)' : ''} className="transition-all duration-300" />
            </g>
            
            {/* Protocol Labels */}
            <text 
              x="20" y="-8" 
              fontSize="10" 
              fontWeight="bold" 
              textAnchor="middle"
              className={`transition-colors duration-500 font-mono ${activeNode === i ? 'fill-slate-800 dark:fill-slate-200' : 'fill-slate-500 dark:fill-slate-500'}`}
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              {p.name}
            </text>

            {/* Status indicators */}
            {activeNode === i && (
              <g transform="translate(45, 0)">
                <rect x="0" y="-5" width="40" height="14" rx="4" fill="#10B981" opacity="0.2" />
                <text x="20" y="5" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle">SECURE</text>
              </g>
            )}
          </g>
        ))}

        {/* Animated Dash CSS */}
        <style>
          {`
            @keyframes dash {
              to {
                stroke-dashoffset: -32;
              }
            }
          `}
        </style>
      </svg>
      
      {/* Floating Info Box */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[85%] bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono font-medium">
            Analyzing transaction traces for <span className="text-slate-900 dark:text-white font-bold">{protocols[activeNode].name}</span>...
          </span>
        </div>
        <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded uppercase">Real-time</span>
      </div>
    </div>
  );
}

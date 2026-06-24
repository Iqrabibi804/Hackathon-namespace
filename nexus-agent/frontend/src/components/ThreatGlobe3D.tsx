'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreatGlobe3DProps {
  activeAttack: string | null;
}

export default function ThreatGlobe3D({ activeAttack }: ThreatGlobe3DProps) {
  // Define nodes on a 2D projection plane for the SVG
  const nodes = [
    { id: 'us-east', x: 250, y: 120, label: 'US-East' },
    { id: 'eu-cent', x: 200, y: 60, label: 'EU-Central' },
    { id: 'ap-south', x: 100, y: 160, label: 'AP-South' },
    { id: 'sa-east', x: 160, y: 220, label: 'SA-East' },
    { id: 'me-west', x: 50, y: 90, label: 'ME-West' },
  ];

  // If there's an active attack, target US-East and SA-East
  const isTargetNode = (id: string) => activeAttack && (id === 'us-east' || id === 'sa-east');

  return (
    <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center select-none overflow-visible">
      
      {/* Background Glows */}
      <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      {activeAttack && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl pointer-events-none"
        ></motion.div>
      )}

      {/* SVG Container */}
      <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.02)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Globe Rings */}
        <motion.circle 
          cx="150" cy="150" r="140" 
          fill="url(#globeGrad)" 
          stroke="rgba(59, 130, 246, 0.2)" 
          strokeWidth="1"
        />
        <motion.ellipse 
          cx="150" cy="150" rx="140" ry="60" 
          fill="none" 
          stroke="rgba(59, 130, 246, 0.1)" 
          strokeWidth="1" 
          transform="rotate(30 150 150)"
        />
        <motion.ellipse 
          cx="150" cy="150" rx="60" ry="140" 
          fill="none" 
          stroke="rgba(59, 130, 246, 0.1)" 
          strokeWidth="1" 
          transform="rotate(30 150 150)"
        />

        {/* Network Connection Lines */}
        <path d="M 250 120 Q 150 100 50 90" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 200 60 Q 150 150 160 220" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 100 160 Q 150 150 250 120" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Active Attack Arcs */}
        <AnimatePresence>
          {activeAttack && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Attack from ME-West to US-East */}
              <motion.path 
                d="M 50 90 Q 150 50 250 120" 
                fill="none" 
                stroke="#EF4444" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                filter="url(#glow)"
              />
              {/* Attack from AP-South to SA-East */}
              <motion.path 
                d="M 100 160 Q 100 200 160 220" 
                fill="none" 
                stroke="#EF4444" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 0.2 }}
                filter="url(#glow)"
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Nodes */}
        {nodes.map((node) => {
          const danger = isTargetNode(node.id);
          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Warning Pulse */}
              {danger && (
                <motion.circle 
                  r="20" 
                  fill="none" 
                  stroke="#EF4444" 
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              
              {/* Node Core */}
              <circle 
                r={danger ? "6" : "4"} 
                fill={danger ? "#EF4444" : "#3B82F6"} 
                filter={danger ? "url(#glow)" : "none"}
              />
              
              {/* Node Label */}
              <text 
                x="12" 
                y="4" 
                fill={danger ? "#FCA5A5" : "#94A3B8"} 
                fontSize="10" 
                fontFamily="monospace"
                fontWeight="bold"
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Hovering AI Shield when no attack is happening */}
        <AnimatePresence>
          {!activeAttack && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pointer-events-none"
            >
              <motion.circle 
                cx="150" cy="150" r="30" 
                fill="rgba(16, 185, 129, 0.1)" 
                stroke="#10B981" 
                strokeWidth="1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <path d="M142 148 L148 154 L160 142" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>
          )}
        </AnimatePresence>

      </svg>
    </div>
  );
}

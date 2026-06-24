'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  progress: number;
  speed: number;
  color: string;
}

interface AttackVector3DProps {
  anomalyActive: boolean;
  anomalyType: string;
}

export default function AttackVector3D({ anomalyActive, anomalyType }: AttackVector3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0.2, y: -0.4 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const maxParticles = 40;

    // Define 3D Node positions
    const nodes = [
      { id: 'Source', label: 'DEPLOYER MULTISIG', x: -100, y: 0, z: 0, color: '#7C6FE0' },
      { id: 'Router', label: 'TARGET CONTRACT ROUTER', x: 0, y: 0, z: 0, color: '#06B6D4' },
      { id: 'Vault', label: 'LIQUIDITY POOL VAULT', x: 100, y: 0, z: 0, color: '#10B981' }
    ];

    const generateParticle = () => {
      const isAttack = anomalyActive;
      const color = isAttack ? '#EF4444' : '#10B981';
      const speed = isAttack ? 0.015 : 0.006;
      return {
        x: nodes[0].x,
        y: nodes[0].y,
        z: nodes[0].z,
        progress: 0,
        speed: speed + Math.random() * 0.005,
        color
      };
    };

    // Prepopulate particles
    for (let i = 0; i < 15; i++) {
      const p = generateParticle();
      p.progress = Math.random();
      particles.push(p);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Slowly rotate continuously
      const curRotX = rotation.x + 0.002;
      const curRotY = rotation.y + 0.004;

      const cosX = Math.cos(curRotX);
      const sinX = Math.sin(curRotX);
      const cosY = Math.cos(curRotY);
      const sinY = Math.sin(curRotY);

      // Function to project 3D point to 2D
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Rotate Y
        let x1 = x3d * cosY - z3d * sinY;
        let z1 = z3d * cosY + x3d * sinY;

        // Rotate X
        let y2 = y3d * cosX - z1 * sinX;
        let z2 = z1 * cosX + y3d * sinX;

        const depth = 200;
        const scale = depth / (depth + z2);
        return {
          x: cx + x1 * scale * 1.5,
          y: cy + y2 * scale * 1.5,
          z: z2,
          scale
        };
      };

      // Project Nodes
      const projNodes = nodes.map(n => ({
        ...n,
        proj: project(n.x, n.y, n.z)
      }));

      // Draw Main Pipeline Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = anomalyActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.06)';
      ctx.beginPath();
      ctx.moveTo(projNodes[0].proj.x, projNodes[0].proj.y);
      ctx.lineTo(projNodes[1].proj.x, projNodes[1].proj.y);
      ctx.lineTo(projNodes[2].proj.x, projNodes[2].proj.y);
      ctx.stroke();

      // Emit new particles
      if (particles.length < maxParticles && Math.random() < 0.15) {
        particles.push(generateParticle());
      }

      // Update and Draw Particles
      particles.forEach((p, idx) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          particles[idx] = generateParticle(); // Reset
          return;
        }

        // Interpolate along the pipeline (Source -> Router -> Vault)
        let currentX, currentY, currentZ;
        if (p.progress < 0.5) {
          const ratio = p.progress * 2;
          currentX = nodes[0].x + (nodes[1].x - nodes[0].x) * ratio;
          currentY = nodes[0].y + (nodes[1].y - nodes[0].y) * ratio;
          currentZ = nodes[0].z + (nodes[1].z - nodes[0].z) * ratio;
        } else {
          const ratio = (p.progress - 0.5) * 2;
          currentX = nodes[1].x + (nodes[2].x - nodes[1].x) * ratio;
          currentY = nodes[1].y + (nodes[2].y - nodes[1].y) * ratio;
          currentZ = nodes[1].z + (nodes[2].z - nodes[1].z) * ratio;
        }

        const proj = project(currentX, currentY, currentZ);
        const radius = Math.max(1, 3 * proj.scale);

        // Highlight blocked telemetry intersection if attack is active
        if (anomalyActive && p.progress >= 0.45 && p.progress <= 0.55) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#06B6D4';
          ctx.fillStyle = '#06B6D4'; // Turns to telemetry protection color
        } else {
          ctx.fillStyle = p.color;
        }

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      // Draw Security Interceptor Ring around target router
      if (anomalyActive) {
        const routerProj = projNodes[1].proj;
        const scanPulse = (Date.now() % 1500) / 1500;
        ctx.strokeStyle = `rgba(6, 182, 212, ${1 - scanPulse})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(routerProj.x, routerProj.y, 25 * scanPulse * routerProj.scale, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Draw Nodes
      projNodes.forEach(n => {
        const radius = Math.max(4, 7 * n.proj.scale);
        
        // Draw Glowing Halo around active node
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.proj.x, n.proj.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        // Node labels
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(n.label, n.proj.x - 35, n.proj.y - 12);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [anomalyActive, anomalyType, rotation, isMobile]);

  if (isMobile) {
    return (
      <div className="bg-[#EF4444]/5 border border-[#EF4444]/10 p-5 rounded-2xl text-center space-y-2 text-xs">
        <span className="text-[#EF4444] font-bold">⚠️ ATTACK PROPAGATION ACTIVE</span>
        <p className="text-gray-500 font-mono">Type: {anomalyType}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 glass-panel bg-white/60 p-6 flex flex-col justify-between overflow-hidden">
      <div className="flex justify-between items-center z-10">
        <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
          [ 3D INTERACTION STAGE: INTERCEPTOR SIMULATOR ]
        </span>
        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
          anomalyActive ? 'bg-[#EF4444]/10 text-[#EF4444] animate-pulse' : 'bg-gray-100 text-gray-500'
        }`}>
          {anomalyActive ? `INTERCEPTING: ${anomalyType.toUpperCase()}` : 'TELEMETRY NOMINAL'}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={220}
        className="w-full h-44 cursor-grab active:cursor-grabbing"
      />

      <div className="text-[9px] text-gray-400 font-mono text-center z-10">
        {anomalyActive 
          ? `🔒 NexusAgent Shield blocking anomalous transactions at Contract Router...`
          : 'Drag space to adjust perspective view. Click parameter targets to inject telemetry anomalies.'
        }
      </div>
    </div>
  );
}

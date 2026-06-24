'use client';

import React, { useRef, useEffect, useState } from 'react';

interface BytecodeBlock {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  opcode: string;
  isVulnerable: boolean;
}

interface ContractMatrix3DProps {
  scanning: boolean;
  vulnerabilitiesFound: boolean;
}

export default function ContractMatrix3D({ scanning, vulnerabilitiesFound }: ContractMatrix3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    let blocks: BytecodeBlock[] = [];
    const numRows = 6;
    const numCols = 8;
    const radius = 80;

    const opcodes = ['PUSH1', 'MSTORE', 'CALLVALUE', 'JUMPI', 'SLOAD', 'SSTORE', 'DELEGATECALL', 'REVERT', 'ADDRESS'];

    // Generate blocks on a cylinder grid
    for (let r = 0; r < numRows; r++) {
      const cyY = (r - (numRows - 1) / 2) * 22; // Layer height
      for (let c = 0; c < numCols; c++) {
        const angle = (c / numCols) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const opcode = opcodes[Math.floor(Math.random() * opcodes.length)];
        
        // Randomly flag a few blocks as potentially vulnerable to highlight
        const isVulnerable = r === 2 && (c === 1 || c === 5);

        blocks.push({
          x, y: cyY, z,
          baseX: x, baseY: cyY, baseZ: z,
          opcode,
          isVulnerable
        });
      }
    }

    let rotY = 0.005;
    let rotX = 0.002;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Adjust rotation speed depending on scanning state
      const currentRotY = scanning ? rotY * 4 : rotY;
      const currentRotX = scanning ? rotX * 3 : rotX;

      rotY += 0.001; // Continuously rotate

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      // Rotate and project blocks
      const projected = blocks.map(b => {
        // Rotate Y
        let x1 = b.baseX * cosY - b.baseZ * sinY;
        let z1 = b.baseZ * cosY + b.baseX * sinY;

        // Rotate X
        let y2 = b.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + b.baseY * sinX;

        const depth = 250;
        const scale = depth / (depth + z2);

        return {
          ...b,
          projX: cx + x1 * scale,
          projY: cy + y2 * scale,
          projZ: z2,
          scale
        };
      });

      // Draw connections/grid mesh lines
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = scanning ? 'rgba(6, 182, 212, 0.25)' : 'rgba(124, 111, 224, 0.15)';
      for (let i = 0; i < projected.length; i++) {
        // Connect to block below
        const belowIdx = i + numCols;
        if (belowIdx < projected.length) {
          ctx.beginPath();
          ctx.moveTo(projected[i].projX, projected[i].projY);
          ctx.lineTo(projected[belowIdx].projX, projected[belowIdx].projY);
          ctx.stroke();
        }
        // Connect to next block in row
        const nextColIdx = i % numCols === numCols - 1 ? i - (numCols - 1) : i + 1;
        ctx.beginPath();
        ctx.moveTo(projected[i].projX, projected[i].projY);
        ctx.lineTo(projected[nextColIdx].projX, projected[nextColIdx].projY);
        ctx.stroke();
      }

      // Draw blocks
      projected.forEach(b => {
        const w = 18 * b.scale;
        const h = 10 * b.scale;
        const alpha = Math.max(0.1, (b.projZ + radius) / (2 * radius));

        // Styling based on state and vulnerabilities
        if (vulnerabilitiesFound && b.isVulnerable) {
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.strokeStyle = '#EF4444';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#EF4444';
        } else if (scanning) {
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.strokeStyle = '#06B6D4';
        } else {
          ctx.fillStyle = `rgba(124, 111, 224, ${alpha * 0.7})`;
          ctx.strokeStyle = 'rgba(124, 111, 224, 0.4)';
        }

        ctx.beginPath();
        ctx.rect(b.projX - w / 2, b.projY - h / 2, w, h);
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset

        // Render opcode labels for front facing blocks
        if (b.projZ < -30) {
          ctx.fillStyle = vulnerabilitiesFound && b.isVulnerable ? '#EF4444' : '#0F172A';
          ctx.font = `${5 * b.scale}px monospace`;
          ctx.fillText(b.opcode, b.projX - (10 * b.scale), b.projY + (2 * b.scale));
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [scanning, vulnerabilitiesFound, isMobile]);

  if (isMobile) {
    return (
      <div className="bg-[#7C6FE0]/5 border border-[#7C6FE0]/15 p-4 rounded-xl text-center text-xs font-mono text-gray-500">
        🗂️ Bytecode Cylindrical Matrix Active
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 glass-panel bg-white/60 p-6 flex flex-col justify-between overflow-hidden">
      <div className="flex justify-between items-center z-10">
        <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
          [ 3D DECOMPILER CYLINDER STAGE ]
        </span>
        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
          vulnerabilitiesFound ? 'bg-[#EF4444]/10 text-[#EF4444]' : scanning ? 'bg-[#06B6D4]/10 text-[#06B6D4]' : 'bg-gray-100 text-gray-500'
        }`}>
          {vulnerabilitiesFound ? 'CRITICAL DETECTED' : scanning ? 'DECOMPILING BYTECODE...' : 'NOMINAL MONITOR'}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={220}
        className="w-full h-44 cursor-pointer"
      />

      <div className="text-[9px] text-gray-400 font-mono text-center z-10">
        {vulnerabilitiesFound 
          ? '❌ RED BLOCKS highlight instruction offsets failing static signature filters.'
          : 'Interactive 3D Cylinder rotates synchronously with decompiler thread telemetry.'
        }
      </div>
    </div>
  );
}

'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function SecurityShield3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rotationRef = useRef({ x: 0.15, y: -0.4, z: 0 });
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

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

    // Define 3D vertices of a SOLID luxury shield (Reference 2 style)
    const vertices: { [key: string]: Point3D } = {
      topDip: { x: 0, y: -75, z: 20 },
      spine: { x: 0, y: 0, z: 25 },
      bottomTip: { x: 0, y: 85, z: 15 },
      topLeft: { x: -45, y: -80, z: 8 },
      midLeft: { x: -65, y: -35, z: 12 },
      lowerLeft: { x: -50, y: 25, z: 10 },
      topRight: { x: 45, y: -80, z: 8 },
      midRight: { x: 65, y: -35, z: 12 },
      lowerRight: { x: 50, y: 25, z: 10 }
    };

    // Define 3D padlock points (Reference 2 solid padlocks)
    const getSolidLock = (cx: number, cy: number, cz: number, scale: number, angleOffset: number) => {
      return {
        cx, cy, cz, scale, angleOffset
      };
    };

    // 4 floating padlocks (Reference 2)
    const padlocks = [
      getSolidLock(-105, -70, -30, 0.9, 0),        // Top left
      getSolidLock(105, -60, 20, 0.85, Math.PI/3), // Top right
      getSolidLock(-110, 50, 15, 0.8, -Math.PI/4),  // Bottom left
      getSolidLock(105, 60, -25, 0.9, Math.PI/2)   // Bottom right
    ];

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;

        rotationRef.current.y += deltaX * 0.008;
        rotationRef.current.x += deltaY * 0.008;

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const time = Date.now();

      // Continuous rotation
      if (!isDragging.current) {
        rotationRef.current.y += 0.007;
      }

      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      // Light direction vector (from top-left-front)
      const lightDir = { x: -0.6, y: -0.6, z: -0.5 };
      const length = Math.sqrt(lightDir.x*lightDir.x + lightDir.y*lightDir.y + lightDir.z*lightDir.z);
      lightDir.x /= length;
      lightDir.y /= length;
      lightDir.z /= length;

      // Project function
      const project = (p: Point3D) => {
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        const depth = 380;
        const scale = depth / (depth + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale - 5,
          z: z2,
          scale
        };
      };

      // ----------------------------------------------------
      // Background Fingerprint Scanner Graphic (Left Side - Reference 2)
      // ----------------------------------------------------
      const fingerprintX = cx - 120;
      const fingerprintY = cy - 40;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1.2;
      for (let r = 10; r <= 45; r += 8) {
        ctx.beginPath();
        ctx.arc(fingerprintX, fingerprintY, r, -Math.PI/2, Math.PI);
        ctx.stroke();
      }
      // Draw small biometric scanner grid lines
      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.fillRect(fingerprintX - 25, fingerprintY + 15, 50, 2);

      // ----------------------------------------------------
      // Background Circular HUD Targets (Right Side - Reference 2)
      // ----------------------------------------------------
      const targetX = cx + 120;
      const targetY = cy - 30;
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
      ctx.beginPath();
      ctx.arc(targetX, targetY, 35, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(targetX, targetY, 15, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.18)';
      ctx.beginPath();
      ctx.moveTo(targetX - 45, targetY);
      ctx.lineTo(targetX + 45, targetY);
      ctx.moveTo(targetX, targetY - 45);
      ctx.lineTo(targetX, targetY + 45);
      ctx.stroke();

      // ----------------------------------------------------
      // Outer HUD rings & glow behind shield (Reference 2)
      // ----------------------------------------------------
      const backGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
      backGlow.addColorStop(0, 'rgba(37, 99, 235, 0.18)');
      backGlow.addColorStop(0.5, 'rgba(124, 58, 237, 0.05)');
      backGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = backGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, 2 * Math.PI);
      ctx.fill();

      // Project shield vertices
      const p = {
        topDip: project(vertices.topDip),
        spine: project(vertices.spine),
        bottomTip: project(vertices.bottomTip),
        topLeft: project(vertices.topLeft),
        midLeft: project(vertices.midLeft),
        lowerLeft: project(vertices.lowerLeft),
        topRight: project(vertices.topRight),
        midRight: project(vertices.midRight),
        lowerRight: project(vertices.lowerRight)
      };

      // Helper function to calculate face normal & light intensity
      const getFaceColor = (p1: Point3D, p2: Point3D, p3: Point3D, baseColor: string) => {
        // Normal vectors calculation
        const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
        const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
        const normal = {
          x: v1.y * v2.z - v1.z * v2.y,
          y: v1.z * v2.x - v1.x * v2.z,
          z: v1.x * v2.y - v1.y * v2.x
        };
        const nLength = Math.sqrt(normal.x*normal.x + normal.y*normal.y + normal.z*normal.z);
        normal.x /= nLength;
        normal.y /= nLength;
        normal.z /= nLength;

        // Dot product with light direction
        const dot = normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z;
        const intensity = Math.max(0.15, Math.min(1, (dot + 1) / 2));
        
        return intensity;
      };

      // Shaded Solid Faces of the Shield
      const drawShadedFace = (pts: any[], intensity: number, startColor: string, endColor: string) => {
        const grad = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[2].x, pts[2].y);
        
        // Apply lighting intensity to generate metallic shading
        const adjustColor = (hex: string, mult: number) => {
          const r = Math.round(parseInt(hex.slice(1,3), 16) * mult);
          const g = Math.round(parseInt(hex.slice(3,5), 16) * mult);
          const b = Math.round(parseInt(hex.slice(5,7), 16) * mult);
          return `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`;
        };

        grad.addColorStop(0, adjustColor(startColor, intensity));
        grad.addColorStop(1, adjustColor(endColor, intensity * 0.7));

        ctx.fillStyle = grad;
        ctx.beginPath();
        pts.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fill();
      };

      // Base shield colors
      const blueBase = '#3B82F6';
      const blueDark = '#1D4ED8';
      const blueLight = '#93C5FD';

      // Face 1: Upper Left Face
      const face1Intensity = getFaceColor(vertices.topDip, vertices.spine, vertices.midLeft, blueBase);
      drawShadedFace([p.topDip, p.spine, p.midLeft, p.topLeft], face1Intensity, blueLight, blueBase);

      // Face 2: Upper Right Face
      const face2Intensity = getFaceColor(vertices.topDip, vertices.spine, vertices.midRight, blueBase);
      drawShadedFace([p.topDip, p.spine, p.midRight, p.topRight], face2Intensity, blueLight, blueDark);

      // Face 3: Lower Left Face
      const face3Intensity = getFaceColor(vertices.spine, vertices.bottomTip, p.lowerLeft, blueBase);
      drawShadedFace([p.spine, p.bottomTip, p.lowerLeft, p.midLeft], face3Intensity, blueBase, blueDark);

      // Face 4: Lower Right Face
      const face4Intensity = getFaceColor(vertices.spine, vertices.bottomTip, p.lowerRight, blueBase);
      drawShadedFace([p.spine, p.bottomTip, p.lowerRight, p.midRight], face4Intensity, blueBase, '#1E40AF');

      // ----------------------------------------------------
      // Glossy Bevel Border Trim & Specular Highlight
      // ----------------------------------------------------
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'; // High reflection edge
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Draw outer left reflection edge
      ctx.moveTo(p.topDip.x, p.topDip.y);
      ctx.lineTo(p.topLeft.x, p.topLeft.y);
      ctx.lineTo(p.midLeft.x, p.midLeft.y);
      ctx.lineTo(p.lowerLeft.x, p.lowerLeft.y);
      ctx.lineTo(p.bottomTip.x, p.bottomTip.y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(30, 64, 175, 0.6)'; // Shadow right edge
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Draw outer right shadow edge
      ctx.moveTo(p.topDip.x, p.topDip.y);
      ctx.lineTo(p.topRight.x, p.topRight.y);
      ctx.lineTo(p.midRight.x, p.midRight.y);
      ctx.lineTo(p.lowerRight.x, p.lowerRight.y);
      ctx.lineTo(p.bottomTip.x, p.bottomTip.y);
      ctx.stroke();

      // ----------------------------------------------------
      // Inner glowing brand checkmark symbol (Reference 2 checkmark)
      // ----------------------------------------------------
      const checkPt1 = project({ x: -16, y: -5, z: 27 });
      const checkPt2 = project({ x: -4, y: 15, z: 28 });
      const checkPt3 = project({ x: 20, y: -18, z: 27 });

      const checkGrad = ctx.createLinearGradient(checkPt1.x, checkPt1.y, checkPt3.x, checkPt3.y);
      checkGrad.addColorStop(0, '#06B6D4');
      checkGrad.addColorStop(1, '#10B981');
      ctx.strokeStyle = checkGrad;
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(checkPt1.x, checkPt1.y);
      ctx.lineTo(checkPt2.x, checkPt2.y);
      ctx.lineTo(checkPt3.x, checkPt3.y);
      ctx.stroke();
      ctx.lineCap = 'butt'; // Reset

      // ----------------------------------------------------
      // Floating Solid 3D Padlocks (Reference 2 style)
      // ----------------------------------------------------
      padlocks.forEach(lock => {
        const floatOffset = Math.sin((time * 0.0015) + lock.angleOffset) * 10;
        const curY = lock.cy + floatOffset;

        // Define 3D Points for a Solid box lock body
        const w = 14 * lock.scale;
        const h = 10 * lock.scale;
        const d = 6 * lock.scale;

        const bodyVertices = [
          project({ x: lock.cx - w, y: curY - h, z: lock.cz - d }),
          project({ x: lock.cx + w, y: curY - h, z: lock.cz - d }),
          project({ x: lock.cx + w, y: curY + h, z: lock.cz - d }),
          project({ x: lock.cx - w, y: curY + h, z: lock.cz - d }),
          project({ x: lock.cx - w, y: curY - h, z: lock.cz + d }),
          project({ x: lock.cx + w, y: curY - h, z: lock.cz + d }),
          project({ x: lock.cx + w, y: curY + h, z: lock.cz + d }),
          project({ x: lock.cx - w, y: curY + h, z: lock.cz + d })
        ];

        // Draw Lock Shackle (solid arch)
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)'; // Silver metallic shackle
        ctx.lineWidth = 2.5 * lock.scale;
        ctx.beginPath();
        for (let a = 0; a <= 10; a++) {
          const angle = (a / 10) * Math.PI;
          const arcPt = project({
            x: lock.cx + Math.cos(angle) * 9 * lock.scale,
            y: curY - h - Math.sin(angle) * 11 * lock.scale,
            z: lock.cz
          });
          if (a === 0) ctx.moveTo(arcPt.x, arcPt.y);
          else ctx.lineTo(arcPt.x, arcPt.y);
        }
        ctx.stroke();

        // Face depth sorting: Draw solid front lock faces
        ctx.fillStyle = 'rgba(59, 130, 246, 0.9)'; // Bright solid blue lock body
        ctx.beginPath();
        ctx.moveTo(bodyVertices[0].x, bodyVertices[0].y);
        ctx.lineTo(bodyVertices[1].x, bodyVertices[1].y);
        ctx.lineTo(bodyVertices[2].x, bodyVertices[2].y);
        ctx.lineTo(bodyVertices[3].x, bodyVertices[3].y);
        ctx.closePath();
        ctx.fill();

        // Top Lock Face (shaded highlight)
        ctx.fillStyle = 'rgba(147, 197, 253, 0.95)'; // Highlight top
        ctx.beginPath();
        ctx.moveTo(bodyVertices[4].x, bodyVertices[4].y);
        ctx.lineTo(bodyVertices[5].x, bodyVertices[5].y);
        ctx.lineTo(bodyVertices[1].x, bodyVertices[1].y);
        ctx.lineTo(bodyVertices[0].x, bodyVertices[0].y);
        ctx.closePath();
        ctx.fill();

        // Outline Borders of the lock
        ctx.strokeStyle = '#1D4ED8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bodyVertices[0].x, bodyVertices[0].y);
        ctx.lineTo(bodyVertices[1].x, bodyVertices[1].y);
        ctx.lineTo(bodyVertices[2].x, bodyVertices[2].y);
        ctx.lineTo(bodyVertices[3].x, bodyVertices[3].y);
        ctx.closePath();
        ctx.stroke();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="relative w-44 h-44 flex items-center justify-center text-[#2563EB]/40 select-none">
        <svg className="w-28 h-28 animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polygon points="12 11 12 11 12 11" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-72 h-72 flex items-center justify-center select-none">
      {/* Outer spinning dash HUD rings (Reference 2 rings) */}
      <div className="absolute inset-0 border border-dashed border-[#2563EB]/15 rounded-full pointer-events-none animate-spin duration-[12000ms]"></div>
      <div className="absolute inset-4 border border-dotted border-[#06B6D4]/18 rounded-full pointer-events-none animate-spin duration-[8000ms]" style={{ animationDirection: 'reverse' }}></div>
      
      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        className="w-72 h-72 cursor-grab active:cursor-grabbing z-10"
      />
    </div>
  );
}

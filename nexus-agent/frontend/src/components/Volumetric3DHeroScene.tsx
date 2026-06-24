'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function Volumetric3DHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.1, y: -0.3, z: 0 });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.x = (e.clientX / innerWidth) - 0.5;
      mouseRef.current.y = (e.clientY / innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let gridOffset = 0;

    // Define 3D vertices of a robust, wide luxury shield (Reference 2 ratio)
    const vertices: { [key: string]: Point3D } = {
      topDip: { x: 0, y: -65, z: 25 },
      spine: { x: 0, y: 5, z: 28 },
      bottomTip: { x: 0, y: 90, z: 12 },
      topLeft: { x: -65, y: -70, z: 10 },
      midLeft: { x: -80, y: -25, z: 12 },
      lowerLeft: { x: -65, y: 30, z: 8 },
      topRight: { x: 65, y: -70, z: 10 },
      midRight: { x: 80, y: -25, z: 12 },
      lowerRight: { x: 65, y: 30, z: 8 }
    };

    // 4 floating padlocks positioned around the shield (Reference 2 style)
    const padlocks = [
      { cx: -130, cy: -75, cz: -30, scale: 0.9, color: '#93C5FD' },  // Top left
      { cx: 130, cy: -65, cz: 20, scale: 0.85, color: '#93C5FD' },  // Top right
      { cx: -135, cy: 55, cz: 15, scale: 0.8, color: '#93C5FD' },   // Bottom left
      { cx: 130, cy: 65, cz: -25, scale: 0.9, color: '#93C5FD' }    // Bottom right
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const time = Date.now();

      // Smooth mouse parallax + auto spin
      rotationRef.current.y += (mouseRef.current.x * 0.3 - rotationRef.current.y) * 0.05;
      rotationRef.current.x += (mouseRef.current.y * 0.2 - rotationRef.current.x) * 0.05;

      const cosX = Math.cos(rotationRef.current.x + 0.05);
      const sinX = Math.sin(rotationRef.current.x + 0.05);
      const cosY = Math.cos(rotationRef.current.y + (time * 0.0005)); // Slow auto spin
      const sinY = Math.sin(rotationRef.current.y + (time * 0.0005));

      const lightDir = { x: -0.5, y: -0.5, z: -0.7 };
      const len = Math.sqrt(lightDir.x*lightDir.x + lightDir.y*lightDir.y + lightDir.z*lightDir.z);
      lightDir.x /= len; lightDir.y /= len; lightDir.z /= len;

      const project = (p: Point3D) => {
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        const depth = 400;
        const scale = depth / (depth + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale - 20,
          z: z2,
          scale
        };
      };

      // ----------------------------------------------------
      // Background Glow & Ambient Waves (Reference 2 style)
      // ----------------------------------------------------
      const gradGlow = ctx.createRadialGradient(cx, cy - 20, 10, cx, cy - 20, 180);
      gradGlow.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      gradGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradGlow;
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 180, 0, 2 * Math.PI);
      ctx.fill();

      // ----------------------------------------------------
      // Perspective Grid Floor (Reference 1 & 2 Style)
      // ----------------------------------------------------
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.lineWidth = 1;
      gridOffset += 0.35;
      if (gridOffset > 30) gridOffset = 0;

      const floorY = 110;
      for (let xVal = -240; xVal <= 240; xVal += 40) {
        ctx.beginPath();
        for (let zVal = 50; zVal <= 300; zVal += 10) {
          const scale = 380 / (380 + zVal);
          const px = cx + xVal * scale;
          const py = cy + floorY + (zVal - 50) * 0.22 * scale;
          if (zVal === 50) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let zLine = 50; zLine <= 300; zLine += 30) {
        const curZ = zLine - gridOffset;
        if (curZ < 50) continue;
        ctx.beginPath();
        for (let xVal = -240; xVal <= 240; xVal += 10) {
          const scale = 380 / (380 + curZ);
          const px = cx + xVal * scale;
          const py = cy + floorY + (curZ - 50) * 0.22 * scale;
          if (xVal === -240) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // ----------------------------------------------------
      // Fingerprint & HUD Scope target circles (Reference 2 style)
      // ----------------------------------------------------
      // Fingerprint (Left)
      const fX = cx - 145;
      const fY = cy - 45;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      for (let r = 8; r <= 38; r += 7) {
        ctx.beginPath();
        ctx.arc(fX, fY, r, -Math.PI/2, Math.PI);
        ctx.stroke();
      }
      // Target scope (Right)
      const tX = cx + 145;
      const tY = cy - 35;
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.beginPath(); ctx.arc(tX, tY, 32, 0, 2*Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(tX, tY, 15, 0, 2*Math.PI); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tX - 40, tY); ctx.lineTo(tX + 40, tY);
      ctx.moveTo(tX, tY - 40); ctx.lineTo(tX, tY + 40);
      ctx.stroke();

      // Project Shield Points
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

      const getFaceColor = (p1: Point3D, p2: Point3D, p3: Point3D) => {
        const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
        const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
        const normal = {
          x: v1.y * v2.z - v1.z * v2.y,
          y: v1.z * v2.x - v1.x * v2.z,
          z: v1.x * v2.y - v1.y * v2.x
        };
        const nLength = Math.sqrt(normal.x*normal.x + normal.y*normal.y + normal.z*normal.z);
        normal.x /= nLength; normal.y /= nLength; normal.z /= nLength;

        const dot = normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z;
        return Math.max(0.2, Math.min(1, (dot + 1) / 2));
      };

      const drawShadedFace = (pts: any[], intensity: number, startColor: string, endColor: string) => {
        const grad = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[2].x, pts[2].y);
        const adjust = (hex: string, mult: number) => {
          const r = Math.round(parseInt(hex.slice(1,3), 16) * mult);
          const g = Math.round(parseInt(hex.slice(3,5), 16) * mult);
          const b = Math.round(parseInt(hex.slice(5,7), 16) * mult);
          return `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`;
        };

        grad.addColorStop(0, adjust(startColor, intensity));
        grad.addColorStop(1, adjust(endColor, intensity * 0.75));

        ctx.fillStyle = grad;
        ctx.beginPath();
        pts.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fill();
      };

      const baseBlue = '#3B82F6';
      const darkBlue = '#1D4ED8';
      const lightBlue = '#93C5FD';

      // Left Upper Face
      const f1Int = getFaceColor(vertices.topDip, vertices.spine, vertices.midLeft);
      drawShadedFace([p.topDip, p.spine, p.midLeft, p.topLeft], f1Int, lightBlue, baseBlue);

      // Right Upper Face
      const f2Int = getFaceColor(vertices.topDip, vertices.spine, vertices.midRight);
      drawShadedFace([p.topDip, p.spine, p.midRight, p.topRight], f2Int, lightBlue, darkBlue);

      // Left Lower Face
      const f3Int = getFaceColor(vertices.spine, vertices.bottomTip, vertices.lowerLeft);
      drawShadedFace([p.spine, p.bottomTip, p.lowerLeft, p.midLeft], f3Int, baseBlue, darkBlue);

      // Right Lower Face
      const f4Int = getFaceColor(vertices.spine, vertices.bottomTip, vertices.lowerRight);
      drawShadedFace([p.spine, p.bottomTip, p.lowerRight, p.midRight], f4Int, baseBlue, '#1E40AF');

      // Double layered glossy silver borders (Reference 2 style)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.topDip.x, p.topDip.y);
      ctx.lineTo(p.topLeft.x, p.topLeft.y);
      ctx.lineTo(p.midLeft.x, p.midLeft.y);
      ctx.lineTo(p.lowerLeft.x, p.lowerLeft.y);
      ctx.lineTo(p.bottomTip.x, p.bottomTip.y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(30, 58, 138, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.topDip.x, p.topDip.y);
      ctx.lineTo(p.topRight.x, p.topRight.y);
      ctx.lineTo(p.midRight.x, p.midRight.y);
      ctx.lineTo(p.lowerRight.x, p.lowerRight.y);
      ctx.lineTo(p.bottomTip.x, p.bottomTip.y);
      ctx.stroke();

      // Glowing Cyan checkmark emblem on shield (Reference 2)
      const c1 = project({ x: -18, y: -3, z: 29 });
      const c2 = project({ x: -5, y: 15, z: 30 });
      const c3 = project({ x: 22, y: -16, z: 29 });

      const cGrad = ctx.createLinearGradient(c1.x, c1.y, c3.x, c3.y);
      cGrad.addColorStop(0, '#06B6D4');
      cGrad.addColorStop(1, '#10B981');
      ctx.strokeStyle = cGrad;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y);
      ctx.stroke();
      ctx.lineCap = 'butt';

      // ----------------------------------------------------
      // Floating Shaded Padlocks (Reference 2 style)
      // ----------------------------------------------------
      padlocks.forEach((lock, idx) => {
        const floatY = lock.cy + Math.sin(time * 0.0015 + idx * 1.5) * 11;
        const w = 15 * lock.scale;
        const h = 11 * lock.scale;
        const d = 6 * lock.scale;

        const bodyPts = [
          project({ x: lock.cx - w, y: floatY - h, z: lock.cz - d }),
          project({ x: lock.cx + w, y: floatY - h, z: lock.cz - d }),
          project({ x: lock.cx + w, y: floatY + h, z: lock.cz - d }),
          project({ x: lock.cx - w, y: floatY + h, z: lock.cz - d }),
          project({ x: lock.cx - w, y: floatY - h, z: lock.cz + d }),
          project({ x: lock.cx + w, y: floatY - h, z: lock.cz + d }),
          project({ x: lock.cx + w, y: floatY + h, z: lock.cz + d }),
          project({ x: lock.cx - w, y: floatY + h, z: lock.cz + d })
        ];

        // Shackle arch
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.9)';
        ctx.lineWidth = 3.5 * lock.scale;
        ctx.beginPath();
        for (let a = 0; a <= 10; a++) {
          const angle = (a / 10) * Math.PI;
          const arcPt = project({
            x: lock.cx + Math.cos(angle) * 10 * lock.scale,
            y: floatY - h - Math.sin(angle) * 12 * lock.scale,
            z: lock.cz
          });
          if (a === 0) ctx.moveTo(arcPt.x, arcPt.y);
          else ctx.lineTo(arcPt.x, arcPt.y);
        }
        ctx.stroke();

        // Front lock face (blue gradient shading)
        const frontGrad = ctx.createLinearGradient(bodyPts[0].x, bodyPts[0].y, bodyPts[2].x, bodyPts[2].y);
        frontGrad.addColorStop(0, '#60A5FA');
        frontGrad.addColorStop(1, '#2563EB');
        ctx.fillStyle = frontGrad;
        ctx.beginPath();
        ctx.moveTo(bodyPts[0].x, bodyPts[0].y);
        ctx.lineTo(bodyPts[1].x, bodyPts[1].y);
        ctx.lineTo(bodyPts[2].x, bodyPts[2].y);
        ctx.lineTo(bodyPts[3].x, bodyPts[3].y);
        ctx.closePath();
        ctx.fill();

        // Shaded top lock face
        ctx.fillStyle = '#93C5FD';
        ctx.beginPath();
        ctx.moveTo(bodyPts[4].x, bodyPts[4].y);
        ctx.lineTo(bodyPts[5].x, bodyPts[5].y);
        ctx.lineTo(bodyPts[1].x, bodyPts[1].y);
        ctx.lineTo(bodyPts[0].x, bodyPts[0].y);
        ctx.closePath();
        ctx.fill();

        // Lock outline border
        ctx.strokeStyle = '#1D4ED8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(bodyPts[0].x, bodyPts[0].y);
        ctx.lineTo(bodyPts[1].x, bodyPts[1].y);
        ctx.lineTo(bodyPts[2].x, bodyPts[2].y);
        ctx.lineTo(bodyPts[3].x, bodyPts[3].y);
        ctx.closePath();
        ctx.stroke();
      });

      // spinning HUD rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.beginPath(); ctx.arc(cx, cy - 20, 130, 0, 2*Math.PI); ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="relative w-64 h-64 flex items-center justify-center text-blue-500/30">
        <svg className="w-36 h-36 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        width={460}
        height={460}
        className="w-[400px] h-[400px] cursor-pointer z-10"
      />
    </div>
  );
}

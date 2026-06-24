import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  progress: number;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, trend, trendDirection, progress, icon }: MetricCardProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-card dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-1">
            {title}
          </span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {value}
          </span>
        </div>
        
        {/* SVG Circular Progress */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-slate-100 dark:text-slate-800"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeLinecap="round"
              fill="none"
              className={progress >= 80 ? 'text-emerald-500' : progress >= 50 ? 'text-amber-500' : 'text-rose-500'}
            />
          </svg>
          <div className="absolute flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono">
            {progress}%
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono">
        <span
          className={`flex items-center gap-1 font-bold ${
            trendDirection === 'up' ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {trendDirection === 'up' ? '↑' : '↓'} {trend}
        </span>
        <span className="text-slate-400">vs last period</span>
      </div>
    </motion.div>
  );
}

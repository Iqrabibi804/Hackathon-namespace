'use client'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { Shield, AlertTriangle, Users, TrendingUp } from 'lucide-react'

const METRICS = [
  {
    label: 'Threats Detected',
    value: 2847,
    percentage: 78,
    color: '#2563EB',
    icon: Shield,
    trend: 12,
    trendLabel: 'this month',
    suffix: '',
  },
  {
    label: 'High/Critical Risks',
    value: 47,
    percentage: 23,
    color: '#EF4444',
    icon: AlertTriangle,
    trend: -3,
    trendLabel: 'from last month',
    suffix: '',
  },
  {
    label: 'Wallets Protected',
    value: 1247,
    percentage: 92,
    color: '#10B981',
    icon: Users,
    trend: 89,
    trendLabel: 'this week',
    suffix: '',
  },
  {
    label: 'Risk Trend',
    value: 65,
    percentage: 65,
    color: '#7C3AED',
    icon: TrendingUp,
    trend: -15,
    trendLabel: '% reduction',
    isText: true,
    textValue: 'Improving',
    suffix: '',
  },
]

function CircleProgress({ percentage, color, size = 52 }: { percentage: number; color: string; size?: number }) {
  const radius = (size / 2) - 4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const [animated, setAnimated] = useState(false)
  const ref = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {/* Background circle */}
      <circle cx={size/2} cy={size/2} r={radius}
        fill="none" stroke="var(--border-light)" strokeWidth={3} />
      {/* Progress circle */}
      <circle ref={ref} cx={size/2} cy={size/2} r={radius}
        fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={circumference}
        strokeDashoffset={animated ? offset : circumference}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
      />
      {/* Percentage text */}
      <text x={size/2} y={size/2 + 4} textAnchor="middle"
        fontSize={11} fontWeight={700} fill={color}>
        {percentage}%
      </text>
    </svg>
  )
}

export default function OverviewCards() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
      {METRICS.map((m, i) => (
        <div key={m.label} className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${m.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={14} color={m.color} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{m.label}</span>
            </div>
            <CircleProgress percentage={m.percentage} color={m.color} />
          </div>
          
          {m.isText ? (
            <p style={{ fontSize: 32, fontWeight: 700, fontFamily: 'DM Sans', color: m.color, lineHeight: 1 }}>
              {m.textValue}
            </p>
          ) : (
            <p style={{ fontSize: 40, fontWeight: 700, fontFamily: 'JetBrains Mono',
              color: 'var(--text-primary)', lineHeight: 1 }}>
              {inView ? <CountUp end={m.value} duration={1.8} delay={i * 0.1} separator="," /> : 0}
            </p>
          )}

          <p style={{ fontSize: 12, marginTop: 8,
            color: m.trend > 0 ? 'var(--success)' : 'var(--danger)' }}>
            {m.trend > 0 ? '↑' : '↓'} {Math.abs(m.trend)} {m.trendLabel}
          </p>
        </div>
      ))}
    </div>
  )
}

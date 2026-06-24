'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DATA = [
  { month: 'Jan', riskScore: 45, threatsBlocked: 12 },
  { month: 'Feb', riskScore: 52, threatsBlocked: 18 },
  { month: 'Mar', riskScore: 38, threatsBlocked: 8 },
  { month: 'Apr', riskScore: 61, threatsBlocked: 25 },
  { month: 'May', riskScore: 55, threatsBlocked: 20 },
  { month: 'Jun', riskScore: 42, threatsBlocked: 14 },
  { month: 'Jul', riskScore: 68, threatsBlocked: 31 },
  { month: 'Aug', riskScore: 35, threatsBlocked: 9 },
  { month: 'Sep', riskScore: 48, threatsBlocked: 16 },
  { month: 'Oct', riskScore: 29, threatsBlocked: 7 },
  { month: 'Nov', riskScore: 41, threatsBlocked: 13 },
  { month: 'Dec', riskScore: 33, threatsBlocked: 11 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid var(--border-light)',
      borderRadius: 10, padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 3, height: 14, background: '#2563EB', borderRadius: 2 }} />
        <span style={{ fontSize: 13 }}>Risk Score: <b>{payload[0]?.value}</b></span>
        <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>↑ 26%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 3, height: 14, background: '#06B6D4', borderRadius: 2 }} />
        <span style={{ fontSize: 13 }}>Threats: <b>{payload[1]?.value}</b></span>
        <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>↓ 4%</span>
      </div>
    </div>
  )
}

export default function RiskAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.12} />
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="riskScore" stroke="#2563EB" strokeWidth={2.5}
          fill="url(#colorRisk)" dot={false} activeDot={{ r: 5, fill: '#2563EB' }}
          isAnimationActive animationDuration={1200} animationEasing="ease-out" />
        <Area type="monotone" dataKey="threatsBlocked" stroke="#06B6D4" strokeWidth={2}
          fill="url(#colorThreats)" dot={false} activeDot={{ r: 4, fill: '#06B6D4' }}
          isAnimationActive animationDuration={1400} animationEasing="ease-out" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

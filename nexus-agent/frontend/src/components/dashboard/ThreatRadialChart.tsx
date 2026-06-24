'use client'
import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

const THREAT_DATA = [
  { name: 'Flash Loan', value: 38, color: '#F97316' },
  { name: 'Rug Pull', value: 28, color: '#EF4444' },
  { name: 'Phishing', value: 22, color: '#FBBF24' },
  { name: 'Whale Dump', value: 12, color: '#D97706' },
]

const SEVERITY_DATA = [
  { name: 'Critical', value: 23, color: '#DC2626' },
  { name: 'High', value: 35, color: '#F97316' },
  { name: 'Medium', value: 28, color: '#FBBF24' },
  { name: 'Low', value: 14, color: '#A3E635' },
]

const STATUS_DATA = [
  { name: 'Denoised', value: 929, color: '#D1D5DB' },
  { name: 'Open', value: 172, color: '#F97316' },
]

const KPI_METRICS = [
  { label: 'Time Saved', value: '2 Hours', sub: 'Monthly' },
  { label: 'Yr. Dollars Saved', value: '$1.2k', sub: 'Projected' },
  { label: 'System Health', value: '16/16', sub: '' },
  { label: 'Denoised %', value: '35%', sub: '' },
  { label: 'Malicious Alerts', value: '5', sub: '' },
]

const TIME_FILTERS = ['Last 24 Hrs','Last Week','Last Month','Custom']

export default function ThreatRadialChart() {
  const [activeFilter, setActiveFilter] = useState('Last Week')
  const [activeSeverity, setActiveSeverity] = useState('All')

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', minHeight: 500 }}>
      
      {/* Left filter panel */}
      <div style={{ width: 240, borderRight: '1px solid var(--border-light)',
        padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        
        {/* Case types */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>All Case types</p>
          {[{ label:'Email',count:32 },{ label:'Cloud',count:48 },{ label:'Endpoint',count:12 }].map(ct => (
            <div key={ct.label} style={{ display: 'flex', justifyContent: 'space-between',
              padding: '6px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{ct.label}</span>
              <span style={{ fontWeight: 600 }}>{ct.count}</span>
            </div>
          ))}
        </div>

        {/* Cases */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>All Cases</p>
          {['Denoised','Open'].map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 0', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%',
                border: '1.5px solid #D1D5DB', flexShrink: 0 }} />
              {c}
            </label>
          ))}
        </div>

        {/* Severity */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Severity</p>
          {['All','Critical','High','Medium','Low'].map(s => (
            <label key={s} onClick={() => setActiveSeverity(s)}
              style={{ display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 0', cursor: 'pointer', fontSize: 13,
              color: activeSeverity === s ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50',
                background: s === 'All' ? 'transparent' :
                  s === 'Critical' ? '#F97316' : s === 'High' ? '#FBBF24' :
                  s === 'Medium' ? '#FDE68A' : '#FEF9C3',
                border: s === 'All' ? '1.5px solid #D1D5DB' : 'none',
                flexShrink: 0 }} />
              {s}
              {activeSeverity === s && <span style={{ marginLeft: 'auto', fontSize: 12 }}>✓</span>}
            </label>
          ))}
        </div>
      </div>

      {/* Center — concentric donuts */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* KPI strip top */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', padding: '12px 24px', gap: 0 }}>
          {KPI_METRICS.map((m, i) => (
            <div key={m.label} style={{ flex: 1, textAlign: 'center',
              borderRight: i < KPI_METRICS.length - 1 ? '1px solid var(--border-light)' : 'none',
              padding: '0 16px' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{m.label}</p>
              <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{m.value}</p>
              {m.sub && <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.sub}</p>}
            </div>
          ))}
        </div>

        {/* Donut chart */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              {/* Outer ring: Status */}
              <Pie data={STATUS_DATA} cx="50%" cy="50%" outerRadius={155} innerRadius={140}
                dataKey="value" paddingAngle={1}>
                {STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              {/* Middle ring: Severity */}
              <Pie data={SEVERITY_DATA} cx="50%" cy="50%" outerRadius={130} innerRadius={115}
                dataKey="value" paddingAngle={1}>
                {SEVERITY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              {/* Inner ring: Threat type */}
              <Pie data={THREAT_DATA} cx="50%" cy="50%" outerRadius={105} innerRadius={75}
                dataKey="value" paddingAngle={2}>
                {THREAT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid var(--border-light)',
                  borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total Malicious</p>
            <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>24</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>(13%)</p>
          </div>
        </div>
      </div>

      {/* Right: time filter */}
      <div style={{ width: 140, borderLeft: '1px solid var(--border-light)',
        padding: 20, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'right' }}>
            Overall Denoised 929 (73%)
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, textAlign: 'right' }}>
            Overall Open 172 (27%)
          </p>
        </div>
        {TIME_FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 24,
              border: '1px solid var(--border-light)', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              background: activeFilter === f ? 'var(--blue-primary)' : 'white',
              color: activeFilter === f ? 'white' : 'var(--text-secondary)',
              textAlign: 'center', transition: 'all 0.2s' }}>
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

interface KPICardProps {
  title: string
  value: string
  description: string
  trend?: number
  icon: ReactNode
  highlighted?: boolean
}

export default function KPICard({ title, value, description, trend, icon, highlighted = false }: KPICardProps) {
  const bg = highlighted ? 'var(--ws-primary)' : 'var(--ws-white)'
  const textPrimary = highlighted ? '#fff' : 'var(--ws-charcoal)'
  const textSecondary = highlighted ? 'rgba(255,255,255,0.75)' : 'var(--ws-gray-600)'
  const iconBg = highlighted ? 'rgba(255,255,255,0.15)' : 'var(--ws-gray-100)'
  const iconColor = highlighted ? '#fff' : 'var(--ws-primary)'

  const trendPositive = trend !== undefined && trend >= 0
  const trendBg = highlighted
    ? 'rgba(255,255,255,0.18)'
    : trendPositive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'
  const trendColor = highlighted ? '#fff' : trendPositive ? 'var(--ws-success)' : 'var(--ws-danger)'

  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-5"
      style={{
        background: bg,
        border: highlighted ? 'none' : '1px solid var(--ws-gray-200)',
        boxShadow: highlighted
          ? '0 8px 32px rgba(69,29,199,0.25)'
          : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
            style={{ background: trendBg, color: trendColor }}
          >
            {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      {/* Value + labels */}
      <div>
        <div className="text-3xl font-bold tracking-tight" style={{ color: textPrimary }}>
          {value}
        </div>
        <div className="text-sm font-semibold mt-1.5" style={{ color: textPrimary }}>
          {title}
        </div>
        <div className="text-xs mt-0.5" style={{ color: textSecondary }}>
          {description}
        </div>
      </div>
    </div>
  )
}

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
      className="rounded-xl px-8 py-6 flex items-start gap-5"
      style={{
        background: bg,
        border: highlighted ? 'none' : '1px solid var(--ws-gray-200)',
        boxShadow: highlighted
          ? '0 8px 32px rgba(69,29,199,0.25)'
          : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>

      {/* Value + labels */}
      <div className="flex-1 min-w-0">
        <div className="text-4xl font-bold tracking-tight leading-none" style={{ color: textPrimary }}>
          {value}
        </div>
        <div className="text-sm font-semibold mt-2" style={{ color: textPrimary }}>
          {title}
        </div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-xs" style={{ color: textSecondary }}>
            {description}
          </span>
          {trend !== undefined && (
            <span
              className="text-sm font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0"
              style={{ background: trendBg, color: trendColor }}
            >
              {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

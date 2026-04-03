interface KPICardProps {
  title: string
  value: string
  description: string
  trend?: number // percent change, positive or negative
  icon: string
  highlighted?: boolean
}

export default function KPICard({ title, value, description, trend, icon, highlighted = false }: KPICardProps) {
  return (
    <div
      className="ws-card p-6 flex flex-col gap-3"
      style={
        highlighted
          ? { background: 'var(--ws-primary)', border: 'none', color: 'var(--ws-white)' }
          : undefined
      }
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{
            background: highlighted ? 'rgba(255,255,255,0.2)' : 'var(--ws-gray-100)',
          }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: highlighted
                ? 'rgba(255,255,255,0.2)'
                : trend >= 0
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              color: highlighted ? 'white' : trend >= 0 ? 'var(--ws-success)' : 'var(--ws-danger)',
            }}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <div
          className="text-2xl font-bold leading-tight"
          style={{ color: highlighted ? 'white' : 'var(--ws-charcoal)' }}
        >
          {value}
        </div>
        <div
          className="text-sm font-medium mt-0.5"
          style={{ color: highlighted ? 'rgba(255,255,255,0.9)' : 'var(--ws-charcoal)' }}
        >
          {title}
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: highlighted ? 'rgba(255,255,255,0.7)' : 'var(--ws-gray-600)' }}
        >
          {description}
        </div>
      </div>
    </div>
  )
}

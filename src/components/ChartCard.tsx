import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description?: string
  source?: string
  children: ReactNode
  className?: string
}

export default function ChartCard({ title, description, source, children, className = '' }: ChartCardProps) {
  return (
    <div
      className={`rounded-xl bg-white ${className}`}
      style={{
        border: '1px solid var(--ws-gray-200)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-base font-semibold" style={{ color: 'var(--ws-charcoal)' }}>
          {title}
        </h3>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--ws-gray-600)' }}>
            {description}
          </p>
        )}
      </div>
      <div className="px-2 pb-4">{children}</div>
      {source && (
        <div
          className="px-6 pb-4 text-xs"
          style={{ color: 'var(--ws-gray-400)' }}
        >
          Source : {source}
        </div>
      )}
    </div>
  )
}

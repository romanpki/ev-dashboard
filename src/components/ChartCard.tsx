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
    <div className={`ws-card p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--ws-charcoal)' }}>
          {title}
        </h3>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--ws-gray-600)' }}>
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
      {source && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--ws-gray-200)' }}>
          <span className="text-xs" style={{ color: 'var(--ws-gray-400)' }}>
            Source : {source}
          </span>
        </div>
      )}
    </div>
  )
}

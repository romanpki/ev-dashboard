interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  filters: {
    label: string
    value: string
    options: FilterOption[]
    onChange: (value: string) => void
  }[]
}

export default function FilterBar({ filters }: FilterBarProps) {
  return (
    <div
      className="ws-card px-4 py-3 flex flex-wrap gap-4 items-center mb-6"
    >
      {filters.map((filter) => (
        <div key={filter.label} className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: 'var(--ws-gray-600)' }}>
            {filter.label}
          </label>
          <div className="flex gap-1">
            {filter.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => filter.onChange(opt.value)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filter.value === opt.value ? 'var(--ws-primary)' : 'var(--ws-gray-100)',
                  color: filter.value === opt.value ? 'white' : 'var(--ws-charcoal)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

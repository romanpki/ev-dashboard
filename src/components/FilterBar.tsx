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
      className="rounded-xl bg-white flex flex-wrap gap-x-6 gap-y-3 px-5 py-4 mb-6"
      style={{ border: '1px solid var(--ws-gray-200)' }}
    >
      {filters.map((filter) => (
        <div key={filter.label} className="flex items-center gap-3">
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--ws-gray-400)' }}>
            {filter.label}
          </span>
          <div className="flex gap-1">
            {filter.options.map((opt) => {
              const active = filter.value === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => filter.onChange(opt.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
                  style={{
                    background: active ? 'var(--ws-primary)' : 'var(--ws-gray-100)',
                    color: active ? '#fff' : 'var(--ws-charcoal)',
                    border: 'none',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

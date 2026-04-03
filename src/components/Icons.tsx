interface IconProps {
  size?: number
  className?: string
}

export function IconCar({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3.5 9.5L5 5.5H15L16.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="2" y="9.5" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="6" cy="15.5" r="1.5" fill="currentColor"/>
      <circle cx="14" cy="15.5" r="1.5" fill="currentColor"/>
      <path d="M2 12H18" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

export function IconChart({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="11" width="3" height="6" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="8.5" y="7" width="3" height="10" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="14" y="3" width="3" height="14" rx="1" fill="currentColor"/>
      <path d="M2 18H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconBolt({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M11.5 2L4 11H10L8.5 18L16 9H10L11.5 2Z"
        fill="currentColor" stroke="currentColor" strokeWidth="0.5"
        strokeLinejoin="round"/>
    </svg>
  )
}

export function IconTrend({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 13L8 8L11.5 11.5L17 5" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 5H17V9" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

import { useTranslation } from 'react-i18next'

export default function LoadingSpinner() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-10 h-10 rounded-full border-4 animate-spin"
        style={{
          borderColor: 'var(--ws-gray-200)',
          borderTopColor: 'var(--ws-primary)',
        }}
      />
      <span className="text-sm" style={{ color: 'var(--ws-gray-600)' }}>
        {t('common.loading')}
      </span>
    </div>
  )
}

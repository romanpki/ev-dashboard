import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('en') ? 'en' : 'fr'

  const toggle = () => {
    i18n.changeLanguage(current === 'fr' ? 'en' : 'fr')
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
      style={{
        border: '1.5px solid var(--ws-gray-200)',
        color: 'var(--ws-primary)',
        background: 'var(--ws-white)',
      }}
      aria-label="Toggle language"
    >
      <span style={{ opacity: current === 'fr' ? 1 : 0.4 }}>FR</span>
      <span style={{ color: 'var(--ws-gray-400)' }}>/</span>
      <span style={{ opacity: current === 'en' ? 1 : 0.4 }}>EN</span>
    </button>
  )
}

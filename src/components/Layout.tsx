import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'

const navItems = [
  { key: 'dashboard', path: '/', icon: '▦' },
  { key: 'registrations', path: '/registrations', icon: '↗' },
  { key: 'charging', path: '/charging', icon: '⌁' },
  { key: 'map', path: '/map', icon: '◎' },
] as const

export default function Layout() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ws-gray-50)' }}>
      {/* Header */}
      <header
        style={{
          background: 'var(--ws-white)',
          borderBottom: '1px solid var(--ws-gray-200)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#451DC7"/>
                <path d="M15.5 5L8 15.5H13.5L12.5 23L20 12.5H14.5L15.5 5Z" fill="white" strokeLinejoin="round"/>
              </svg>
              <div>
                <div className="font-semibold text-sm leading-tight" style={{ color: 'var(--ws-charcoal)' }}>
                  EV Dashboard
                </div>
                <div className="text-xs leading-tight" style={{ color: 'var(--ws-gray-400)' }}>
                  {t('app.subtitle')}
                </div>
              </div>
            </div>

            {/* Nav — desktop */}
            <nav className="hidden md:flex items-center gap-1 flex-1">
              {navItems.map(({ key, path }) => (
                <NavLink
                  key={key}
                  to={path}
                  end={path === '/'}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap"
                  style={({ isActive }) => ({
                    background: isActive ? 'var(--ws-gray-100)' : 'transparent',
                    color: isActive ? 'var(--ws-primary)' : 'var(--ws-gray-600)',
                    fontWeight: isActive ? 600 : 400,
                  })}
                >
                  {t(`nav.${key}`)}
                </NavLink>
              ))}
            </nav>

            <LanguageToggle />
          </div>

          {/* Nav — mobile */}
          <nav className="md:hidden flex gap-1 pb-2 overflow-x-auto">
            {navItems.map(({ key, path }) => (
              <NavLink
                key={key}
                to={path}
                end={path === '/'}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={({ isActive }) => ({
                  background: isActive ? 'var(--ws-gray-100)' : 'transparent',
                  color: isActive ? 'var(--ws-primary)' : 'var(--ws-gray-600)',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--ws-dark)', color: 'var(--ws-gray-200)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--ws-light)' }}>
                {t('footer.sources')}
              </div>
              <div className="text-sm opacity-75">{t('footer.sourcesList')}</div>
              <div className="text-xs opacity-50 mt-1">{t('footer.license')}</div>
            </div>
            <div className="text-sm opacity-60 md:text-right">
              <div>{t('footer.updatedMonthly')}</div>
              <div className="mt-1">
                {t('footer.madeBy')}{' '}
                <a href="https://wavestone.com" target="_blank" rel="noopener noreferrer"
                  className="underline opacity-80 hover:opacity-100 transition-opacity">
                  Wavestone
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

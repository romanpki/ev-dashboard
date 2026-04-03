import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'

const navItems = [
  { key: 'dashboard', path: '/' },
  { key: 'registrations', path: '/registrations' },
  { key: 'charging', path: '/charging' },
  { key: 'map', path: '/map' },
] as const

export default function Layout() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ws-gray-50)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'var(--ws-white)',
          borderBottom: '1px solid var(--ws-gray-200)',
          boxShadow: 'var(--ws-shadow-sm)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg text-white text-lg font-bold"
                style={{ background: 'var(--ws-primary)' }}
              >
                ⚡
              </div>
              <div>
                <div className="font-bold text-base leading-tight" style={{ color: 'var(--ws-charcoal)' }}>
                  {t('app.title')}
                </div>
                <div className="text-xs leading-tight" style={{ color: 'var(--ws-gray-600)' }}>
                  {t('app.subtitle')}
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ key, path }) => (
                <NavLink
                  key={key}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white'
                        : 'hover:bg-gray-100'
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'var(--ws-primary)' : undefined,
                    color: isActive ? 'var(--ws-white)' : 'var(--ws-charcoal)',
                  })}
                >
                  {t(`nav.${key}`)}
                </NavLink>
              ))}
            </nav>

            {/* Language toggle */}
            <LanguageToggle />
          </div>

          {/* Mobile nav */}
          <nav className="md:hidden flex gap-1 pb-2 overflow-x-auto">
            {navItems.map(({ key, path }) => (
              <NavLink
                key={key}
                to={path}
                end={path === '/'}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={({ isActive }) => ({
                  background: isActive ? 'var(--ws-primary)' : undefined,
                  color: isActive ? 'var(--ws-white)' : 'var(--ws-charcoal)',
                })}
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="mt-8"
        style={{
          background: 'var(--ws-dark)',
          color: 'var(--ws-gray-200)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="font-semibold text-white mb-2">{t('footer.sources')}</div>
              <div className="text-sm opacity-80">{t('footer.sourcesList')}</div>
              <div className="text-xs opacity-60 mt-1">{t('footer.license')}</div>
            </div>
            <div className="text-sm opacity-70 md:text-right">
              <div>{t('footer.updatedMonthly')}</div>
              <div className="mt-1">
                {t('footer.madeBy')}{' '}
                <a
                  href="https://wavestone.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline opacity-90 hover:opacity-100"
                >
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

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
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--ws-gray-50)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 overflow-y-auto"
        style={{
          width: 240,
          background: 'var(--ws-sidebar-bg)',
          borderRight: '1px solid var(--ws-gray-200)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
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

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--ws-gray-200)', margin: '0 12px 8px' }} />

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ key, path, icon }) => (
            <NavLink
              key={key}
              to={path}
              end={path === '/'}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative"
              style={({ isActive }) => ({
                background: isActive ? 'var(--ws-sidebar-active)' : 'transparent',
                color: isActive ? 'var(--ws-primary)' : 'var(--ws-gray-600)',
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? '3px solid var(--ws-primary)' : '3px solid transparent',
              })}
            >
              <span className="text-base w-5 text-center leading-none">{icon}</span>
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar (language toggle only) */}
        <header
          className="flex items-center justify-end px-10 py-3 flex-shrink-0"
          style={{
            background: 'var(--ws-gray-50)',
            borderBottom: '1px solid var(--ws-gray-200)',
          }}
        >
          <LanguageToggle />
        </header>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0" style={{ background: 'var(--ws-dark)', color: 'var(--ws-gray-200)' }}>
          <div className="px-10 py-6">
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
    </div>
  )
}

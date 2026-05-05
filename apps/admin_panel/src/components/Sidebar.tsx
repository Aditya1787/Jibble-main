import type { Page } from '../App'

const navItems = [
  { id: 'dashboard',  label: 'Dashboard',  icon: '⊞' },
  { id: 'users',      label: 'Users',       icon: '👥' },
  { id: 'posts',      label: 'Posts',       icon: '📝' },
  { id: 'reports',    label: 'Reports',     icon: '🚩' },
  { id: 'analytics',  label: 'Analytics',   icon: '📊' },
  { id: 'settings',   label: 'Settings',    icon: '⚙️' },
] as const

interface Props {
  activePage: Page
  onNavigate: (page: Page) => void
}

export default function Sidebar({ activePage, onNavigate }: Props) {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, var(--accent), #a855f7)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800,
            boxShadow: '0 0 20px var(--accent-glow)',
          }}>J</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Jibble</div>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>Admin Console</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '8px 12px 12px', textTransform: 'uppercase' }}>
          Navigation
        </div>
        {navItems.map(item => {
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 16px',
                marginBottom: 4,
                borderRadius: 10,
                border: 'none',
                background: active ? 'linear-gradient(135deg, var(--accent-glow), rgba(168,85,247,0.15))' : 'transparent',
                color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                textAlign: 'left',
                transition: 'all 0.2s',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700,
        }}>A</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Super Admin</div>
        </div>
      </div>
    </aside>
  )
}

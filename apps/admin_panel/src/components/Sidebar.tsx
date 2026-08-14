import type { Page } from '../App'
import { useAuthStore } from '../store/useAuthStore'

const navItems = [
  { id: 'dashboard',  label: 'Dashboard',       icon: '⊞' },
  { id: 'profile',    label: 'My Profile',      icon: '👤' },
  { id: 'hierarchy',  label: 'Org Hierarchy',   icon: '🌳' },
  { id: 'about',      label: 'About Jibble',    icon: 'ℹ️' },
  { id: 'users',      label: 'Users',           icon: '👥' },
  { id: 'teams',      label: 'Teams & Roster',  icon: '🏢' },
  { id: 'tasks',      label: 'Tasks Dashboard', icon: '📋' },
  { id: 'privacy',    label: 'Privacy & Policy', icon: '🛡️' },
  { id: 'posts',      label: 'Posts',           icon: '📝' },
  { id: 'reports',    label: 'Reports',         icon: '🚩' },
  { id: 'analytics',  label: 'Analytics',       icon: '📊' },
  { id: 'settings',   label: 'Settings',        icon: '⚙️' },
] as const

interface Props {
  activePage: Page
  onNavigate: (page: Page) => void
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
}

export default function Sidebar({ activePage, onNavigate, theme = 'light', onToggleTheme }: Props) {
  const { user, logout } = useAuthStore()

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: 'calc(100vh - 32px)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border-light)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), var(--nm-flat)',
      position: 'fixed',
      top: '16px',
      left: '16px',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      padding: '16px',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    }}>
      {/* Logo Card & Theme Switcher */}
      <div className="nm-card-inset" style={{
        padding: '14px',
        marginBottom: '20px',
        borderRadius: '16px',
        background: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--accent)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: '#fff',
            boxShadow: '2px 2px 4px var(--shadow-dark), -2px -2px 4px var(--shadow-light)',
          }}>J</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Jibble</div>
            <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Admin Console</div>
          </div>
        </div>

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="nm-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{
              width: 34,
              height: 34,
              padding: 0,
              borderRadius: 10,
              fontSize: 16,
              cursor: 'pointer',
              border: 'none',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--nm-flat-xs)'
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '0 8px 4px', textTransform: 'uppercase' }}>
          Navigation
        </div>
        {navItems.map(item => {
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={active ? 'nm-card-inset' : 'nm-btn'}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '12px',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: active ? 700 : 500,
                textAlign: 'left',
                boxShadow: active ? 'var(--nm-inset-sm)' : 'none',
                background: active ? 'var(--bg-hover)' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--bg-hover)'
                  e.currentTarget.style.boxShadow = 'var(--nm-flat-xs)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Profile Footer Panel */}
      {user && (
        <div className="nm-card" style={{
          padding: '12px',
          marginTop: 'auto',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'var(--bg-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Avatar */}
            <div style={{
              width: 38, height: 38,
              background: 'var(--bg-primary)',
              borderRadius: '50%',
              boxShadow: 'var(--nm-inset-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: user.avatar.length > 4 ? '18px' : '22px',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              {user.avatar.startsWith('data:image') ? (
                <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.avatar
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                @{user.username}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.role}
              </div>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="nm-btn" 
            style={{
              padding: '6px 12px', 
              fontSize: '11px', 
              width: '100%',
              color: 'var(--danger)',
              justifyContent: 'center',
              borderRadius: '8px',
              boxShadow: 'var(--nm-flat-xs)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </aside>
  )
}

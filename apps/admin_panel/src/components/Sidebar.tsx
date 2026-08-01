import type { Page } from '../App'
import { useAuthStore } from '../store/useAuthStore'

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
  const { user, logout } = useAuthStore()

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--bg-secondary)',
      boxShadow: '4px 0 15px var(--shadow-dark), 1px 0 0 rgba(255,255,255,0.5)',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      padding: '12px',
    }}>
      {/* Logo Card */}
      <div className="nm-card-inset" style={{
        padding: '16px',
        marginBottom: '20px',
        borderRadius: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38,
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
                background: active ? 'var(--bg-primary)' : 'transparent',
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

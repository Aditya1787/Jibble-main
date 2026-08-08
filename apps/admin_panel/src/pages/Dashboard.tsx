import StatCard from '../components/StatCard'
import { useAuthStore } from '../store/useAuthStore'
import { useTeamTaskStore } from '../store/useTeamTaskStore'

const recentUsers = [
  { name: 'Aditya Kumar',    college: 'IIT Delhi',      joined: '2 min ago',   status: 'active' },
  { name: 'Priya Sharma',    college: 'BITS Pilani',    joined: '18 min ago',  status: 'active' },
  { name: 'Rahul Verma',     college: 'VIT Vellore',    joined: '1 hr ago',    status: 'pending' },
  { name: 'Neha Gupta',      college: 'NIT Trichy',     joined: '3 hr ago',    status: 'active' },
  { name: 'Arjun Singh',     college: 'DTU Delhi',      joined: '5 hr ago',    status: 'banned' },
]

const statusColor: Record<string, string> = {
  active:  'var(--accent)',
  pending: 'var(--warning)',
  banned:  'var(--danger)',
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const { teams, tasks, policies } = useTeamTaskStore()

  const mandatoryCount = policies.filter(p => p.isMandatory).length
  const avgCompliance = Math.round(policies.reduce((acc, p) => acc + p.complianceRate, 0) / (policies.length || 1))

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
          Corporate Workspace Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
          Welcome back, <strong style={{ color: 'var(--accent)' }}>@{user?.username || 'Admin'}</strong> — corporate position: <strong style={{ color: 'var(--accent)' }}>{user?.role || 'Founder / CEO'}</strong>.
        </p>
      </div>

      {/* Primary KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <StatCard title="Active Teams"      value={`${teams.length} Teams`} change="100%" positive icon="🏢" color="#336659" />
        <StatCard title="Assigned Tasks"    value={`${tasks.length} Active`} change="12.4%" positive icon="📋" color="#3b82f6" />
        <StatCard title="Policy Sign-offs"  value={`${avgCompliance}% Compliance`} change="4.2%" positive icon="🛡️" color="#10b981" />
        <StatCard title="Open Reports"      value="47" change="3.0%" positive={false} icon="🚩" color="#b34a4a" />
      </div>

      {/* Two column section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }}>
        {/* Recent Signups */}
        <div className="nm-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Recent Signups</h2>
            <button className="nm-btn" style={{ padding: '6px 12px', fontSize: 11, borderRadius: '8px', boxShadow: 'var(--nm-flat-xs)' }}>
              View all →
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recentUsers.map((u, i) => (
              <div key={i} className="nm-card-inset" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '14px',
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 38, height: 38,
                    background: `hsl(${i * 60 + 120}, 45%, 45%)`,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#fff',
                    flexShrink: 0,
                    boxShadow: 'var(--nm-flat-xs)'
                  }}>{u.name[0]}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{u.college}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: statusColor[u.status],
                    background: 'var(--bg-primary)',
                    boxShadow: 'var(--nm-flat-xs)',
                    padding: '3px 10px', borderRadius: 20,
                    textTransform: 'uppercase'
                  }}>{u.status}</span>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>{u.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Quick Actions */}
          <div className="nm-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Review flagged posts',   count: 12, color: 'var(--danger)' },
                { label: 'Pending verifications',  count: 7,  color: 'var(--warning)' },
                { label: 'Unresolved reports',     count: 47, color: 'var(--accent)' },
                { label: 'New college requests',   count: 3,  color: 'var(--accent)' },
              ].map((a, i) => (
                <div key={i} className="nm-card-inset" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', borderRadius: 12,
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{a.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800,
                    background: a.color,
                    color: '#fff',
                    borderRadius: 10,
                    padding: '3px 8px',
                    minWidth: 28, textAlign: 'center',
                  }}>{a.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform health */}
          <div className="nm-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>Platform Health</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'API Uptime',      value: 99.97, color: 'var(--accent)' },
                { label: 'DB Response',     value: 87,    color: 'var(--warning)' },
                { label: 'CDN Hit Rate',    value: 94,    color: 'var(--accent)' },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{m.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.value}%</span>
                  </div>
                  <div className="nm-card-inset" style={{ borderRadius: 6, height: 10, overflow: 'hidden', padding: '1px', boxShadow: 'inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light)' }}>
                    <div style={{
                      width: `${m.value}%`,
                      height: '100%',
                      background: m.color,
                      borderRadius: 4,
                      boxShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

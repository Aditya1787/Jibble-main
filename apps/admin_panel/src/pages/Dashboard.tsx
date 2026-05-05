import StatCard from '../components/StatCard'

const recentUsers = [
  { name: 'Aditya Kumar',    college: 'IIT Delhi',      joined: '2 min ago',   status: 'active' },
  { name: 'Priya Sharma',    college: 'BITS Pilani',    joined: '18 min ago',  status: 'active' },
  { name: 'Rahul Verma',     college: 'VIT Vellore',    joined: '1 hr ago',    status: 'pending' },
  { name: 'Neha Gupta',      college: 'NIT Trichy',     joined: '3 hr ago',    status: 'active' },
  { name: 'Arjun Singh',     college: 'DTU Delhi',      joined: '5 hr ago',    status: 'banned' },
]

const statusColor: Record<string, string> = {
  active:  'var(--success)',
  pending: 'var(--warning)',
  banned:  'var(--danger)',
}

export default function Dashboard() {
  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Welcome back, Admin — here's what's happening on Jibble.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard title="Total Users"    value="24,891" change="12.4%" positive icon="👥" color="#6c63ff" />
        <StatCard title="Active Today"   value="3,214"  change="8.2%"  positive icon="🔥" color="#10b981" />
        <StatCard title="New Posts"      value="1,842"  change="5.1%"  positive icon="📝" color="#f59e0b" />
        <StatCard title="Open Reports"   value="47"     change="3.0%"  positive={false} icon="🚩" color="#ef4444" />
      </div>

      {/* Two column section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Signups */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Signups</h2>
            <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>View all →</span>
          </div>
          {recentUsers.map((u, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < recentUsers.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36,
                  background: `hsl(${i * 50 + 220}, 70%, 55%)`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  flexShrink: 0,
                }}>{u.name[0]}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.college}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: statusColor[u.status],
                  background: `${statusColor[u.status]}1a`,
                  padding: '3px 10px', borderRadius: 20,
                }}>{u.status}</span>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{u.joined}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
            {[
              { label: 'Review flagged posts',   count: 12, color: 'var(--danger)' },
              { label: 'Pending verifications',  count: 7,  color: 'var(--warning)' },
              { label: 'Unresolved reports',     count: 47, color: 'var(--accent)' },
              { label: 'New college requests',   count: 3,  color: 'var(--success)' },
            ].map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', marginBottom: 8,
                background: 'var(--bg-secondary)', borderRadius: 10,
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-hover)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)'}
              >
                <span style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  background: a.color,
                  color: '#fff',
                  borderRadius: 20,
                  padding: '2px 10px',
                  minWidth: 30, textAlign: 'center',
                }}>{a.count}</span>
              </div>
            ))}
          </div>

          {/* Platform health */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Platform Health</h2>
            {[
              { label: 'API Uptime',      value: 99.97, color: 'var(--success)' },
              { label: 'DB Response',     value: 87,    color: 'var(--warning)' },
              { label: 'CDN Hit Rate',    value: 94,    color: 'var(--success)' },
            ].map((m, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{m.value}%</span>
                </div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${m.value}%`, height: '100%', background: m.color, borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

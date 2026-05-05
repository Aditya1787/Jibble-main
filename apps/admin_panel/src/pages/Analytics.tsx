const weekData = [
  { day: 'Mon', users: 320, posts: 120 },
  { day: 'Tue', users: 480, posts: 210 },
  { day: 'Wed', users: 390, posts: 160 },
  { day: 'Thu', users: 560, posts: 280 },
  { day: 'Fri', users: 720, posts: 340 },
  { day: 'Sat', users: 410, posts: 190 },
  { day: 'Sun', users: 280, posts: 140 },
]

const maxUsers = Math.max(...weekData.map(d => d.users))
const maxPosts = Math.max(...weekData.map(d => d.posts))

const topColleges = [
  { name: 'IIT Delhi',    users: 3240, pct: 88 },
  { name: 'BITS Pilani',  users: 2870, pct: 77 },
  { name: 'VIT Vellore',  users: 2410, pct: 65 },
  { name: 'NIT Trichy',   users: 1980, pct: 53 },
  { name: 'DTU Delhi',    users: 1740, pct: 47 },
]

export default function Analytics() {
  return (
    <div style={{ padding: '32px 36px', maxWidth: 1300 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Platform growth and engagement metrics (mock data).</p>
      </div>

      {/* Weekly chart */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Weekly Activity</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180 }}>
          {weekData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', display: 'flex', gap: 4, alignItems: 'flex-end', height: 150 }}>
                <div style={{
                  flex: 1, background: 'var(--accent)',
                  height: `${(d.users / maxUsers) * 100}%`,
                  borderRadius: '6px 6px 0 0',
                  minHeight: 4,
                  opacity: 0.85,
                  transition: 'height 0.5s',
                }} title={`Users: ${d.users}`} />
                <div style={{
                  flex: 1, background: '#10b981',
                  height: `${(d.posts / maxPosts) * 100}%`,
                  borderRadius: '6px 6px 0 0',
                  minHeight: 4,
                  opacity: 0.75,
                  transition: 'height 0.5s',
                }} title={`Posts: ${d.posts}`} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{d.day}</span>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, background: 'var(--accent)', borderRadius: 3 }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Active Users</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, background: '#10b981', borderRadius: 3 }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>New Posts</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Top colleges */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Top Colleges by Users</h2>
          {topColleges.map((c, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{c.users.toLocaleString()}</span>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), #a855f7)', borderRadius: 4, transition: 'width 0.6s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Content breakdown */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Content Breakdown</h2>
          {[
            { label: 'Tech',    pct: 34, color: 'var(--accent)' },
            { label: 'Events',  pct: 25, color: '#10b981' },
            { label: 'Career',  pct: 22, color: '#f59e0b' },
            { label: 'General', pct: 12, color: '#a855f7' },
            { label: 'Other',   pct: 7,  color: 'var(--text-muted)' },
          ].map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, background: cat.color, borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ fontSize: 13, flex: 1 }}>{cat.label}</span>
              <div style={{ width: 120, background: 'var(--bg-secondary)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.color, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, width: 30, textAlign: 'right', color: 'var(--text-secondary)' }}>{cat.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

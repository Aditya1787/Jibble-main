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
    <div style={{ padding: '32px 36px', maxWidth: 1300, display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Platform growth and engagement metrics (mock data).</p>
      </div>

      {/* Weekly chart */}
      <div className="nm-card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Weekly Activity</h2>
        
        {/* Graph Inner Panel */}
        <div className="nm-card-inset" style={{ padding: '24px 20px', borderRadius: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180 }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', display: 'flex', gap: 6, alignItems: 'flex-end', height: 150 }}>
                  {/* Users Bar */}
                  <div style={{
                    flex: 1,
                    background: 'var(--accent)',
                    height: `${(d.users / maxUsers) * 100}%`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                    transition: 'height 0.5s',
                  }} title={`Users: ${d.users}`} />
                  
                  {/* Posts Bar */}
                  <div style={{
                    flex: 1,
                    background: 'var(--warning)',
                    height: `${(d.posts / maxPosts) * 100}%`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                    transition: 'height 0.5s',
                  }} title={`Posts: ${d.posts}`} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 14, height: 14, background: 'var(--accent)', borderRadius: 4, boxShadow: 'var(--nm-flat-xs)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Active Users</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 14, height: 14, background: 'var(--warning)', borderRadius: 4, boxShadow: 'var(--nm-flat-xs)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>New Posts</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Top colleges */}
        <div className="nm-card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>Top Colleges by Users</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topColleges.map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>{c.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>{c.users.toLocaleString()}</span>
                </div>
                <div className="nm-card-inset" style={{ borderRadius: 6, height: 10, overflow: 'hidden', padding: '1px', boxShadow: 'inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light)' }}>
                  <div style={{ width: `${c.pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 4, transition: 'width 0.6s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content breakdown */}
        <div className="nm-card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>Content Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Tech',    pct: 34, color: 'var(--accent)' },
              { label: 'Events',  pct: 25, color: 'var(--accent-light)' },
              { label: 'Career',  pct: 22, color: 'var(--warning)' },
              { label: 'General', pct: 12, color: 'var(--text-muted)' },
              { label: 'Other',   pct: 7,  color: 'var(--danger)' },
            ].map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 12, height: 12, background: cat.color, borderRadius: '50%', flexShrink: 0, boxShadow: 'var(--nm-flat-xs)' }} />
                <span style={{ fontSize: 13, flex: 1, fontWeight: 600, color: 'var(--text-secondary)' }}>{cat.label}</span>
                
                <div className="nm-card-inset" style={{ width: 120, borderRadius: 6, height: 8, overflow: 'hidden', padding: '1px' }}>
                  <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.color, borderRadius: 4 }} />
                </div>
                
                <span style={{ fontSize: 12, fontWeight: 700, width: 34, textAlign: 'right', color: 'var(--text-primary)' }}>{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

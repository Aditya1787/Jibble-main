const reports = [
  { id: 1, reporter: 'Priya Sharma',  reported: 'Arjun Singh',  type: 'Harassment',        desc: 'User sent offensive messages in DM.',           status: 'open',     time: '1h ago' },
  { id: 2, reporter: 'Riya Patel',    reported: 'Karan Mehta',  type: 'Spam',              desc: 'User is posting the same promotional content.',  status: 'reviewing', time: '3h ago' },
  { id: 3, reporter: 'Neha Gupta',    reported: 'Unknown Post', type: 'Misinformation',    desc: 'Post contains false placement statistics.',      status: 'resolved', time: '6h ago' },
  { id: 4, reporter: 'Rahul Verma',   reported: 'Priya Sharma', type: 'Impersonation',     desc: 'Profile claims to be a faculty member.',         status: 'open',     time: '8h ago' },
  { id: 5, reporter: 'Karan Mehta',   reported: 'Anonymous',   type: 'Inappropriate content', desc: 'Anonymous post with explicit language.',     status: 'resolved', time: '1d ago' },
]

const statusStyle: Record<string, { color: string; bg: string }> = {
  open:      { color: 'var(--danger)',  bg: 'rgba(179,74,74,0.1)' },
  reviewing: { color: 'var(--warning)', bg: 'rgba(194,141,56,0.1)' },
  resolved:  { color: 'var(--accent)',  bg: 'rgba(51,102,89,0.1)' },
}

export default function Reports() {
  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200, display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>Reports</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Handle user-submitted reports and violations.</p>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: '🔴 Open', count: 2, color: 'var(--danger)' },
          { label: '🟡 Reviewing', count: 1, color: 'var(--warning)' },
          { label: '🟢 Resolved', count: 2, color: 'var(--accent)' }
        ].map((item, idx) => (
          <div key={idx} className="nm-card" style={{ padding: '14px 24px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.count}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {reports.map(r => {
          const ss = statusStyle[r.status]
          return (
            <div key={r.id} className="nm-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    background: 'var(--bg-primary)',
                    boxShadow: 'var(--nm-flat-xs)',
                    padding: '4px 10px',
                    borderRadius: 12,
                    textTransform: 'uppercase'
                  }}>{r.type}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{r.time}</span>
                </div>
                
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: ss.color,
                  background: 'var(--bg-primary)',
                  boxShadow: 'var(--nm-flat-xs)',
                  padding: '4px 10px',
                  borderRadius: 12,
                  textTransform: 'uppercase'
                }}>{r.status}</span>
              </div>
              
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6, fontWeight: 500 }}>
                {r.desc}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{r.reporter}</strong> reported <strong style={{ color: 'var(--danger)' }}>{r.reported}</strong>
                </div>
                
                <div style={{ display: 'flex', gap: 8 }}>
                  {r.status === 'open' && (
                    <>
                      <button className="nm-btn" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, color: 'var(--warning)', boxShadow: 'var(--nm-flat-xs)' }}>Review</button>
                      <button className="nm-btn" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, color: 'var(--danger)', boxShadow: 'var(--nm-flat-xs)' }}>Action</button>
                    </>
                  )}
                  {r.status === 'reviewing' && (
                    <button className="nm-btn" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, color: 'var(--accent)', boxShadow: 'var(--nm-flat-xs)' }}>Resolve</button>
                  )}
                  {r.status === 'resolved' && (
                    <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>✔ Resolved</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

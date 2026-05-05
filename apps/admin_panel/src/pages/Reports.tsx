const reports = [
  { id: 1, reporter: 'Priya Sharma',  reported: 'Arjun Singh',  type: 'Harassment',        desc: 'User sent offensive messages in DM.',           status: 'open',     time: '1h ago' },
  { id: 2, reporter: 'Riya Patel',    reported: 'Karan Mehta',  type: 'Spam',              desc: 'User is posting the same promotional content.',  status: 'reviewing', time: '3h ago' },
  { id: 3, reporter: 'Neha Gupta',    reported: 'Unknown Post', type: 'Misinformation',    desc: 'Post contains false placement statistics.',      status: 'resolved', time: '6h ago' },
  { id: 4, reporter: 'Rahul Verma',   reported: 'Priya Sharma', type: 'Impersonation',     desc: 'Profile claims to be a faculty member.',         status: 'open',     time: '8h ago' },
  { id: 5, reporter: 'Karan Mehta',   reported: 'Anonymous',   type: 'Inappropriate content', desc: 'Anonymous post with explicit language.',     status: 'resolved', time: '1d ago' },
]

const statusStyle: Record<string, { color: string; bg: string }> = {
  open:      { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)' },
  reviewing: { color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  resolved:  { color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
}

export default function Reports() {
  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Reports</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Handle user-submitted reports and violations.</p>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[['🔴 Open', 2, 'var(--danger)'], ['🟡 Reviewing', 1, 'var(--warning)'], ['🟢 Resolved', 2, 'var(--success)']].map(([label, count, color]) => (
          <div key={String(label)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 22px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: String(color) }}>{count}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {reports.map(r => {
          const ss = statusStyle[r.status]
          return (
            <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-glow)', padding: '3px 10px', borderRadius: 20 }}>{r.type}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.time}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: ss.color, background: ss.bg, padding: '4px 12px', borderRadius: 20, textTransform: 'capitalize' }}>{r.status}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>{r.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{r.reporter}</strong> reported <strong style={{ color: 'var(--danger)' }}>{r.reported}</strong>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {r.status === 'open' && <>
                    <button style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', background: 'var(--warning)', color: '#000', cursor: 'pointer' }}>Review</button>
                    <button style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', cursor: 'pointer' }}>Take Action</button>
                  </>}
                  {r.status === 'reviewing' && (
                    <button style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', cursor: 'pointer' }}>Resolve</button>
                  )}
                  {r.status === 'resolved' && (
                    <span style={{ fontSize: 12, color: 'var(--success)' }}>✔ Resolved</span>
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

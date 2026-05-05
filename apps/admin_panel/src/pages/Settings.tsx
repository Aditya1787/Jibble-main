export default function Settings() {
  return (
    <div style={{ padding: '32px 36px', maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Configure platform-wide settings and feature flags.</p>
      </div>

      {[
        {
          section: 'General',
          items: [
            { label: 'Platform Name', type: 'input', value: 'Jibble' },
            { label: 'Support Email', type: 'input', value: 'support@jibble.app' },
          ],
        },
        {
          section: 'Feature Flags',
          items: [
            { label: 'Anonymous Posts (Circle)',   type: 'toggle', value: true },
            { label: 'Stories',                    type: 'toggle', value: true },
            { label: 'Smart Matching',             type: 'toggle', value: false },
            { label: 'Events',                     type: 'toggle', value: true },
            { label: 'Group Chats',                type: 'toggle', value: true },
          ],
        },
        {
          section: 'Moderation',
          items: [
            { label: 'AI Content Filter',     type: 'toggle', value: true },
            { label: 'Auto-ban on 5 reports', type: 'toggle', value: false },
          ],
        },
      ].map(group => (
        <div key={group.section} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--accent)' }}>{group.section}</h2>
          {group.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0',
              borderBottom: i < group.items.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              {item.type === 'input' ? (
                <input
                  defaultValue={String(item.value)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '8px 14px',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none',
                    width: 260,
                  }}
                />
              ) : (
                <div style={{
                  width: 46, height: 26,
                  background: item.value ? 'var(--accent)' : 'var(--bg-secondary)',
                  borderRadius: 13,
                  cursor: 'pointer',
                  position: 'relative',
                  border: '1px solid var(--border)',
                  transition: 'background 0.2s',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 3,
                    left: item.value ? 22 : 3,
                    width: 18, height: 18,
                    background: '#fff',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <button style={{
        padding: '12px 32px', fontSize: 14, fontWeight: 700,
        background: 'linear-gradient(135deg, var(--accent), #a855f7)',
        color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
        boxShadow: '0 4px 20px var(--accent-glow)',
      }}>Save Changes</button>
    </div>
  )
}

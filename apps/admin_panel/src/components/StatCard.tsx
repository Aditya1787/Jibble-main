interface Props {
  title: string
  value: string
  change: string
  positive: boolean
  icon: string
  color: string
}

export default function StatCard({ title, value, change, positive, icon, color }: Props) {
  return (
    <div className="nm-card" style={{
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100,
        background: color,
        borderRadius: '50%',
        opacity: 0.05,
        filter: 'blur(20px)',
      }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
          <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
          <p style={{ fontSize: 11, marginTop: 10, color: positive ? 'var(--accent)' : 'var(--danger)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{positive ? '▲' : '▼'}</span> <span>{change} vs last month</span>
          </p>
        </div>
        <div style={{
          width: 48, height: 48,
          background: 'var(--bg-primary)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          boxShadow: 'var(--nm-flat-sm)',
          flexShrink: 0,
        }}>{icon}</div>
      </div>
    </div>
  )
}

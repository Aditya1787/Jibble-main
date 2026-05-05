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
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${color}22`
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
    }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100,
        background: color,
        borderRadius: '50%',
        opacity: 0.08,
        filter: 'blur(20px)',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
          <p style={{ fontSize: 12, marginTop: 8, color: positive ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
            {positive ? '▲' : '▼'} {change} vs last month
          </p>
        </div>
        <div style={{
          width: 48, height: 48,
          background: color,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, opacity: 0.9,
          flexShrink: 0,
        }}>{icon}</div>
      </div>
    </div>
  )
}

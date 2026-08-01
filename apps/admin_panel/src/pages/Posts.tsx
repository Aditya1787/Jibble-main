import { useState } from 'react'

const mockPosts = [
  { id: 1, author: 'Aditya Kumar',  college: 'IIT Delhi',   content: 'Just finished my ML project — built a sentiment analyser for college reviews 🎉',        likes: 142, comments: 28, category: 'Tech',    flagged: false, time: '2h ago' },
  { id: 2, author: 'Priya Sharma',  college: 'BITS Pilani', content: 'Looking for teammates for the upcoming hackathon at BITS. DM if interested!',            likes: 87,  comments: 14, category: 'Events',  flagged: false, time: '4h ago' },
  { id: 3, author: 'Arjun Singh',   college: 'DTU Delhi',   content: 'This post contains inappropriate content that has been flagged by multiple users...',    likes: 3,   comments: 7,  category: 'General', flagged: true,  time: '6h ago' },
  { id: 4, author: 'Neha Gupta',    college: 'NIT Trichy',  content: 'Campus placement season is here! Sharing tips from my recent interviews at top MNCs.',   likes: 234, comments: 56, category: 'Career',  flagged: false, time: '8h ago' },
  { id: 5, author: 'Riya Patel',    college: 'IIIT Hyd',    content: 'Organised a coding bootcamp for freshers today. 60+ students attended!',                 likes: 189, comments: 33, category: 'Events',  flagged: false, time: '12h ago' },
  { id: 6, author: 'Karan Mehta',   college: 'Manipal',     content: 'Suspicious content flagged by AI filter — potential spam.',                              likes: 1,   comments: 0,  category: 'General', flagged: true,  time: '1d ago' },
]

const categoryColor: Record<string, string> = {
  Tech:    'var(--accent)',
  Events:  'var(--accent)',
  General: 'var(--text-muted)',
  Career:  'var(--warning)',
}

export default function Posts() {
  const [filter, setFilter] = useState('all')

  const filtered = mockPosts.filter(p => {
    if (filter === 'flagged') return p.flagged
    if (filter === 'safe')    return !p.flagged
    return true
  })

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>Posts</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Review and moderate all platform posts.</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[['all', 'All Posts'], ['flagged', '🚩 Flagged'], ['safe', '✅ Safe']].map(([val, label]) => {
          const isActive = filter === val
          return (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={isActive ? 'nm-card-inset' : 'nm-btn'}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-primary)' : 'var(--bg-card)',
                boxShadow: isActive ? 'var(--nm-inset-sm)' : 'var(--nm-flat-sm)',
                transition: 'all 0.15s'
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.map(post => (
          <div
            key={post.id}
            className="nm-card"
            style={{
              padding: 24,
              position: 'relative',
              border: post.flagged ? '1px solid rgba(179,74,74,0.3)' : '1px solid var(--border-light)',
            }}
          >
            {post.flagged && (
              <div style={{
                position: 'absolute', top: 20, right: 20,
                background: 'var(--bg-primary)',
                color: 'var(--danger)',
                boxShadow: 'var(--nm-flat-xs)',
                fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                letterSpacing: '0.04em'
              }}>🚩 FLAGGED</div>
            )}
            
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 40, height: 40,
                background: `hsl(${post.id * 55 + 200}, 50%, 50%)`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
                boxShadow: 'var(--nm-flat-xs)'
              }}>{post.author[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{post.author}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{post.college} · {post.time}</div>
              </div>
            </div>
            
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18, fontWeight: 500 }}>
              {post.content}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="nm-card-inset" style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12, color: 'var(--text-secondary)', boxShadow: 'var(--nm-inset-sm)' }}>
                  ❤️ {post.likes}
                </span>
                <span className="nm-card-inset" style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12, color: 'var(--text-secondary)', boxShadow: 'var(--nm-inset-sm)' }}>
                  💬 {post.comments}
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: categoryColor[post.category] || 'var(--text-muted)',
                  background: 'var(--bg-primary)',
                  boxShadow: 'var(--nm-flat-xs)',
                  padding: '4px 10px',
                  borderRadius: 12,
                  textTransform: 'uppercase'
                }}>{post.category}</span>
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="nm-btn" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 8, boxShadow: 'var(--nm-flat-xs)' }}>
                  View
                </button>
                <button className="nm-btn" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 8, color: 'var(--danger)', boxShadow: 'var(--nm-flat-xs)' }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

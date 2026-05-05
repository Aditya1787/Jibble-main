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
  Events:  '#10b981',
  General: 'var(--text-muted)',
  Career:  '#f59e0b',
}

export default function Posts() {
  const [filter, setFilter] = useState('all')

  const filtered = mockPosts.filter(p => {
    if (filter === 'flagged') return p.flagged
    if (filter === 'safe')    return !p.flagged
    return true
  })

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Posts</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Review and moderate all platform posts.</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['all', 'All Posts'], ['flagged', '🚩 Flagged'], ['safe', '✅ Safe']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '10px 20px', borderRadius: 10,
            border: '1px solid var(--border)',
            background: filter === val ? 'var(--accent)' : 'var(--bg-card)',
            color: filter === val ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(post => (
          <div key={post.id} style={{
            background: 'var(--bg-card)',
            border: `1px solid ${post.flagged ? 'rgba(239,68,68,0.35)' : 'var(--border)'}`,
            borderRadius: 16,
            padding: 24,
            position: 'relative',
          }}>
            {post.flagged && (
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(239,68,68,0.15)', color: 'var(--danger)',
                fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
              }}>🚩 FLAGGED</div>
            )}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 40, height: 40,
                background: `hsl(${post.id * 55 + 200}, 65%, 55%)`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>{post.author[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{post.author}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.college} · {post.time}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{post.content}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>❤️ {post.likes}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>💬 {post.comments}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: categoryColor[post.category] || 'var(--text-muted)', background: `${categoryColor[post.category]}1a`, padding: '2px 10px', borderRadius: 20 }}>{post.category}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>View</button>
                <button style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

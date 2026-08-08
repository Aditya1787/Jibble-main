import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

interface PostItem {
  id: number
  author: string
  college: string
  type: 'post' | 'reel'
  content: string
  likes: number
  comments: number
  category: string
  flagged: boolean
  time: string
}

const initialPosts: PostItem[] = [
  { id: 1, author: 'Aditya Kumar',  college: 'IIT Delhi', type: 'post', content: 'Just finished my ML project — built a sentiment analyser for college reviews 🎉', likes: 142, comments: 28, category: 'Tech',    flagged: false, time: '2h ago' },
  { id: 2, author: 'Priya Sharma',  college: 'BITS Pilani', type: 'reel', content: '📹 30-sec Reel: Quick Flutter App animation demo & UI breakdown!', likes: 412, comments: 89, category: 'Tech', flagged: false, time: '3h ago' },
  { id: 3, author: 'Arjun Singh',   college: 'DTU Delhi',   type: 'post', content: 'This post contains inappropriate content that has been flagged by multiple users...', likes: 3, comments: 7, category: 'General', flagged: true,  time: '6h ago' },
  { id: 4, author: 'Neha Gupta',    college: 'NIT Trichy',  type: 'post', content: 'Campus placement season is here! Sharing tips from my recent interviews at top MNCs.', likes: 234, comments: 56, category: 'Career',  flagged: false, time: '8h ago' },
  { id: 5, author: 'Riya Patel',    college: 'IIIT Hyd',    type: 'reel', content: '📹 Reel: Campus Hackathon Highlights & Team Celebrations! 🚀', likes: 520, comments: 94, category: 'Events',  flagged: false, time: '12h ago' },
  { id: 6, author: 'Karan Mehta',   college: 'Manipal',     type: 'post', content: 'Suspicious content flagged by AI filter — potential spam or community policy violation.', likes: 1, comments: 0, category: 'General', flagged: true,  time: '1d ago' },
]

const categoryColor: Record<string, string> = {
  Tech:    'var(--accent)',
  Events:  'var(--accent)',
  General: 'var(--text-muted)',
  Career:  'var(--warning)',
}

export default function Posts() {
  const { user } = useAuthStore()
  const [postsList, setPostsList] = useState<PostItem[]>(initialPosts)
  const [filter, setFilter] = useState('all')
  const [contentType, setContentType] = useState<'all' | 'post' | 'reel'>('all')

  const isPolicyOfficer = user?.category === 'Privacy & Policy Management' || user?.role?.toLowerCase().includes('moderator') || user?.role?.toLowerCase().includes('officer') || user?.role?.toLowerCase().includes('ceo')

  const handleRemovePost = (postId: number) => {
    setPostsList(postsList.filter(p => p.id !== postId))
  }

  const filtered = postsList.filter(p => {
    const matchFlag = filter === 'all' || (filter === 'flagged' && p.flagged) || (filter === 'safe' && !p.flagged)
    const matchType = contentType === 'all' || p.type === contentType
    return matchFlag && matchType
  })

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Community Posts & Reels Moderation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
            Review, audit, and remove user posts, video reels, or policy-violating content.
          </p>
        </div>

        {isPolicyOfficer && (
          <div className="nm-card-inset" style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🛡️ Privacy & Policy Officer Moderation Active
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* Content Type Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'all', label: '🌐 All Content' },
            { id: 'post', label: '📝 Posts' },
            { id: 'reel', label: '📹 Reels & Videos' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setContentType(c.id as any)}
              className={contentType === c.id ? 'nm-btn-accent' : 'nm-btn'}
              style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12, border: 'none', fontWeight: 700 }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { val: 'all', label: 'All Items' },
            { val: 'flagged', label: '🚩 Flagged' },
            { val: 'safe', label: '✅ Verified Safe' },
          ].map(({ val, label }) => {
            const isActive = filter === val
            return (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={isActive ? 'nm-card-inset' : 'nm-btn'}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-primary)' : 'var(--bg-card)',
                  boxShadow: isActive ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)'
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Posts & Reels List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filtered.map(post => (
          <div
            key={post.id}
            className="nm-card"
            style={{
              padding: 24,
              position: 'relative',
              border: post.flagged ? '1px solid rgba(179,74,74,0.4)' : '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 40, height: 40,
                  background: `hsl(${post.id * 55 + 200}, 50%, 50%)`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
                  boxShadow: 'var(--nm-flat-xs)'
                }}>{post.author[0]}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    @{post.author}
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginLeft: '8px' }}>
                      [{post.type === 'reel' ? '📹 Reel Video' : '📝 Standard Post'}]
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{post.college} · {post.time}</div>
                </div>
              </div>

              {post.flagged && (
                <div style={{
                  background: 'rgba(179,74,74,0.1)',
                  color: 'var(--danger)',
                  fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                  letterSpacing: '0.04em'
                }}>🚩 FLAGGED VIOLATION</div>
              )}
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
                <button
                  type="button"
                  className="nm-btn-accent"
                  style={{ padding: '6px 14px', fontSize: 12, borderRadius: 8, background: 'var(--danger)', border: 'none', color: '#fff' }}
                  onClick={() => handleRemovePost(post.id)}
                >
                  🗑️ Delete {post.type === 'reel' ? 'Reel' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

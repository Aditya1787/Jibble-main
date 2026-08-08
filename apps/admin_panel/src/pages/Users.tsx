import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import UserProfileModal from '../components/UserProfileModal'

interface UserItem {
  id: number
  name: string
  username: string
  email: string
  college: string
  role: string
  status: 'active' | 'pending' | 'banned'
  joined: string
  posts: number
}

const initialUsers: UserItem[] = [
  { id: 1, name: 'Aditya Kumar', username: 'aditya', email: 'aditya@iitd.ac.in', college: 'IIT Delhi', role: 'student', status: 'active', joined: 'Jan 12, 2025', posts: 42 },
  { id: 2, name: 'Priya Sharma', username: 'priya_hr', email: 'priya@bits.ac.in', college: 'BITS Pilani', role: 'mod', status: 'active', joined: 'Jan 15, 2025', posts: 28 },
  { id: 3, name: 'Rahul Verma', username: 'rahul_dev', email: 'rahul@vit.ac.in', college: 'VIT Vellore', role: 'student', status: 'pending', joined: 'Feb 2, 2025', posts: 0 },
  { id: 4, name: 'Neha Gupta', username: 'neha_sec', email: 'neha@nittrichy.ac.in', college: 'NIT Trichy', role: 'mod', status: 'active', joined: 'Dec 20, 2024', posts: 87 },
  { id: 5, name: 'Arjun Singh', username: 'arjun_s', email: 'arjun@dtu.ac.in', college: 'DTU Delhi', role: 'student', status: 'banned', joined: 'Mar 5, 2025', posts: 3 },
  { id: 6, name: 'Riya Patel', username: 'riya_ui', email: 'riya@iiit.ac.in', college: 'IIIT Hyd', role: 'student', status: 'active', joined: 'Mar 8, 2025', posts: 19 },
  { id: 7, name: 'Karan Mehta', username: 'karan_m', email: 'karan@manipal.edu', college: 'Manipal', role: 'student', status: 'active', joined: 'Mar 9, 2025', posts: 55 },
]

const statusColor: Record<string, string> = {
  active: 'var(--accent)',
  pending: 'var(--warning)',
  banned: 'var(--danger)',
}
const roleColor: Record<string, string> = {
  student: 'var(--accent)',
  mod: 'var(--warning)',
  admin: 'var(--danger)',
}

export default function Users() {
  const { user } = useAuthStore()
  const [usersList, setUsersList] = useState<UserItem[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const [profileModalUser, setProfileModalUser] = useState<string | null>(null)

  const isPolicyOfficer = user?.category === 'Privacy & Policy Management' || user?.role?.toLowerCase().includes('moderator') || user?.role?.toLowerCase().includes('officer') || user?.role?.toLowerCase().includes('ceo')

  const handleBanUser = (userId: number) => {
    setUsersList(usersList.map(u => u.id === userId ? { ...u, status: 'banned' as const } : u))
  }

  const handleRemoveUser = (userId: number) => {
    setUsersList(usersList.filter(u => u.id !== userId))
  }

  const filtered = usersList.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Search users by @username, view performance profiles, and manage corporate permissions.</p>
        </div>

        {isPolicyOfficer && (
          <div className="nm-card-inset" style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)', fontWeight: 700, fontSize: '12px' }}>
            🛡️ Policy Officer Account Moderation Active
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <input
            placeholder="Search users by @username, name, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="nm-input"
          />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'active', 'pending', 'banned'].map(f => {
            const isActive = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={isActive ? 'nm-card-inset' : 'nm-btn'}
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-primary)' : 'var(--bg-card)',
                  boxShadow: isActive ? 'var(--nm-inset-sm)' : 'var(--nm-flat-sm)',
                  transition: 'all 0.15s'
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="nm-card" style={{ overflow: 'hidden', padding: '8px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['User', 'College', 'Role', 'Status', 'Joined', 'Posts', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'all 0.2s',
                }}
                className="table-row"
                >
                  {/* User Column */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{
                        width: 36, height: 36,
                        background: `hsl(${u.id * 55 + 200}, 50%, 50%)`,
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: '#fff',
                        flexShrink: 0,
                        boxShadow: 'var(--nm-flat-xs)'
                      }}>{u.name[0]}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>@{u.username} ({u.name})</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {u.college}
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: roleColor[u.role] || 'var(--accent)',
                      background: 'var(--bg-primary)',
                      boxShadow: 'var(--nm-flat-xs)',
                      padding: '4px 10px',
                      borderRadius: 12,
                      textTransform: 'uppercase'
                    }}>{u.role}</span>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: statusColor[u.status],
                      background: 'var(--bg-primary)',
                      boxShadow: 'var(--nm-flat-xs)',
                      padding: '4px 10px',
                      borderRadius: 12,
                      textTransform: 'uppercase'
                    }}>{u.status}</span>
                  </td>

                  <td style={{ padding: '16px 20px', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
                    {u.joined}
                  </td>

                  <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {u.posts}
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="nm-btn"
                        style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, boxShadow: 'var(--nm-flat-xs)' }}
                        onClick={() => setProfileModalUser(u.username)}
                      >
                        Profile Dashboard
                      </button>

                      {u.status !== 'banned' && (
                        <button
                          className="nm-btn"
                          style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, color: 'var(--warning)', boxShadow: 'var(--nm-flat-xs)' }}
                          onClick={() => handleBanUser(u.id)}
                        >
                          Ban
                        </button>
                      )}

                      {isPolicyOfficer && (
                        <button
                          className="nm-btn-accent"
                          style={{ padding: '6px 10px', fontSize: 11, borderRadius: 8, background: 'var(--danger)', border: 'none', color: '#fff' }}
                          onClick={() => handleRemoveUser(u.id)}
                        >
                          Remove Account
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {profileModalUser && (
        <UserProfileModal
          initialUsername={profileModalUser}
          onClose={() => setProfileModalUser(null)}
        />
      )}
    </div>
  )
}

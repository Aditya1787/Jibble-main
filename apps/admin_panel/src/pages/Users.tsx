import { useState } from 'react'

const mockUsers = [
  { id: 1, name: 'Aditya Kumar',   email: 'aditya@iitd.ac.in',   college: 'IIT Delhi',    role: 'student', status: 'active',  joined: 'Jan 12, 2025', posts: 42 },
  { id: 2, name: 'Priya Sharma',   email: 'priya@bits.ac.in',     college: 'BITS Pilani',  role: 'student', status: 'active',  joined: 'Jan 15, 2025', posts: 28 },
  { id: 3, name: 'Rahul Verma',    email: 'rahul@vit.ac.in',      college: 'VIT Vellore',  role: 'student', status: 'pending', joined: 'Feb 2, 2025',  posts: 0 },
  { id: 4, name: 'Neha Gupta',     email: 'neha@nitтриchy.ac.in', college: 'NIT Trichy',   role: 'mod',     status: 'active',  joined: 'Dec 20, 2024', posts: 87 },
  { id: 5, name: 'Arjun Singh',    email: 'arjun@dtu.ac.in',      college: 'DTU Delhi',    role: 'student', status: 'banned',  joined: 'Mar 5, 2025',  posts: 3 },
  { id: 6, name: 'Riya Patel',     email: 'riya@iiit.ac.in',      college: 'IIIT Hyd',     role: 'student', status: 'active',  joined: 'Mar 8, 2025',  posts: 19 },
  { id: 7, name: 'Karan Mehta',    email: 'karan@manipal.edu',    college: 'Manipal',      role: 'student', status: 'active',  joined: 'Mar 9, 2025',  posts: 55 },
]

const statusColor: Record<string, string> = {
  active:  'var(--success)',
  pending: 'var(--warning)',
  banned:  'var(--danger)',
}
const roleColor: Record<string, string> = {
  student: 'var(--accent)',
  mod:     '#f59e0b',
  admin:   '#ef4444',
}

export default function Users() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Users</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage and monitor all registered users.</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '10px 16px',
            color: 'var(--text-primary)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        {['all', 'active', 'pending', 'banned'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: filter === f ? 'var(--accent)' : 'var(--bg-card)',
            color: filter === f ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
            textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['User', 'College', 'Role', 'Status', 'Joined', 'Posts', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
              >
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 36, height: 36,
                      background: `hsl(${u.id * 55 + 200}, 65%, 55%)`,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{u.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.college}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: roleColor[u.role], background: `${roleColor[u.role]}1a`, padding: '3px 10px', borderRadius: 20 }}>{u.role}</span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: statusColor[u.status], background: `${statusColor[u.status]}1a`, padding: '3px 10px', borderRadius: 20 }}>{u.status}</span>
                </td>
                <td style={{ padding: '16px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{u.joined}</td>
                <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 600 }}>{u.posts}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>View</button>
                    {u.status !== 'banned' && (
                      <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', cursor: 'pointer' }}>Ban</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

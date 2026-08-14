import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import UserProfileModal from '../components/UserProfileModal'

interface UserItem {
  id: number
  name: string
  username: string
  email: string
  department: string
  role: string
  status: 'active' | 'pending' | 'banned'
  joined: string
  posts: number
}

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
  const { user, registeredUsers, fetchRegisteredUsers } = useAuthStore()
  
  // Fetch registered users on mount
  useEffect(() => {
    fetchRegisteredUsers()
  }, [fetchRegisteredUsers])

  const isExecutiveRole = (roleTitle: string) => {
    if (!roleTitle) return false
    const norm = roleTitle.toLowerCase()
    const execs = ['founder', 'ceo', 'cto', 'cfo', 'coo', 'cpo', 'cmo', 'executive']
    return execs.some((e) => norm.includes(e))
  }

  const isCeoOrFounder = user?.role?.toLowerCase().includes('ceo') || user?.role?.toLowerCase().includes('founder')
  const isFounderOrHr = Boolean(
    isCeoOrFounder ||
    user?.role?.toLowerCase().includes('hr') ||
    user?.category?.toLowerCase().includes('hr') ||
    user?.category?.toLowerCase().includes('human resources') ||
    user?.category?.toLowerCase().includes('people operations')
  )

  // Persist user moderation statuses by email in localStorage
  const [approvedUserEmails, setApprovedUserEmails] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('jibble_approved_user_emails')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [rejectedUserEmails, setRejectedUserEmails] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('jibble_rejected_user_emails')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [bannedUserEmails, setBannedUserEmails] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('jibble_banned_user_emails')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [removedUserEmails, setRemovedUserEmails] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('jibble_removed_user_emails')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem('jibble_approved_user_emails', JSON.stringify(approvedUserEmails)) } catch {}
  }, [approvedUserEmails])

  useEffect(() => {
    try { localStorage.setItem('jibble_rejected_user_emails', JSON.stringify(rejectedUserEmails)) } catch {}
  }, [rejectedUserEmails])

  useEffect(() => {
    try { localStorage.setItem('jibble_banned_user_emails', JSON.stringify(bannedUserEmails)) } catch {}
  }, [bannedUserEmails])

  useEffect(() => {
    try { localStorage.setItem('jibble_removed_user_emails', JSON.stringify(removedUserEmails)) } catch {}
  }, [removedUserEmails])

  // Dynamically populate registered users
  const allUsers: UserItem[] = useMemo(() => {
    const rawList = user
      ? [user, ...registeredUsers.map((r) => r.profile).filter((p) => p.email.toLowerCase() !== user.email.toLowerCase())]
      : registeredUsers.map((r) => r.profile)

    return rawList.map((p, idx) => {
      const isExec = isExecutiveRole(p.role)
      return {
        id: idx + 1,
        name: p.username || 'Employee',
        username: p.username,
        email: p.email,
        department: p.category || 'General',
        role: p.role || 'Contributor',
        status: isExec ? ('active' as const) : ('pending' as const),
        joined: 'Recently',
        posts: 0,
      }
    })
  }, [user, registeredUsers])

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [removalError, setRemovalError] = useState<string | null>(null)

  const [profileModalUser, setProfileModalUser] = useState<string | null>(null)

  const handleBanUser = (email: string) => {
    const norm = email.toLowerCase()
    setBannedUserEmails((prev) => (prev.includes(norm) ? prev : [...prev, norm]))
  }

  const handleUnbanUser = (email: string) => {
    const norm = email.toLowerCase()
    setBannedUserEmails((prev) => prev.filter((e) => e !== norm))
  }

  const handleApproveUser = (email: string) => {
    const norm = email.toLowerCase()
    setApprovedUserEmails((prev) => (prev.includes(norm) ? prev : [...prev, norm]))
    setRejectedUserEmails((prev) => prev.filter((e) => e !== norm))
  }

  const handleRejectUser = (email: string) => {
    const norm = email.toLowerCase()
    setRejectedUserEmails((prev) => (prev.includes(norm) ? prev : [...prev, norm]))
    setApprovedUserEmails((prev) => prev.filter((e) => e !== norm))
  }

  const handleRemoveUser = (targetUser: UserItem) => {
    setRemovalError(null)
    if (!isFounderOrHr) {
      setRemovalError('Only CEO / Founder and HR personnel can remove users.')
      return
    }
    if (isExecutiveRole(targetUser.role) && !isCeoOrFounder) {
      setRemovalError(`Cannot remove ${targetUser.username} (${targetUser.role}). Only CEO / Founder can remove executive personnel.`)
      return
    }
    const norm = targetUser.email.toLowerCase()
    setRemovedUserEmails((prev) => (prev.includes(norm) ? prev : [...prev, norm]))
  }

  const activeUserList = allUsers
    .filter((u) => {
      const norm = u.email.toLowerCase()
      return !removedUserEmails.includes(norm) && !rejectedUserEmails.includes(norm)
    })
    .map((u) => {
      const norm = u.email.toLowerCase()
      let currentStatus = u.status
      if (approvedUserEmails.includes(norm)) currentStatus = 'active'
      if (bannedUserEmails.includes(norm)) currentStatus = 'banned'
      return { ...u, status: currentStatus }
    })

  const filtered = activeUserList.filter((u) => {
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

        {isFounderOrHr && (
          <div className="nm-card-inset" style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)', fontWeight: 700, fontSize: '12px' }}>
            🛡️ CEO / Founder & HR Moderation Active
          </div>
        )}
      </div>

      {removalError && (
        <div className="nm-card-inset animate-pop-in" style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(179,74,74,0.08)', border: '1px solid rgba(179,74,74,0.2)', color: 'var(--danger)', fontWeight: 700, fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {removalError}</span>
          <button onClick={() => setRemovalError(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)', fontWeight: 800 }}>✕</button>
        </div>
      )}

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
                {['User', 'Department / Category', 'Role', 'Status', 'Joined', 'Posts', 'Actions'].map(h => (
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
                    {u.department}
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

                      {isFounderOrHr && u.status === 'pending' && (
                        <>
                          <button
                            className="nm-btn-accent"
                            style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, background: '#059669', color: '#fff', border: 'none' }}
                            onClick={() => handleApproveUser(u.email)}
                          >
                            ✓ Approve User
                          </button>
                          <button
                            className="nm-btn-accent"
                            style={{ padding: '6px 10px', fontSize: 11, borderRadius: 8, background: 'var(--danger)', color: '#fff', border: 'none' }}
                            onClick={() => handleRejectUser(u.email)}
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}

                      {isFounderOrHr && u.status !== 'pending' && (
                        <>
                          {u.status !== 'banned' ? (
                            <button
                              className="nm-btn"
                              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, color: 'var(--warning)', boxShadow: 'var(--nm-flat-xs)' }}
                              onClick={() => handleBanUser(u.email)}
                            >
                              Ban
                            </button>
                          ) : (
                            <button
                              className="nm-btn-accent"
                              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, background: '#059669', color: '#fff', border: 'none' }}
                              onClick={() => handleUnbanUser(u.email)}
                            >
                              ✓ Unban
                            </button>
                          )}

                          <button
                            className="nm-btn-accent"
                            style={{ padding: '6px 10px', fontSize: 11, borderRadius: 8, background: 'var(--danger)', border: 'none', color: '#fff' }}
                            onClick={() => handleRemoveUser(u)}
                          >
                            Remove Account
                          </button>
                        </>
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

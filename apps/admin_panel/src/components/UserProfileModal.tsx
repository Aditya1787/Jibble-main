import { useState } from 'react'
import { useAuthStore, AdminUser } from '../store/useAuthStore'
import { useTeamTaskStore } from '../store/useTeamTaskStore'

interface Props {
  initialUsername?: string
  onClose: () => void
}

export default function UserProfileModal({ initialUsername = '', onClose }: Props) {
  const { user, registeredUsers } = useAuthStore()
  const { tasks, getEmployeePerformance } = useTeamTaskStore()

  const allAvailableProfiles = user ? [user, ...registeredUsers.map(r => r.profile).filter(p => p.email !== user.email)] : registeredUsers.map(r => r.profile)

  const [searchUsername, setSearchUsername] = useState(initialUsername)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(() => {
    if (initialUsername) {
      const match = allAvailableProfiles.find(
        (p) => p.username.toLowerCase() === initialUsername.toLowerCase() || p.email.toLowerCase() === initialUsername.toLowerCase()
      )
      if (match) return match
    }
    return allAvailableProfiles[0] || user || null
  })

  // Filtered users dropdown
  const matchingUsers = registeredUsers.filter((acc) =>
    acc.profile.username.toLowerCase().includes(searchUsername.toLowerCase()) ||
    acc.profile.email.toLowerCase().includes(searchUsername.toLowerCase())
  )

  const handleSelectUser = (u: AdminUser) => {
    setSelectedUser(u)
    setSearchUsername(u.username)
  }

  const performance = selectedUser
    ? getEmployeePerformance(selectedUser.username || selectedUser.email)
    : { totalAssigned: 0, completedOnTime: 0, overdueCount: 0, onTimeRate: 0, ratingBadge: '⚡ Contributor' }

  const cleanName = (str: string = '') => str.replace(/^@/, '').split(' ')[0].trim().toLowerCase()
  const targetClean = selectedUser ? cleanName(selectedUser.username || selectedUser.email) : ''
  const userAssignedTasks = selectedUser
    ? tasks.filter((t) => {
        const taskAssigneeClean = cleanName(t.assigneeName ?? '')
        return (
          taskAssigneeClean.includes(targetClean) ||
          targetClean.includes(taskAssigneeClean) ||
          (t.assigneeName ?? '').toLowerCase().includes(selectedUser.username.toLowerCase()) ||
          (t.assigneeName ?? '').toLowerCase().includes(selectedUser.email.toLowerCase())
        )
      })
    : []

  const isFounderOrCeo = selectedUser
    ? Boolean(selectedUser.role.toLowerCase().includes('founder') || selectedUser.role.toLowerCase().includes('ceo'))
    : false

  const selectedUserTeams = tasks ? useTeamTaskStore.getState().teams.filter((t) => {
    if (!selectedUser) return false
    const leadClean = cleanName(t.leadName ?? '')
    const isDirectLead = leadClean.includes(targetClean) || targetClean.includes(leadClean) || (t.leadName ?? '').toLowerCase().includes(selectedUser.username.toLowerCase())
    const isMember = t.members.some((m) => cleanName(m.name).includes(targetClean) || cleanName(m.email).includes(targetClean) || m.name.toLowerCase().includes(selectedUser.username.toLowerCase()))
    return isFounderOrCeo || isDirectLead || isMember
  }) : []

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '640px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Employee Profile Dashboard</h3>
          <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={onClose}>✕</button>
        </div>

        {/* User Search Selector */}
        <div className="nm-card-inset" style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px' }}>🔍</span>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              className="nm-input-glass"
              placeholder="Search employee profile by @username or email..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              style={{ fontSize: '12px' }}
            />

            {searchUsername && matchingUsers.length > 0 && (
              <div
                className="spatial-panel animate-pop-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  width: '100%',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  zIndex: 120,
                  padding: '6px',
                  background: 'var(--bg-primary)',
                  borderRadius: '10px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {matchingUsers.map((acc) => (
                  <button
                    key={acc.profile.email}
                    type="button"
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: 'transparent',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => handleSelectUser(acc.profile)}
                  >
                    <span style={{ fontWeight: 700 }}>@{acc.profile.username || acc.profile.email}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{acc.profile.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* User Info Header */}
            <div className="nm-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-primary)', boxShadow: 'var(--nm-flat-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                {selectedUser.avatar || '👤'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 800 }}>@{selectedUser.username}</h4>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                    {selectedUser.role}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {selectedUser.email} • {selectedUser.category}
                </div>
              </div>
            </div>

            {/* Performance Analytics Card */}
            <div className="nm-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  📊 Employee Task Performance Analytics
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', background: 'rgba(51,102,89,0.12)', padding: '4px 10px', borderRadius: '8px' }}>
                  {performance.ratingBadge}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{performance.totalAssigned}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Tasks</div>
                </div>
                <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>{performance.completedOnTime}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Completed On Time</div>
                </div>
                <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--danger)' }}>{performance.overdueCount}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Urgent / Overdue</div>
                </div>
              </div>

              {/* On-Time Completion Rate Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>On-Time Task Execution Rate</span>
                  <span style={{ color: 'var(--accent)' }}>{performance.onTimeRate}% Success</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${performance.onTimeRate}%`, height: '100%', background: performance.onTimeRate >= 80 ? 'var(--accent)' : '#e67e22', borderRadius: '4px' }} />
                </div>
              </div>
            </div>

            {/* Teams & Leadership Responsibilities for Selected User */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                🏢 {isFounderOrCeo ? 'Executive Command Teams Oversight' : 'Assigned Teams & Leadership Roles'} ({selectedUserTeams.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                {selectedUserTeams.length > 0 ? (
                  selectedUserTeams.map((t) => {
                    const leadClean = cleanName(t.leadName ?? '')
                    const isDirectLead = leadClean.includes(targetClean) || targetClean.includes(leadClean) || (selectedUser && (t.leadName ?? '').toLowerCase().includes(selectedUser.username.toLowerCase()))
                    const isMember = selectedUser && t.members.some((m) => cleanName(m.name).includes(targetClean) || cleanName(m.email).includes(targetClean) || m.name.toLowerCase().includes(selectedUser.username.toLowerCase()))
                    
                    let roleBadge = '👑 Executive Command Oversight'
                    let badgeBg = 'rgba(245,158,11,0.12)'
                    let badgeColor = '#d97706'

                    if (isDirectLead) {
                      roleBadge = '👑 Lead'
                      badgeBg = 'rgba(16,185,129,0.12)'
                      badgeColor = '#059669'
                    } else if (isMember) {
                      roleBadge = '👥 Member'
                      badgeBg = 'rgba(59,130,246,0.12)'
                      badgeColor = '#2563eb'
                    }

                    return (
                      <div key={t.id} className="nm-card-inset" style={{ padding: '10px 12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700 }}>{t.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.department} • Lead: {t.leadName}</div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: badgeBg, color: badgeColor }}>
                          {roleBadge}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '8px' }}>
                    No assigned team leadership or team membership yet.
                  </div>
                )}
              </div>
            </div>

            {/* Task Roster for this User */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Assigned Task History ({userAssignedTasks.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {userAssignedTasks.length > 0 ? (
                  userAssignedTasks.map((t) => (
                    <div key={t.id} className="nm-card-inset" style={{ padding: '10px 12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>{t.title}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>📁 {t.projectName} • {t.dueDate}</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: t.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: t.status === 'completed' ? '#059669' : '#d97706' }}>
                        {t.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No specific tasks assigned yet
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No employee selected
          </div>
        )}
      </div>
    </div>
  )
}

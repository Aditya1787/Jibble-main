import { useState } from 'react'
import { useAuthStore, AdminUser } from '../store/useAuthStore'
import { useTeamTaskStore } from '../store/useTeamTaskStore'

interface Props {
  initialUsername?: string
  onClose: () => void
}

export default function UserProfileModal({ initialUsername = '', onClose }: Props) {
  const { registeredUsers } = useAuthStore()
  const { tasks, getEmployeePerformance } = useTeamTaskStore()

  const [searchUsername, setSearchUsername] = useState(initialUsername)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(() => {
    if (initialUsername) {
      const match = registeredUsers.find(
        (acc) => acc.profile.username.toLowerCase() === initialUsername.toLowerCase()
      )
      if (match) return match.profile
    }
    return registeredUsers[0]?.profile || null
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

  const userAssignedTasks = selectedUser
    ? tasks.filter((t) => (t.assigneeName ?? '').toLowerCase().includes(selectedUser.username.toLowerCase()) || (t.assigneeName ?? '').toLowerCase().includes(selectedUser.email.toLowerCase()))
    : []

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '640px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Employee Profile & Performance Analytics</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Search any user by username to view their performance metrics and task history.</p>
          </div>
          <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }} onClick={onClose}>✕</button>
        </div>

        {/* Username Search Input */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
            Search User by @username
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="nm-input-glass"
              placeholder="Type @username or email (e.g. admin_ceo, aditya)..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              style={{ paddingRight: '30px', fontWeight: 600 }}
            />
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '12px' }}>🔍</span>
          </div>

          {/* Search Dropdown list */}
          {searchUsername && matchingUsers.length > 0 && searchUsername !== selectedUser?.username && (
            <div
              className="spatial-panel animate-pop-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                width: '100%',
                maxHeight: '160px',
                overflowY: 'auto',
                zIndex: 120,
                padding: '6px',
                background: 'var(--bg-primary)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
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
                    padding: '8px 10px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => handleSelectUser(acc.profile)}
                >
                  <span style={{ fontWeight: 700 }}>@{acc.profile.username || acc.profile.email}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{acc.profile.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected User Details & Performance Dashboard */}
        {selectedUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Identity Card */}
            <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-primary)', boxShadow: 'var(--nm-flat-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                {selectedUser.avatar || '👤'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 800 }}>@{selectedUser.username}</h4>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                    {selectedUser.role}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
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

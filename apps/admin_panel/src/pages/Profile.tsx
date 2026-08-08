import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useTeamTaskStore } from '../store/useTeamTaskStore'

const avatarPresets = ['🎒', '💻', '🎨', '🚀', '👨‍💼', '🦸‍♂️', '🧠', '⭐']

export default function Profile() {
  const { user, updateUserProfile } = useAuthStore()
  const { tasks, updateTaskStatus, getEmployeePerformance } = useTeamTaskStore()

  const [showEditModal, setShowEditModal] = useState(false)

  // Edit form state initialized from logged in user
  const [username, setUsername] = useState(user?.username || 'admin_ceo')
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '+91 98765 43210')
  const [address, setAddress] = useState(user?.address || 'Building 4, Tech Park, New Delhi, India')
  const [hometown, setHometown] = useState(user?.hometown || 'New Delhi, India')
  const [favFood, setFavFood] = useState(user?.favFood || '🍕 Pizza')
  const [avatar, setAvatar] = useState(user?.avatar || '🎒')
  const [hobbiesInput, setHobbiesInput] = useState(user?.hobbies?.join(', ') || 'Coding, Gaming, Design')

  if (!user) return null

  // Calculate task performance stats
  const performance = getEmployeePerformance(user.username || user.email)
  const userAssignedTasks = tasks.filter(
    (t) =>
      (t.assigneeName ?? '').toLowerCase().includes(user.username.toLowerCase()) ||
      (t.assigneeName ?? '').toLowerCase().includes(user.email.toLowerCase())
  )

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserProfile({
      username,
      mobileNumber,
      address,
      hometown,
      favFood,
      avatar,
      hobbies: hobbiesInput.split(',').map((h) => h.trim()).filter(Boolean)
    })
    setShowEditModal(false)
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', boxSizing: 'border-box' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            My Employee Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
            Manage your personal profile information, view assigned tasks, and track on-time execution performance.
          </p>
        </div>

        <button
          type="button"
          className="nm-btn-accent"
          style={{ padding: '12px 22px', fontSize: '13px', fontWeight: 800 }}
          onClick={() => setShowEditModal(true)}
        >
          ✏️ Edit Personal Profile
        </button>
      </div>

      {/* Hero Profile Summary Card */}
      <div className="nm-card" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Avatar circle */}
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'var(--bg-primary)', boxShadow: 'var(--nm-flat-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px' }}>
            {user.avatar || '👤'}
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>@{user.username}</h2>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', background: 'rgba(51,102,89,0.12)', padding: '4px 12px', borderRadius: '8px' }}>
                {user.role}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', background: 'rgba(59,130,246,0.12)', padding: '4px 12px', borderRadius: '8px' }}>
                {user.category}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>
              <span>📧 {user.email}</span>
              <span>📱 {user.mobileNumber || '+91 98765 43210'}</span>
              <span>📍 {user.hometown || 'New Delhi, India'}</span>
            </div>
          </div>

          <div className="nm-card-inset" style={{ padding: '14px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '160px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Performance Rating</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent)', marginTop: '4px' }}>
              {performance.ratingBadge}
            </div>
          </div>
        </div>

        {/* Extended Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="nm-card-inset" style={{ padding: '14px 18px', borderRadius: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Physical Office Address</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {user.address || 'Building 4, Tech Park, New Delhi, India'}
            </div>
          </div>

          <div className="nm-card-inset" style={{ padding: '14px 18px', borderRadius: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Reporting Supervisor / Team Lead</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>
              👨‍💼 {user.reportingLead || 'Alex Rivera (Team Lead)'}
            </div>
          </div>

          <div className="nm-card-inset" style={{ padding: '14px 18px', borderRadius: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>HR Representative Contact</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', marginTop: '4px' }}>
              🤝 {user.hrContact || 'Priya Sharma (HR Lead)'}
            </div>
          </div>

          <div className="nm-card-inset" style={{ padding: '14px 18px', borderRadius: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Fav Food & Hobbies</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {user.favFood || '🍕 Pizza'} • {user.hobbies?.join(', ') || 'Coding, Music'}
            </div>
          </div>
        </div>
      </div>

      {/* Task Performance Analytics Dashboard */}
      <div className="nm-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📊 Employee Task Performance & On-Time Analytics
          </h3>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', background: 'rgba(51,102,89,0.12)', padding: '4px 12px', borderRadius: '8px' }}>
            {performance.ratingBadge}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>{performance.totalAssigned}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Tasks Assigned</div>
          </div>

          <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669' }}>{performance.completedOnTime}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Completed On Time</div>
          </div>

          <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--danger)' }}>{performance.overdueCount}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Overdue / Urgent</div>
          </div>

          <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent)' }}>{performance.onTimeRate}%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>On-Time Success Rate</div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>On-Time Execution Progress</span>
            <span style={{ color: 'var(--accent)' }}>{performance.onTimeRate}% Execution Score</span>
          </div>
          <div style={{ width: '100%', height: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${performance.onTimeRate}%`, height: '100%', background: performance.onTimeRate >= 80 ? 'var(--accent)' : '#e67e22', borderRadius: '6px' }} />
          </div>
        </div>
      </div>

      {/* Roster of Assigned Tasks for Logged In User */}
      <div className="nm-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>My Assigned Tasks ({userAssignedTasks.length})</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {userAssignedTasks.length > 0 ? (
            userAssignedTasks.map((t) => (
              <div key={t.id} className="nm-card-inset animate-pop-in" style={{ padding: '18px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', background: 'var(--bg-primary)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)' }}>
                      📁 {t.projectName}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: t.priority === 'urgent' ? 'var(--danger)' : '#e67e22' }}>
                      {t.priority.toUpperCase()}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{t.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{t.description}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Due: {t.dueDate}</span>
                  <select
                    className="nm-input-glass"
                    style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', cursor: 'pointer' }}
                    value={t.status}
                    onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                  >
                    <option value="todo">📌 To Do</option>
                    <option value="in_progress">🛠️ Working On Task</option>
                    <option value="in_review">🔍 In Review</option>
                    <option value="completed">✓ Completed</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', gridColumn: '1 / -1' }}>
              No tasks currently assigned to you.
            </div>
          )}
        </div>
      </div>

      {/* Projects History & Active Contributions */}
      <div className="nm-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Projects History & Active Contributions</h3>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.1)', padding: '4px 10px', borderRadius: '8px' }}>
            {useTeamTaskStore.getState().projects.length} Workspace Projects
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {useTeamTaskStore.getState().projects.map((project) => {
            const projectTasks = userAssignedTasks.filter((t) => t.projectId === project.id)
            return (
              <div key={project.id} className="nm-card-inset animate-pop-in" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)' }}>
                      {project.teamName}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{project.name}</h4>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.12)', color: '#059669', textTransform: 'uppercase' }}>
                    {project.status}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{project.description}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Target: {project.targetDate}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)' }}>{projectTasks.length} Assigned Tasks</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '560px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Edit Personal Profile</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Avatar Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Choose Avatar Icon</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {avatarPresets.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        fontSize: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        background: avatar === icon ? 'var(--accent)' : 'rgba(243,239,232,0.6)',
                        boxShadow: avatar === icon ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)'
                      }}
                      onClick={() => setAvatar(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Username</label>
                  <input type="text" className="nm-input-glass" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Mobile Number</label>
                  <input type="text" className="nm-input-glass" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Physical Office Address</label>
                <input type="text" className="nm-input-glass" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Hometown / City</label>
                  <input type="text" className="nm-input-glass" value={hometown} onChange={(e) => setHometown(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Favorite Food</label>
                  <input type="text" className="nm-input-glass" value={favFood} onChange={(e) => setFavFood(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Hobbies (Comma Separated)</label>
                <input type="text" className="nm-input-glass" value={hobbiesInput} onChange={(e) => setHobbiesInput(e.target.value)} />
              </div>

              <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                Save Profile Changes ✓
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

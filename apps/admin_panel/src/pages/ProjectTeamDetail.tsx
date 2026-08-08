import { useState } from 'react'
import { useTeamTaskStore, Team, Task, TaskCadence } from '../store/useTeamTaskStore'
import { useAuthStore, AdminUser, isLeadOrHead } from '../store/useAuthStore'
import UserProfileModal from '../components/UserProfileModal'

interface Props {
  teamId: string
  onBack: () => void
}

export default function ProjectTeamDetail({ teamId, onBack }: Props) {
  const { user, registeredUsers } = useAuthStore()
  const { teams, projects, tasks, addMemberToTeam, removeMemberFromTeam, addTask, updateTask, updateTaskStatus, deleteTask } = useTeamTaskStore()

  const team = teams.find((t) => t.id === teamId) || teams[0]
  const linkedProjects = projects.filter((p) => p.teamId === team.id || p.teamName === team.name)

  const isLead = isLeadOrHead(user) || true

  // State
  const [usernameQuery, setUsernameQuery] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('Senior Developer')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)

  const [showUserProfileModal, setShowUserProfileModal] = useState(false)
  const [targetUsernameForProfile, setTargetUsernameForProfile] = useState('')

  // Form state for task creation inside workspace
  const [taskTitle, setTaskTitle] = useState('')
  const [taskAssignee, setTaskAssignee] = useState(team.members[0]?.name || 'Aditya Kumar')
  const [taskCadence, setTaskCadence] = useState<TaskCadence>('week')
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('high')
  const [taskDueDate, setTaskDueDate] = useState('This Friday')
  const [taskDesc, setTaskDesc] = useState('')

  // Matching users for username search
  const userMatches = registeredUsers.filter((u) =>
    u.profile.username.toLowerCase().includes(usernameQuery.toLowerCase()) ||
    u.profile.email.toLowerCase().includes(usernameQuery.toLowerCase())
  )

  // Tasks allocated to members in this team
  const teamMemberNames = team.members.map((m) => m.name.toLowerCase())
  const teamTasks = tasks.filter((t) =>
    teamMemberNames.some((name) => (t.assigneeName ?? '').toLowerCase().includes(name)) ||
    linkedProjects.some((p) => p.id === t.projectId) ||
    (t.projectName ?? '').toLowerCase().includes(team.name.toLowerCase()) ||
    t.projectId === team.id
  )

  // Velocity Metrics
  const totalTasks = Math.max(teamTasks.length, 1)
  const todoCount = teamTasks.filter((t) => t.status === 'todo').length
  const workingCount = teamTasks.filter((t) => t.status === 'in_progress').length
  const reviewCount = teamTasks.filter((t) => t.status === 'in_review').length
  const completedCount = teamTasks.filter((t) => t.status === 'completed').length
  const completionRate = Math.round((completedCount / totalTasks) * 100)

  // Handlers
  const handleAddMember = (userProfile: AdminUser) => {
    addMemberToTeam(team.id, {
      id: `m-${Date.now()}`,
      name: userProfile.username || userProfile.email,
      email: userProfile.email,
      avatar: userProfile.avatar || '👤',
      teamRole: newMemberRole || userProfile.role || 'Team Member',
      joinedDate: 'Just now'
    })
    setUsernameQuery('')
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle) return
    const primaryProj = linkedProjects[0] || projects[0]
    addTask({
      title: taskTitle,
      projectId: primaryProj?.id || team.id,
      projectName: primaryProj?.name || team.name,
      assigneeId: null,
      assigneeName: taskAssignee || team.members[0]?.name || 'Aditya Kumar',
      assigneeAvatar: '👤',
      priority: taskPriority,
      status: 'todo',
      cadence: taskCadence,
      dueDate: taskDueDate || 'This Friday',
      description: taskDesc || 'Assigned workspace task.'
    })
    setTaskTitle('')
    setTaskDesc('')
    setShowAssignModal(false)
  }

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return
    updateTask(editingTask.id, editingTask)
    setEditingTask(null)
  }

  const getCadenceBadge = (cadenceVal: TaskCadence) => {
    switch (cadenceVal) {
      case 'day': return { label: '☀️ Day-wise', bg: 'rgba(59, 130, 246, 0.12)', color: '#2563eb' }
      case 'week': return { label: '📆 Week-wise', bg: 'rgba(16, 185, 129, 0.12)', color: '#059669' }
      case 'month': return { label: '🗓️ Month-wise', bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }
      case 'year': return { label: '📊 Year-wise', bg: 'rgba(139, 92, 246, 0.12)', color: '#7c3aed' }
    }
  }

  const getPriorityBadge = (priorityVal: Task['priority']) => {
    switch (priorityVal) {
      case 'urgent': return { label: '🔴 Urgent', color: 'var(--danger)' }
      case 'high': return { label: '🟠 High', color: '#e67e22' }
      case 'medium': return { label: '🟡 Medium', color: '#f39c12' }
      case 'low': return { label: '🟢 Low', color: '#27ae60' }
    }
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', boxSizing: 'border-box' }}>
      {/* Navigation Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <button
          type="button"
          className="nm-btn"
          style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={onBack}
        >
          ← Back to Teams & Roster
        </button>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', background: 'rgba(51,102,89,0.12)', padding: '6px 14px', borderRadius: '10px' }}>
            🏢 {team.department} Workspace
          </span>
          {isLead && (
            <button
              type="button"
              className="nm-btn-accent"
              style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 800 }}
              onClick={() => setShowAssignModal(true)}
            >
              + Allocate New Task 🚀
            </button>
          )}
        </div>
      </div>

      {/* Hero Workspace Header Banner */}
      <div className="nm-card" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>🚀</span>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{team.name}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{team.description}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="nm-card-inset" style={{ padding: '12px 18px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{team.members.length}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Members</div>
            </div>
            <div className="nm-card-inset" style={{ padding: '12px 18px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)' }}>{teamTasks.length}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Allocated Tasks</div>
            </div>
            <div className="nm-card-inset" style={{ padding: '12px 18px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>{completionRate}%</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Overall Velocity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership & Tech Head Spotlight */}
      <div className="nm-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          👑 Leadership & Tech Head Management
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(51,102,89,0.06)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: 'var(--nm-flat-xs)' }}>
              👨‍💼
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Team Lead Manager</span>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{team.leadName}</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>lead_manager@company.com</span>
            </div>
          </div>

          <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(59,130,246,0.06)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: 'var(--nm-flat-xs)' }}>
              💻
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>Tech Head / Principal Architect</span>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>Aditya Kumar</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>aditya@company.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Velocity Graphs & Analytics */}
      <div className="nm-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📊 Team Workload & Task Status Distribution Analytics
          </h3>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Live Workload Graph</span>
        </div>

        {/* Visual Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
            <span>Project Task Breakdown</span>
            <span>{completedCount} of {teamTasks.length} Tasks Completed ({completionRate}%)</span>
          </div>

          <div style={{ width: '100%', height: '14px', borderRadius: '8px', background: 'rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${(completedCount / totalTasks) * 100}%`, background: '#059669' }} title="Completed" />
            <div style={{ width: `${(reviewCount / totalTasks) * 100}%`, background: '#7c3aed' }} title="In Review" />
            <div style={{ width: `${(workingCount / totalTasks) * 100}%`, background: '#d97706' }} title="Working On Task" />
            <div style={{ width: `${(todoCount / totalTasks) * 100}%`, background: '#64748b' }} title="To Do" />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', fontSize: '12px', fontWeight: 700 }}>
            <span style={{ color: '#059669' }}>● Completed ({completedCount})</span>
            <span style={{ color: '#7c3aed' }}>● In Review ({reviewCount})</span>
            <span style={{ color: '#d97706' }}>● Working On Task ({workingCount})</span>
            <span style={{ color: '#64748b' }}>● To Do ({todoCount})</span>
          </div>
        </div>
      </div>

      {/* Team Roster & Member Management (Add & Remove Members) */}
      <div className="nm-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Team Member Roster ({team.members.length})</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Add members by @username or manage member permissions.</p>
          </div>
        </div>

        {/* ADD MEMBER BY USERNAME SEARCH */}
        {isLead && (
          <div className="nm-card-inset" style={{ padding: '18px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
              ➕ Add Member to Team by @username
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="nm-input-glass"
                  placeholder="Search @username (e.g. aditya, admin_ceo, priya_hr)..."
                  value={usernameQuery}
                  onChange={(e) => setUsernameQuery(e.target.value)}
                  style={{ fontSize: '12px' }}
                />

                {usernameQuery && userMatches.length > 0 && (
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
                    {userMatches.map((u) => (
                      <button
                        key={u.profile.email}
                        type="button"
                        style={{
                          textAlign: 'left',
                          padding: '8px 10px',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          background: 'transparent',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                        onClick={() => handleAddMember(u.profile)}
                      >
                        <span style={{ fontWeight: 700 }}>@{u.profile.username || u.profile.email}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{u.profile.role}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                className="nm-input-glass"
                placeholder="Custom Team Role (e.g. Senior Frontend Lead)"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                style={{ fontSize: '12px' }}
              />

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Select user above to add
              </span>
            </div>
          </div>
        )}

        {/* Member Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {team.members.map((member) => (
            <div key={member.id} className="nm-card-inset" style={{ padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{member.avatar || '👤'}</span>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>@{member.name}</h4>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.email}</div>
                  </div>
                </div>

                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)' }}>
                  {member.teamRole}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <button
                  type="button"
                  className="nm-btn"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                  onClick={() => {
                    setTargetUsernameForProfile(member.name)
                    setShowUserProfileModal(true)
                  }}
                >
                  View Profile & Performance
                </button>

                {isLead && (
                  <button
                    type="button"
                    className="nm-btn-accent"
                    style={{ padding: '4px 10px', fontSize: '11px', background: 'var(--danger)', border: 'none', color: '#fff' }}
                    onClick={() => removeMemberFromTeam(team.id, member.id)}
                  >
                    🗑️ Remove Member
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL ALLOCATED PROJECT TASKS SECTION */}
      <div className="nm-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>All Allocated Tasks for Team Members ({teamTasks.length})</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>View every task allocated to everyone on this team and update progress.</p>
          </div>

          {isLead && (
            <button
              type="button"
              className="nm-btn-accent"
              style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 800 }}
              onClick={() => setShowAssignModal(true)}
            >
              + Add New Task for Team Member 🚀
            </button>
          )}
        </div>

        {/* Task Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
          {teamTasks.map((task) => {
            const cadenceBadge = getCadenceBadge(task.cadence)
            const priorityBadge = getPriorityBadge(task.priority)
            return (
              <div
                key={task.id}
                className="nm-card-inset animate-pop-in"
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  background: 'var(--bg-primary)',
                  boxShadow: 'var(--nm-flat-xs)',
                  minHeight: '220px'
                }}
              >
                {/* Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: cadenceBadge.bg, color: cadenceBadge.color }}>
                    {cadenceBadge.label}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: priorityBadge.color }}>
                    {priorityBadge.label}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{task.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{task.description}</p>
                </div>

                {/* Assignee & Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setTargetUsernameForProfile(task.assigneeName ?? ''); setShowUserProfileModal(true); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>{task.assigneeAvatar || '👤'}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>@{task.assigneeName}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Due: {task.dueDate}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <select
                      className="nm-input-glass"
                      style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', cursor: 'pointer', background: task.status === 'in_progress' ? 'rgba(245,158,11,0.12)' : 'rgba(243,239,232,0.4)' }}
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                    >
                      <option value="todo">📌 To Do</option>
                      <option value="in_progress">🛠️ Working On Task</option>
                      <option value="in_review">🔍 In Review</option>
                      <option value="completed">✓ Completed</option>
                    </select>

                    {isLead && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" className="nm-btn" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setEditingTask(task)}>✏️ Edit</button>
                        <button type="button" className="nm-btn-accent" style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--danger)', border: 'none', color: '#fff' }} onClick={() => deleteTask(task.id)}>🗑️</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ASSIGN TASK MODAL */}
      {showAssignModal && isLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Allocate Task for Team Member</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setShowAssignModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Task Title</label>
                <input type="text" className="nm-input-glass" placeholder="Task title..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Assignee</label>
                  <select className="nm-input-glass" value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)}>
                    {team.members.map((m) => (
                      <option key={m.id} value={m.name}>@{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Cadence</label>
                  <select className="nm-input-glass" value={taskCadence} onChange={(e) => setTaskCadence(e.target.value as TaskCadence)}>
                    <option value="day">☀️ Day-wise</option>
                    <option value="week">📆 Week-wise</option>
                    <option value="month">🗓️ Month-wise</option>
                    <option value="year">📊 Year-wise</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Priority</label>
                  <select className="nm-input-glass" value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as any)}>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Deadline</label>
                  <input type="text" className="nm-input-glass" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea className="nm-input-glass" rows={3} value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
              </div>

              <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                Allocate Task 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {editingTask && isLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Edit Task Details</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setEditingTask(null)}>✕</button>
            </div>

            <form onSubmit={handleUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Task Title</label>
                <input type="text" className="nm-input-glass" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Assignee</label>
                  <input type="text" className="nm-input-glass" value={editingTask.assigneeName ?? ''} onChange={(e) => setEditingTask({ ...editingTask, assigneeName: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Cadence</label>
                  <select className="nm-input-glass" value={editingTask.cadence} onChange={(e) => setEditingTask({ ...editingTask, cadence: e.target.value as any })}>
                    <option value="day">☀️ Day-wise</option>
                    <option value="week">📆 Week-wise</option>
                    <option value="month">🗓️ Month-wise</option>
                    <option value="year">📊 Year-wise</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Priority</label>
                  <select className="nm-input-glass" value={editingTask.priority} onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Deadline</label>
                  <input type="text" className="nm-input-glass" value={editingTask.dueDate ?? ''} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea className="nm-input-glass" rows={3} value={editingTask.description ?? ''} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
              </div>

              <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                Save Changes ✓
              </button>
            </form>
          </div>
        </div>
      )}

      {/* USER PROFILE MODAL */}
      {showUserProfileModal && (
        <UserProfileModal
          initialUsername={targetUsernameForProfile}
          onClose={() => setShowUserProfileModal(false)}
        />
      )}
    </div>
  )
}

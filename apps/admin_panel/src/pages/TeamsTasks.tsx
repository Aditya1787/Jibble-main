import { useState } from 'react'
import { useTeamTaskStore, TaskCadence, Task, Team } from '../store/useTeamTaskStore'
import { useAuthStore, AdminUser, isLeadOrHead } from '../store/useAuthStore'
import UserProfileModal from '../components/UserProfileModal'

interface Props {
  onSelectTeam?: (teamId: string) => void
}

export default function TeamsTasks({ onSelectTeam }: Props = {}) {
  const { user, registeredUsers } = useAuthStore()
  const isLead = isLeadOrHead(user) || true
  const { teams, projects, tasks, addTeam, updateTeam, addMemberToTeam, addTask, updateTask, updateTaskStatus, deleteTask } = useTeamTaskStore()

  const [activeTab, setActiveTab] = useState<'teams' | 'tasks'>('teams')
  const [cadenceFilter, setCadenceFilter] = useState<TaskCadence | 'all'>('all')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [taskSearch, setTaskSearch] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // Modals
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showUserProfileModal, setShowUserProfileModal] = useState(false)
  const [targetUsernameForProfile, setTargetUsernameForProfile] = useState('')

  // Edit / Detail Modals State
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Username search for adding member to selectedTeam
  const [usernameQuery, setUsernameQuery] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('Team Contributor')

  // New Team Form State
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDept, setNewTeamDept] = useState('Engineering')
  const [newTeamLead, setNewTeamLead] = useState('Alex Rivera')
  const [newTeamDesc, setNewTeamDesc] = useState('')
  const [newMembers, setNewMembers] = useState<Array<{ name: string; email: string; avatar: string; teamRole: string }>>([
    { name: 'Aditya Kumar', email: 'aditya@company.com', avatar: '💻', teamRole: 'Senior Team Member' }
  ])

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskProjId, setNewTaskProjId] = useState(projects[0]?.id || '')
  const [newTaskAssignee, setNewTaskAssignee] = useState('Aditya Kumar')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('high')
  const [newTaskCadence, setNewTaskCadence] = useState<TaskCadence>('week')
  const [newTaskDueDate, setNewTaskDueDate] = useState('This Friday')
  const [newTaskDesc, setNewTaskDesc] = useState('')

  // Total metrics
  const totalMembers = teams.reduce((acc, t) => acc + t.members.length, 0)
  
  // Filtered Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchCadence = cadenceFilter === 'all' || task.cadence === cadenceFilter
    const matchProj = selectedProject === 'all' || task.projectId === selectedProject
    const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchSearch =
      task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.assigneeName.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.projectName.toLowerCase().includes(taskSearch.toLowerCase())
    return matchCadence && matchProj && matchPriority && matchSearch
  })

  // Matching registered users for username lookup
  const userMatches = registeredUsers.filter((u) =>
    u.profile.username.toLowerCase().includes(usernameQuery.toLowerCase()) ||
    u.profile.email.toLowerCase().includes(usernameQuery.toLowerCase())
  )

  // Handlers
  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName) return
    addTeam({
      name: newTeamName,
      department: newTeamDept,
      leadName: newTeamLead,
      description: newTeamDesc || 'Corporate employee project team.',
      activeProjectsCount: 1,
      members: newMembers.map((m, idx) => ({
        id: `m-custom-${idx}-${Date.now()}`,
        name: m.name,
        email: m.email,
        avatar: m.avatar,
        teamRole: m.teamRole,
        joinedDate: 'Just now'
      }))
    })
    setNewTeamName('')
    setNewTeamDesc('')
    setShowTeamModal(false)
  }

  const handleAddMemberByUsername = (userProfile: AdminUser) => {
    if (!selectedTeam) return
    addMemberToTeam(selectedTeam.id, {
      id: `m-${Date.now()}`,
      name: userProfile.username || userProfile.email,
      email: userProfile.email,
      avatar: userProfile.avatar || '👤',
      teamRole: newMemberRole || userProfile.role || 'Team Member',
      joinedDate: 'Just now'
    })
    // Refresh local selectedTeam state
    const updated = teams.find(t => t.id === selectedTeam.id)
    if (updated) setSelectedTeam(updated)
    setUsernameQuery('')
  }

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle) return
    const proj = projects.find((p) => p.id === newTaskProjId)
    addTask({
      title: newTaskTitle,
      projectId: newTaskProjId,
      projectName: proj?.name || 'Workspace Project',
      assigneeName: newTaskAssignee,
      assigneeAvatar: '👤',
      priority: newTaskPriority,
      status: 'todo',
      cadence: newTaskCadence,
      dueDate: newTaskDueDate || 'Pending',
      description: newTaskDesc || 'Assigned project task.'
    })
    setNewTaskTitle('')
    setNewTaskDesc('')
    setShowTaskModal(false)
  }

  const handleUpdateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return
    updateTask(editingTask.id, editingTask)
    setEditingTask(null)
  }

  const getCadenceBadge = (cadence: TaskCadence) => {
    switch (cadence) {
      case 'day': return { label: '☀️ Day-wise', bg: 'rgba(59, 130, 246, 0.12)', color: '#2563eb' }
      case 'week': return { label: '📆 Week-wise', bg: 'rgba(16, 185, 129, 0.12)', color: '#059669' }
      case 'month': return { label: '🗓️ Month-wise', bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }
      case 'year': return { label: '📊 Year-wise', bg: 'rgba(139, 92, 246, 0.12)', color: '#7c3aed' }
    }
  }

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return { label: '🔴 Urgent', color: 'var(--danger)' }
      case 'high': return { label: '🟠 High', color: '#e67e22' }
      case 'medium': return { label: '🟡 Medium', color: '#f39c12' }
      case 'low': return { label: '🟢 Low', color: '#27ae60' }
    }
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Teams & Task Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
            Click any team or task to view details, add members by @username, edit descriptions, assign deadlines, and monitor employee performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="nm-btn"
            style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              setTargetUsernameForProfile('')
              setShowUserProfileModal(true)
            }}
          >
            🔍 Search Employee Profile
          </button>

          {/* Tab Switcher */}
          <div className="nm-card-inset" style={{ padding: '4px', borderRadius: '16px', display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className={activeTab === 'teams' ? 'nm-btn-accent' : 'nm-btn'}
              style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '13px', border: 'none', fontWeight: 700 }}
              onClick={() => setActiveTab('teams')}
            >
              👥 Teams & Roster ({teams.length})
            </button>
            <button
              type="button"
              className={activeTab === 'tasks' ? 'nm-btn-accent' : 'nm-btn'}
              style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '13px', border: 'none', fontWeight: 700 }}
              onClick={() => setActiveTab('tasks')}
            >
              📋 Projects & Task Cadence ({tasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: TEAMS & EMPLOYEE ROSTER ================= */}
      {activeTab === 'teams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(51,102,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🏢
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Teams</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{teams.length} Teams</h3>
              </div>
            </div>

            <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                👥
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Assigned Members</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalMembers} Employees</h3>
              </div>
            </div>

            <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🚀
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Projects</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{projects.length} Active</h3>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Corporate Teams Directory (Click any team to open & edit)</h2>
            <button
              type="button"
              className="nm-btn-accent"
              style={{ padding: '10px 20px', fontSize: '13px' }}
              onClick={() => setShowTeamModal(true)}
            >
              + Create New Team
            </button>
          </div>

          {/* Teams Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
            {teams.map((team) => (
              <div
                key={team.id}
                className="nm-card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer', transition: 'transform 0.15s' }}
                onClick={() => {
                  if (onSelectTeam) {
                    onSelectTeam(team.id)
                  } else {
                    setSelectedTeam(team)
                  }
                }}
              >
                {/* Team Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                      {team.department}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>{team.name}</h3>
                  </div>
                  <div className="nm-card-inset" style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    👨‍💼 Lead: {team.leadName}
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {team.description}
                </p>

                {/* Team Roster Section */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Team Members ({team.members.length}) • Click to Edit
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>
                      🔍 Open Team Details →
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {team.members.map((member) => (
                      <div key={member.id} className="nm-card-inset" style={{ padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{member.avatar}</span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>@{member.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.email}</div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.1)', padding: '2px 8px', borderRadius: '6px', display: 'inline-block' }}>
                            {member.teamRole}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PROJECTS & TASK MANAGEMENT ================= */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Cadence Filter Tabs */}
          <div className="nm-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🗓️ Task Cadence Frequency Filter
              </span>
              <button
                type="button"
                className="nm-btn-accent"
                style={{ padding: '8px 16px', fontSize: '12px' }}
                onClick={() => setShowTaskModal(true)}
              >
                + Assign New Task
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: '🌐 All Cadences', count: tasks.length },
                { id: 'day', label: '☀️ Day-wise (Daily)', count: tasks.filter(t => t.cadence === 'day').length },
                { id: 'week', label: '📆 Week-wise (Weekly Sprints)', count: tasks.filter(t => t.cadence === 'week').length },
                { id: 'month', label: '🗓️ Month-wise (Monthly Deliverables)', count: tasks.filter(t => t.cadence === 'month').length },
                { id: 'year', label: '📊 Year-wise (Yearly Objectives)', count: tasks.filter(t => t.cadence === 'year').length },
              ].map((c) => {
                const isActive = cadenceFilter === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: isActive ? 'var(--accent)' : 'rgba(243,239,232,0.5)',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      boxShadow: isActive ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)',
                      transition: 'all 0.15s'
                    }}
                    onClick={() => setCadenceFilter(c.id as any)}
                  >
                    {c.label} ({c.count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Secondary Toolbar (Search, Project, Priority) */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="nm-input-glass"
                placeholder="Search tasks by title, project, or assignee..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                className="nm-input-glass"
                style={{ cursor: 'pointer', width: '180px', fontWeight: 600 }}
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                className="nm-input-glass"
                style={{ cursor: 'pointer', width: '140px', fontWeight: 600 }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          {/* Tasks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {filteredTasks.map((task) => {
              const cadenceBadge = getCadenceBadge(task.cadence)
              const priorityBadge = getPriorityBadge(task.priority)
              return (
                <div
                  key={task.id}
                  className="nm-card"
                  style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}
                  onClick={() => setEditingTask(task)}
                >
                  {/* Card Header badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: cadenceBadge.bg, color: cadenceBadge.color }}>
                      {cadenceBadge.label}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: priorityBadge.color }}>
                      {priorityBadge.label}
                    </span>
                  </div>

                  {/* Title & Project */}
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{task.title}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>📁 {task.projectName}</span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {task.description}
                  </p>

                  {/* Assignee & Status Row */}
                  <div className="nm-card-inset" style={{ padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{task.assigneeAvatar || '👤'}</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>@{task.assigneeName}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Due: {task.dueDate}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <select
                        className="nm-input-glass"
                        style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', cursor: 'pointer' }}
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_review">In Review</option>
                        <option value="completed">Completed ✓</option>
                      </select>
                      <button
                        type="button"
                        style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px' }}
                        onClick={() => deleteTask(task.id)}
                        title="Delete Task"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= OPEN / EDIT TEAM DETAIL MODAL ================= */}
      {selectedTeam && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '680px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  {selectedTeam.department}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{selectedTeam.name}</h3>
              </div>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }} onClick={() => setSelectedTeam(null)}>✕</button>
            </div>

            {/* Description & Lead Edit */}
            <div className="nm-card-inset" style={{ padding: '14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Team Details</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedTeam.description}</p>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>👨‍💼 Lead Manager: {selectedTeam.leadName}</div>
            </div>

            {/* ADD MEMBER BY USERNAME SEARCH */}
            <div className="nm-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                ➕ Add Team Member by @username
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="nm-input-glass"
                    placeholder="Search @username (e.g. aditya, admin_ceo)..."
                    value={usernameQuery}
                    onChange={(e) => setUsernameQuery(e.target.value)}
                    style={{ fontSize: '12px' }}
                  />

                  {/* Username Autocomplete list */}
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
                            padding: '6px 8px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            background: 'transparent',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                          onClick={() => handleAddMemberByUsername(u.profile)}
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
                  placeholder="Team Role (e.g. Lead Dev)"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{ fontSize: '12px' }}
                />

                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Select user above
                </span>
              </div>
            </div>

            {/* Current Team Roster */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Current Team Members ({selectedTeam.members.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTeam.members.map((m) => (
                  <div key={m.id} className="nm-card-inset" style={{ padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{m.avatar}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>@{m.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="nm-btn"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => {
                        setTargetUsernameForProfile(m.name)
                        setShowUserProfileModal(true)
                      }}
                    >
                      View Profile & Performance
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT TASK MODAL ================= */}
      {editingTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Edit Task & Reassign Work</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setEditingTask(null)}>✕</button>
            </div>

            <form onSubmit={handleUpdateTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Task Title</label>
                <input type="text" className="nm-input-glass" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Assignee @username</label>
                  <input type="text" className="nm-input-glass" value={editingTask.assigneeName} onChange={(e) => setEditingTask({ ...editingTask, assigneeName: e.target.value })} />
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
                  <input type="text" className="nm-input-glass" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea className="nm-input-glass" rows={3} value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
              </div>

              <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                Update Task Details ✓
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE TEAM MODAL ================= */}
      {showTeamModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '560px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Create New Corporate Team</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setShowTeamModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Team Name</label>
                <input type="text" className="nm-input-glass" placeholder="e.g. AI & Machine Learning Squad" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Department</label>
                  <input type="text" className="nm-input-glass" value={newTeamDept} onChange={(e) => setNewTeamDept(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Team Lead Name</label>
                  <input type="text" className="nm-input-glass" value={newTeamLead} onChange={(e) => setNewTeamLead(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea className="nm-input-glass" rows={2} placeholder="Team goals and responsibilities..." value={newTeamDesc} onChange={(e) => setNewTeamDesc(e.target.value)} />
              </div>

              <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                Save & Initialize Team 🎉
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE TASK MODAL ================= */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Assign New Project Task</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setShowTaskModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Task Title</label>
                <input type="text" className="nm-input-glass" placeholder="e.g. Implement authentication security audit" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Project</label>
                  <select className="nm-input-glass" value={newTaskProjId} onChange={(e) => setNewTaskProjId(e.target.value)}>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Assignee Name</label>
                  <input type="text" className="nm-input-glass" value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Time Cadence</label>
                  <select className="nm-input-glass" value={newTaskCadence} onChange={(e) => setNewTaskCadence(e.target.value as TaskCadence)}>
                    <option value="day">☀️ Day-wise (Daily)</option>
                    <option value="week">📆 Week-wise (Weekly Sprint)</option>
                    <option value="month">🗓️ Month-wise (Monthly)</option>
                    <option value="year">📊 Year-wise (Yearly Objective)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Priority</label>
                  <select className="nm-input-glass" value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as any)}>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Due Date / Target Timeframe</label>
                <input type="text" className="nm-input-glass" placeholder="e.g. This Friday, 5:00 PM" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea className="nm-input-glass" rows={3} placeholder="Task details and expected deliverables..." value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} />
              </div>

              <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                Assign Task to Member 🚀
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

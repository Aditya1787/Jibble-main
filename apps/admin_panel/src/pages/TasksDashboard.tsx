import { useState } from 'react'
import { useTeamTaskStore, TaskCadence, Task } from '../store/useTeamTaskStore'
import { useAuthStore, isLeadOrHead } from '../store/useAuthStore'
import UserProfileModal from '../components/UserProfileModal'

export default function TasksDashboard() {
  const { user } = useAuthStore()
  const { projects, tasks, addTask, updateTask, updateTaskStatus, deleteTask } = useTeamTaskStore()

  // User Role State
  const [demoRoleMode, setDemoRoleMode] = useState<'lead' | 'member'>(() =>
    isLeadOrHead(user) ? 'lead' : 'lead'
  )
  const isLead = demoRoleMode === 'lead'

  // View Mode Switcher: 'all_tasks' | 'projects' | 'kanban'
  const [viewMode, setViewMode] = useState<'projects' | 'all_tasks' | 'kanban'>('projects')

  // Selected Project filter in Project view (default 'all')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')

  // Filters
  const [cadenceFilter, setCadenceFilter] = useState<TaskCadence | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [taskSearch, setTaskSearch] = useState<string>('')

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showUserProfileModal, setShowUserProfileModal] = useState(false)
  const [targetUsernameForProfile, setTargetUsernameForProfile] = useState('')

  // New Task Form State
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState(projects[0]?.id || '')
  const [assigneeQuery, setAssigneeQuery] = useState('')
  const [selectedAssignee, setSelectedAssignee] = useState('Aditya Kumar')
  const [priority, setPriority] = useState<Task['priority']>('high')
  const [cadence, setCadence] = useState<TaskCadence>('week')
  const [dueDate, setDueDate] = useState('This Friday, 5:00 PM')
  const [description, setDescription] = useState('')

  // Matching registered users for assignee lookup
  const { registeredUsers } = useAuthStore()
  const userMatches = registeredUsers.filter((u) =>
    u.profile.username.toLowerCase().includes(assigneeQuery.toLowerCase()) ||
    u.profile.email.toLowerCase().includes(assigneeQuery.toLowerCase())
  )

  // Metrics
  const totalTasks = tasks.length
  const workingOnCount = tasks.filter((t) => t.status === 'in_progress').length
  const inReviewCount = tasks.filter((t) => t.status === 'in_review').length
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  // Filtered Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchCadence = cadenceFilter === 'all' || task.cadence === cadenceFilter
    const matchProj = selectedProjectId === 'all' || task.projectId === selectedProjectId
    const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchStatus = statusFilter === 'all' || task.status === statusFilter
    const matchSearch =
      task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.assigneeName.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.projectName.toLowerCase().includes(taskSearch.toLowerCase())
    return matchCadence && matchProj && matchPriority && matchStatus && matchSearch
  })

  // Grouped tasks for Kanban board
  const kanbanColumns = [
    { id: 'todo', title: '📌 To Do', color: '#64748b', tasks: filteredTasks.filter(t => t.status === 'todo') },
    { id: 'in_progress', title: '🛠️ Working On Task', color: '#d97706', tasks: filteredTasks.filter(t => t.status === 'in_progress') },
    { id: 'in_review', title: '🔍 In Review', color: '#7c3aed', tasks: filteredTasks.filter(t => t.status === 'in_review') },
    { id: 'completed', title: '✓ Completed', color: '#059669', tasks: filteredTasks.filter(t => t.status === 'completed') },
  ]

  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !isLead) return
    const proj = projects.find((p) => p.id === projectId)
    addTask({
      title,
      projectId: projectId || projects[0]?.id || 'proj-1',
      projectName: proj?.name || 'Workspace Project',
      assigneeName: selectedAssignee || assigneeQuery || 'Unassigned',
      assigneeAvatar: '👤',
      priority,
      status: 'todo',
      cadence,
      dueDate: dueDate || 'Pending',
      description: description || 'Assigned workspace task.'
    })
    setTitle('')
    setDescription('')
    setShowAssignModal(false)
  }

  const handleUpdateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask || !isLead) return
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
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
      {/* INTERACTIVE ROLE SWITCHER DEMO BANNER */}
      <div className="nm-card-inset" style={{ padding: '12px 20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'rgba(243, 239, 232, 0.55)', border: '1px solid rgba(51, 102, 89, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🔐</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>Role Permission Simulator</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {isLead ? '👑 Team Lead / Project Head Mode (Full permissions: Edit project tasks, reassign, & delete tasks)' : '👤 Regular Employee Mode (Restricted: View project tasks & update work progress)'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={demoRoleMode === 'lead' ? 'nm-btn-accent' : 'nm-btn'}
            style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '10px', border: 'none', fontWeight: 700 }}
            onClick={() => setDemoRoleMode('lead')}
          >
            👑 Team Lead / Head Mode
          </button>
          <button
            type="button"
            className={demoRoleMode === 'member' ? 'nm-btn-accent' : 'nm-btn'}
            style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '10px', border: 'none', fontWeight: 700 }}
            onClick={() => setDemoRoleMode('member')}
          >
            👤 Member Mode (Restricted)
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Project Tasks & Employee Allocation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
            Open any project to view all tasks allocated across every team member, edit task details as Team Lead, and track execution.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Mode Switcher Tabs */}
          <div className="nm-card-inset" style={{ padding: '4px', borderRadius: '14px', display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className={viewMode === 'projects' ? 'nm-btn-accent' : 'nm-btn'}
              style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '10px', border: 'none', fontWeight: 700 }}
              onClick={() => setViewMode('projects')}
            >
              📁 Projects Breakdown
            </button>
            <button
              type="button"
              className={viewMode === 'all_tasks' ? 'nm-btn-accent' : 'nm-btn'}
              style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '10px', border: 'none', fontWeight: 700 }}
              onClick={() => setViewMode('all_tasks')}
            >
              📋 All Tasks Section
            </button>
            <button
              type="button"
              className={viewMode === 'kanban' ? 'nm-btn-accent' : 'nm-btn'}
              style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '10px', border: 'none', fontWeight: 700 }}
              onClick={() => setViewMode('kanban')}
            >
              📊 Kanban Board
            </button>
          </div>

          {/* Lead Only Action */}
          {isLead && (
            <button
              type="button"
              className="nm-btn-accent"
              style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 800 }}
              onClick={() => setShowAssignModal(true)}
            >
              + Assign New Task 🚀
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            📋
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Allocated Tasks</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalTasks} Tasks</h3>
          </div>
        </div>

        <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            🛠️
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Working On Task</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#d97706' }}>{workingOnCount} Active</h3>
          </div>
        </div>

        <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            🔍
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Pending Review</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#7c3aed' }}>{inReviewCount} In Review</h3>
          </div>
        </div>

        <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            ✓
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Completed Tasks</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>{completedCount} Done</h3>
          </div>
        </div>
      </div>

      {/* Cadence Filter Tabs */}
      <div className="nm-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🗓️ Task Cadence Timeframe Filter
        </span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: '🌐 All Cadences', count: tasks.length },
            { id: 'day', label: '☀️ Day-wise (Daily Tasks)', count: tasks.filter(t => t.cadence === 'day').length },
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
                  boxShadow: isActive ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)'
                }}
                onClick={() => setCadenceFilter(c.id as any)}
              >
                {c.label} ({c.count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Toolbar Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="nm-input-glass"
            placeholder="Search tasks by title, project, or @username..."
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="nm-input-glass"
            style={{ cursor: 'pointer', width: '180px', fontWeight: 600 }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="all">All Workspace Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            className="nm-input-glass"
            style={{ cursor: 'pointer', width: '150px', fontWeight: 600 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">🛠️ Working On Task</option>
            <option value="in_review">🔍 In Review</option>
            <option value="completed">✓ Completed</option>
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

      {/* ================= VIEW 1: PROJECTS BREAKDOWN VIEW ================= */}
      {viewMode === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {projects
            .filter((p) => selectedProjectId === 'all' || p.id === selectedProjectId)
            .map((project) => {
              const projectTasks = filteredTasks.filter((t) => t.projectId === project.id)
              return (
                <div key={project.id} className="nm-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '18px' }}>
                  {/* Project Header Banner */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>📁</span>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{project.name}</h2>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '8px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)' }}>
                          Team: {project.teamName}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {project.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div className="nm-card-inset" style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700 }}>
                        Target: {project.targetDate}
                      </div>
                      <div className="nm-card-inset" style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>
                        Total Allocated: {projectTasks.length} Tasks
                      </div>
                    </div>
                  </div>

                  {/* ALL TASKS ALLOCATED TO EVERYONE ON THIS PROJECT */}
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', display: 'block' }}>
                      Tasks Allocated to Team Members ({projectTasks.length})
                    </span>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
                      {projectTasks.map((task) => {
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
                            {/* Top Badges */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: cadenceBadge.bg, color: cadenceBadge.color }}>
                                {cadenceBadge.label}
                              </span>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: priorityBadge.color }}>
                                {priorityBadge.label}
                              </span>
                            </div>

                            {/* Task Info */}
                            <div>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{task.title}</h4>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{task.description}</p>
                            </div>

                            {/* Assignee & Actions Row */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setTargetUsernameForProfile(task.assigneeName); setShowUserProfileModal(true); }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '16px' }}>{task.assigneeAvatar || '👤'}</span>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>@{task.assigneeName}</span>
                                </div>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Due: {task.dueDate}</span>
                              </div>

                              {/* Status Dropdown & Lead Actions */}
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

                      {projectTasks.length === 0 && (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', gridColumn: '1 / -1' }}>
                          No tasks allocated for this project yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {/* ================= VIEW 2: ALL TASKS SECTION VIEW ================= */}
      {viewMode === 'all_tasks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
          {filteredTasks.map((task) => {
            const cadenceBadge = getCadenceBadge(task.cadence)
            const priorityBadge = getPriorityBadge(task.priority)
            return (
              <div key={task.id} className="nm-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', minHeight: '260px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: cadenceBadge.bg, color: cadenceBadge.color }}>
                    {cadenceBadge.label}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: priorityBadge.color }}>
                    {priorityBadge.label}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{task.title}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>📁 {task.projectName}</span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {task.description}
                </p>

                <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setTargetUsernameForProfile(task.assigneeName); setShowUserProfileModal(true); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{task.assigneeAvatar || '👤'}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>@{task.assigneeName}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Deadline: {task.dueDate}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
                      <select
                        className="nm-input-glass"
                        style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', cursor: 'pointer' }}
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">🛠️ Working On Task</option>
                        <option value="in_review">🔍 In Review</option>
                        <option value="completed">✓ Completed</option>
                      </select>
                    </div>

                    {isLead && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" className="nm-btn" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setEditingTask(task)}>✏️ Edit</button>
                        <button type="button" className="nm-btn-accent" style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--danger)', border: 'none', color: '#fff' }} onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ================= VIEW 3: KANBAN BOARD VIEW ================= */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'flex-start' }}>
          {kanbanColumns.map((col) => (
            <div key={col.id} className="nm-card-inset" style={{ padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(243, 239, 232, 0.45)', minHeight: '420px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '2px solid rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: col.color }}>{col.title}</h3>
                <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '10px', boxShadow: 'var(--nm-flat-xs)' }}>
                  {col.tasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {col.tasks.map((task) => {
                  const cadenceBadge = getCadenceBadge(task.cadence)
                  const priorityBadge = getPriorityBadge(task.priority)
                  return (
                    <div key={task.id} className="nm-card animate-pop-in" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: cadenceBadge.bg, color: cadenceBadge.color }}>
                          {cadenceBadge.label}
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: priorityBadge.color }}>
                          {priorityBadge.label}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{task.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{task.description}</p>

                      <div className="nm-card-inset" style={{ padding: '8px 10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => { setTargetUsernameForProfile(task.assigneeName); setShowUserProfileModal(true); }}>
                          <span style={{ fontSize: '11px', fontWeight: 700 }}>👤 @{task.assigneeName}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{task.dueDate}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                          <select
                            className="nm-input-glass"
                            style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', cursor: 'pointer' }}
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">🛠️ Working On Task</option>
                            <option value="in_review">🔍 In Review</option>
                            <option value="completed">✓ Completed</option>
                          </select>

                          {isLead && (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px' }} onClick={() => setEditingTask(task)}>✏️</button>
                              <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px', color: 'var(--danger)' }} onClick={() => deleteTask(task.id)}>🗑️</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ASSIGN NEW TASK MODAL ================= */}
      {showAssignModal && isLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '540px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Assign New Task to Employee</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setShowAssignModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAssignTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Task Title</label>
                <input type="text" className="nm-input-glass" placeholder="e.g. Implement authentication security audit" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Project</label>
                  <select className="nm-input-glass" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Assignee @username</label>
                  <input
                    type="text"
                    className="nm-input-glass"
                    placeholder="Type @username..."
                    value={assigneeQuery || selectedAssignee}
                    onChange={(e) => {
                      setAssigneeQuery(e.target.value)
                      setSelectedAssignee(e.target.value)
                    }}
                  />
                  {assigneeQuery && userMatches.length > 0 && (
                    <div
                      className="spatial-panel animate-pop-in"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        width: '100%',
                        maxHeight: '130px',
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
                          onClick={() => {
                            setSelectedAssignee(u.profile.username || u.profile.email)
                            setAssigneeQuery('')
                          }}
                        >
                          <span style={{ fontWeight: 700 }}>@{u.profile.username || u.profile.email}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{u.profile.role}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Time Cadence</label>
                  <select className="nm-input-glass" value={cadence} onChange={(e) => setCadence(e.target.value as TaskCadence)}>
                    <option value="day">☀️ Day-wise (Daily Task)</option>
                    <option value="week">📆 Week-wise (Weekly Sprint)</option>
                    <option value="month">🗓️ Month-wise (Monthly Deliverable)</option>
                    <option value="year">📊 Year-wise (Yearly Objective)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Priority</label>
                  <select className="nm-input-glass" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Deadline / Timeframe</label>
                <input type="text" className="nm-input-glass" placeholder="e.g. Tomorrow 5 PM, Friday, End of Month" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Task Description & Instructions</label>
                <textarea className="nm-input-glass" rows={3} placeholder="Task goals, deliverables, and instructions..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                Assign Task Now 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT TASK MODAL ================= */}
      {editingTask && isLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Edit Project Task Details</h3>
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

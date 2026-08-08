import { useState, useMemo } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useTeamTaskStore } from '../store/useTeamTaskStore'
import UserProfileModal from '../components/UserProfileModal'
import {
  OrgNode,
  fullOrgTree,
  allCompanyCategories,
  jobRoleData,
  allOrgEmployees,
  flattenOrgTree
} from '../data/orgData'

type ViewMode = 'tree' | 'grid' | 'catalog'

export default function OrgHierarchy() {
  const { registeredUsers } = useAuthStore()
  const { projects } = useTeamTaskStore()

  const [selectedUsername, setSelectedUsername] = useState<string>('admin_ceo')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('tree')
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({})
  const [showProfileModal, setShowProfileModal] = useState<string | null>(null)
  const [showCatalogDrawer, setShowCatalogDrawer] = useState<boolean>(false)

  // Enrich tree with store data
  const allNodes = useMemo(() => {
    const flattened = flattenOrgTree(fullOrgTree)
    return flattened.map((n) => {
      const reg = registeredUsers.find((r) => r.profile.username.toLowerCase() === n.username.toLowerCase())
      return {
        ...n,
        avatar: reg?.profile.avatar || n.avatar,
        role: reg?.profile.role || n.role,
        email: reg?.profile.email || n.email
      }
    })
  }, [registeredUsers])

  const selectedNode = allNodes.find((n) => n.username.toLowerCase() === selectedUsername.toLowerCase()) || allNodes[0]
  const supervisorNode = allNodes.find((n) => n.username.toLowerCase() === selectedNode.reportsTo?.toLowerCase())
  const directReports = allNodes.filter((n) => n.reportsTo?.toLowerCase() === selectedNode.username.toLowerCase())
  const sharedProjects = projects.filter(
    (p) =>
      (p.teamName ?? '').toLowerCase().includes(selectedNode.category.toLowerCase()) ||
      (p.teamName ?? '').toLowerCase().includes(selectedNode.subcategory?.toLowerCase() || '') ||
      (p.teamName ?? '').toLowerCase().includes('engineering')
  )

  // Search and filter matching logic
  const matchesFilter = (node: OrgNode): boolean => {
    const matchesSearch =
      !searchQuery ||
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.subcategory && node.subcategory.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategoryFilter === 'all' || node.category.toLowerCase() === selectedCategoryFilter.toLowerCase()

    const matchesSubcategory =
      selectedSubcategoryFilter === 'all' ||
      (!!node.subcategory && node.subcategory.toLowerCase() === selectedSubcategoryFilter.toLowerCase())

    return Boolean(matchesSearch && matchesCategory && matchesSubcategory)
  }

  // Recursive tree visibility check
  const isNodeVisibleInTree = (node: OrgNode): boolean => {
    if (matchesFilter(node)) return true
    if (node.children && node.children.some(isNodeVisibleInTree)) return true
    return false
  }

  const toggleCollapse = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCollapsedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }))
  }

  // Available subcategories depending on category filter
  const currentSubcategories = useMemo(() => {
    if (selectedCategoryFilter === 'Software Engineering') {
      return ['all', 'Backend', 'Frontend', 'Mobile (Flutter)', 'Full Stack', 'DevOps', 'Quality Assurance (QA)']
    }
    if (selectedCategoryFilter === 'Marketing') {
      return ['all', 'Digital Marketing', 'Social Media', 'Content']
    }
    return []
  }, [selectedCategoryFilter])

  // Recursive Tree Node Component
  const RenderTreeNode = ({ node }: { node: OrgNode }) => {
    if (!isNodeVisibleInTree(node)) return null
    const isSelected = selectedUsername.toLowerCase() === node.username.toLowerCase()
    const isSearchMatch = searchQuery && matchesFilter(node)
    const isCollapsed = !!collapsedNodes[node.id]

    const visibleChildren = node.children ? node.children.filter(isNodeVisibleInTree) : []
    const hasChildren = visibleChildren.length > 0

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* Node Card */}
        <div
          className={`nm-card animate-pop-in ${isSelected ? 'nm-card-inset' : ''}`}
          style={{
            padding: '12px 16px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            background: isSelected
              ? 'rgba(51,102,89,0.14)'
              : isSearchMatch
              ? 'rgba(234,179,8,0.15)'
              : 'var(--bg-primary)',
            border: isSelected
              ? '2px solid var(--accent)'
              : isSearchMatch
              ? '2px solid #eab308'
              : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isSelected
              ? '0 0 20px rgba(51,102,89,0.3)'
              : isSearchMatch
              ? '0 0 16px rgba(234,179,8,0.4)'
              : 'var(--nm-flat-xs)',
            transition: 'all 0.2s',
            zIndex: 3,
            minWidth: '240px',
            maxWidth: '280px'
          }}
          onClick={() => setSelectedUsername(node.username)}
        >
          {/* Avatar Icon */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: 'var(--nm-flat-xs)',
              flexShrink: 0
            }}
          >
            {node.avatar}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {node.name}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {node.role}
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                @{node.username}
              </span>
              {node.subcategory && (
                <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: '#2563eb', padding: '1px 6px', borderRadius: '4px' }}>
                  {node.subcategory}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
            <button
              type="button"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', opacity: 0.8 }}
              onClick={(e) => {
                e.stopPropagation()
                setShowProfileModal(node.username)
              }}
              title="View Employee Profile"
            >
              🔍
            </button>

            {hasChildren && (
              <button
                type="button"
                style={{
                  border: 'none',
                  background: 'var(--bg-primary)',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 800,
                  boxShadow: 'var(--nm-flat-xs)',
                  color: 'var(--accent)'
                }}
                onClick={(e) => toggleCollapse(node.id, e)}
                title={isCollapsed ? 'Expand Branch' : 'Collapse Branch'}
              >
                {isCollapsed ? '+' : '−'}
              </button>
            )}
          </div>
        </div>

        {/* Vertical Line from Parent Card */}
        {hasChildren && !isCollapsed && (
          <div style={{ width: '2px', height: '20px', background: 'var(--accent)', opacity: 0.5 }} />
        )}

        {/* Children Row with Gap-Aware Horizontal Line Connectors */}
        {hasChildren && !isCollapsed && (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {visibleChildren.map((child, index) => {
              const isFirst = index === 0
              const isLast = index === visibleChildren.length - 1
              const isOnly = visibleChildren.length === 1

              return (
                <div
                  key={child.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Top Horizontal Connector Bar */}
                  {!isOnly && (
                    <div style={{ position: 'relative', width: '100%', height: '2px' }}>
                      {/* Left half connector line */}
                      {!isFirst && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '-12px',
                            top: 0,
                            width: 'calc(50% + 12px)',
                            height: '2px',
                            background: 'var(--accent)',
                            opacity: 0.5
                          }}
                        />
                      )}
                      {/* Right half connector line */}
                      {!isLast && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '-12px',
                            top: 0,
                            width: 'calc(50% + 12px)',
                            height: '2px',
                            background: 'var(--accent)',
                            opacity: 0.5
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Vertical Line down into Child Card */}
                  <div style={{ width: '2px', height: '20px', background: 'var(--accent)', opacity: 0.5 }} />

                  <RenderTreeNode node={child} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Filtered nodes array for Grid and Catalog modes
  const filteredNodes = useMemo(() => {
    return allNodes.filter(matchesFilter)
  }, [allNodes, searchQuery, selectedCategoryFilter, selectedSubcategoryFilter])

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1800, display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Corporate Job Roles & Organizational Hierarchy Tree
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
            Complete corporate tree covering all 19 categories and 139 job roles with dedicated employee assignments across Engineering, AI, Privacy, Design, Product, Marketing, Sales, HR, Finance, Operations, Legal, Security, Cloud, DevRel, Documentation, and Growth.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="nm-btn"
            style={{ padding: '10px 18px', fontSize: '12px', fontWeight: 800 }}
            onClick={() => setShowCatalogDrawer(true)}
          >
            📋 139 Job Roles Catalog
          </button>
          <div className="nm-card-inset" style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)', fontWeight: 800, fontSize: '12px' }}>
            🌳 {allNodes.length} Assigned Employees (100% Filled)
          </div>
        </div>
      </div>

      {/* CONTROLS BAR: SEARCH, CATEGORY FILTERS & VIEW MODE TOGGLE */}
      <div className="nm-card" style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search and View Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '340px' }}>
            <input
              type="text"
              className="nm-input-glass"
              placeholder="Search by name, role (e.g. LLM Engineer, Flutter, DPO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '36px', fontSize: '13px', fontWeight: 600, width: '100%' }}
            />
            {searchQuery ? (
              <button
                type="button"
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)' }}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            ) : (
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '13px' }}>
                🔍
              </span>
            )}
          </div>

          {/* View Mode Buttons */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '12px' }}>
            <button
              type="button"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                background: viewMode === 'tree' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'tree' ? '#ffffff' : 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
              onClick={() => setViewMode('tree')}
            >
              🌳 Hierarchy Tree View
            </button>
            <button
              type="button"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                background: viewMode === 'grid' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
              onClick={() => setViewMode('grid')}
            >
              🏢 Department Grid View ({filteredNodes.length})
            </button>
            <button
              type="button"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                background: viewMode === 'catalog' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'catalog' ? '#ffffff' : 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
              onClick={() => setViewMode('catalog')}
            >
              📋 All 139 Job Roles Table
            </button>
          </div>
        </div>

        {/* 19 Company Categories Filter Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🏷️ Filter Hierarchy by Department (19 Categories)
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto', paddingRight: '4px' }}>
            {allCompanyCategories.map((cat) => {
              const isActive = selectedCategoryFilter.toLowerCase() === cat.id.toLowerCase()
              return (
                <button
                  key={cat.id}
                  type="button"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: isActive ? 'var(--accent)' : 'rgba(243,239,232,0.6)',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    boxShadow: isActive ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)'
                  }}
                  onClick={() => {
                    setSelectedCategoryFilter(cat.id)
                    setSelectedSubcategoryFilter('all')
                  }}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Subcategory Pills if Software Engineering or Marketing is active */}
        {currentSubcategories.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
              📂 Subcategory Filter:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {currentSubcategories.map((sub) => {
                const isActive = selectedSubcategoryFilter === sub
                return (
                  <button
                    key={sub}
                    type="button"
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: isActive ? '#2563eb' : 'rgba(59,130,246,0.1)',
                      color: isActive ? '#ffffff' : '#2563eb'
                    }}
                    onClick={() => setSelectedSubcategoryFilter(sub)}
                  >
                    {sub === 'all' ? 'All Subcategories' : sub}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* SELECTED EMPLOYEE CONNECTION INTELLIGENCE PANEL */}
      <div className="nm-card" style={{ padding: '20px 24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: 'var(--nm-flat-xs)' }}>
              {selectedNode.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedNode.name}</h3>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  @{selectedNode.username}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                  {selectedNode.category} {selectedNode.subcategory ? `• ${selectedNode.subcategory}` : ''}
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {selectedNode.role} • {selectedNode.email}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="nm-btn-accent"
            style={{ padding: '8px 18px', fontSize: '12px' }}
            onClick={() => setShowProfileModal(selectedNode.username)}
          >
            Open Profile Dashboard →
          </button>
        </div>

        {/* Linkages Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {/* Direct Supervisor */}
          <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>⬆️ Direct Supervisor</span>
            {supervisorNode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setSelectedUsername(supervisorNode.username)}>
                <span style={{ fontSize: '16px' }}>{supervisorNode.avatar}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>{supervisorNode.name} (@{supervisorNode.username})</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{supervisorNode.role}</div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>👑 Executive Board (Top Command)</div>
            )}
          </div>

          {/* Direct Reports */}
          <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>👥 Direct Reports ({directReports.length})</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '50px', overflowY: 'auto' }}>
              {directReports.length > 0 ? (
                directReports.map((report) => (
                  <span
                    key={report.id}
                    style={{ fontSize: '10px', fontWeight: 700, background: 'var(--bg-primary)', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', boxShadow: 'var(--nm-flat-xs)' }}
                    onClick={() => setSelectedUsername(report.username)}
                  >
                    {report.avatar} @{report.username}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Individual Contributor / Staff</span>
              )}
            </div>
          </div>

          {/* Shared Workspace Projects */}
          <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🔗 Shared Department Projects</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '50px', overflowY: 'auto' }}>
              {sharedProjects.slice(0, 3).map((p) => (
                <span key={p.id} style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: '#2563eb', padding: '2px 6px', borderRadius: '4px' }}>
                  📁 {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE HIERARCHY TREE CANVAS */}
      {viewMode === 'tree' && (
        <div style={{ position: 'relative' }}>
          {/* Zoom and Reset Controls */}
          <div style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-primary)', padding: '6px 12px', borderRadius: '12px', boxShadow: 'var(--nm-flat-xs)' }}>
            <button
              type="button"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, fontSize: '13px', padding: '2px 6px' }}
              onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
              title="Zoom Out"
            >
              🔍−
            </button>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', minWidth: '36px', textAlign: 'center' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, fontSize: '13px', padding: '2px 6px' }}
              onClick={() => setZoomLevel((z) => Math.min(1.5, Number((z + 0.1).toFixed(1))))}
              title="Zoom In"
            >
              🔍+
            </button>
            <span style={{ color: 'rgba(0,0,0,0.15)' }}>|</span>
            <button
              type="button"
              style={{ border: 'none', background: zoomLevel === 0.5 ? 'rgba(51,102,89,0.15)' : 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '10px', padding: '2px 6px', color: 'var(--text-secondary)' }}
              onClick={() => setZoomLevel(0.5)}
            >
              50%
            </button>
            <button
              type="button"
              style={{ border: 'none', background: zoomLevel === 0.75 ? 'rgba(51,102,89,0.15)' : 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '10px', padding: '2px 6px', color: 'var(--text-secondary)' }}
              onClick={() => setZoomLevel(0.75)}
            >
              75%
            </button>
            <button
              type="button"
              style={{ border: 'none', background: zoomLevel === 1 ? 'rgba(51,102,89,0.15)' : 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '10px', padding: '2px 6px', color: 'var(--text-secondary)' }}
              onClick={() => setZoomLevel(1)}
            >
              100%
            </button>
            <span style={{ color: 'rgba(0,0,0,0.15)' }}>|</span>
            <button
              type="button"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, fontSize: '11px', color: 'var(--accent)' }}
              onClick={() => {
                setZoomLevel(1)
                setCollapsedNodes({})
              }}
              title="Reset Tree View"
            >
              Reset
            </button>
          </div>

          <div
            className="nm-card"
            style={{
              padding: '24px 16px',
              borderRadius: '24px',
              overflow: 'auto',
              background: 'var(--bg-primary)',
              maxHeight: '78vh',
              minHeight: '480px',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: 'max-content',
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '40px 100px 80px 100px',
                boxSizing: 'border-box',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s'
              }}
            >
              <RenderTreeNode node={fullOrgTree} />
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: DEPARTMENT MATRIX GRID */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {jobRoleData.map((catDef) => {
            const isCategoryMatch = selectedCategoryFilter === 'all' || selectedCategoryFilter.toLowerCase() === catDef.category.toLowerCase()
            if (!isCategoryMatch) return null

            const categoryNodes = allNodes.filter((n) => n.category.toLowerCase() === catDef.category.toLowerCase() && matchesFilter(n))
            if (categoryNodes.length === 0) return null

            return (
              <div key={catDef.category} className="nm-card animate-pop-in" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{catDef.icon}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{catDef.category}</h3>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                    {categoryNodes.length} Job Roles
                  </span>
                </div>

                {/* Nodes List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                  {categoryNodes.map((node) => {
                    const isSelected = selectedUsername.toLowerCase() === node.username.toLowerCase()
                    return (
                      <div
                        key={node.id}
                        className="nm-card-inset"
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(51,102,89,0.12)' : 'var(--bg-primary)',
                          border: isSelected ? '1px solid var(--accent)' : 'none'
                        }}
                        onClick={() => setSelectedUsername(node.username)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <span style={{ fontSize: '18px' }}>{node.avatar}</span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {node.role}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {node.name} (@{node.username})
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {node.subcategory && (
                            <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: '#2563eb', padding: '2px 6px', borderRadius: '4px' }}>
                              {node.subcategory}
                            </span>
                          )}
                          <button
                            type="button"
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowProfileModal(node.username)
                            }}
                          >
                            🔍
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* VIEW MODE 3: ALL 139 JOB ROLES DIRECTORY TABLE */}
      {viewMode === 'catalog' && (
        <div className="nm-card" style={{ padding: '20px', borderRadius: '20px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              📋 Complete 139 Company Job Roles Directory ({filteredNodes.length} Filtered)
            </h3>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
              Showing {filteredNodes.length} of {allNodes.length} Assigned Roles
            </span>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)', background: 'rgba(0,0,0,0.02)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-muted)' }}>#</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-muted)' }}>Job Role Title</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-muted)' }}>Assigned Employee</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-muted)' }}>Department Category</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-muted)' }}>Subcategory</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-muted)' }}>Reports To Lead</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredNodes.map((node, index) => {
                  const isSelected = selectedUsername.toLowerCase() === node.username.toLowerCase()
                  return (
                    <tr
                      key={node.id}
                      style={{
                        borderBottom: '1px solid rgba(0,0,0,0.04)',
                        background: isSelected ? 'rgba(51,102,89,0.08)' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedUsername(node.username)}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>{index + 1}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--text-primary)' }}>{node.role}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{node.avatar}</span>
                          <span style={{ fontWeight: 800, color: 'var(--accent)' }}>{node.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>(@{node.username})</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-secondary)' }}>{node.category}</td>
                      <td style={{ padding: '10px 14px' }}>
                        {node.subcategory ? (
                          <span style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: '#2563eb', padding: '2px 8px', borderRadius: '4px' }}>
                            {node.subcategory}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {node.reportsTo ? `@${node.reportsTo}` : '👑 Board'}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <button
                          type="button"
                          className="nm-btn-xs"
                          style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowProfileModal(node.username)
                          }}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALL JOB ROLES DRAWER MODAL */}
      {showCatalogDrawer && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '820px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>139 Corporate Job Roles Breakdown</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Comprehensive catalog of all 19 company categories and subcategories with assigned staff.</p>
              </div>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }} onClick={() => setShowCatalogDrawer(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {jobRoleData.map((catDef) => {
                const categoryNodes = allNodes.filter((n) => n.category.toLowerCase() === catDef.category.toLowerCase())
                return (
                  <div key={catDef.category} className="nm-card-inset" style={{ padding: '16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{catDef.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)' }}>{catDef.category}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {categoryNodes.length} Assigned Employees
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {categoryNodes.map((n) => (
                        <span
                          key={n.id}
                          style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-primary)', cursor: 'pointer', boxShadow: 'var(--nm-flat-xs)' }}
                          onClick={() => {
                            setSelectedUsername(n.username)
                            setShowCatalogDrawer(false)
                          }}
                        >
                          {n.avatar} <strong>{n.role}</strong> ({n.name})
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          initialUsername={showProfileModal}
          onClose={() => setShowProfileModal(null)}
        />
      )}
    </div>
  )
}

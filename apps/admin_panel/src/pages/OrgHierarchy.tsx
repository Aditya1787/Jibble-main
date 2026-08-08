import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useTeamTaskStore } from '../store/useTeamTaskStore'
import UserProfileModal from '../components/UserProfileModal'

interface OrgNode {
  id: string
  name: string
  username: string
  role: string
  category: string
  email: string
  avatar: string
  reportsTo?: string // username of supervisor
  children?: OrgNode[]
}

// Complete Corporate Hierarchy Tree covering ALL Categories & Roles
const fullOrgTree: OrgNode = {
  id: 'ceo',
  name: 'Aditya Kumar',
  username: 'admin_ceo',
  role: 'Founder / CEO',
  category: 'Executive Team',
  email: 'admin@jibble.com',
  avatar: '🎒',
  children: [
    // 1. SOFTWARE ENGINEERING & CLOUD INFRASTRUCTURE
    {
      id: 'cto',
      name: 'Vikram Malhotra',
      username: 'cto_vikram',
      role: 'CTO (Chief Technology Officer)',
      category: 'Executive Team',
      email: 'cto@company.com',
      avatar: '🧠',
      reportsTo: 'admin_ceo',
      children: [
        {
          id: 'tech_head',
          name: 'Aditya Kumar',
          username: 'aditya',
          role: 'Tech Head & Principal Architect',
          category: 'Software Engineering',
          email: 'aditya@company.com',
          avatar: '💻',
          reportsTo: 'cto_vikram',
          children: [
            {
              id: 'lead_backend',
              name: 'Karan Mehta',
              username: 'karan_backend',
              role: 'Lead Backend Engineer & Cloud Architect',
              category: 'Software Engineering',
              email: 'karan@company.com',
              avatar: '⚡',
              reportsTo: 'aditya',
              children: [
                { id: 'dev_backend', name: 'Suresh Raina', username: 'suresh_backend', role: 'Senior Backend Engineer', category: 'Software Engineering', email: 'suresh@company.com', avatar: '⚙️', reportsTo: 'karan_backend' },
                { id: 'intern_backend', name: 'Rohan Sharma', username: 'rohan_intern', role: 'Backend Developer Intern', category: 'Software Engineering', email: 'rohan@company.com', avatar: '💻', reportsTo: 'karan_backend' }
              ]
            },
            {
              id: 'lead_frontend',
              name: 'Alex Rivera',
              username: 'alex_lead',
              role: 'Frontend Lead & Senior React Developer',
              category: 'Software Engineering',
              email: 'alex@company.com',
              avatar: '👨‍💼',
              reportsTo: 'aditya',
              children: [
                { id: 'dev_react', name: 'Rahul Verma', username: 'rahul_dev', role: 'React Specialist', category: 'Software Engineering', email: 'rahul@company.com', avatar: '🚀', reportsTo: 'alex_lead' },
                { id: 'intern_frontend', name: 'Arjun Singh', username: 'arjun_intern', role: 'Frontend Developer Intern', category: 'Software Engineering', email: 'arjun@company.com', avatar: '💻', reportsTo: 'alex_lead' }
              ]
            },
            {
              id: 'lead_mobile',
              name: 'Varun Dhawan',
              username: 'varun_mobile',
              role: 'Mobile Tech Lead (Flutter)',
              category: 'Software Engineering',
              email: 'varun@company.com',
              avatar: '📱',
              reportsTo: 'aditya',
              children: [
                { id: 'dev_mobile', name: 'Sneha Roy', username: 'sneha_mobile', role: 'Senior Flutter Developer', category: 'Software Engineering', email: 'sneha@company.com', avatar: '📲', reportsTo: 'varun_mobile' }
              ]
            },
            {
              id: 'lead_cloud',
              name: 'Nikhil Sen',
              username: 'nikhil_cloud',
              role: 'Cloud Infrastructure & SRE Engineer',
              category: 'Cloud Infrastructure',
              email: 'nikhil@company.com',
              avatar: '☁️',
              reportsTo: 'aditya'
            },
            {
              id: 'lead_qa',
              name: 'Meera Rajput',
              username: 'meera_qa',
              role: 'QA Lead & Automation Engineer',
              category: 'Software Engineering',
              email: 'meera@company.com',
              avatar: '🧪',
              reportsTo: 'aditya',
              children: [
                { id: 'intern_qa', name: 'Deepak Kumar', username: 'deepak_qa', role: 'Quality Assurance (QA) Intern', category: 'Software Engineering', email: 'deepak@company.com', avatar: '🔍', reportsTo: 'meera_qa' }
              ]
            }
          ]
        },

        // AI / MACHINE LEARNING BRANCH
        {
          id: 'ai_lead',
          name: 'Dr. Sameer Khan',
          username: 'sameer_ai',
          role: 'AI Research Scientist & LLM Lead',
          category: 'AI / Machine Learning',
          email: 'sameer@company.com',
          avatar: '🤖',
          reportsTo: 'cto_vikram',
          children: [
            { id: 'ml_eng', name: 'Tanvi Shah', username: 'tanvi_ml', role: 'Machine Learning Engineer', category: 'AI / Machine Learning', email: 'tanvi@company.com', avatar: '🧠', reportsTo: 'sameer_ai' }
          ]
        },

        // CYBER SECURITY BRANCH
        {
          id: 'sec_arch',
          name: 'Rohan Sen',
          username: 'rohan_sec',
          role: 'Security Architect & Penetration Tester',
          category: 'Cyber Security',
          email: 'rohan_sec@company.com',
          avatar: '🔐',
          reportsTo: 'cto_vikram',
          children: [
            { id: 'sec_analyst', name: 'Kavita Das', username: 'kavita_sec', role: 'SOC Security Analyst', category: 'Cyber Security', email: 'kavita_sec@company.com', avatar: '🔍', reportsTo: 'rohan_sec' }
          ]
        }
      ]
    },

    // 2. PRIVACY, POLICY & LEGAL BRANCH
    {
      id: 'dpo_head',
      name: 'Neha Gupta',
      username: 'neha_dpo',
      role: 'Data Protection Officer (DPO) & Compliance Director',
      category: 'Privacy & Policy Management',
      email: 'neha@company.com',
      avatar: '🛡️',
      reportsTo: 'admin_ceo',
      children: [
        {
          id: 'compliance_mgr',
          name: 'Rajesh Kumar',
          username: 'rajesh_compliance',
          role: 'Compliance Officer & Policy Auditor',
          category: 'Privacy & Policy Management',
          email: 'rajesh@company.com',
          avatar: '📜',
          reportsTo: 'neha_dpo',
          children: [
            { id: 'content_mod', name: 'Simran Kaur', username: 'simran_mod', role: 'Content & Policy Moderator', category: 'Privacy & Policy Management', email: 'simran@company.com', avatar: '🚨', reportsTo: 'rajesh_compliance' },
            { id: 'privacy_intern', name: 'Aakash Verma', username: 'aakash_intern', role: 'Legal & Privacy Intern', category: 'Privacy & Policy Management', email: 'aakash@company.com', avatar: '⚖️', reportsTo: 'rajesh_compliance' }
          ]
        },
        {
          id: 'corp_lawyer',
          name: 'Meenakshi Sundaram',
          username: 'meenakshi_legal',
          role: 'Corporate Lawyer & Legal Counsel',
          category: 'Legal',
          email: 'meenakshi@company.com',
          avatar: '⚖️',
          reportsTo: 'neha_dpo'
        }
      ]
    },

    // 3. PRODUCT, DESIGN & DATA BRANCH
    {
      id: 'cpo',
      name: 'Sanya Kapoor',
      username: 'sanya_cpo',
      role: 'Chief Product Officer (CPO)',
      category: 'Product',
      email: 'sanya@company.com',
      avatar: '📱',
      reportsTo: 'admin_ceo',
      children: [
        {
          id: 'head_design',
          name: 'Riya Patel',
          username: 'riya_ui',
          role: 'Head of Product Design & Lead UI/UX Designer',
          category: 'Design',
          email: 'riya@company.com',
          avatar: '🎨',
          reportsTo: 'sanya_cpo',
          children: [
            { id: 'product_mgr', name: 'Aman Deep', username: 'aman_pm', role: 'Senior Product Manager', category: 'Product', email: 'aman@company.com', avatar: '📊', reportsTo: 'riya_ui' },
            { id: 'data_analyst', name: 'Pooja Hegde', username: 'pooja_data', role: 'Senior Data Analyst', category: 'Data', email: 'pooja@company.com', avatar: '📈', reportsTo: 'riya_ui' },
            { id: 'design_intern', name: 'Kavita Joshi', username: 'kavita_intern', role: 'UI/UX Design Intern', category: 'Design', email: 'kavita@company.com', avatar: '✏️', reportsTo: 'riya_ui' }
          ]
        }
      ]
    },

    // 4. HUMAN RESOURCES & OPERATIONS BRANCH
    {
      id: 'hr_dir',
      name: 'Priya Sharma',
      username: 'priya_hr',
      role: 'HR Director & People Operations Manager',
      category: 'Human Resources (HR)',
      email: 'priya@company.com',
      avatar: '🤝',
      reportsTo: 'admin_ceo',
      children: [
        {
          id: 'recruiter_lead',
          name: 'Ananya Saxena',
          username: 'ananya_recruiter',
          role: 'Technical Recruiter & HRBP',
          category: 'Human Resources (HR)',
          email: 'ananya@company.com',
          avatar: '📋',
          reportsTo: 'priya_hr',
          children: [
            { id: 'ops_mgr', name: 'Sunil Rao', username: 'sunil_ops', role: 'Operations & Program Manager', category: 'Operations', email: 'sunil@company.com', avatar: '📦', reportsTo: 'ananya_recruiter' },
            { id: 'hr_intern', name: 'Pooja Verma', username: 'pooja_hr_intern', role: 'Human Resources (HR) Intern', category: 'Human Resources (HR)', email: 'pooja@company.com', avatar: '🌸', reportsTo: 'ananya_recruiter' }
          ]
        }
      ]
    },

    // 5. MARKETING, SALES & FINANCE BRANCH
    {
      id: 'cmo',
      name: 'Kabir Mehta',
      username: 'kabir_cmo',
      role: 'CMO (Chief Marketing Officer)',
      category: 'Marketing',
      email: 'kabir@company.com',
      avatar: '📢',
      reportsTo: 'admin_ceo',
      children: [
        {
          id: 'marketing_lead',
          name: 'Nisha Singhania',
          username: 'nisha_mktg',
          role: 'Growth Marketer & Digital Content Strategist',
          category: 'Marketing',
          email: 'nisha@company.com',
          avatar: '🚀',
          reportsTo: 'kabir_cmo',
          children: [
            { id: 'sales_dir', name: 'Vikas Oberoi', username: 'vikas_sales', role: 'Enterprise Sales Director', category: 'Sales', email: 'vikas@company.com', avatar: '💰', reportsTo: 'nisha_mktg' },
            { id: 'fin_mgr', name: 'Siddharth Rao', username: 'siddharth_fin', role: 'Corporate Finance Manager', category: 'Finance', email: 'siddharth@company.com', avatar: '💵', reportsTo: 'nisha_mktg' },
            { id: 'mktg_intern', name: 'Tushar Grover', username: 'tushar_mktg_intern', role: 'Digital Marketing Intern', category: 'Marketing', email: 'tushar@company.com', avatar: '📈', reportsTo: 'nisha_mktg' }
          ]
        }
      ]
    }
  ]
}

// Full All Corporate Categories List
const allCompanyCategories = [
  { id: 'all', label: '🌐 All Company Categories (17 Departments)', icon: '🏢' },
  { id: 'Executive Team', label: '👨‍💼 Executive Team', icon: '👑' },
  { id: 'Software Engineering', label: '💻 Software Engineering', icon: '⚡' },
  { id: 'Privacy & Policy Management', label: '🛡️ Privacy & Policy', icon: '📜' },
  { id: 'AI / Machine Learning', label: '🤖 AI / Machine Learning', icon: '🧠' },
  { id: 'Data', label: '📊 Data & Analytics', icon: '📈' },
  { id: 'Design', label: '🎨 Design', icon: '✏️' },
  { id: 'Product', label: '📱 Product Management', icon: '📋' },
  { id: 'Marketing', label: '📢 Marketing', icon: '🚀' },
  { id: 'Sales', label: '💰 Sales & BDE', icon: '💵' },
  { id: 'Customer Success', label: '🤝 Customer Success', icon: '👥' },
  { id: 'Human Resources (HR)', label: '🏢 Human Resources (HR)', icon: '🌸' },
  { id: 'Finance', label: '💵 Finance', icon: '🏦' },
  { id: 'Legal', label: '⚖️ Legal & Compliance', icon: '📜' },
  { id: 'Cyber Security', label: '🔐 Cyber Security', icon: '🛡️' },
  { id: 'Cloud Infrastructure', label: '☁️ Cloud & SRE', icon: '🌐' },
  { id: 'Operations', label: '📋 Operations & Program', icon: '📦' },
]

export default function OrgHierarchy() {
  const { registeredUsers } = useAuthStore()
  const { projects } = useTeamTaskStore()

  const [selectedUsername, setSelectedUsername] = useState<string>('admin_ceo')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  const [showProfileModal, setShowProfileModal] = useState<string | null>(null)
  const [showCatalogDrawer, setShowCatalogDrawer] = useState<boolean>(false)

  // Flatten tree for node lookup
  const flattenTree = (node: OrgNode): OrgNode[] => {
    let result = [node]
    if (node.children) {
      node.children.forEach((c) => {
        result = result.concat(flattenTree(c))
      })
    }
    return result
  }

  const allNodes = flattenTree(fullOrgTree).map((n) => {
    const reg = registeredUsers.find((r) => r.profile.username.toLowerCase() === n.username.toLowerCase())
    return {
      ...n,
      avatar: reg?.profile.avatar || n.avatar,
      role: reg?.profile.role || n.role,
      email: reg?.profile.email || n.email
    }
  })

  const selectedNode = allNodes.find((n) => n.username.toLowerCase() === selectedUsername.toLowerCase()) || allNodes[0]
  const supervisorNode = allNodes.find((n) => n.username.toLowerCase() === selectedNode.reportsTo?.toLowerCase())
  const directReports = allNodes.filter((n) => n.reportsTo?.toLowerCase() === selectedNode.username.toLowerCase())
  const sharedProjects = projects.filter((p) => p.teamName.toLowerCase().includes('frontend') || p.teamName.toLowerCase().includes('engineering'))

  // Filter node matching
  const isNodeVisible = (node: OrgNode) => {
    if (selectedCategoryFilter === 'all') return true
    if (node.category === selectedCategoryFilter) return true
    if (node.children && node.children.some(isNodeVisible)) return true
    return false
  }

  // Recursive Tree Node Renderer
  const RenderTreeNode = ({ node }: { node: OrgNode }) => {
    if (!isNodeVisible(node)) return null
    const isSelected = selectedUsername.toLowerCase() === node.username.toLowerCase()
    const visibleChildren = node.children ? node.children.filter(isNodeVisible) : []
    const hasChildren = visibleChildren.length > 0

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* Node Card */}
        <div
          className={`nm-card animate-pop-in ${isSelected ? 'nm-card-inset' : ''}`}
          style={{
            padding: '14px 18px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            background: isSelected ? 'rgba(51,102,89,0.12)' : 'var(--bg-primary)',
            border: isSelected ? '2px solid var(--accent)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isSelected ? '0 0 20px rgba(51,102,89,0.3)' : 'var(--nm-flat-xs)',
            transition: 'all 0.2s',
            zIndex: 3,
            minWidth: '220px'
          }}
          onClick={() => setSelectedUsername(node.username)}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: 'var(--nm-flat-xs)', flexShrink: 0 }}>
            {node.avatar}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              @{node.username}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {node.role}
            </div>
          </div>

          <button
            type="button"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', opacity: 0.7 }}
            onClick={(e) => {
              e.stopPropagation()
              setShowProfileModal(node.username)
            }}
            title="View Employee Profile Dashboard"
          >
            🔍
          </button>
        </div>

        {/* Connector Line to Children */}
        {hasChildren && (
          <div style={{ width: '2px', height: '24px', background: 'var(--accent)', opacity: 0.5 }} />
        )}

        {/* Horizontal Connector Line */}
        {hasChildren && visibleChildren.length > 1 && (
          <div style={{ width: '88%', height: '2px', background: 'var(--accent)', opacity: 0.5 }} />
        )}

        {/* Children Row */}
        {hasChildren && (
          <div style={{ display: 'flex', gap: '20px', marginTop: '4px', alignItems: 'flex-start' }}>
            {visibleChildren.map((child) => (
              <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '2px', height: '16px', background: 'var(--accent)', opacity: 0.5 }} />
                <RenderTreeNode node={child} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1800, display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            All Company Categories & Job Roles Hierarchy Tree
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
            Complete corporate tree covering all 17 company categories and 100+ job roles across Engineering, AI, Privacy, Design, Product, Marketing, Sales, HR, and Finance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="nm-btn"
            style={{ padding: '10px 18px', fontSize: '12px', fontWeight: 800 }}
            onClick={() => setShowCatalogDrawer(true)}
          >
            📋 Browse All Job Roles (100+)
          </button>
          <div className="nm-card-inset" style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(51,102,89,0.1)', color: 'var(--accent)', fontWeight: 800, fontSize: '12px' }}>
            🌳 {allNodes.length} Linked Company Roles
          </div>
        </div>
      </div>

      {/* DEPARTMENT CATEGORY FILTER BAR */}
      <div className="nm-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🏷️ Filter Hierarchy Tree by Company Category
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {allCompanyCategories.map((cat) => {
            const isActive = selectedCategoryFilter === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: isActive ? 'var(--accent)' : 'rgba(243,239,232,0.5)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  boxShadow: isActive ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)'
                }}
                onClick={() => setSelectedCategoryFilter(cat.id)}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* CONNECTION INTELLIGENCE PANEL */}
      <div className="nm-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '18px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{selectedNode.avatar}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>@{selectedNode.username}</h3>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  {selectedNode.category}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>{selectedNode.role} • {selectedNode.email}</div>
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

        {/* Reporting Linkages Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {/* Supervisor Manager */}
          <div className="nm-card-inset" style={{ padding: '14px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>⬆️ Reports To (Direct Supervisor)</span>
            {supervisorNode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setSelectedUsername(supervisorNode.username)}>
                <span style={{ fontSize: '18px' }}>{supervisorNode.avatar}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>@{supervisorNode.username}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{supervisorNode.role}</div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>👑 Founder / CEO Executive Board</div>
            )}
          </div>

          {/* Direct Reports */}
          <div className="nm-card-inset" style={{ padding: '14px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>👥 Direct Reports ({directReports.length})</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {directReports.length > 0 ? (
                directReports.map((report) => (
                  <span
                    key={report.id}
                    style={{ fontSize: '11px', fontWeight: 700, background: 'var(--bg-primary)', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', boxShadow: 'var(--nm-flat-xs)' }}
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

          {/* Shared Projects */}
          <div className="nm-card-inset" style={{ padding: '14px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🔗 Shared Workspace Projects</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {sharedProjects.map((p) => (
                <span key={p.id} style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: '#2563eb', padding: '2px 6px', borderRadius: '4px' }}>
                  📁 {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TREE CANVAS BOARD */}
      <div className="nm-card" style={{ padding: '40px 24px', borderRadius: '24px', overflowX: 'auto', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'center' }}>
        <RenderTreeNode node={fullOrgTree} />
      </div>

      {/* ALL JOB ROLES BROWSER DRAWER */}
      {showCatalogDrawer && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '720px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Company Job Roles Catalog (100+ Roles)</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setShowCatalogDrawer(false)}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Below are all registered corporate job roles across all 17 categories in the company:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {allCompanyCategories.filter((c) => c.id !== 'all').map((cat) => {
                const categoryNodes = allNodes.filter((n) => n.category === cat.id)
                return (
                  <div key={cat.id} className="nm-card-inset" style={{ padding: '16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)' }}>{cat.label}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{categoryNodes.length} Linked Employees</span>
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
                          {n.avatar} {n.role} (@{n.username})
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

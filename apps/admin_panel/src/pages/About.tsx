import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import UserProfileModal from '../components/UserProfileModal'

interface ExecutiveInfo {
  username: string
  name: string
  title: string
  category: string
  avatar: string
  photoUrl?: string
  email: string
  location: string
  quote: string
  bio: string
  highlights: string[]
}

const executives: ExecutiveInfo[] = [
  {
    username: 'admin_ceo',
    name: 'Aditya Kumar',
    title: 'Founder / CEO',
    category: 'Executive Team',
    avatar: '🎒',
    photoUrl: '/avatars/founder_ceo.png',
    email: 'admin@jibble.com',
    location: 'San Francisco, CA & Mumbai, India',
    quote: 'Architecting scalable communities and empowering workforce collaboration worldwide.',
    bio: 'Aditya founded Jibble on October 14, 2023, with a vision to build a unified community creation and workforce management platform. He oversees global platform architecture, product innovation, and executive strategy.',
    highlights: ['Platform Vision & Product Strategy', 'Full Stack Architecture', 'Global Expansion']
  },
  {
    username: 'co_founder_rohan',
    name: 'Rohan Verma',
    title: 'Co-Founder',
    category: 'Executive Team',
    avatar: '🌟',
    photoUrl: '/avatars/co_founder.png',
    email: 'rohan.co@jibble.com',
    location: 'New Delhi, India',
    quote: 'Building meaningful bridges between digital communities and enterprise teams.',
    bio: 'Rohan co-founded Jibble, leading global community expansion, institutional partnerships, creator ecosystem growth, and international strategic operations.',
    highlights: ['Strategic Partnerships', 'Community Expansion', 'Business Development']
  },
  {
    username: 'cto_vikram',
    name: 'Vikram Malhotra',
    title: 'CTO (Chief Technology Officer)',
    category: 'Executive Team',
    avatar: '🧠',
    photoUrl: '/avatars/cto.png',
    email: 'cto@jibble.com',
    location: 'Bengaluru, India',
    quote: 'Pioneering resilient distributed architecture and cutting-edge AI engine systems.',
    bio: 'Vikram directs Jibble’s cloud infrastructure, security architecture, AI models, and software engineering teams across all 6 engineering sub-disciplines.',
    highlights: ['Cloud & AI Infrastructure', 'Cyber Security Systems', '139-Role Engineering Hierarchy']
  },
  {
    username: 'cfo_rajesh',
    name: 'Rajesh Singhania',
    title: 'CFO (Chief Financial Officer)',
    category: 'Executive Team',
    avatar: '💵',
    photoUrl: '/avatars/exec_grid.png',
    email: 'cfo@jibble.com',
    location: 'Mumbai, India',
    quote: 'Ensuring financial integrity, fiscal sustainability, and global investor growth.',
    bio: 'Rajesh manages global corporate treasury, capital allocation, financial risk assessment, and financial compliance for Jibble’s international operations.',
    highlights: ['Capital Allocation', 'Financial Compliance', 'Corporate Treasury']
  },
  {
    username: 'coo_anjali',
    name: 'Anjali Sharma',
    title: 'COO (Chief Operating Officer)',
    category: 'Executive Team',
    avatar: '💼',
    photoUrl: '/avatars/exec_grid.png',
    email: 'coo@jibble.com',
    location: 'Mumbai, India',
    quote: 'Operational excellence through seamless HR, Legal, and Privacy governance.',
    bio: 'Anjali leads daily operations across HR, Legal & Compliance, Privacy & Policy Management, and Customer Success to ensure flawless platform execution.',
    highlights: ['Global Operations', 'Privacy & DPO Management', 'Legal & HR Oversight']
  },
  {
    username: 'sanya_cpo',
    name: 'Sanya Kapoor',
    title: 'CPO (Chief Product Officer)',
    category: 'Executive Team',
    avatar: '📱',
    photoUrl: '/avatars/exec_grid.png',
    email: 'cpo@jibble.com',
    location: 'New Delhi, India',
    quote: 'Designing intuitive, human-centered experiences that delight every user.',
    bio: 'Sanya leads Product Design, UI/UX design systems, analytics integration, and user experience strategy across all Jibble applications.',
    highlights: ['Neumorphic UX System', 'Product Roadmap', 'Data & Analytics Insights']
  },
  {
    username: 'cmo_kabir',
    name: 'Kabir Mehta',
    title: 'CMO (Chief Marketing Officer)',
    category: 'Executive Team',
    avatar: '📢',
    photoUrl: '/avatars/exec_grid.png',
    email: 'cmo@jibble.com',
    location: 'Mumbai, India',
    quote: 'Amplifying the Jibble story to millions of creators, groups, and enterprises.',
    bio: 'Kabir drives digital marketing, social media strategy, content publishing, developer relations, and enterprise sales acquisition.',
    highlights: ['Growth Marketing', 'Developer Relations', 'Global Brand Strategy']
  }
]

const applicationServices = [
  {
    icon: '🧙‍♂️',
    title: 'Smart Community Creation & Duplicate Prevention Wizard',
    category: 'Community Engine',
    desc: 'Users can search existing communities or create new ones. The system automatically performs fuzzy search checks to prevent duplicate communities, ensuring clean organization governance.'
  },
  {
    icon: '🌳',
    title: '139-Role Enterprise Org Hierarchy Canvas',
    category: 'Workforce Governance',
    desc: 'Interactive 2D visual org chart spanning 19 department divisions and 139 specialized job roles with live reporting links, supervisor inspection, and search filtering.'
  },
  {
    icon: '📋',
    title: 'Real-Time Task Orchestration & Team Rostering',
    category: 'Project Management',
    desc: 'Assign workspace tasks across teams, track project progress, monitor on-time completion rates, and manage team member assignments dynamically.'
  },
  {
    icon: '🛡️',
    title: 'Privacy Policy & DPO Compliance Governance',
    category: 'Security & Legal',
    desc: 'Dedicated Data Protection Officer (DPO) suite, privacy audit trails, SOC security monitoring, and legal compliance workflows for global regulatory standards.'
  },
  {
    icon: '📊',
    title: 'AI-Powered Employee Performance Analytics',
    category: 'Analytics & HR',
    desc: 'Automated performance scoring algorithms, on-time delivery badges, workload breakdown, and user profile analytics for every team contributor.'
  },
  {
    icon: '🚨',
    title: 'Content & Policy Moderation System',
    category: 'Community Safety',
    desc: 'Review flagged posts, enforce community guidelines, resolve moderation reports, and protect users with robust content filter controls.'
  },
  {
    icon: '🔐',
    title: 'Role-Based Access Control (RBAC) & Multi-Factor Auth',
    category: 'Security Infrastructure',
    desc: 'Two-step email and mobile OTP verification, credential management, custom profile customization, and granular lead/admin permissions.'
  },
  {
    icon: '💬',
    title: 'Social Feed & Community Discussion Engine',
    category: 'Engagement',
    desc: 'Interactive post feed supporting announcements, community updates, category tags, author verification, and engagement reactions.'
  }
]

const companyMilestones = [
  {
    date: 'October 14, 2023',
    title: 'Inception & Official Founding Date',
    icon: '🚀',
    desc: 'Jibble was officially founded on October 14, 2023 by Aditya Kumar and Rohan Verma to revolutionize community creation, workforce task management, and governance.'
  },
  {
    date: 'January 2024',
    title: 'Smart Community Creation Wizard',
    icon: '🧙‍♂️',
    desc: 'Introduced duplicate-prevention algorithms and intuitive onboarding flows for creator groups, clubs, and organizations.'
  },
  {
    date: 'June 2024',
    title: '139-Role Org Hierarchy Engine',
    icon: '🌳',
    desc: 'Launched the interactive 2D organizational canvas covering 19 department divisions and 139 specialized job roles.'
  },
  {
    date: 'November 2024',
    title: 'AI Performance & Task Analytics',
    icon: '📊',
    desc: 'Engineered real-time employee analytics, automated time tracking, and performance badge rating algorithms.'
  },
  {
    date: '2025 - Present',
    title: 'Enterprise Privacy & DPO Compliance Suite',
    icon: '🛡️',
    desc: 'Expanded with full Data Protection Officer audit dashboards, SOC security monitoring, and global policy moderation.'
  }
]

type TabKey = 'all' | 'story' | 'vision' | 'services' | 'leadership' | 'timeline' | 'tech'

export default function About() {
  const { registeredUsers } = useAuthStore()
  const [selectedLeaderModal, setSelectedLeaderModal] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* HERO BANNER SECTION */}
      <div className="spatial-panel animate-pop-in" style={{ padding: '48px 44px', borderRadius: '28px', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', zIndex: 2, position: 'relative' }}>
          <div style={{ maxWidth: '900px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '12px', background: 'rgba(51,102,89,0.14)', color: 'var(--accent)', fontWeight: 800, fontSize: '12px', marginBottom: '18px' }}>
              🌟 OFFICIAL CORPORATE & APPLICATION DIRECTORY
            </div>
            
            <h1 style={{ fontSize: '44px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.035em', lineHeight: 1.15, marginBottom: '18px' }}>
              About <span style={{ color: 'var(--accent)' }}>Jibble</span> Corporate Platform
            </h1>
            
            <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.65, fontWeight: 500, marginBottom: '20px' }}>
              Jibble is a general-purpose community & workforce management application designed for creators, interest groups, clubs, corporate teams, and enterprises worldwide. Founded on <strong>October 14, 2023</strong>, Jibble seamlessly unifies community onboarding, 139-role matrix hierarchy analytics, task orchestration, and Data Protection Officer (DPO) privacy governance.
            </p>

            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500, marginBottom: '28px' }}>
              Unlike fragmented tools restricted to college campuses or narrow chat groups, Jibble provides an all-in-one ecosystem where any group can instantiate a verified space, prevent duplicate communities during signup, delegate work across a transparent 19-department hierarchy, and ensure 100% GDPR and DPO privacy compliance.
            </p>

            {/* Comprehensive Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="nm-card-inset" style={{ padding: '14px 18px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>📅 Official Founding Date</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent)' }}>October 14, 2023</span>
              </div>

              <div className="nm-card-inset" style={{ padding: '14px 18px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🌐 Active Platform Accounts</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{registeredUsers.length}+ Users (500k Global)</span>
              </div>

              <div className="nm-card-inset" style={{ padding: '14px 18px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>🏢 Corporate Divisions</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#2563eb' }}>19 Department Categories</span>
              </div>

              <div className="nm-card-inset" style={{ padding: '14px 18px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>💼 Staffed Job Roles</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--warning)' }}>139 Roles (100% Staffed)</span>
              </div>
            </div>
          </div>

          {/* Founding Badge Card */}
          <div className="nm-card" style={{ padding: '32px 24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', minWidth: '260px', background: 'var(--bg-primary)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#fff', boxShadow: 'var(--nm-flat-sm)' }}>
              🏛️
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>Jibble HQ</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>San Francisco & Mumbai</div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Version 3.6.0 Enterprise</div>
            </div>
          </div>
        </div>
      </div>

      {/* REVEALING NAVIGATION TABS */}
      <div className="nm-card" style={{ padding: '8px', borderRadius: '18px', display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'var(--bg-primary)' }}>
        {[
          { id: 'all', label: '🌐 All Sections' },
          { id: 'story', label: '📖 Genesis Story' },
          { id: 'vision', label: '🎯 Vision & Mission' },
          { id: 'services', label: '🛠️ Application Services (8)' },
          { id: 'leadership', label: '👑 Founders & Leadership (7)' },
          { id: 'timeline', label: '📅 Founding Timeline' },
          { id: 'tech', label: '💻 Tech Stack' },
        ].map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                boxShadow: isActive ? 'var(--nm-inset-sm)' : 'none',
                transition: 'all 0.25s'
              }}
              onClick={() => setActiveTab(tab.id as TabKey)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* SECTION 1: GENESIS STORY */}
      {(activeTab === 'all' || activeTab === 'story') && (
        <div className="spatial-panel animate-pop-in" style={{ padding: '36px', borderRadius: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📖 THE ORIGIN STORY
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              The Inception & Growth of Jibble
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            <div className="nm-card-inset" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--accent)' }}>💡 The Problem We Solved</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, fontWeight: 500 }}>
                Before Jibble was founded on October 14, 2023, traditional community tools were fragmented. Social media applications forced communities into isolated silos or restricted access to specific colleges, while corporate workforce tools were rigid, opaque, and lacked community onboarding flexibility.
              </p>
            </div>

            <div className="nm-card-inset" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#2563eb' }}>⚡ The Jibble Solution</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, fontWeight: 500 }}>
                Jibble was created as a general-purpose community application for everyone—creators, interest groups, student clubs, non-profits, and enterprises alike. When signing up, users search for their desired community. If not found, our creation wizard prevents duplicate entries and instantiates a verified space with a transparent 139-role matrix hierarchy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VISION & MISSION */}
      {(activeTab === 'all' || activeTab === 'vision') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          {/* Mission Card */}
          <div className="spatial-panel animate-pop-in" style={{ padding: '32px', borderRadius: '24px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(51,102,89,0.14)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: 'var(--nm-flat-xs)' }}>
                🎯
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>Our Mission</h2>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>Purpose Driven Innovation</div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, fontWeight: 500 }}>
              To empower creators, interest groups, non-profits, and enterprise workforces by providing an intuitive, all-in-one platform for community creation, task orchestration, and workforce governance. Jibble eliminates duplicate community fragmentation, enforces transparent 139-role leadership, and safeguards user data with built-in DPO privacy compliance.
            </p>

            <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Key Mission Outcomes:</span>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>✅ Zero duplicate communities via smart onboarding wizard</div>
                <div>✅ 100% role allocation across all 19 company divisions</div>
                <div>✅ End-to-end privacy policy & DPO audit governance</div>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="spatial-panel animate-pop-in" style={{ padding: '32px', borderRadius: '24px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(37,99,235,0.12)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: 'var(--nm-flat-xs)' }}>
                👁️
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>Our Vision</h2>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>Looking Ahead to 2030</div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, fontWeight: 500 }}>
              To become the world's standard digital operating system for community & organization infrastructure—where any group can launch, organize, govern, and scale seamlessly with zero technical friction, complete organizational clarity, and uncompromised privacy.
            </p>

            <div className="nm-card-inset" style={{ padding: '16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Future Growth Horizon:</span>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>🚀 Scaling to 10M+ active creators & enterprise teams</div>
                <div>🧠 Next-gen AI automated task load balancing</div>
                <div>🌍 Multi-region decentralized governance architecture</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: APPLICATION SERVICES WE PROVIDE */}
      {(activeTab === 'all' || activeTab === 'services') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
              🛠️ Core Application Services We Provide
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Comprehensive suite of services integrated directly into the Jibble Admin Console & Community Platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {applicationServices.map((service, index) => (
              <div
                key={index}
                className="nm-card animate-pop-in"
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: 'var(--bg-primary)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(51,102,89,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: 'var(--nm-flat-xs)' }}>
                    {service.icon}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(59,130,246,0.1)', color: '#2563eb', padding: '3px 8px', borderRadius: '6px' }}>
                    {service.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {service.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, fontWeight: 500 }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: FOUNDERS & EXECUTIVE LEADERSHIP BOARD */}
      {(activeTab === 'all' || activeTab === 'leadership') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
                👑 Founders & Executive Board Leadership
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Meet the visionaries, founders, and executive officers guiding Jibble’s global strategy, technology, and operations.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>
              Click any executive card to inspect full profile dashboard →
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {executives.map((exec) => (
              <div
                key={exec.username}
                className="spatial-panel animate-pop-in"
                style={{
                  padding: '26px',
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  cursor: 'pointer',
                  background: 'var(--bg-primary)'
                }}
                onClick={() => setSelectedLeaderModal(exec.username)}
              >
                {/* Header with Photo Portrait */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: 'var(--nm-flat-xs)',
                      background: 'var(--bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      flexShrink: 0,
                      border: '2px solid rgba(255,255,255,0.8)'
                    }}
                  >
                    {exec.photoUrl ? (
                      <img
                        src={exec.photoUrl}
                        alt={exec.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      exec.avatar
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {exec.name}
                      </h3>
                      <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(51,102,89,0.14)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '6px' }}>
                        @{exec.username}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)', marginTop: '2px' }}>
                      {exec.title}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                      📍 {exec.location}
                    </div>
                  </div>
                </div>

                {/* Executive Quote */}
                <div className="nm-card-inset" style={{ padding: '14px 16px', borderRadius: '14px', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  "{exec.quote}"
                </div>

                {/* Biography */}
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.55, fontWeight: 500 }}>
                  {exec.bio}
                </p>

                {/* Key Focus Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Key Strategic Responsibilities:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {exec.highlights.map((h, idx) => (
                      <span key={idx} style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(0,0,0,0.04)', color: 'var(--text-primary)', padding: '4px 10px', borderRadius: '8px' }}>
                        ⚡ {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>{exec.email}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>Open Profile Dashboard →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: FOUNDING TIMELINE */}
      {(activeTab === 'all' || activeTab === 'timeline') && (
        <div className="nm-card animate-pop-in" style={{ padding: '36px', borderRadius: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
              📅 Company Founding & Milestone Roadmap
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Key corporate milestones from initial founding on October 14, 2023 to present day enterprise platform.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px', borderLeft: '4px solid var(--accent)' }}>
            {companyMilestones.map((ms, index) => (
              <div key={index} className="spatial-panel" style={{ padding: '22px 26px', borderRadius: '18px', background: 'var(--bg-primary)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-36px', top: '26px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent)', border: '4px solid var(--bg-primary)', boxShadow: 'var(--nm-flat-xs)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{ms.icon}</span>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>{ms.title}</h3>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', background: 'rgba(51,102,89,0.14)', padding: '5px 12px', borderRadius: '10px' }}>
                    {ms.date}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
                  {ms.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: TECH STACK & ARCHITECTURE */}
      {(activeTab === 'all' || activeTab === 'tech') && (
        <div className="spatial-panel animate-pop-in" style={{ padding: '36px', borderRadius: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
              💻 Technology Stack & Security Architecture
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Modern technologies powering Jibble’s high performance, spatial user experience, and privacy governance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="nm-card-inset" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>⚡ Frontend & Logic Engine</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Built with React 18, Vite, TypeScript, Zustand reactive state management, and modern CSS custom tokens.
              </p>
            </div>

            <div className="nm-card-inset" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb' }}>🎨 Design System & Spatial UI</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Hybrid Neumorphic & Spatial UI with glassmorphism backdrop blurs, HSL color tokens, and micro-animations.
              </p>
            </div>

            <div className="nm-card-inset" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--warning)' }}>🔐 Security & Privacy Architecture</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Integrated OTP authentication, DPO audit logging, SOC security monitoring, and RBAC permission checks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CORPORATE NOTICE */}
      <div className="nm-card-inset" style={{ padding: '28px', borderRadius: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Jibble Community & Corporate Management Platform
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.5 }}>
          Founded October 14, 2023. Operating under global privacy guidelines, Data Protection Officer compliance standards, and open community creation governance.
        </p>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginTop: '4px' }}>
          © 2023 - 2026 Jibble Inc. All rights reserved. San Francisco • Mumbai • New Delhi • Bengaluru
        </div>
      </div>

      {/* Leader Profile Modal Trigger */}
      {selectedLeaderModal && (
        <UserProfileModal
          initialUsername={selectedLeaderModal}
          onClose={() => setSelectedLeaderModal(null)}
        />
      )}
    </div>
  )
}

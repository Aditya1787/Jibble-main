export interface OrgNode {
  id: string
  name: string
  username: string
  role: string
  category: string
  subcategory?: string
  email: string
  avatar: string
  reportsTo?: string
  children?: OrgNode[]
}

export interface JobCategoryDef {
  category: string
  icon: string
  roles?: string[]
  subcategories?: Record<string, string[]>
}

export const jobRoleData: JobCategoryDef[] = [
  {
    category: 'Privacy & Policy Management',
    icon: '🛡️',
    roles: [
      'Privacy Intern',
      'Data Protection Officer (DPO)',
      'Compliance Officer',
      'Content & Policy Moderator',
      'Privacy Policy Auditor',
      'Legal & Compliance Lead'
    ]
  },
  {
    category: 'Executive Team',
    icon: '👨‍💼',
    roles: [
      'Founder / CEO',
      'Co-Founder',
      'CTO (Chief Technology Officer)',
      'COO (Chief Operating Officer)',
      'CFO (Chief Financial Officer)',
      'CPO (Chief Product Officer)',
      'CMO (Chief Marketing Officer)',
      'Executive Intern'
    ]
  },
  {
    category: 'Software Engineering',
    icon: '💻',
    subcategories: {
      'Backend': [
        'Backend Intern',
        'Junior Backend Developer',
        'Backend Developer',
        'Senior Backend Engineer',
        'Lead Backend Engineer',
        'Backend Architect'
      ],
      'Frontend': [
        'Frontend Intern',
        'Junior Frontend Developer',
        'Frontend Developer',
        'Senior Frontend Developer',
        'Frontend Lead'
      ],
      'Mobile (Flutter)': [
        'Flutter Intern',
        'Junior Flutter Developer',
        'Flutter Developer',
        'Senior Flutter Developer',
        'Mobile Tech Lead'
      ],
      'Full Stack': [
        'Full Stack Intern',
        'Junior Full Stack Developer',
        'Full Stack Developer',
        'Senior Full Stack Engineer',
        'Principal Engineer'
      ],
      'DevOps': [
        'DevOps Intern',
        'Junior DevOps Engineer',
        'DevOps Engineer',
        'Senior DevOps Engineer',
        'Cloud Architect'
      ],
      'Quality Assurance (QA)': [
        'QA Intern',
        'QA Tester',
        'Automation Test Engineer',
        'Senior QA Engineer',
        'QA Lead'
      ]
    }
  },
  {
    category: 'AI / Machine Learning',
    icon: '🤖',
    roles: [
      'AI Intern',
      'Machine Learning Engineer',
      'AI Engineer',
      'LLM Engineer',
      'Computer Vision Engineer',
      'NLP Engineer',
      'Senior AI Engineer',
      'AI Research Scientist'
    ]
  },
  {
    category: 'Data',
    icon: '📊',
    roles: [
      'Data Analyst',
      'Business Analyst',
      'Data Engineer',
      'Senior Data Engineer',
      'Data Scientist',
      'Analytics Manager'
    ]
  },
  {
    category: 'Design',
    icon: '🎨',
    roles: [
      'UI Designer',
      'UX Designer',
      'Product Designer',
      'Graphic Designer',
      'Motion Designer',
      'Senior Product Designer',
      'Design Lead'
    ]
  },
  {
    category: 'Product',
    icon: '📱',
    roles: [
      'Associate Product Manager (APM)',
      'Product Manager',
      'Senior Product Manager',
      'Group Product Manager',
      'Head of Product'
    ]
  },
  {
    category: 'Marketing',
    icon: '📢',
    subcategories: {
      'Digital Marketing': [
        'Marketing Intern',
        'Digital Marketing Executive',
        'SEO Specialist',
        'SEM Specialist',
        'Growth Marketer',
        'Marketing Manager'
      ],
      'Social Media': [
        'Social Media Intern',
        'Social Media Executive',
        'Social Media Manager',
        'Community Manager',
        'Influencer Marketing Manager'
      ],
      'Content': [
        'Content Writer',
        'Technical Writer',
        'Copywriter',
        'Content Strategist'
      ]
    }
  },
  {
    category: 'Sales',
    icon: '💰',
    roles: [
      'Sales Intern',
      'Sales Executive',
      'Business Development Executive (BDE)',
      'Business Development Manager (BDM)',
      'Account Executive',
      'Enterprise Sales Manager',
      'Sales Director'
    ]
  },
  {
    category: 'Customer Success',
    icon: '🤝',
    roles: [
      'Customer Support Executive',
      'Technical Support Engineer',
      'Customer Success Associate',
      'Customer Success Manager',
      'Key Account Manager'
    ]
  },
  {
    category: 'Human Resources (HR)',
    icon: '🏢',
    roles: [
      'HR Intern',
      'Talent Acquisition Executive',
      'HR Executive',
      'Recruiter',
      'HR Business Partner',
      'HR Manager'
    ]
  },
  {
    category: 'Finance',
    icon: '💵',
    roles: [
      'Accountant',
      'Finance Executive',
      'Payroll Executive',
      'Financial Analyst',
      'Finance Manager'
    ]
  },
  {
    category: 'Legal',
    icon: '⚖️',
    roles: [
      'Legal Executive',
      'Compliance Officer',
      'Corporate Lawyer',
      'Legal Manager'
    ]
  },
  {
    category: 'Cyber Security',
    icon: '🔐',
    roles: [
      'Security Analyst',
      'SOC Analyst',
      'Ethical Hacker',
      'Penetration Tester',
      'Security Engineer',
      'Security Architect'
    ]
  },
  {
    category: 'Cloud Infrastructure',
    icon: '☁️',
    roles: [
      'Cloud Engineer',
      'AWS Engineer',
      'Site Reliability Engineer (SRE)',
      'Infrastructure Engineer',
      'Platform Engineer'
    ]
  },
  {
    category: 'Operations',
    icon: '📋',
    roles: [
      'Operations Executive',
      'Operations Manager',
      'Project Coordinator',
      'Project Manager',
      'Program Manager'
    ]
  },
  {
    category: 'Documentation',
    icon: '📝',
    roles: [
      'Technical Writer',
      'API Documentation Engineer',
      'Knowledge Base Manager'
    ]
  },
  {
    category: 'Developer Relations',
    icon: '🌍',
    roles: [
      'Developer Advocate',
      'Community Manager',
      'Technical Evangelist'
    ]
  },
  {
    category: 'Growth',
    icon: '📈',
    roles: [
      'Growth Associate',
      'Growth Analyst',
      'Growth Engineer',
      'Growth Product Manager'
    ]
  }
]

export const allCompanyCategories = [
  { id: 'all', label: '🌐 All Company Categories (19 Depts)', icon: '🏢' },
  { id: 'Executive Team', label: '👨‍💼 Executive Team', icon: '👑' },
  { id: 'Software Engineering', label: '💻 Software Engineering', icon: '⚡' },
  { id: 'Privacy & Policy Management', label: '🛡️ Privacy & Policy', icon: '📜' },
  { id: 'AI / Machine Learning', label: '🤖 AI / Machine Learning', icon: '🧠' },
  { id: 'Data', label: '📊 Data', icon: '📈' },
  { id: 'Design', label: '🎨 Design', icon: '✏️' },
  { id: 'Product', label: '📱 Product', icon: '📋' },
  { id: 'Marketing', label: '📢 Marketing', icon: '🚀' },
  { id: 'Sales', label: '💰 Sales', icon: '💵' },
  { id: 'Customer Success', label: '🤝 Customer Success', icon: '👥' },
  { id: 'Human Resources (HR)', label: '🏢 Human Resources (HR)', icon: '🌸' },
  { id: 'Finance', label: '💵 Finance', icon: '🏦' },
  { id: 'Legal', label: '⚖️ Legal', icon: '📜' },
  { id: 'Cyber Security', label: '🔐 Cyber Security', icon: '🛡️' },
  { id: 'Cloud Infrastructure', label: '☁️ Cloud Infrastructure', icon: '🌐' },
  { id: 'Operations', label: '📋 Operations', icon: '📦' },
  { id: 'Documentation', label: '📝 Documentation', icon: '📑' },
  { id: 'Developer Relations', label: '🌍 Developer Relations', icon: '🌐' },
  { id: 'Growth', label: '📈 Growth', icon: '🚀' }
]

// Dynamic hierarchy structure (starts clean and empty until real users register)
export const fullOrgTree: OrgNode = {
  id: 'org-root',
  name: 'Jibble Organization',
  username: 'jibble_org',
  role: 'Organization',
  category: 'Company',
  email: 'org@jibble.com',
  avatar: '🏢',
  children: []
}

// Helper to flatten the org tree into an array of all employees
export const flattenOrgTree = (node: OrgNode): OrgNode[] => {
  if (!node || !node.username) return []
  let result: OrgNode[] = [node]
  if (node.children) {
    node.children.forEach((child) => {
      result = result.concat(flattenOrgTree(child))
    })
  }
  return result
}

export const allOrgEmployees: OrgNode[] = []

export const getRoleRankScore = (role: string = '', category: string = ''): number => {
  const r = role.toLowerCase()
  const c = category.toLowerCase()

  if (r.includes('founder') || r.includes('ceo')) return 1
  if (r.includes('co-founder') || r.includes('cto') || r.includes('cfo') || r.includes('coo') || r.includes('cpo') || r.includes('cmo')) return 2
  if (r.includes('vp') || r.includes('director') || r.includes('head') || r.includes('dpo')) return 3
  if (r.includes('manager') || r.includes('lead') || r.includes('architect')) return 4
  if (r.includes('senior') || r.includes('principal')) return 5
  if (c.includes('executive')) return 2
  return 6
}

/**
 * Builds a dynamic hierarchy tree from registered active nodes sorted by corporate rank
 */
export const buildOrgTreeFromNodes = (nodes: OrgNode[]): OrgNode | null => {
  if (!nodes || nodes.length === 0) return null

  const map = new Map<string, OrgNode>()
  const rootCandidates: OrgNode[] = []

  nodes.forEach((n) => {
    map.set(n.username.toLowerCase(), { ...n, children: [] })
  })

  nodes.forEach((n) => {
    const currentNode = map.get(n.username.toLowerCase())!
    if (n.reportsTo && map.has(n.reportsTo.toLowerCase())) {
      const parent = map.get(n.reportsTo.toLowerCase())!
      if (!parent.children) parent.children = []
      parent.children.push(currentNode)
    } else {
      rootCandidates.push(currentNode)
    }
  })

  // Sort children by corporate rank
  map.forEach((node) => {
    if (node.children && node.children.length > 1) {
      node.children.sort(
        (a, b) => getRoleRankScore(a.role, a.category) - getRoleRankScore(b.role, b.category)
      )
    }
  })

  // Sort root candidates so Founder / CEO is at top
  rootCandidates.sort(
    (a, b) => getRoleRankScore(a.role, a.category) - getRoleRankScore(b.role, b.category)
  )

  if (rootCandidates.length === 1) {
    return rootCandidates[0]
  }

  return {
    id: 'org-root',
    name: 'Jibble Corporate Hierarchy',
    username: 'jibble_corp',
    role: 'Corporate Headquarters',
    category: 'Executive Team',
    email: 'hq@jibble.com',
    avatar: '🏢',
    children: rootCandidates,
  }
}

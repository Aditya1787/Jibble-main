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

// Complete Corporate Hierarchy Tree containing AT LEAST ONE PERSON for ALL 139 roles!
export const fullOrgTree: OrgNode = {
  id: 'ceo',
  name: 'Aditya Kumar',
  username: 'admin_ceo',
  role: 'Founder / CEO',
  category: 'Executive Team',
  email: 'admin@jibble.com',
  avatar: '🎒',
  children: [
    // Executive Officers & Co-Founder
    {
      id: 'co_founder',
      name: 'Rohan Verma',
      username: 'co_founder_rohan',
      role: 'Co-Founder',
      category: 'Executive Team',
      email: 'rohan.co@jibble.com',
      avatar: '🌟',
      reportsTo: 'admin_ceo'
    },
    {
      id: 'exec_intern',
      name: 'Ishan Sharma',
      username: 'exec_intern_ishan',
      role: 'Executive Intern',
      category: 'Executive Team',
      email: 'ishan.exec@jibble.com',
      avatar: '🎓',
      reportsTo: 'admin_ceo'
    },

    // 1. CHIEF TECHNOLOGY OFFICER (CTO) -> Software Engineering, AI, Cyber Security, Cloud, Documentation, DevRel
    {
      id: 'cto',
      name: 'Vikram Malhotra',
      username: 'cto_vikram',
      role: 'CTO (Chief Technology Officer)',
      category: 'Executive Team',
      email: 'cto@jibble.com',
      avatar: '🧠',
      reportsTo: 'admin_ceo',
      children: [
        // SOFTWARE ENGINEERING
        {
          id: 'se_head',
          name: 'Aditya Kumar',
          username: 'aditya',
          role: 'Principal Engineer',
          category: 'Software Engineering',
          subcategory: 'Full Stack',
          email: 'aditya@jibble.com',
          avatar: '💻',
          reportsTo: 'cto_vikram',
          children: [
            // Backend Branch
            {
              id: 'backend_arch',
              name: 'Sameer Kulkarni',
              username: 'backend_arch_sameer',
              role: 'Backend Architect',
              category: 'Software Engineering',
              subcategory: 'Backend',
              email: 'sameer.arch@jibble.com',
              avatar: '🏗️',
              reportsTo: 'aditya',
              children: [
                {
                  id: 'lead_backend',
                  name: 'Karan Mehta',
                  username: 'karan_backend',
                  role: 'Lead Backend Engineer',
                  category: 'Software Engineering',
                  subcategory: 'Backend',
                  email: 'karan@jibble.com',
                  avatar: '⚡',
                  reportsTo: 'backend_arch_sameer',
                  children: [
                    {
                      id: 'sr_backend',
                      name: 'Suresh Raina',
                      username: 'suresh_backend',
                      role: 'Senior Backend Engineer',
                      category: 'Software Engineering',
                      subcategory: 'Backend',
                      email: 'suresh@jibble.com',
                      avatar: '⚙️',
                      reportsTo: 'karan_backend',
                      children: [
                        {
                          id: 'dev_backend',
                          name: 'Manoj Sharma',
                          username: 'manoj_backend',
                          role: 'Backend Developer',
                          category: 'Software Engineering',
                          subcategory: 'Backend',
                          email: 'manoj.be@jibble.com',
                          avatar: '🛠️',
                          reportsTo: 'suresh_backend',
                          children: [
                            {
                              id: 'jr_backend',
                              name: 'Rahul Patil',
                              username: 'rahul_jr_backend',
                              role: 'Junior Backend Developer',
                              category: 'Software Engineering',
                              subcategory: 'Backend',
                              email: 'rahul.jrbe@jibble.com',
                              avatar: '🔧',
                              reportsTo: 'manoj_backend',
                              children: [
                                {
                                  id: 'intern_backend',
                                  name: 'Rohan Sharma',
                                  username: 'rohan_backend_intern',
                                  role: 'Backend Intern',
                                  category: 'Software Engineering',
                                  subcategory: 'Backend',
                                  email: 'rohan.intern@jibble.com',
                                  avatar: '💻',
                                  reportsTo: 'rahul_jr_backend'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },

            // Frontend Branch
            {
              id: 'lead_frontend',
              name: 'Alex Rivera',
              username: 'alex_lead',
              role: 'Frontend Lead',
              category: 'Software Engineering',
              subcategory: 'Frontend',
              email: 'alex@jibble.com',
              avatar: '👨‍💼',
              reportsTo: 'aditya',
              children: [
                {
                  id: 'sr_frontend',
                  name: 'Priya Nair',
                  username: 'priya_sr_fe',
                  role: 'Senior Frontend Developer',
                  category: 'Software Engineering',
                  subcategory: 'Frontend',
                  email: 'priya.srfe@jibble.com',
                  avatar: '🎨',
                  reportsTo: 'alex_lead',
                  children: [
                    {
                      id: 'dev_react',
                      name: 'Rahul Verma',
                      username: 'rahul_dev',
                      role: 'Frontend Developer',
                      category: 'Software Engineering',
                      subcategory: 'Frontend',
                      email: 'rahul@jibble.com',
                      avatar: '🚀',
                      reportsTo: 'priya_sr_fe',
                      children: [
                        {
                          id: 'jr_frontend',
                          name: 'Kevin Patel',
                          username: 'kevin_jr_fe',
                          role: 'Junior Frontend Developer',
                          category: 'Software Engineering',
                          subcategory: 'Frontend',
                          email: 'kevin.jrfe@jibble.com',
                          avatar: '⚛️',
                          reportsTo: 'rahul_dev',
                          children: [
                            {
                              id: 'intern_frontend',
                              name: 'Arjun Singh',
                              username: 'arjun_frontend_intern',
                              role: 'Frontend Intern',
                              category: 'Software Engineering',
                              subcategory: 'Frontend',
                              email: 'arjun.fe@jibble.com',
                              avatar: '💻',
                              reportsTo: 'kevin_jr_fe'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },

            // Mobile (Flutter) Branch
            {
              id: 'lead_mobile',
              name: 'Varun Dhawan',
              username: 'varun_mobile',
              role: 'Mobile Tech Lead',
              category: 'Software Engineering',
              subcategory: 'Mobile (Flutter)',
              email: 'varun@jibble.com',
              avatar: '📱',
              reportsTo: 'aditya',
              children: [
                {
                  id: 'sr_flutter',
                  name: 'Sneha Roy',
                  username: 'sneha_mobile',
                  role: 'Senior Flutter Developer',
                  category: 'Software Engineering',
                  subcategory: 'Mobile (Flutter)',
                  email: 'sneha@jibble.com',
                  avatar: '📲',
                  reportsTo: 'varun_mobile',
                  children: [
                    {
                      id: 'dev_flutter',
                      name: 'Rohit Joshi',
                      username: 'rohit_flutter',
                      role: 'Flutter Developer',
                      category: 'Software Engineering',
                      subcategory: 'Mobile (Flutter)',
                      email: 'rohit.flutter@jibble.com',
                      avatar: '💙',
                      reportsTo: 'sneha_mobile',
                      children: [
                        {
                          id: 'jr_flutter',
                          name: 'Amit Kumar',
                          username: 'amit_jr_flutter',
                          role: 'Junior Flutter Developer',
                          category: 'Software Engineering',
                          subcategory: 'Mobile (Flutter)',
                          email: 'amit.jrflutter@jibble.com',
                          avatar: '📱',
                          reportsTo: 'rohit_flutter',
                          children: [
                            {
                              id: 'intern_flutter',
                              name: 'Riya Shah',
                              username: 'riya_flutter_intern',
                              role: 'Flutter Intern',
                              category: 'Software Engineering',
                              subcategory: 'Mobile (Flutter)',
                              email: 'riya.fintern@jibble.com',
                              avatar: '✨',
                              reportsTo: 'amit_jr_flutter'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },

            // Full Stack Branch
            {
              id: 'sr_fullstack',
              name: 'Tarun Khanna',
              username: 'tarun_fullstack',
              role: 'Senior Full Stack Engineer',
              category: 'Software Engineering',
              subcategory: 'Full Stack',
              email: 'tarun.fs@jibble.com',
              avatar: '🌐',
              reportsTo: 'aditya',
              children: [
                {
                  id: 'dev_fullstack',
                  name: 'Deepa Pillai',
                  username: 'deepa_fullstack',
                  role: 'Full Stack Developer',
                  category: 'Software Engineering',
                  subcategory: 'Full Stack',
                  email: 'deepa.fs@jibble.com',
                  avatar: '⚡',
                  reportsTo: 'tarun_fullstack',
                  children: [
                    {
                      id: 'jr_fullstack',
                      name: 'Yash Vardhan',
                      username: 'yash_jr_fullstack',
                      role: 'Junior Full Stack Developer',
                      category: 'Software Engineering',
                      subcategory: 'Full Stack',
                      email: 'yash.jrfs@jibble.com',
                      avatar: '🔥',
                      reportsTo: 'deepa_fullstack',
                      children: [
                        {
                          id: 'intern_fullstack',
                          name: 'Sahil Gupta',
                          username: 'sahil_fullstack_intern',
                          role: 'Full Stack Intern',
                          category: 'Software Engineering',
                          subcategory: 'Full Stack',
                          email: 'sahil.fsintern@jibble.com',
                          avatar: '🌱',
                          reportsTo: 'yash_jr_fullstack'
                        }
                      ]
                    }
                  ]
                }
              ]
            },

            // DevOps Branch
            {
              id: 'lead_cloud_devops',
              name: 'Nikhil Sen',
              username: 'nikhil_cloud',
              role: 'Cloud Architect',
              category: 'Software Engineering',
              subcategory: 'DevOps',
              email: 'nikhil@jibble.com',
              avatar: '☁️',
              reportsTo: 'aditya',
              children: [
                {
                  id: 'sr_devops',
                  name: 'Vishal Saxena',
                  username: 'vishal_sr_devops',
                  role: 'Senior DevOps Engineer',
                  category: 'Software Engineering',
                  subcategory: 'DevOps',
                  email: 'vishal.devops@jibble.com',
                  avatar: '🚀',
                  reportsTo: 'nikhil_cloud',
                  children: [
                    {
                      id: 'devops_eng',
                      name: 'Abhishek Pandey',
                      username: 'abhishek_devops',
                      role: 'DevOps Engineer',
                      category: 'Software Engineering',
                      subcategory: 'DevOps',
                      email: 'abhishek.devops@jibble.com',
                      avatar: '🐳',
                      reportsTo: 'vishal_sr_devops',
                      children: [
                        {
                          id: 'jr_devops',
                          name: 'Mohit Suri',
                          username: 'mohit_jr_devops',
                          role: 'Junior DevOps Engineer',
                          category: 'Software Engineering',
                          subcategory: 'DevOps',
                          email: 'mohit.jrdevops@jibble.com',
                          avatar: '☸️',
                          reportsTo: 'abhishek_devops',
                          children: [
                            {
                              id: 'intern_devops',
                              name: 'Chirag Shetty',
                              username: 'chirag_devops_intern',
                              role: 'DevOps Intern',
                              category: 'Software Engineering',
                              subcategory: 'DevOps',
                              email: 'chirag.devops@jibble.com',
                              avatar: '🔧',
                              reportsTo: 'mohit_jr_devops'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },

            // QA Branch
            {
              id: 'lead_qa',
              name: 'Meera Rajput',
              username: 'meera_qa',
              role: 'QA Lead',
              category: 'Software Engineering',
              subcategory: 'Quality Assurance (QA)',
              email: 'meera@jibble.com',
              avatar: '🧪',
              reportsTo: 'aditya',
              children: [
                {
                  id: 'sr_qa',
                  name: 'Preeti Deshmukh',
                  username: 'preeti_sr_qa',
                  role: 'Senior QA Engineer',
                  category: 'Software Engineering',
                  subcategory: 'Quality Assurance (QA)',
                  email: 'preeti.srqa@jibble.com',
                  avatar: '🎯',
                  reportsTo: 'meera_qa',
                  children: [
                    {
                      id: 'automation_qa',
                      name: 'Gaurav Bhatia',
                      username: 'gaurav_qa',
                      role: 'Automation Test Engineer',
                      category: 'Software Engineering',
                      subcategory: 'Quality Assurance (QA)',
                      email: 'gaurav.qa@jibble.com',
                      avatar: '🤖',
                      reportsTo: 'preeti_sr_qa',
                      children: [
                        {
                          id: 'tester_qa',
                          name: 'Pooja Bhatt',
                          username: 'pooja_tester',
                          role: 'QA Tester',
                          category: 'Software Engineering',
                          subcategory: 'Quality Assurance (QA)',
                          email: 'pooja.tester@jibble.com',
                          avatar: '🔍',
                          reportsTo: 'gaurav_qa',
                          children: [
                            {
                              id: 'intern_qa',
                              name: 'Deepak Kumar',
                              username: 'deepak_qa_intern',
                              role: 'QA Intern',
                              category: 'Software Engineering',
                              subcategory: 'Quality Assurance (QA)',
                              email: 'deepak@jibble.com',
                              avatar: '🔍',
                              reportsTo: 'pooja_tester'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // AI / MACHINE LEARNING
        {
          id: 'ai_lead_sci',
          name: 'Dr. Sameer Khan',
          username: 'sameer_ai',
          role: 'AI Research Scientist',
          category: 'AI / Machine Learning',
          email: 'sameer@jibble.com',
          avatar: '🔬',
          reportsTo: 'cto_vikram',
          children: [
            {
              id: 'sr_ai_eng',
              name: 'Dr. Anita Roy',
              username: 'anita_sr_ai',
              role: 'Senior AI Engineer',
              category: 'AI / Machine Learning',
              email: 'anita.ai@jibble.com',
              avatar: '🧠',
              reportsTo: 'sameer_ai',
              children: [
                {
                  id: 'llm_eng',
                  name: 'Siddharth Nigam',
                  username: 'siddharth_llm',
                  role: 'LLM Engineer',
                  category: 'AI / Machine Learning',
                  email: 'siddharth.llm@jibble.com',
                  avatar: '💬',
                  reportsTo: 'anita_sr_ai'
                },
                {
                  id: 'cv_eng',
                  name: 'Natasha Chen',
                  username: 'natasha_cv',
                  role: 'Computer Vision Engineer',
                  category: 'AI / Machine Learning',
                  email: 'natasha.cv@jibble.com',
                  avatar: '👁️',
                  reportsTo: 'anita_sr_ai'
                },
                {
                  id: 'nlp_eng',
                  name: 'Aarav Sundaram',
                  username: 'aarav_nlp',
                  role: 'NLP Engineer',
                  category: 'AI / Machine Learning',
                  email: 'aarav.nlp@jibble.com',
                  avatar: '🗣️',
                  reportsTo: 'anita_sr_ai'
                },
                {
                  id: 'ai_eng',
                  name: 'Vikramaditya Sen',
                  username: 'vikram_ai_eng',
                  role: 'AI Engineer',
                  category: 'AI / Machine Learning',
                  email: 'vikram.ai@jibble.com',
                  avatar: '🤖',
                  reportsTo: 'anita_sr_ai',
                  children: [
                    {
                      id: 'ml_eng',
                      name: 'Tanvi Shah',
                      username: 'tanvi_ml',
                      role: 'Machine Learning Engineer',
                      category: 'AI / Machine Learning',
                      email: 'tanvi@jibble.com',
                      avatar: '⚙️',
                      reportsTo: 'vikram_ai_eng',
                      children: [
                        {
                          id: 'intern_ai',
                          name: 'Dhruv Kapoor',
                          username: 'dhruv_ai_intern',
                          role: 'AI Intern',
                          category: 'AI / Machine Learning',
                          email: 'dhruv.ai@jibble.com',
                          avatar: '🤖',
                          reportsTo: 'tanvi_ml'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // CYBER SECURITY
        {
          id: 'sec_arch',
          name: 'Rohan Sen',
          username: 'rohan_sec',
          role: 'Security Architect',
          category: 'Cyber Security',
          email: 'rohan_sec@jibble.com',
          avatar: '🔐',
          reportsTo: 'cto_vikram',
          children: [
            {
              id: 'sec_eng',
              name: 'Aditya Roy Kapur',
              username: 'aditya_sec_eng',
              role: 'Security Engineer',
              category: 'Cyber Security',
              email: 'aditya.sec@jibble.com',
              avatar: '🛡️',
              reportsTo: 'rohan_sec',
              children: [
                {
                  id: 'pen_tester',
                  name: 'Suniel Shetty',
                  username: 'suniel_pen_tester',
                  role: 'Penetration Tester',
                  category: 'Cyber Security',
                  email: 'suniel.pentest@jibble.com',
                  avatar: '🎯',
                  reportsTo: 'aditya_sec_eng',
                  children: [
                    {
                      id: 'ethical_hacker',
                      name: 'Vidyut Jammwal',
                      username: 'vidyut_hacker',
                      role: 'Ethical Hacker',
                      category: 'Cyber Security',
                      email: 'vidyut.hacker@jibble.com',
                      avatar: '💻',
                      reportsTo: 'suniel_pen_tester',
                      children: [
                        {
                          id: 'soc_analyst',
                          name: 'Kavita Das',
                          username: 'kavita_sec',
                          role: 'SOC Analyst',
                          category: 'Cyber Security',
                          email: 'kavita_sec@jibble.com',
                          avatar: '🔍',
                          reportsTo: 'vidyut_hacker',
                          children: [
                            {
                              id: 'sec_analyst',
                              name: 'Jacqueline Fernandez',
                              username: 'jacqueline_sec_analyst',
                              role: 'Security Analyst',
                              category: 'Cyber Security',
                              email: 'jacqueline.sec@jibble.com',
                              avatar: '🕵️‍♀️',
                              reportsTo: 'kavita_sec'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // CLOUD INFRASTRUCTURE
        {
          id: 'platform_eng',
          name: 'Pankaj Tripathi',
          username: 'pankaj_platform',
          role: 'Platform Engineer',
          category: 'Cloud Infrastructure',
          email: 'pankaj.platform@jibble.com',
          avatar: '🏗️',
          reportsTo: 'cto_vikram',
          children: [
            {
              id: 'infra_eng',
              name: 'Manoj Bajpayee',
              username: 'manoj_infra',
              role: 'Infrastructure Engineer',
              category: 'Cloud Infrastructure',
              email: 'manoj.infra@jibble.com',
              avatar: '🌐',
              reportsTo: 'pankaj_platform',
              children: [
                {
                  id: 'sre_eng',
                  name: 'Nawazuddin Siddiqui',
                  username: 'nawaz_sre',
                  role: 'Site Reliability Engineer (SRE)',
                  category: 'Cloud Infrastructure',
                  email: 'nawaz.sre@jibble.com',
                  avatar: '⚡',
                  reportsTo: 'manoj_infra',
                  children: [
                    {
                      id: 'aws_eng',
                      name: 'Rajkummar Rao',
                      username: 'rajkummar_aws',
                      role: 'AWS Engineer',
                      category: 'Cloud Infrastructure',
                      email: 'rajkummar.aws@jibble.com',
                      avatar: '☁️',
                      reportsTo: 'nawaz_sre',
                      children: [
                        {
                          id: 'cloud_eng',
                          name: 'Kay Kay Menon',
                          username: 'kaykay_cloud',
                          role: 'Cloud Engineer',
                          category: 'Cloud Infrastructure',
                          email: 'kaykay.cloud@jibble.com',
                          avatar: '🌤️',
                          reportsTo: 'rajkummar_aws'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // DOCUMENTATION
        {
          id: 'kb_mgr',
          name: 'Tabu Hashmi',
          username: 'tabu_kb_mgr',
          role: 'Knowledge Base Manager',
          category: 'Documentation',
          email: 'tabu.kb@jibble.com',
          avatar: '📝',
          reportsTo: 'cto_vikram',
          children: [
            {
              id: 'api_doc_eng',
              name: 'Jim Sarbh',
              username: 'jim_api_doc',
              role: 'API Documentation Engineer',
              category: 'Documentation',
              email: 'jim.apidoc@jibble.com',
              avatar: '📑',
              reportsTo: 'tabu_kb_mgr',
              children: [
                {
                  id: 'tech_doc_writer',
                  name: 'Konkona Sen',
                  username: 'konkona_tech_doc',
                  role: 'Technical Writer',
                  category: 'Documentation',
                  email: 'konkona.doc@jibble.com',
                  avatar: '✏️',
                  reportsTo: 'jim_api_doc'
                }
              ]
            }
          ]
        },

        // DEVELOPER RELATIONS
        {
          id: 'tech_evangelist',
          name: 'Boman Irani',
          username: 'boman_evangelist',
          role: 'Technical Evangelist',
          category: 'Developer Relations',
          email: 'boman.evangelist@jibble.com',
          avatar: '🎙️',
          reportsTo: 'cto_vikram',
          children: [
            {
              id: 'dev_comm_mgr',
              name: 'Ali Fazal',
              username: 'ali_dev_community',
              role: 'Community Manager',
              category: 'Developer Relations',
              email: 'ali.community@jibble.com',
              avatar: '🌍',
              reportsTo: 'boman_evangelist',
              children: [
                {
                  id: 'dev_advocate',
                  name: 'Vikrant Massey',
                  username: 'vikrant_dev_advocate',
                  role: 'Developer Advocate',
                  category: 'Developer Relations',
                  email: 'vikrant.dev@jibble.com',
                  avatar: '🚀',
                  reportsTo: 'ali_dev_community'
                }
              ]
            }
          ]
        }
      ]
    },

    // 2. CHIEF OPERATING OFFICER (COO) -> Privacy, Operations, HR, Legal, Customer Success
    {
      id: 'coo',
      name: 'Anjali Sharma',
      username: 'coo_anjali',
      role: 'COO (Chief Operating Officer)',
      category: 'Executive Team',
      email: 'coo@jibble.com',
      avatar: '💼',
      reportsTo: 'admin_ceo',
      children: [
        // PRIVACY & POLICY MANAGEMENT
        {
          id: 'dpo_head',
          name: 'Neha Gupta',
          username: 'neha_dpo',
          role: 'Data Protection Officer (DPO)',
          category: 'Privacy & Policy Management',
          email: 'neha@jibble.com',
          avatar: '🛡️',
          reportsTo: 'coo_anjali',
          children: [
            {
              id: 'legal_compliance_lead',
              name: 'Alok Verma',
              username: 'alok_privacy_lead',
              role: 'Legal & Compliance Lead',
              category: 'Privacy & Policy Management',
              email: 'alok.compliance@jibble.com',
              avatar: '⚖️',
              reportsTo: 'neha_dpo',
              children: [
                {
                  id: 'compliance_officer_privacy',
                  name: 'Rajesh Kumar',
                  username: 'rajesh_compliance',
                  role: 'Compliance Officer',
                  category: 'Privacy & Policy Management',
                  email: 'rajesh@jibble.com',
                  avatar: '📜',
                  reportsTo: 'alok_privacy_lead',
                  children: [
                    {
                      id: 'privacy_auditor',
                      name: 'Divya Malhotra',
                      username: 'divya_auditor',
                      role: 'Privacy Policy Auditor',
                      category: 'Privacy & Policy Management',
                      email: 'divya.auditor@jibble.com',
                      avatar: '🔍',
                      reportsTo: 'rajesh_compliance',
                      children: [
                        {
                          id: 'content_mod',
                          name: 'Simran Kaur',
                          username: 'simran_mod',
                          role: 'Content & Policy Moderator',
                          category: 'Privacy & Policy Management',
                          email: 'simran@jibble.com',
                          avatar: '🚨',
                          reportsTo: 'divya_auditor',
                          children: [
                            {
                              id: 'privacy_intern',
                              name: 'Aakash Verma',
                              username: 'aakash_privacy_intern',
                              role: 'Privacy Intern',
                              category: 'Privacy & Policy Management',
                              email: 'aakash@jibble.com',
                              avatar: '🛡️',
                              reportsTo: 'simran_mod'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // OPERATIONS
        {
          id: 'prog_mgr',
          name: 'Sunil Rao',
          username: 'sunil_ops',
          role: 'Program Manager',
          category: 'Operations',
          email: 'sunil@jibble.com',
          avatar: '📦',
          reportsTo: 'coo_anjali',
          children: [
            {
              id: 'proj_mgr',
              name: 'Jaideep Ahlawat',
              username: 'jaideep_pm',
              role: 'Project Manager',
              category: 'Operations',
              email: 'jaideep.pm@jibble.com',
              avatar: '📋',
              reportsTo: 'sunil_ops',
              children: [
                {
                  id: 'proj_coord',
                  name: 'Vijay Varma',
                  username: 'vijay_coord',
                  role: 'Project Coordinator',
                  category: 'Operations',
                  email: 'vijay.coord@jibble.com',
                  avatar: '📌',
                  reportsTo: 'jaideep_pm',
                  children: [
                    {
                      id: 'ops_mgr',
                      name: 'Nawaz Sen',
                      username: 'nawaz_ops_mgr',
                      role: 'Operations Manager',
                      category: 'Operations',
                      email: 'nawaz.ops@jibble.com',
                      avatar: '⚙️',
                      reportsTo: 'vijay_coord',
                      children: [
                        {
                          id: 'ops_exec',
                          name: 'Radhika Madan',
                          username: 'radhika_ops',
                          role: 'Operations Executive',
                          category: 'Operations',
                          email: 'radhika.ops@jibble.com',
                          avatar: '📝',
                          reportsTo: 'nawaz_ops_mgr'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // HUMAN RESOURCES (HR)
        {
          id: 'hr_mgr',
          name: 'Priya Sharma',
          username: 'priya_hr',
          role: 'HR Manager',
          category: 'Human Resources (HR)',
          email: 'priya@jibble.com',
          avatar: '🤝',
          reportsTo: 'coo_anjali',
          children: [
            {
              id: 'hrbp',
              name: 'Ananya Saxena',
              username: 'ananya_recruiter',
              role: 'HR Business Partner',
              category: 'Human Resources (HR)',
              email: 'ananya@jibble.com',
              avatar: '📋',
              reportsTo: 'priya_hr',
              children: [
                {
                  id: 'recruiter',
                  name: 'Kartik Aaryan',
                  username: 'kartik_recruiter',
                  role: 'Recruiter',
                  category: 'Human Resources (HR)',
                  email: 'kartik.recruiter@jibble.com',
                  avatar: '🔍',
                  reportsTo: 'ananya_recruiter',
                  children: [
                    {
                      id: 'hr_exec',
                      name: 'Janhvi Kapoor',
                      username: 'janhvi_hr',
                      role: 'HR Executive',
                      category: 'Human Resources (HR)',
                      email: 'janhvi.hr@jibble.com',
                      avatar: '🌸',
                      reportsTo: 'kartik_recruiter',
                      children: [
                        {
                          id: 'ta_exec',
                          name: 'Sidharth Malhotra',
                          username: 'sidharth_ta',
                          role: 'Talent Acquisition Executive',
                          category: 'Human Resources (HR)',
                          email: 'sidharth.ta@jibble.com',
                          avatar: '🎯',
                          reportsTo: 'janhvi_hr',
                          children: [
                            {
                              id: 'hr_intern',
                              name: 'Pooja Verma',
                              username: 'pooja_hr_intern',
                              role: 'HR Intern',
                              category: 'Human Resources (HR)',
                              email: 'pooja.hrintern@jibble.com',
                              avatar: '🌸',
                              reportsTo: 'sidharth_ta'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // LEGAL
        {
          id: 'legal_mgr',
          name: 'Meenakshi Sundaram',
          username: 'meenakshi_legal',
          role: 'Legal Manager',
          category: 'Legal',
          email: 'meenakshi@jibble.com',
          avatar: '⚖️',
          reportsTo: 'coo_anjali',
          children: [
            {
              id: 'corp_lawyer',
              name: 'Ram Jethmalani',
              username: 'ram_lawyer',
              role: 'Corporate Lawyer',
              category: 'Legal',
              email: 'ram.lawyer@jibble.com',
              avatar: '📜',
              reportsTo: 'meenakshi_legal',
              children: [
                {
                  id: 'compliance_officer_legal',
                  name: 'Harish Salve',
                  username: 'harish_compliance_legal',
                  role: 'Compliance Officer',
                  category: 'Legal',
                  email: 'harish.legal@jibble.com',
                  avatar: '🏛️',
                  reportsTo: 'ram_lawyer',
                  children: [
                    {
                      id: 'legal_exec',
                      name: 'Yami Gautam',
                      username: 'yami_legal_exec',
                      role: 'Legal Executive',
                      category: 'Legal',
                      email: 'yami.legal@jibble.com',
                      avatar: '⚖️',
                      reportsTo: 'harish_compliance_legal'
                    }
                  ]
                }
              ]
            }
          ]
        },

        // CUSTOMER SUCCESS
        {
          id: 'kam_mgr',
          name: 'Sanjay Dutt',
          username: 'sanjay_kam',
          role: 'Key Account Manager',
          category: 'Customer Success',
          email: 'sanjay.kam@jibble.com',
          avatar: '🔑',
          reportsTo: 'coo_anjali',
          children: [
            {
              id: 'csm_mgr',
              name: 'Priyanka Chopra',
              username: 'priyanka_csm',
              role: 'Customer Success Manager',
              category: 'Customer Success',
              email: 'priyanka.csm@jibble.com',
              avatar: '🤝',
              reportsTo: 'sanjay_kam',
              children: [
                {
                  id: 'csa_assoc',
                  name: 'Ranveer Singh',
                  username: 'ranveer_csa',
                  role: 'Customer Success Associate',
                  category: 'Customer Success',
                  email: 'ranveer.csa@jibble.com',
                  avatar: '⭐',
                  reportsTo: 'priyanka_csm',
                  children: [
                    {
                      id: 'tech_support_eng',
                      name: 'Dev Patel',
                      username: 'dev_tech_support',
                      role: 'Technical Support Engineer',
                      category: 'Customer Success',
                      email: 'dev.support@jibble.com',
                      avatar: '🛠️',
                      reportsTo: 'ranveer_csa',
                      children: [
                        {
                          id: 'cust_support_exec',
                          name: 'Alia Bhatt',
                          username: 'alia_support',
                          role: 'Customer Support Executive',
                          category: 'Customer Success',
                          email: 'alia.support@jibble.com',
                          avatar: '🎧',
                          reportsTo: 'dev_tech_support'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // 3. CHIEF FINANCIAL OFFICER (CFO) -> Finance
    {
      id: 'cfo',
      name: 'Rajesh Singhania',
      username: 'cfo_rajesh',
      role: 'CFO (Chief Financial Officer)',
      category: 'Executive Team',
      email: 'cfo@jibble.com',
      avatar: '💵',
      reportsTo: 'admin_ceo',
      children: [
        {
          id: 'fin_mgr',
          name: 'Siddharth Rao',
          username: 'siddharth_fin',
          role: 'Finance Manager',
          category: 'Finance',
          email: 'siddharth@jibble.com',
          avatar: '🏦',
          reportsTo: 'cfo_rajesh',
          children: [
            {
              id: 'fin_analyst',
              name: 'Katrina Kaif',
              username: 'katrina_fin_analyst',
              role: 'Financial Analyst',
              category: 'Finance',
              email: 'katrina.fin@jibble.com',
              avatar: '📊',
              reportsTo: 'siddharth_fin',
              children: [
                {
                  id: 'payroll_exec',
                  name: 'Tiger Shroff',
                  username: 'tiger_payroll',
                  role: 'Payroll Executive',
                  category: 'Finance',
                  email: 'tiger.payroll@jibble.com',
                  avatar: '💸',
                  reportsTo: 'katrina_fin_analyst',
                  children: [
                    {
                      id: 'fin_exec',
                      name: 'Disha Patani',
                      username: 'disha_fin_exec',
                      role: 'Finance Executive',
                      category: 'Finance',
                      email: 'disha.fin@jibble.com',
                      avatar: '💵',
                      reportsTo: 'tiger_payroll',
                      children: [
                        {
                          id: 'accountant',
                          name: 'Ayushmann Khurrana',
                          username: 'ayushmann_accountant',
                          role: 'Accountant',
                          category: 'Finance',
                          email: 'ayushmann.acc@jibble.com',
                          avatar: '🧾',
                          reportsTo: 'disha_fin_exec'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // 4. CHIEF PRODUCT OFFICER (CPO) -> Product, Design, Data
    {
      id: 'cpo',
      name: 'Sanya Kapoor',
      username: 'cpo_sanya',
      role: 'CPO (Chief Product Officer)',
      category: 'Executive Team',
      email: 'cpo@jibble.com',
      avatar: '📱',
      reportsTo: 'admin_ceo',
      children: [
        // PRODUCT
        {
          id: 'gpm_head',
          name: 'Vikramaditya Rao',
          username: 'vikram_gpm',
          role: 'Group Product Manager',
          category: 'Product',
          email: 'vikram.gpm@jibble.com',
          avatar: '🎯',
          reportsTo: 'cpo_sanya',
          children: [
            {
              id: 'sr_pm',
              name: 'Aman Deep',
              username: 'aman_pm',
              role: 'Senior Product Manager',
              category: 'Product',
              email: 'aman@jibble.com',
              avatar: '📊',
              reportsTo: 'vikram_gpm',
              children: [
                {
                  id: 'pm_prod',
                  name: 'Shreya Ghoshal',
                  username: 'shreya_pm',
                  role: 'Product Manager',
                  category: 'Product',
                  email: 'shreya.pm@jibble.com',
                  avatar: '📋',
                  reportsTo: 'aman_pm',
                  children: [
                    {
                      id: 'apm_prod',
                      name: 'Niharika Sen',
                      username: 'niharika_apm',
                      role: 'Associate Product Manager (APM)',
                      category: 'Product',
                      email: 'niharika.apm@jibble.com',
                      avatar: '🚀',
                      reportsTo: 'shreya_pm'
                    }
                  ]
                }
              ]
            }
          ]
        },

        // DESIGN
        {
          id: 'design_lead',
          name: 'Riya Patel',
          username: 'riya_ui',
          role: 'Design Lead',
          category: 'Design',
          email: 'riya@jibble.com',
          avatar: '🎨',
          reportsTo: 'cpo_sanya',
          children: [
            {
              id: 'sr_product_designer',
              name: 'Tanya Singhal',
              username: 'tanya_sr_des',
              role: 'Senior Product Designer',
              category: 'Design',
              email: 'tanya.design@jibble.com',
              avatar: '✨',
              reportsTo: 'riya_ui',
              children: [
                {
                  id: 'motion_designer',
                  name: 'Leo Zhang',
                  username: 'leo_motion',
                  role: 'Motion Designer',
                  category: 'Design',
                  email: 'leo.motion@jibble.com',
                  avatar: '🎬',
                  reportsTo: 'tanya_sr_des'
                },
                {
                  id: 'graphic_designer',
                  name: 'Shruti Hassan',
                  username: 'shruti_graphic',
                  role: 'Graphic Designer',
                  category: 'Design',
                  email: 'shruti.graphic@jibble.com',
                  avatar: '🖼️',
                  reportsTo: 'tanya_sr_des'
                },
                {
                  id: 'prod_designer',
                  name: 'Kunal Kapoor',
                  username: 'kunal_prod_des',
                  role: 'Product Designer',
                  category: 'Design',
                  email: 'kunal.design@jibble.com',
                  avatar: '✏️',
                  reportsTo: 'tanya_sr_des',
                  children: [
                    {
                      id: 'ux_designer',
                      name: 'Ananya Das',
                      username: 'ananya_ux',
                      role: 'UX Designer',
                      category: 'Design',
                      email: 'ananya.ux@jibble.com',
                      avatar: '📐',
                      reportsTo: 'kunal_prod_des',
                      children: [
                        {
                          id: 'ui_designer',
                          name: 'Kavita Joshi',
                          username: 'kavita_ui',
                          role: 'UI Designer',
                          category: 'Design',
                          email: 'kavita@jibble.com',
                          avatar: '🖌️',
                          reportsTo: 'ananya_ux'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // DATA
        {
          id: 'analytics_mgr',
          name: 'Madhavan Iyer',
          username: 'madhavan_analytics_mgr',
          role: 'Analytics Manager',
          category: 'Data',
          email: 'madhavan.analytics@jibble.com',
          avatar: '📈',
          reportsTo: 'cpo_sanya',
          children: [
            {
              id: 'data_sci',
              name: 'Dr. Vivek Pillai',
              username: 'vivek_ds',
              role: 'Data Scientist',
              category: 'Data',
              email: 'vivek.ds@jibble.com',
              avatar: '🧪',
              reportsTo: 'madhavan_analytics_mgr',
              children: [
                {
                  id: 'sr_data_eng',
                  name: 'Harish Kumar',
                  username: 'harish_sr_data',
                  role: 'Senior Data Engineer',
                  category: 'Data',
                  email: 'harish.data@jibble.com',
                  avatar: '⚡',
                  reportsTo: 'vivek_ds',
                  children: [
                    {
                      id: 'data_eng',
                      name: 'Swati Reddy',
                      username: 'swati_de',
                      role: 'Data Engineer',
                      category: 'Data',
                      email: 'swati.de@jibble.com',
                      avatar: '💾',
                      reportsTo: 'harish_sr_data',
                      children: [
                        {
                          id: 'biz_analyst',
                          name: 'Nitin Gadkari',
                          username: 'nitin_ba',
                          role: 'Business Analyst',
                          category: 'Data',
                          email: 'nitin.ba@jibble.com',
                          avatar: '💼',
                          reportsTo: 'swati_de',
                          children: [
                            {
                              id: 'data_analyst',
                              name: 'Pooja Hegde',
                              username: 'pooja_data',
                              role: 'Data Analyst',
                              category: 'Data',
                              email: 'pooja@jibble.com',
                              avatar: '📊',
                              reportsTo: 'nitin_ba'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // 5. CHIEF MARKETING OFFICER (CMO) -> Marketing, Sales, Growth
    {
      id: 'cmo',
      name: 'Kabir Mehta',
      username: 'cmo_kabir',
      role: 'CMO (Chief Marketing Officer)',
      category: 'Executive Team',
      email: 'cmo@jibble.com',
      avatar: '📢',
      reportsTo: 'admin_ceo',
      children: [
        // MARKETING (Digital Marketing, Social Media, Content)
        {
          id: 'mktg_mgr',
          name: 'Nisha Singhania',
          username: 'nisha_mktg',
          role: 'Marketing Manager',
          category: 'Marketing',
          subcategory: 'Digital Marketing',
          email: 'nisha@jibble.com',
          avatar: '🚀',
          reportsTo: 'cmo_kabir',
          children: [
            // Digital Marketing Subcategory
            {
              id: 'growth_mktg',
              name: 'Tarun Bajaj',
              username: 'tarun_growth',
              role: 'Growth Marketer',
              category: 'Marketing',
              subcategory: 'Digital Marketing',
              email: 'tarun.growth@jibble.com',
              avatar: '📈',
              reportsTo: 'nisha_mktg',
              children: [
                {
                  id: 'sem_spec',
                  name: 'Rishi Kapoor',
                  username: 'rishi_sem',
                  role: 'SEM Specialist',
                  category: 'Marketing',
                  subcategory: 'Digital Marketing',
                  email: 'rishi.sem@jibble.com',
                  avatar: '🎯',
                  reportsTo: 'tarun_growth',
                  children: [
                    {
                      id: 'seo_spec',
                      name: 'Maya Lin',
                      username: 'maya_seo',
                      role: 'SEO Specialist',
                      category: 'Marketing',
                      subcategory: 'Digital Marketing',
                      email: 'maya.seo@jibble.com',
                      avatar: '🔍',
                      reportsTo: 'rishi_sem',
                      children: [
                        {
                          id: 'digi_mktg_exec',
                          name: 'Avani Jain',
                          username: 'avani_mktg_exec',
                          role: 'Digital Marketing Executive',
                          category: 'Marketing',
                          subcategory: 'Digital Marketing',
                          email: 'avani.mktg@jibble.com',
                          avatar: '📲',
                          reportsTo: 'maya_seo',
                          children: [
                            {
                              id: 'mktg_intern',
                              name: 'Tushar Grover',
                              username: 'tushar_mktg_intern',
                              role: 'Marketing Intern',
                              category: 'Marketing',
                              subcategory: 'Digital Marketing',
                              email: 'tushar@jibble.com',
                              avatar: '🌱',
                              reportsTo: 'avani_mktg_exec'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },

            // Social Media Subcategory
            {
              id: 'influencer_mgr',
              name: 'Sophie Turner',
              username: 'sophie_influencer',
              role: 'Influencer Marketing Manager',
              category: 'Marketing',
              subcategory: 'Social Media',
              email: 'sophie.influencer@jibble.com',
              avatar: '🌟',
              reportsTo: 'nisha_mktg',
              children: [
                {
                  id: 'comm_mgr_mktg',
                  name: 'Rohan Mehra',
                  username: 'rohan_community',
                  role: 'Community Manager',
                  category: 'Marketing',
                  subcategory: 'Social Media',
                  email: 'rohan.comm@jibble.com',
                  avatar: '💬',
                  reportsTo: 'sophie_influencer',
                  children: [
                    {
                      id: 'smm_mgr',
                      name: 'Zara Khan',
                      username: 'zara_smm',
                      role: 'Social Media Manager',
                      category: 'Marketing',
                      subcategory: 'Social Media',
                      email: 'zara.smm@jibble.com',
                      avatar: '📱',
                      reportsTo: 'rohan_community',
                      children: [
                        {
                          id: 'sm_exec',
                          name: 'Priya Dutt',
                          username: 'priya_sm_exec',
                          role: 'Social Media Executive',
                          category: 'Marketing',
                          subcategory: 'Social Media',
                          email: 'priya.sm@jibble.com',
                          avatar: '📸',
                          reportsTo: 'zara_smm',
                          children: [
                            {
                              id: 'sm_intern',
                              name: 'Diya Mirza',
                              username: 'diya_sm_intern',
                              role: 'Social Media Intern',
                              category: 'Marketing',
                              subcategory: 'Social Media',
                              email: 'diya.smintern@jibble.com',
                              avatar: '✨',
                              reportsTo: 'priya_sm_exec'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },

            // Content Subcategory
            {
              id: 'content_strat',
              name: 'Varun Grover',
              username: 'varun_content_strat',
              role: 'Content Strategist',
              category: 'Marketing',
              subcategory: 'Content',
              email: 'varun.content@jibble.com',
              avatar: '💡',
              reportsTo: 'nisha_mktg',
              children: [
                {
                  id: 'tech_writer_mktg',
                  name: 'Srinivas Rao',
                  username: 'srinivas_tech_writer',
                  role: 'Technical Writer',
                  category: 'Marketing',
                  subcategory: 'Content',
                  email: 'srinivas.writer@jibble.com',
                  avatar: '✍️',
                  reportsTo: 'varun_content_strat',
                  children: [
                    {
                      id: 'copywriter',
                      name: 'Fatima Sana',
                      username: 'fatima_copywriter',
                      role: 'Copywriter',
                      category: 'Marketing',
                      subcategory: 'Content',
                      email: 'fatima.copy@jibble.com',
                      avatar: '📝',
                      reportsTo: 'srinivas_tech_writer',
                      children: [
                        {
                          id: 'content_writer',
                          name: 'Harshita Gour',
                          username: 'harshita_writer',
                          role: 'Content Writer',
                          category: 'Marketing',
                          subcategory: 'Content',
                          email: 'harshita.writer@jibble.com',
                          avatar: '📖',
                          reportsTo: 'fatima_copywriter'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // SALES
        {
          id: 'sales_dir',
          name: 'Vikas Oberoi',
          username: 'vikas_sales',
          role: 'Sales Director',
          category: 'Sales',
          email: 'vikas@jibble.com',
          avatar: '💰',
          reportsTo: 'cmo_kabir',
          children: [
            {
              id: 'enterprise_sales_mgr',
              name: 'Rajiv Bajaj',
              username: 'rajiv_enterprise_sales',
              role: 'Enterprise Sales Manager',
              category: 'Sales',
              email: 'rajiv.sales@jibble.com',
              avatar: '💼',
              reportsTo: 'vikas_sales',
              children: [
                {
                  id: 'account_exec',
                  name: 'Sameer Wankhede',
                  username: 'sameer_ae',
                  role: 'Account Executive',
                  category: 'Sales',
                  email: 'sameer.ae@jibble.com',
                  avatar: '🤝',
                  reportsTo: 'rajiv_enterprise_sales',
                  children: [
                    {
                      id: 'bdm_mgr',
                      name: 'Karan Johar',
                      username: 'karan_bdm',
                      role: 'Business Development Manager (BDM)',
                      category: 'Sales',
                      email: 'karan.bdm@jibble.com',
                      avatar: '🚀',
                      reportsTo: 'sameer_ae',
                      children: [
                        {
                          id: 'bde_exec',
                          name: 'Neil Nitin',
                          username: 'neil_bde',
                          role: 'Business Development Executive (BDE)',
                          category: 'Sales',
                          email: 'neil.bde@jibble.com',
                          avatar: '📞',
                          reportsTo: 'karan_bdm',
                          children: [
                            {
                              id: 'sales_exec',
                              name: 'Radhika Apte',
                              username: 'radhika_sales',
                              role: 'Sales Executive',
                              category: 'Sales',
                              email: 'radhika.sales@jibble.com',
                              avatar: '💵',
                              reportsTo: 'neil_bde',
                              children: [
                                {
                                  id: 'sales_intern',
                                  name: 'Kabir Bedi',
                                  username: 'kabir_sales_intern',
                                  role: 'Sales Intern',
                                  category: 'Sales',
                                  email: 'kabir.salesintern@jibble.com',
                                  avatar: '💼',
                                  reportsTo: 'radhika_sales'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        // GROWTH
        {
          id: 'growth_pm',
          name: 'Sumeet Vyas',
          username: 'sumeet_growth_pm',
          role: 'Growth Product Manager',
          category: 'Growth',
          email: 'sumeet.growth@jibble.com',
          avatar: '🚀',
          reportsTo: 'cmo_kabir',
          children: [
            {
              id: 'growth_eng',
              name: 'Amol Parashar',
              username: 'amol_growth_eng',
              role: 'Growth Engineer',
              category: 'Growth',
              email: 'amol.growth@jibble.com',
              avatar: '⚡',
              reportsTo: 'sumeet_growth_pm',
              children: [
                {
                  id: 'growth_analyst',
                  name: 'Jitendra Kumar',
                  username: 'jitendra_growth_analyst',
                  role: 'Growth Analyst',
                  category: 'Growth',
                  email: 'jitendra.growth@jibble.com',
                  avatar: '📊',
                  reportsTo: 'amol_growth_eng',
                  children: [
                    {
                      id: 'growth_assoc',
                      name: 'Mithila Palkar',
                      username: 'mithila_growth_assoc',
                      role: 'Growth Associate',
                      category: 'Growth',
                      email: 'mithila.growth@jibble.com',
                      avatar: '🌟',
                      reportsTo: 'jitendra_growth_analyst'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

// Helper to flatten the org tree into an array of all employees
export const flattenOrgTree = (node: OrgNode): OrgNode[] => {
  let result: OrgNode[] = [node]
  if (node.children) {
    node.children.forEach((child) => {
      result = result.concat(flattenOrgTree(child))
    })
  }
  return result
}

export const allOrgEmployees = flattenOrgTree(fullOrgTree)

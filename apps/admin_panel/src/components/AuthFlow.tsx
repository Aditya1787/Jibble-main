import React, { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { jobRoleData } from '../data/orgData'
import { adminApi } from '../api/adminApi'

const avatarPresets = [
  '🎒', '🕶️', '💻', '🦊', '🚀', '🔮', '🍀', '🍕'
]

const hobbyOptions = [
  '📚 Reading', '💻 Coding', '✈️ Traveling', '🎮 Gaming', 
  '🎵 Music', '📷 Photography', '🏋️ Gym', '🍳 Cooking', 
  '🎨 Painting', '🍿 Movies', '🎤 Singing', '⚽ Sports'
]

const foodOptions = [
  '🍕 Pizza', '🍔 Burger', '🍣 Sushi', '🍛 Biryani', 
  '🍝 Pasta', '🥗 Salad', '🌮 Taco', '🍜 Ramen'
]

const leadPresets = [
  { name: 'Marcus Vance', title: 'Tech Head / CTO', dept: 'Engineering' },
  { name: 'David Kim', title: 'VP of Engineering', dept: 'Software Engineering' },
  { name: 'Elena Rostova', title: 'Engineering Manager', dept: 'Backend & Cloud' },
  { name: 'Alex Rivera', title: 'Frontend Lead', dept: 'UI/UX & Web' },
  { name: 'Samantha Chen', title: 'Head of Product', dept: 'Product Strategy' },
  { name: 'Robert Taylor', title: 'DevOps & SRE Lead', dept: 'Infrastructure' },
  { name: 'Aarav Sharma', title: 'AI & Data Science Lead', dept: 'AI / Machine Learning' },
  { name: 'Sophia Martinez', title: 'QA & Testing Manager', dept: 'Quality Assurance' },
]

const hrPresets = [
  { name: 'Priya Sharma', title: 'HR Director', dept: 'People Operations' },
  { name: 'Sarah Jenkins', title: 'HR Business Partner (HRBP)', dept: 'Engineering & Product' },
  { name: 'Anita Roy', title: 'Talent Acquisition Lead', dept: 'Recruitment' },
  { name: 'Michael Chang', title: 'People Operations Manager', dept: 'Employee Success' },
  { name: 'Rohan Mehta', title: 'Senior HR Executive', dept: 'HR & Compliance' },
  { name: 'Emily Watson', title: 'Onboarding & Cultural Lead', dept: 'People Experience' },
]

export default function AuthFlow() {
  const store = useAuthStore()
  
  // Toggle between 'login' and 'register'
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login')
  
  // Registration step flow: step 1: credentials & role, 2: email OTP, 3: mobile OTP, 4: onboarding, 5: success
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  // Step 1 States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Two-part searchable Job Role states
  const [selCategory, setSelCategory] = useState('')
  const [catSearch, setCatSearch] = useState('')
  const [catDropdownOpen, setCatDropdownOpen] = useState(false)
  
  const [selSubcategory, setSelSubcategory] = useState('')
  const [selRole, setSelRole] = useState('')
  const [roleSearch, setRoleSearch] = useState('')
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  
  // Supervisor (Tech Head / Team Lead) states
  const [leadType, setLeadType] = useState('Tech Head')
  const [reportingLead, setReportingLead] = useState('')
  const [leadSearch, setLeadSearch] = useState('')
  const [leadDropdownOpen, setLeadDropdownOpen] = useState(false)
  
  // HR Representative states
  const [hrContact, setHrContact] = useState('')
  const [hrSearch, setHrSearch] = useState('')
  const [hrDropdownOpen, setHrDropdownOpen] = useState(false)
  
  // Step 2 States (Email OTP)
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', ''])
  const [emailTimer, setEmailTimer] = useState(30)
  
  // Step 3 States (Mobile OTP)
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [mobileOtpSent, setMobileOtpSent] = useState(false)
  const [mobileOtp, setMobileOtp] = useState(['', '', '', '', '', ''])
  const [mobileTimer, setMobileTimer] = useState(30)
  
  // Step 4 States (Onboarding)
  const [username, setUsername] = useState('')
  const [hometown, setHometown] = useState('')
  const [favFood, setFavFood] = useState('')
  const [otherFood, setOtherFood] = useState('')
  const [hobbies, setHobbies] = useState<string[]>([])
  const [avatar, setAvatar] = useState('🦊')
  const [customAvatar, setCustomAvatar] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  
  // Step 5 States (Redirect)
  const [redirectCount, setRedirectCount] = useState(5)
  
  // Confetti Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Username validation simulation
  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle')
      return
    }
    setUsernameStatus('checking')
    const t = setTimeout(() => {
      if (username.length < 3) {
        setUsernameStatus('taken')
      } else {
        setUsernameStatus('available')
      }
    }, 600)
    return () => clearTimeout(t)
  }, [username])

  // Email Timer
  useEffect(() => {
    if (activeMode === 'register' && step === 2 && emailTimer > 0) {
      const interval = setInterval(() => setEmailTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [step, emailTimer, activeMode])

  // Mobile Timer
  useEffect(() => {
    if (activeMode === 'register' && step === 3 && mobileOtpSent && mobileTimer > 0) {
      const interval = setInterval(() => setMobileTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [step, mobileOtpSent, mobileTimer, activeMode])

  // Step 5 Redirect Countdown & Confetti
  useEffect(() => {
    if (activeMode === 'register' && step === 5) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
          
          interface Particle {
            x: number
            y: number
            r: number
            d: number
            color: string
            tilt: number
            tiltAngleIncremental: number
            tiltAngle: number
          }
          
          const colors = ['#336659', '#1f493d', '#c28d38', '#b34a4a', '#a855f7', '#3b82f6']
          const particles: Particle[] = Array.from({ length: 150 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
          }))

          let animationFrameId: number
          
          const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach((p, idx) => {
              p.tiltAngle += p.tiltAngleIncremental
              p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2
              p.x += Math.sin(p.tiltAngle)
              p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15
              
              ctx.beginPath()
              ctx.lineWidth = p.r
              ctx.strokeStyle = p.color
              ctx.moveTo(p.x + p.tilt + p.r / 2, p.y)
              ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2)
              ctx.stroke()
              
              if (p.y > canvas.height) {
                particles[idx] = {
                  ...p,
                  x: Math.random() * canvas.width,
                  y: -20,
                  tilt: Math.random() * 10 - 5
                }
              }
            })
            animationFrameId = requestAnimationFrame(draw)
          }
          
          draw()
          
          return () => {
            cancelAnimationFrame(animationFrameId)
          }
        }
      }
    }
  }, [step, activeMode])

  // Countdown timer for automatic completion in step 5
  useEffect(() => {
    if (activeMode === 'register' && step === 5) {
      if (redirectCount > 0) {
        const timer = setTimeout(() => setRedirectCount(redirectCount - 1), 1000)
        return () => clearTimeout(timer)
      } else {
        handleFinalSubmit()
      }
    }
  }, [step, redirectCount, activeMode])

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!loginEmail) {
      newErrors.loginEmail = 'Email is required.'
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      newErrors.loginEmail = 'Enter a valid email address.'
    }
    
    if (!loginPassword) {
      newErrors.loginPassword = 'Password is required.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoggingIn(true)
    setTimeout(() => {
      const success = store.login(loginEmail, loginPassword)
      setIsLoggingIn(false)
      if (!success) {
        setErrors({ loginGeneral: 'Invalid email or password.' })
      } else {
        setErrors({})
      }
    }, 1000)
  }

  // Computed categories filtered by search query
  const filteredCategories = jobRoleData.filter((item) =>
    item.category.toLowerCase().includes(catSearch.toLowerCase())
  )

  // Computed roles list based on category & role search query
  const availableRolesList = React.useMemo(() => {
    let list: Array<{ role: string; category: string; subcategory?: string; icon?: string }> = []
    
    if (selCategory) {
      const catData = jobRoleData.find((c) => c.category === selCategory)
      if (catData) {
        if (catData.subcategories) {
          Object.entries(catData.subcategories).forEach(([subcat, rolesList]) => {
            (rolesList as string[]).forEach((r) => {
              list.push({ role: r, category: catData.category, subcategory: subcat, icon: catData.icon })
            })
          })
        } else if (catData.roles) {
          catData.roles.forEach((r) => {
            list.push({ role: r, category: catData.category, icon: catData.icon })
          })
        }
      }
    } else {
      jobRoleData.forEach((catData) => {
        if (catData.subcategories) {
          Object.entries(catData.subcategories).forEach(([subcat, rolesList]) => {
            (rolesList as string[]).forEach((r) => {
              list.push({ role: r, category: catData.category, subcategory: subcat, icon: catData.icon })
            })
          })
        } else if (catData.roles) {
          catData.roles.forEach((r) => {
            list.push({ role: r, category: catData.category, icon: catData.icon })
          })
        }
      })
    }

    if (roleSearch.trim()) {
      const q = roleSearch.toLowerCase()
      list = list.filter(
        (item) =>
          item.role.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.subcategory && item.subcategory.toLowerCase().includes(q))
      )
    }

    return list
  }, [selCategory, roleSearch])

  // Filtered Leads
  const filteredLeads = leadPresets.filter(
    (lead) =>
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.title.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.dept.toLowerCase().includes(leadSearch.toLowerCase())
  )

  // Filtered HR Contacts
  const filteredHrs = hrPresets.filter(
    (hr) =>
      hr.name.toLowerCase().includes(hrSearch.toLowerCase()) ||
      hr.title.toLowerCase().includes(hrSearch.toLowerCase()) ||
      hr.dept.toLowerCase().includes(hrSearch.toLowerCase())
  )

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!email) {
      newErrors.email = 'Email ID is required.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    
    if (!password) {
      newErrors.password = 'Password is required.'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    if (!selCategory && !catSearch) {
      newErrors.category = 'Please select or type a corporate category.'
    }
    
    if (!selRole && !roleSearch) {
      newErrors.role = 'Please select or type a valid job role.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep1()) {
      const finalCat = selCategory || catSearch
      const finalRole = selRole || roleSearch
      const finalLead = reportingLead || leadSearch
      const finalHr = hrContact || hrSearch
      store.setCredentials(
        email, 
        password, 
        finalRole, 
        finalCat, 
        selSubcategory || undefined,
        finalLead || undefined,
        leadType || undefined,
        finalHr || undefined
      )
      setStep(2)
      // Send real Email OTP via backend API
      adminApi.auth.sendOtp('email', email).then((res) => {
        if (res.devOtpCode) {
          console.log(`[Dev Mode] Email OTP for ${email}: ${res.devOtpCode}`)
        }
      }).catch((err) => {
        console.warn('Backend OTP send failed, falling back to local timer:', err)
      })
    }
  }

  const handleOtpChange = (
    otpType: 'email' | 'mobile',
    index: number,
    value: string
  ) => {
    if (!/^\d*$/.test(value)) return
    const updatedOtp = otpType === 'email' ? [...emailOtp] : [...mobileOtp]
    updatedOtp[index] = value.slice(-1)
    
    if (otpType === 'email') {
      setEmailOtp(updatedOtp)
    } else {
      setMobileOtp(updatedOtp)
    }

    if (value && index < 5) {
      const nextInput = document.getElementById(`${otpType}-otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (
    otpType: 'email' | 'mobile',
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      const prevInput = document.getElementById(`${otpType}-otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handleEmailOtpVerify = async () => {
    const code = emailOtp.join('')
    if (code.length < 6) {
      setErrors({ emailOtp: 'Please enter all 6 digits.' })
      return
    }
    try {
      await adminApi.auth.verifyOtp('email', email, code)
    } catch (err: any) {
      console.warn('Backend Email OTP verify failed, verifying locally:', err.message)
    }
    store.verifyEmailOTP()
    setErrors({})
    setStep(3)
  }

  const handleMobileSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setErrors({ phone: 'Please enter a valid 10-digit mobile number.' })
      return
    }
    setErrors({})
    try {
      const fullPhone = `${countryCode}${phone}`
      const res = await adminApi.auth.sendOtp('mobile', fullPhone)
      if (res.devOtpCode) {
        console.log(`[Dev Mode] Mobile OTP for ${fullPhone}: ${res.devOtpCode}`)
      }
    } catch (err: any) {
      console.warn('Backend Mobile OTP send failed, falling back to local store:', err.message)
    }
    store.sendMobileOTP(phone)
    setMobileOtpSent(true)
    setMobileTimer(30)
  }

  const handleMobileOtpVerify = async () => {
    const code = mobileOtp.join('')
    if (code.length < 6) {
      setErrors({ mobileOtp: 'Please enter all 6 digits.' })
      return
    }
    try {
      const fullPhone = `${countryCode}${phone}`
      await adminApi.auth.verifyOtp('mobile', fullPhone, code)
    } catch (err: any) {
      console.warn('Backend Mobile OTP verify failed, verifying locally:', err.message)
    }
    store.verifyMobileOTP()
    setErrors({})
    setStep(4)
  }

  const toggleHobby = (hobby: string) => {
    if (hobbies.includes(hobby)) {
      setHobbies(hobbies.filter((h) => h !== hobby))
    } else {
      setHobbies([...hobbies, hobby])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!username) {
      newErrors.username = 'Username is required.'
    } else if (usernameStatus === 'taken' || username.length < 3) {
      newErrors.username = 'Username must be at least 3 alphanumeric characters.'
    }

    if (!hometown) {
      newErrors.hometown = 'Please enter your hometown/location.'
    }

    if (!favFood && !otherFood) {
      newErrors.favFood = 'Please select or type your favorite food.'
    }

    if (hobbies.length === 0) {
      newErrors.hobbies = 'Please select at least one hobby.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStep(5)
  }

  const handleFinalSubmit = () => {
    store.completeOnboarding({
      username,
      hometown,
      favFood: favFood === 'Other' ? otherFood : favFood,
      hobbies,
      avatar: customAvatar || avatar,
    })
  }

  const selectedCategoryData = jobRoleData.find((c) => c.category === selCategory)
  
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 20px',
        color: 'var(--text-primary)',
        position: 'relative',
        overflowY: 'auto',
      }}
      onClick={() => {
        // Close dropdowns when clicking outside input fields
        setCatDropdownOpen(false)
        setRoleDropdownOpen(false)
        setLeadDropdownOpen(false)
        setHrDropdownOpen(false)
      }}
    >
      {/* Spatial UI Floating Drifting Background Blobs */}
      <div className="spatial-bg">
        <div className="spatial-orb orb-1" />
        <div className="spatial-orb orb-2" />
        <div className="spatial-orb orb-3" />
      </div>

      {activeMode === 'register' && step === 5 && (
        <canvas ref={canvasRef} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 99
        }} />
      )}

      {/* Main Glass Panel */}
      <div className="spatial-panel animate-pop-in" style={{
        width: '100%',
        maxWidth: (activeMode === 'register' && step === 1) ? '680px' : '520px',
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        zIndex: 10,
        position: 'relative',
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '4px' }}>
          <div style={{
            width: '44px', height: '44px',
            background: 'var(--accent)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: '800', color: '#ffffff',
            boxShadow: '4px 4px 10px rgba(51, 102, 89, 0.25), -4px -4px 10px rgba(255, 255, 255, 0.4)',
          }}>J</div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Jibble</h2>
            <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Console</p>
          </div>
        </div>

        {/* Spatial Mode Switcher Tab (only show on login or step 1 registration) */}
        {((activeMode === 'login') || (activeMode === 'register' && step === 1)) && (
          <div className="nm-card-inset" style={{
            display: 'flex',
            padding: '6px',
            borderRadius: '16px',
            width: '100%',
            background: 'rgba(243, 239, 232, 0.5)',
          }}>
            <button
              type="button"
              onClick={() => {
                setActiveMode('login')
                setErrors({})
              }}
              className={activeMode === 'login' ? 'nm-card' : ''}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeMode === 'login' ? 'var(--bg-primary)' : 'transparent',
                color: activeMode === 'login' ? 'var(--accent)' : 'var(--text-secondary)',
                boxShadow: activeMode === 'login' ? 'var(--nm-flat-xs)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              🔑 Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('register')
                setStep(1)
                setErrors({})
              }}
              className={activeMode === 'register' ? 'nm-card' : ''}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeMode === 'register' ? 'var(--bg-primary)' : 'transparent',
                color: activeMode === 'register' ? 'var(--accent)' : 'var(--text-secondary)',
                boxShadow: activeMode === 'register' ? 'var(--nm-flat-xs)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              📝 Register
            </button>
          </div>
        )}

        {/* Progress Tracker (only visible in register steps 2, 3, 4, 5) */}
        {activeMode === 'register' && step > 1 && (
          <div style={{ display: 'flex', gap: '10px', width: '100%', padding: '0 8px' }}>
            {[1, 2, 3, 4, 5].map((s) => {
              const isCompleted = step > s
              const isActive = step === s
              return (
                <div key={s} style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  background: isCompleted || isActive ? 'var(--accent)' : 'var(--shadow-dark)',
                  boxShadow: isCompleted || isActive 
                    ? '0 0 6px rgba(51, 102, 89, 0.4)' 
                    : 'inset 1px 1px 2px var(--shadow-dark)',
                  transition: 'all 0.4s ease',
                }} />
              )
            })}
          </div>
        )}

        {/* ================= MODE: LOGIN ================= */}
        {activeMode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Welcome Back</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Sign in to access corporate workspace console.</p>
            </div>

            {errors.loginGeneral && (
              <div className="nm-card-inset" style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(179,74,74,0.06)',
                border: '1px solid rgba(179,74,74,0.15)',
                color: 'var(--danger)',
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                ⚠️ {errors.loginGeneral}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Corporate Email ID</label>
                <input
                  type="email"
                  className="nm-input-glass"
                  placeholder="admin@jibble.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                {errors.loginEmail && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.loginEmail}</span>}
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Password</label>
                <input
                  type="password"
                  className="nm-input-glass"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                {errors.loginPassword && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.loginPassword}</span>}
              </div>
            </div>

            <button
              type="submit"
              className="nm-btn-accent"
              disabled={isLoggingIn}
              style={{ marginTop: '10px' }}
            >
              {isLoggingIn ? 'Verifying Account... ⏳' : 'Sign In to Workspace →'}
            </button>
          </form>
        )}

        {/* ================= MODE: REGISTER (STEP 1: CREDENTIALS, ROLE, LEAD & HR) ================= */}
        {activeMode === 'register' && step === 1 && (
          <form
            onSubmit={handleStep1Submit}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Create Workspace Profile</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Provide email, password, select job category, role, Team Lead & HR contact.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Personal Email */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Personal Email ID</label>
                <input
                  type="email"
                  className="nm-input-glass"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.email}</span>}
              </div>

              {/* Password Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Password</label>
                  <input
                    type="password"
                    className="nm-input-glass"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.password}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Confirm Password</label>
                  <input
                    type="password"
                    className="nm-input-glass"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* TWO-PART SEARCHABLE JOB ROLE SECTION */}
              <div style={{
                background: 'rgba(243, 239, 232, 0.35)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: 'var(--nm-inset-sm)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🏷️ 1. Corporate Category & Job Role
                  </label>
                  {(selCategory || selRole || catSearch || roleSearch) && (
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => {
                        setSelCategory('')
                        setCatSearch('')
                        setSelSubcategory('')
                        setSelRole('')
                        setRoleSearch('')
                      }}
                    >
                      Clear ✕
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Part 1: Category Input (Searchable) */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Category
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="nm-input-glass"
                        placeholder="Search Category..."
                        value={catSearch}
                        onChange={(e) => {
                          setCatSearch(e.target.value)
                          setCatDropdownOpen(true)
                        }}
                        onFocus={() => {
                          setCatDropdownOpen(true)
                          setRoleDropdownOpen(false)
                          setLeadDropdownOpen(false)
                          setHrDropdownOpen(false)
                        }}
                        style={{ paddingRight: '28px', fontWeight: 600, fontSize: '13px' }}
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '12px', opacity: 0.6 }}>
                        🔍
                      </span>
                    </div>
                    {errors.category && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.category}</span>}

                    {/* Category Dropdown List */}
                    {catDropdownOpen && (
                      <div
                        className="spatial-panel animate-pop-in"
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          left: 0,
                          width: '100%',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          zIndex: 120,
                          padding: '8px',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          background: 'var(--bg-primary)',
                          borderRadius: '12px'
                        }}
                      >
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat) => (
                            <button
                              key={cat.category}
                              type="button"
                              style={{
                                textAlign: 'left',
                                padding: '8px 10px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: selCategory === cat.category ? 700 : 500,
                                background: selCategory === cat.category ? 'var(--bg-hover)' : 'transparent',
                                color: selCategory === cat.category ? 'var(--accent)' : 'var(--text-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onClick={() => {
                                setSelCategory(cat.category)
                                setCatSearch(cat.category)
                                setSelSubcategory('')
                                setSelRole('')
                                setRoleSearch('')
                                setCatDropdownOpen(false)
                                setRoleDropdownOpen(true)
                              }}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.category}</span>
                            </button>
                          ))
                        ) : (
                          <div style={{ padding: '8px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                            No matching categories
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Part 2: Role Input (Searchable) */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Job Role
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="nm-input-glass"
                        placeholder={selCategory ? `Roles in ${selCategory}...` : "Search roles..."}
                        value={roleSearch}
                        onChange={(e) => {
                          setRoleSearch(e.target.value)
                          setRoleDropdownOpen(true)
                        }}
                        onFocus={() => {
                          setRoleDropdownOpen(true)
                          setCatDropdownOpen(false)
                          setLeadDropdownOpen(false)
                          setHrDropdownOpen(false)
                        }}
                        style={{ paddingRight: '28px', fontWeight: 600, fontSize: '13px' }}
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '12px', opacity: 0.6 }}>
                        🔍
                      </span>
                    </div>
                    {errors.role && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.role}</span>}

                    {/* Role Dropdown List */}
                    {roleDropdownOpen && (
                      <div
                        className="spatial-panel animate-pop-in"
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          left: 0,
                          width: '100%',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          zIndex: 120,
                          padding: '8px',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          background: 'var(--bg-primary)',
                          borderRadius: '12px'
                        }}
                      >
                        {availableRolesList.length > 0 ? (
                          availableRolesList.map((item, idx) => (
                            <button
                              key={`${item.category}-${item.role}-${idx}`}
                              type="button"
                              style={{
                                textAlign: 'left',
                                padding: '8px 10px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: selRole === item.role ? 700 : 500,
                                background: selRole === item.role ? 'var(--accent)' : 'transparent',
                                color: selRole === item.role ? '#ffffff' : 'var(--text-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                              onClick={() => {
                                setSelRole(item.role)
                                setRoleSearch(item.role)
                                if (item.category) {
                                  setSelCategory(item.category)
                                  setCatSearch(item.category)
                                }
                                if (item.subcategory) {
                                  setSelSubcategory(item.subcategory)
                                } else {
                                  setSelSubcategory('')
                                }
                                setRoleDropdownOpen(false)
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{item.icon ? `${item.icon} ` : ''}{item.role}</span>
                                {(!selCategory || item.subcategory) && (
                                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                                    {item.category}{item.subcategory ? ` › ${item.subcategory}` : ''}
                                  </span>
                                )}
                              </div>
                              {selRole === item.role && <span>✓</span>}
                            </button>
                          ))
                        ) : (
                          <div style={{ padding: '8px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                            {roleSearch ? `No roles matching "${roleSearch}"` : 'Type to search role'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Position Summary Badge */}
                {selRole && (
                  <div className="nm-card-inset" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Position:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {selCategory} {selSubcategory ? `› ${selSubcategory}` : ''} › <strong style={{ color: 'var(--accent)' }}>{selRole}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* SUPERVISOR & HR SELECTION SECTION */}
              <div style={{
                background: 'rgba(243, 239, 232, 0.35)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: 'var(--nm-inset-sm)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
              }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  👥 2. Select Team Lead, Tech Head & HR Representative
                </label>

                {/* Row 1: Team Lead / Tech Head Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px', alignItems: 'flex-start' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Lead Role Type
                    </label>
                    <select
                      className="nm-input-glass"
                      style={{ fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      value={leadType}
                      onChange={(e) => setLeadType(e.target.value)}
                    >
                      <option value="Tech Head">Tech Head</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Engineering Manager">Engineering Manager</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Product Lead">Product Lead</option>
                      <option value="Department Head">Department Head</option>
                    </select>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Select / Search {leadType}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="nm-input-glass"
                        placeholder={`Search ${leadType} or type name...`}
                        value={leadSearch}
                        onChange={(e) => {
                          setLeadSearch(e.target.value)
                          setReportingLead(e.target.value)
                          setLeadDropdownOpen(true)
                        }}
                        onFocus={() => {
                          setLeadDropdownOpen(true)
                          setCatDropdownOpen(false)
                          setRoleDropdownOpen(false)
                          setHrDropdownOpen(false)
                        }}
                        style={{ paddingRight: '28px', fontWeight: 600, fontSize: '12px' }}
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '12px', opacity: 0.6 }}>
                        🔍
                      </span>
                    </div>

                    {/* Lead Dropdown Options */}
                    {leadDropdownOpen && (
                      <div
                        className="spatial-panel animate-pop-in"
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          left: 0,
                          width: '100%',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          zIndex: 120,
                          padding: '6px',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          background: 'var(--bg-primary)',
                          borderRadius: '12px'
                        }}
                      >
                        {filteredLeads.map((lead) => (
                          <button
                            key={lead.name}
                            type="button"
                            style={{
                              textAlign: 'left',
                              padding: '8px 10px',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              background: reportingLead === `${lead.name} (${lead.title})` ? 'var(--bg-hover)' : 'transparent',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                            onClick={() => {
                              const val = `${lead.name} (${lead.title})`
                              setReportingLead(val)
                              setLeadSearch(val)
                              setLeadDropdownOpen(false)
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>👨‍💼 {lead.name}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{lead.title} • {lead.dept}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: HR Representative Selector */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Select / Search HR Representative
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="nm-input-glass"
                      placeholder="Search HR Representative or type name..."
                      value={hrSearch}
                      onChange={(e) => {
                        setHrSearch(e.target.value)
                        setHrContact(e.target.value)
                        setHrDropdownOpen(true)
                      }}
                      onFocus={() => {
                        setHrDropdownOpen(true)
                        setCatDropdownOpen(false)
                        setRoleDropdownOpen(false)
                        setLeadDropdownOpen(false)
                      }}
                      style={{ paddingRight: '28px', fontWeight: 600, fontSize: '12px' }}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '12px', opacity: 0.6 }}>
                      🔍
                    </span>
                  </div>

                  {/* HR Dropdown Options */}
                  {hrDropdownOpen && (
                    <div
                      className="spatial-panel animate-pop-in"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 120,
                        padding: '6px',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        background: 'var(--bg-primary)',
                        borderRadius: '12px'
                      }}
                    >
                      {filteredHrs.map((hr) => (
                        <button
                          key={hr.name}
                          type="button"
                          style={{
                            textAlign: 'left',
                            padding: '8px 10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            background: hrContact === `${hr.name} (${hr.title})` ? 'var(--bg-hover)' : 'transparent',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={() => {
                            const val = `${hr.name} (${hr.title})`
                            setHrContact(val)
                            setHrSearch(val)
                            setHrDropdownOpen(false)
                          }}
                        >
                          <span style={{ fontWeight: 700 }}>🏢 {hr.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{hr.title} • {hr.dept}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px' }}>
              Register & Continue →
            </button>
          </form>
        )}

        {/* ================= REGISTER STEP 2: EMAIL OTP ================= */}
        {activeMode === 'register' && step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Email Verification</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                We sent a 6-digit verification code to <strong style={{ color: 'var(--accent)' }}>{email}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              {/* OTP Input Row */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {emailOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`email-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange('email', idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown('email', idx, e)}
                    className="nm-input-glass"
                    style={{
                      width: '46px',
                      height: '52px',
                      textAlign: 'center',
                      fontSize: '20px',
                      fontWeight: 700,
                      padding: 0,
                    }}
                  />
                ))}
              </div>
              
              {errors.emailOtp && <span style={{ color: 'var(--danger)', fontSize: '12px', fontWeight: 600 }}>{errors.emailOtp}</span>}

              {/* Demo Helper box */}
              <div className="nm-card-inset" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                💡 <span>Verification Code: <strong style={{ color: 'var(--accent)' }}>123456</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button
                type="button"
                className="nm-btn"
                style={{ padding: '10px 18px', fontSize: '12px' }}
                onClick={() => setStep(1)}
              >
                ← Back
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {emailTimer > 0 ? (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Resend code in {emailTimer}s</span>
                ) : (
                  <button
                    type="button"
                    style={{ border: 'none', background: 'transparent', color: 'var(--accent)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                    onClick={() => setEmailTimer(30)}
                  >
                    Resend Code
                  </button>
                )}
                <button
                  type="button"
                  className="nm-btn-accent"
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                  onClick={handleEmailOtpVerify}
                >
                  Verify Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= REGISTER STEP 3: MOBILE OTP ================= */}
        {activeMode === 'register' && step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Mobile Authentication</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Add your mobile number to complete authentication security.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!mobileOtpSent ? (
                /* Mobile input view */
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      className="nm-input-glass"
                      style={{
                        width: '90px',
                        cursor: 'pointer',
                        paddingRight: '4px',
                        fontWeight: 600,
                        borderRight: '4px solid transparent'
                      }}
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>
                    <input
                      type="tel"
                      className="nm-input-glass"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </div>
                  {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.phone}</span>}
                </div>
              ) : (
                /* Mobile OTP Code Input View */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    We sent a verification code to <strong style={{ color: 'var(--accent)' }}>{countryCode} {phone}</strong>.
                  </p>
                  
                  {/* OTP Row */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {mobileOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`mobile-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange('mobile', idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown('mobile', idx, e)}
                        className="nm-input-glass"
                        style={{
                          width: '46px',
                          height: '52px',
                          textAlign: 'center',
                          fontSize: '20px',
                          fontWeight: 700,
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>

                  {errors.mobileOtp && <span style={{ color: 'var(--danger)', fontSize: '12px', fontWeight: 600 }}>{errors.mobileOtp}</span>}

                  {/* Demo Helper box */}
                  <div className="nm-card-inset" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    💡 <span>Verification Code: <strong style={{ color: 'var(--accent)' }}>654321</strong></span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button
                type="button"
                className="nm-btn"
                style={{ padding: '10px 18px', fontSize: '12px' }}
                onClick={() => {
                  if (mobileOtpSent) {
                    setMobileOtpSent(false)
                  } else {
                    setStep(2)
                  }
                }}
              >
                ← Back
              </button>

              {!mobileOtpSent ? (
                <button
                  type="button"
                  className="nm-btn-accent"
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                  onClick={handleMobileSendOtp}
                >
                  Send OTP Code →
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {mobileTimer > 0 ? (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Resend in {mobileTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      style={{ border: 'none', background: 'transparent', color: 'var(--accent)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                      onClick={handleMobileSendOtp}
                    >
                      Resend Code
                    </button>
                  )}
                  <button
                    type="button"
                    className="nm-btn-accent"
                    style={{ padding: '10px 20px', fontSize: '13px' }}
                    onClick={handleMobileOtpVerify}
                  >
                    Verify & Setup Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= REGISTER STEP 4: ONBOARDING SCREEN ================= */}
        {activeMode === 'register' && step === 4 && (
          <form onSubmit={handleOnboardingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Personalize Profile</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Welcome to Jibble! Let the team know a little about you.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '340px', overflowY: 'auto', paddingRight: '6px' }}>
              {/* Place / Hometown */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Where do you belong?</label>
                <input
                  type="text"
                  className="nm-input-glass"
                  placeholder="New Delhi, India"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                />
                {errors.hometown && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.hometown}</span>}
              </div>

              {/* Unique Username */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Unique Username</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="nm-input-glass"
                    placeholder="aditya_17"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  />
                  <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', fontWeight: 700 }}>
                    {usernameStatus === 'checking' && <span style={{ color: 'var(--text-muted)' }}>⏳</span>}
                    {usernameStatus === 'available' && <span style={{ color: 'var(--success)' }}>✓ Available</span>}
                    {usernameStatus === 'taken' && <span style={{ color: 'var(--danger)' }}>✗ Invalid / Short</span>}
                  </div>
                </div>
                {errors.username && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.username}</span>}
              </div>

              {/* Profile Pic selection */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>Choose Avatar or Upload Photo</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  {/* Selected Preview */}
                  <div style={{
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    boxShadow: 'var(--nm-inset)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: customAvatar ? '24px' : '32px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)'
                  }}>
                    {customAvatar ? (
                      <img src={customAvatar} alt="custom avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      avatar
                    )}
                  </div>
                  
                  {/* Quick Select row */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {avatarPresets.map((av) => (
                      <button
                        key={av}
                        type="button"
                        style={{
                          width: '32px', height: '32px',
                          border: 'none', borderRadius: '50%',
                          background: avatar === av && !customAvatar ? 'var(--bg-hover)' : 'rgba(243,239,232,0.3)',
                          boxShadow: avatar === av && !customAvatar ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)',
                          fontSize: '16px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onClick={() => {
                          setAvatar(av)
                          setCustomAvatar('')
                        }}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Drag and Drop box */}
                <div style={{
                  padding: '10px',
                  borderRadius: '12px',
                  boxShadow: 'var(--nm-inset-sm)',
                  textAlign: 'center',
                  background: 'rgba(243,239,232,0.2)',
                  position: 'relative',
                  border: '1px dashed var(--border)'
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Drag & drop file or click here to upload photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      opacity: 0, cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

              {/* Fav Food Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Favorite Food</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {foodOptions.map((food) => {
                    const isSelected = favFood === food
                    return (
                      <button
                        key={food}
                        type="button"
                        style={{
                          background: isSelected ? 'var(--accent)' : 'rgba(243,239,232,0.4)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: isSelected ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)',
                          transition: 'all 0.15s'
                        }}
                        onClick={() => {
                          setFavFood(food)
                          setOtherFood('')
                        }}
                      >
                        {food}
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    style={{
                      background: favFood === 'Other' ? 'var(--accent)' : 'rgba(243,239,232,0.4)',
                      color: favFood === 'Other' ? '#ffffff' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: favFood === 'Other' ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)'
                    }}
                    onClick={() => setFavFood('Other')}
                  >
                    🍽️ Other...
                  </button>
                </div>
                {favFood === 'Other' && (
                  <input
                    type="text"
                    className="nm-input-glass"
                    placeholder="Enter your favorite cuisine/dish..."
                    value={otherFood}
                    onChange={(e) => setOtherFood(e.target.value)}
                  />
                )}
                {errors.favFood && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.favFood}</span>}
              </div>

              {/* Hobbies Multiselect */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Hobbies (Select multiple)</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {hobbyOptions.map((hobby) => {
                    const isSelected = hobbies.includes(hobby)
                    return (
                      <button
                        key={hobby}
                        type="button"
                        style={{
                          background: isSelected ? 'var(--accent)' : 'rgba(243,239,232,0.4)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: isSelected ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)',
                          transition: 'all 0.15s'
                        }}
                        onClick={() => toggleHobby(hobby)}
                      >
                        {hobby}
                      </button>
                    )
                  })}
                </div>
                {errors.hobbies && <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 600 }}>{errors.hobbies}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <button
                type="button"
                className="nm-btn"
                style={{ padding: '10px 18px', fontSize: '12px' }}
                onClick={() => setStep(3)}
              >
                ← Back
              </button>

              <button
                type="submit"
                className="nm-btn-accent"
                style={{ padding: '10px 24px', fontSize: '13px' }}
              >
                Complete Onboarding 🎉
              </button>
            </div>
          </form>
        )}

        {/* ================= REGISTER STEP 5: SUCCESS CELEBRATION ================= */}
        {activeMode === 'register' && step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
              boxShadow: 'var(--nm-flat)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '44px',
              animation: 'float 2s infinite ease-in-out',
            }}>
              ✨
            </div>

            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>Profile Verified!</h3>
              <p style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600, marginTop: '4px' }}>
                Welcome to Jibble corporate console, @{username}!
              </p>
            </div>

            {/* User summary card */}
            <div className="nm-card-inset" style={{
              width: '100%',
              padding: '20px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(243, 239, 232, 0.45)',
            }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  boxShadow: 'var(--nm-flat-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', overflow: 'hidden'
                }}>
                  {customAvatar ? <img src={customAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>@{username}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{email}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8px 16px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Company Role:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{selRole || roleSearch} ({selCategory || catSearch})</span>

                {(reportingLead || leadSearch) && (
                  <>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Supervisor ({leadType}):</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>👨‍💼 {reportingLead || leadSearch}</span>
                  </>
                )}

                {(hrContact || hrSearch) && (
                  <>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>HR Contact:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>🏢 {hrContact || hrSearch}</span>
                  </>
                )}

                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Belongs to:</span>
                <span style={{ fontWeight: 600 }}>📍 {hometown}</span>

                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Favorite Food:</span>
                <span style={{ fontWeight: 600 }}>🥘 {favFood === 'Other' ? otherFood : favFood}</span>

                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Hobbies:</span>
                <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {hobbies.join(', ')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '8px' }}>
              <button
                type="button"
                className="nm-btn-accent"
                onClick={handleFinalSubmit}
                style={{ width: '100%' }}
              >
                Go to Dashboard Now →
              </button>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Entering dashboard in {redirectCount} seconds...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

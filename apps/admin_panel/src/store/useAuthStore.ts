import { create } from 'zustand'

export interface AdminUser {
  email: string
  role: string
  category: string
  subcategory?: string
  reportingLead?: string
  leadType?: string
  hrContact?: string
  username: string
  hometown: string
  mobileNumber?: string
  address?: string
  favFood: string
  hobbies: string[]
  avatar: string
}

export function isLeadOrHead(user: AdminUser | null): boolean {
  if (!user) return false
  const role = user.role.toLowerCase()
  const cat = user.category.toLowerCase()
  const leadKeywords = ['lead', 'head', 'manager', 'director', 'cto', 'ceo', 'cpo', 'cfo', 'founder', 'dpo', 'officer', 'moderator', 'executive', 'architect']
  return leadKeywords.some((kw) => role.includes(kw) || cat.includes(kw))
}

interface RegisteredAccount {
  email: string
  password: string
  profile: AdminUser
}

interface AuthState {
  user: AdminUser | null
  registeredUsers: RegisteredAccount[]
  isAuthenticated: boolean
  isOnboarded: boolean
  emailOTPVerified: boolean
  mobileNumber: string
  mobileOTPVerified: boolean
  tempEmail: string
  tempPassword?: string // Temp storage during onboarding
  tempRole: string
  tempCategory: string
  tempSubcategory?: string
  tempReportingLead?: string
  tempLeadType?: string
  tempHrContact?: string
  
  setCredentials: (
    email: string, 
    password: string, 
    role: string, 
    category: string, 
    subcategory?: string,
    reportingLead?: string,
    leadType?: string,
    hrContact?: string
  ) => void
  verifyEmailOTP: () => void
  sendMobileOTP: (mobileNumber: string) => void
  verifyMobileOTP: () => void
  completeOnboarding: (userData: Omit<AdminUser, 'email' | 'role' | 'category' | 'subcategory' | 'reportingLead' | 'leadType' | 'hrContact'>) => void
  updateUserProfile: (updatedProfile: Partial<AdminUser>) => void
  login: (email: string, password: string) => boolean
  logout: () => void
}

// Initial registered users list containing the default administrator credentials
const defaultAdmin: RegisteredAccount = {
  email: 'admin@jibble.com',
  password: 'admin123',
  profile: {
    email: 'admin@jibble.com',
    role: 'Founder / CEO',
    category: 'Executive Team',
    reportingLead: 'Board of Directors',
    leadType: 'Executive Lead',
    hrContact: 'Priya Sharma (HR Director)',
    username: 'admin_ceo',
    hometown: 'San Francisco, USA',
    favFood: '🍕 Pizza',
    hobbies: ['💻 Coding', '🍿 Movies'],
    avatar: '🎒',
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  registeredUsers: [defaultAdmin],
  isAuthenticated: false,
  isOnboarded: false,
  emailOTPVerified: false,
  mobileNumber: '',
  mobileOTPVerified: false,
  tempEmail: '',
  tempPassword: '',
  tempRole: '',
  tempCategory: '',
  tempSubcategory: '',
  tempReportingLead: '',
  tempLeadType: '',
  tempHrContact: '',

  setCredentials: (email, password, role, category, subcategory, reportingLead, leadType, hrContact) => set({
    tempEmail: email,
    tempPassword: password,
    tempRole: role,
    tempCategory: category,
    tempSubcategory: subcategory,
    tempReportingLead: reportingLead,
    tempLeadType: leadType,
    tempHrContact: hrContact,
  }),

  verifyEmailOTP: () => set({ emailOTPVerified: true }),

  sendMobileOTP: (mobileNumber) => set({ mobileNumber }),

  verifyMobileOTP: () => set({ mobileOTPVerified: true, isAuthenticated: true }),

  completeOnboarding: (userData) => set((state) => {
    const fullUser: AdminUser = {
      email: state.tempEmail,
      role: state.tempRole,
      category: state.tempCategory,
      subcategory: state.tempSubcategory,
      reportingLead: state.tempReportingLead,
      leadType: state.tempLeadType,
      hrContact: state.tempHrContact,
      ...userData
    }
    const newAccount: RegisteredAccount = {
      email: state.tempEmail,
      password: state.tempPassword || 'default_pass',
      profile: fullUser
    }
    return {
      user: fullUser,
      isOnboarded: true,
      registeredUsers: [...state.registeredUsers, newAccount]
    }
  }),

  login: (email, password) => {
    const match = get().registeredUsers.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    )
    if (match) {
      set({
        user: match.profile,
        isAuthenticated: true,
        isOnboarded: true,
        emailOTPVerified: true,
        mobileOTPVerified: true,
        tempEmail: match.profile.email,
        tempRole: match.profile.role,
        tempCategory: match.profile.category,
        tempSubcategory: match.profile.subcategory,
        tempReportingLead: match.profile.reportingLead,
        tempLeadType: match.profile.leadType,
        tempHrContact: match.profile.hrContact
      })
      return true
    }
    return false
  },

  updateUserProfile: (updatedProfile) => set((state) => {
    if (!state.user) return state
    const newProfile = { ...state.user, ...updatedProfile }
    const newRegisteredUsers = state.registeredUsers.map((acc) =>
      acc.email.toLowerCase() === state.user?.email.toLowerCase()
        ? { ...acc, profile: newProfile }
        : acc
    )
    return { user: newProfile, registeredUsers: newRegisteredUsers }
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    isOnboarded: false,
    emailOTPVerified: false,
    mobileNumber: '',
    mobileOTPVerified: false,
    tempEmail: '',
    tempPassword: '',
    tempRole: '',
    tempCategory: '',
    tempSubcategory: '',
    tempReportingLead: '',
    tempLeadType: '',
    tempHrContact: '',
  })
}))

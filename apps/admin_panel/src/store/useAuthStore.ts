import { create } from 'zustand'

export interface AdminUser {
  email: string
  role: string
  category: string
  subcategory?: string
  username: string
  hometown: string
  favFood: string
  hobbies: string[]
  avatar: string
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
  
  setCredentials: (email: string, password: string, role: string, category: string, subcategory?: string) => void
  verifyEmailOTP: () => void
  sendMobileOTP: (mobileNumber: string) => void
  verifyMobileOTP: () => void
  completeOnboarding: (userData: Omit<AdminUser, 'email' | 'role' | 'category' | 'subcategory'>) => void
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

  setCredentials: (email, password, role, category, subcategory) => set({
    tempEmail: email,
    tempPassword: password,
    tempRole: role,
    tempCategory: category,
    tempSubcategory: subcategory,
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
    const { registeredUsers } = get()
    const match = registeredUsers.find(
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
        tempSubcategory: match.profile.subcategory
      })
      return true
    }
    return false
  },

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
  })
}))

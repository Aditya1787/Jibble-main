/**
 * useAuthStore.ts
 *
 * Authentication store for Jibble Admin Panel.
 * Uses Supabase Auth for real sign-in/sign-up when env vars are set,
 * with a graceful fallback to the mock local account system during development
 * (before Supabase credentials are configured).
 */

import { create } from 'zustand'
import { allOrgEmployees } from '../data/orgData'
import { supabase, signInWithEmail, signUpWithEmail, signOut as supabaseSignOut, getAccessToken } from '../api/supabaseClient'
import { adminApi } from '../api/adminApi'

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
  // Supabase fields (populated after real auth)
  supabaseId?: string
  dbEmployeeId?: string
}

export function isLeadOrHead(user: AdminUser | null): boolean {
  if (!user) return false
  const role = user.role.toLowerCase()
  const cat = user.category.toLowerCase()
  const leadKeywords = [
    'lead', 'head', 'manager', 'director', 'cto', 'ceo', 'cpo', 'cfo',
    'founder', 'dpo', 'officer', 'moderator', 'executive', 'architect',
  ]
  return leadKeywords.some((kw) => role.includes(kw) || cat.includes(kw))
}

interface RegisteredAccount {
  email: string
  password: string
  profile: AdminUser
}

// ── Supabase available check ──────────────────────────────────────────────────
const SUPABASE_CONFIGURED =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

const API_CONFIGURED = Boolean(import.meta.env.VITE_API_BASE_URL)

interface AuthState {
  user: AdminUser | null
  registeredUsers: RegisteredAccount[]
  isAuthenticated: boolean
  isOnboarded: boolean
  isLoading: boolean
  emailOTPVerified: boolean
  mobileNumber: string
  mobileOTPVerified: boolean
  tempEmail: string
  tempPassword?: string
  tempRole: string
  tempCategory: string
  tempSubcategory?: string
  tempReportingLead?: string
  tempLeadType?: string
  tempHrContact?: string

  // Actions
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
  completeOnboarding: (
    userData: Omit<
      AdminUser,
      'email' | 'role' | 'category' | 'subcategory' | 'reportingLead' | 'leadType' | 'hrContact'
    >
  ) => void
  updateUserProfile: (updatedProfile: Partial<AdminUser>) => void

  // Real Supabase auth
  loginWithSupabase: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>

  // Fallback mock login (used when Supabase not configured)
  login: (email: string, password: string) => boolean

  // Load profile from backend after auth
  loadProfileFromBackend: () => Promise<void>
  fetchRegisteredUsers: () => Promise<void>

  // Initialize auth state from Supabase session on app start
  initAuth: () => Promise<void>
}

// ── Registered accounts (starts empty until users register) ──────────────────
const defaultAccounts: RegisteredAccount[] = []

const loadStoredUsers = (): RegisteredAccount[] => {
  try {
    const raw = localStorage.getItem('jibble_registered_users')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const saveStoredUsers = (users: RegisteredAccount[]) => {
  try {
    localStorage.setItem('jibble_registered_users', JSON.stringify(users))
  } catch { /* ignore */ }
}

const loadActiveUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem('jibble_active_user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const saveActiveUser = (user: AdminUser | null) => {
  try {
    if (user) {
      localStorage.setItem('jibble_active_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('jibble_active_user')
    }
  } catch { /* ignore */ }
}

const initialActiveUser = loadActiveUser()

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialActiveUser,
  registeredUsers: loadStoredUsers(),
  isAuthenticated: Boolean(initialActiveUser),
  isOnboarded: Boolean(initialActiveUser),
  isLoading: false,
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

  // ── Onboarding helpers ─────────────────────────────────────────────────────
  setCredentials: (email, password, role, category, subcategory, reportingLead, leadType, hrContact) =>
    set({
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

  completeOnboarding: async (userData) => {
    const state = get()
    const fullUser: AdminUser = {
      email: state.tempEmail,
      role: state.tempRole,
      category: state.tempCategory,
      subcategory: state.tempSubcategory,
      reportingLead: state.tempReportingLead,
      leadType: state.tempLeadType,
      hrContact: state.tempHrContact,
      mobileNumber: state.mobileNumber || userData.mobileNumber,
      ...userData,
    }

    // Register user in Supabase Auth if configured
    if (SUPABASE_CONFIGURED && state.tempEmail && state.tempPassword) {
      try {
        const sbData = await signUpWithEmail(state.tempEmail, state.tempPassword, {
          username: fullUser.username,
          role: fullUser.role,
          category: fullUser.category,
        })
        if (sbData?.user?.id) {
          fullUser.supabaseId = sbData.user.id
        }
      } catch (sbErr: any) {
        console.warn('Supabase Auth signUp warning (account may already exist):', sbErr.message)
      }
    }

    // Register user in Supabase database table (public.employees)
    if (API_CONFIGURED && state.tempEmail) {
      try {
        const emp = await adminApi.auth.register({
          authUserId: fullUser.supabaseId,
          username: fullUser.username,
          fullName: fullUser.username,
          email: fullUser.email,
          role: fullUser.role,
          category: fullUser.category,
          subcategory: fullUser.subcategory ?? null,
          avatarEmoji: fullUser.avatar || '👤',
          hometown: fullUser.hometown ?? null,
          mobileNumber: fullUser.mobileNumber ?? null,
          favFood: fullUser.favFood ?? null,
          hobbies: fullUser.hobbies ?? [],
        })
        if (emp?.id) fullUser.dbEmployeeId = emp.id
      } catch (err: any) {
        console.warn('Backend user registration sync warning:', err.message)
      }
    }

    const newAccount: RegisteredAccount = {
      email: state.tempEmail,
      password: state.tempPassword || 'default_pass',
      profile: fullUser,
    }

    const updatedRegisteredUsers = [
      ...state.registeredUsers.filter((a) => a.email.toLowerCase() !== state.tempEmail.toLowerCase()),
      newAccount,
    ]

    saveStoredUsers(updatedRegisteredUsers)
    saveActiveUser(fullUser)

    set({
      user: fullUser,
      isAuthenticated: true,
      isOnboarded: true,
      registeredUsers: updatedRegisteredUsers,
    })
  },

  updateUserProfile: (updatedProfile) =>
    set((state) => {
      if (!state.user) return state
      const newProfile = { ...state.user, ...updatedProfile }
      saveActiveUser(newProfile)
      const newRegisteredUsers = state.registeredUsers.map((acc) =>
        acc.email.toLowerCase() === state.user?.email.toLowerCase()
          ? { ...acc, profile: newProfile }
          : acc
      )
      return { user: newProfile, registeredUsers: newRegisteredUsers }
    }),

  // ── Real Supabase Login ────────────────────────────────────────────────────
  loginWithSupabase: async (email, password) => {
    set({ isLoading: true })
    try {
      const { user: sbUser } = await signInWithEmail(email, password)
      if (!sbUser) {
        set({ isLoading: false })
        return false
      }

      // Try to load employee profile from backend
      let employeeProfile: AdminUser | null = null
      if (API_CONFIGURED) {
        try {
          const dto = await adminApi.profile.getMe()
          employeeProfile = {
            email: dto.email,
            role: dto.role,
            category: dto.category,
            subcategory: dto.subcategory ?? undefined,
            reportingLead: dto.reportsToName ?? 'Board of Directors',
            leadType: dto.role.includes('Lead') || dto.role.includes('Chief') ? 'Department Lead' : 'Team Contributor',
            hrContact: 'HR Team',
            username: dto.username,
            hometown: dto.hometown ?? 'India',
            mobileNumber: dto.mobileNumber ?? undefined,
            address: dto.address ?? undefined,
            favFood: dto.favFood ?? '🍕 Pizza & Chai',
            hobbies: dto.hobbies ?? [],
            avatar: dto.avatarEmoji,
            supabaseId: sbUser.id,
            dbEmployeeId: dto.id,
          }
        } catch {
          // Backend profile not found — use mock fallback
          const match = defaultAccounts.find(
            (a) => a.email.toLowerCase() === email.toLowerCase()
          )
          if (match) employeeProfile = { ...match.profile, supabaseId: sbUser.id }
        }
      } else {
        const match = defaultAccounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        )
        if (match) employeeProfile = { ...match.profile, supabaseId: sbUser.id }
      }

      if (!employeeProfile) {
        // Create a basic profile from Supabase user metadata
        employeeProfile = {
          email: sbUser.email ?? email,
          role: (sbUser.user_metadata?.role as string) ?? 'Employee',
          category: (sbUser.user_metadata?.category as string) ?? 'General',
          username: email.split('@')[0],
          hometown: 'India',
          favFood: '🍕 Pizza & Chai',
          hobbies: ['💻 Tech'],
          avatar: '👤',
          supabaseId: sbUser.id,
        }
      }

      set({
        user: employeeProfile,
        isAuthenticated: true,
        isOnboarded: true,
        emailOTPVerified: true,
        mobileOTPVerified: true,
        isLoading: false,
        tempEmail: employeeProfile.email,
        tempRole: employeeProfile.role,
        tempCategory: employeeProfile.category,
      })
      return true
    } catch (err) {
      console.error('Supabase login error:', err)
      set({ isLoading: false })
      return false
    }
  },

  // ── Load Profile from Backend ─────────────────────────────────────────────
  loadProfileFromBackend: async () => {
    if (!API_CONFIGURED) return
    try {
      const dto = await adminApi.profile.getMe()
      const current = get().user
      if (!current) return
      const newUser: AdminUser = {
        ...current,
        email: dto.email,
        role: dto.role,
        category: dto.category,
        subcategory: dto.subcategory ?? undefined,
        username: dto.username,
        hometown: dto.hometown ?? current.hometown,
        mobileNumber: dto.mobileNumber ?? current.mobileNumber,
        address: dto.address ?? current.address,
        favFood: dto.favFood ?? current.favFood,
        hobbies: dto.hobbies ?? current.hobbies,
        avatar: dto.avatarEmoji,
        dbEmployeeId: dto.id,
      }
      saveActiveUser(newUser)
      set({ user: newUser })
    } catch {
      /* silently fail if backend not running */
    }
  },

  // ── Fetch all registered users from Supabase backend ────────────────────────
  fetchRegisteredUsers: async () => {
    if (!API_CONFIGURED) return
    const token = await getAccessToken()
    if (!token) {
      const local = loadStoredUsers()
      if (local.length > 0) set({ registeredUsers: local })
      return
    }
    try {
      const list = await adminApi.employees.list()
      if (Array.isArray(list)) {
        const mappedAccounts: RegisteredAccount[] = list.map((emp) => ({
          email: emp.email,
          password: 'default_pass',
          profile: {
            email: emp.email,
            role: emp.role,
            category: emp.category,
            subcategory: emp.subcategory ?? undefined,
            reportingLead: emp.reportsToName ?? undefined,
            username: emp.username,
            hometown: emp.hometown ?? 'India',
            mobileNumber: emp.mobileNumber ?? undefined,
            address: emp.address ?? undefined,
            favFood: emp.favFood ?? '🍕 Pizza & Chai',
            hobbies: emp.hobbies ?? [],
            avatar: emp.avatarEmoji || '👤',
            dbEmployeeId: emp.id,
          },
        }))
        saveStoredUsers(mappedAccounts)
        set({ registeredUsers: mappedAccounts })
      }
    } catch (e: any) {
      const local = loadStoredUsers()
      if (local.length > 0) set({ registeredUsers: local })
    }
  },

  // ── Initialize auth from existing Supabase session ────────────────────────
  initAuth: async () => {
    set({ isLoading: true })
    try {
      if (SUPABASE_CONFIGURED) {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {
          const sbUser = data.session.user
          let employeeProfile: AdminUser | null = null
          if (API_CONFIGURED) {
            try {
              const dto = await adminApi.profile.getMe()
              employeeProfile = {
                email: dto.email,
                role: dto.role,
                category: dto.category,
                subcategory: dto.subcategory ?? undefined,
                reportingLead: dto.reportsToName ?? undefined,
                username: dto.username,
                hometown: dto.hometown ?? 'India',
                mobileNumber: dto.mobileNumber ?? undefined,
                address: dto.address ?? undefined,
                favFood: dto.favFood ?? '🍕 Pizza & Chai',
                hobbies: dto.hobbies ?? [],
                avatar: dto.avatarEmoji,
                supabaseId: sbUser.id,
                dbEmployeeId: dto.id,
              }
            } catch { /* backend not running */ }
          }
          if (employeeProfile) {
            saveActiveUser(employeeProfile)
            set({ user: employeeProfile, isAuthenticated: true, isOnboarded: true })
          }
        }
      }
      // If active user is present in local storage, keep user authenticated
      const savedActive = loadActiveUser()
      if (savedActive) {
        set({ user: savedActive, isAuthenticated: true, isOnboarded: true })
      }
    } finally {
      set({ isLoading: false })
    }
  },

  // ── Mock & Email Fallback Login ─────────────────────────────────────────────
  login: (email, password) => {
    const normEmail = email.trim().toLowerCase()
    const match = get().registeredUsers.find(
      (acc) =>
        acc.email.toLowerCase() === normEmail &&
        (acc.password === password || acc.password === 'default_pass' || Boolean(acc.profile))
    )
    if (match) {
      saveActiveUser(match.profile)
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
        tempHrContact: match.profile.hrContact,
      })
      return true
    }
    return false
  },

  // ── Logout ─────────────────────────────────────────────────────────────────
  logout: async () => {
    const currentUser = get().user
    if (currentUser?.email) {
      // Remove deleted/logged-out account from local registered users cache
      const updatedUsers = get().registeredUsers.filter(
        (acc) => acc.email.toLowerCase() !== currentUser.email.toLowerCase()
      )
      saveStoredUsers(updatedUsers)
      set({ registeredUsers: updatedUsers })
    }
    saveActiveUser(null)
    if (SUPABASE_CONFIGURED) {
      try { await supabaseSignOut() } catch { /* ignore */ }
    }
    set({
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
  },
}))

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

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isOnboarded: boolean
  emailOTPVerified: boolean
  mobileNumber: string
  mobileOTPVerified: boolean
  tempEmail: string
  tempRole: string
  tempCategory: string
  tempSubcategory?: string
  
  setCredentials: (email: string, role: string, category: string, subcategory?: string) => void
  verifyEmailOTP: () => void
  sendMobileOTP: (mobileNumber: string) => void
  verifyMobileOTP: () => void
  completeOnboarding: (userData: Omit<AdminUser, 'email' | 'role' | 'category' | 'subcategory'>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  emailOTPVerified: false,
  mobileNumber: '',
  mobileOTPVerified: false,
  tempEmail: '',
  tempRole: '',
  tempCategory: '',
  tempSubcategory: '',

  setCredentials: (email, role, category, subcategory) => set({
    tempEmail: email,
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
    };
    return {
      user: fullUser,
      isOnboarded: true,
    }
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    isOnboarded: false,
    emailOTPVerified: false,
    mobileNumber: '',
    mobileOTPVerified: false,
    tempEmail: '',
    tempRole: '',
    tempCategory: '',
    tempSubcategory: '',
  })
}))

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { authService, UserProfile } from '@/lib/auth-service'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string, confirmPassword: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: { firstName: string; lastName: string; phone: string }) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        try {
          const profile = await authService.getUserProfile(firebaseUser.uid)
          setUserProfile(profile)
        } catch (error) {
          console.error('Failed to load user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string, confirmPassword: string) => {
    try {
      setLoading(true)
      await authService.signUp(email, password, firstName, lastName, phone, confirmPassword)
      toast.success('Account created successfully!')
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      await authService.signIn(email, password)
      toast.success('Welcome back!')
    } catch (error: any) {
      const errorMessage = authService.getErrorMessage(error)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      toast.success('Signed out successfully')
    } catch (error: any) {
      const errorMessage = authService.getErrorMessage(error)
      toast.error(errorMessage)
    }
  }

  const updateProfile = async (updates: { firstName: string; lastName: string; phone: string }) => {
    if (!user || !userProfile) {
      toast.error('No user logged in')
      return
    }

    try {
      await authService.updateUserProfile(user.uid, updates)
      
      // Refresh user profile
      const updatedProfile = await authService.getUserProfile(user.uid)
      setUserProfile(updatedProfile)
      
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error('Failed to update profile')
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

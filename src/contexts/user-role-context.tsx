'use client'

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type UserRole = 'form-teacher' | 'year-head'

interface UserRoleContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
}

const UserRoleContext = createContext<UserRoleContextValue | undefined>(undefined)

const STORAGE_KEY = 'user-role'
const DEFAULT_ROLE: UserRole = 'form-teacher'

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(DEFAULT_ROLE)
  const [isClient, setIsClient] = useState(false)

  // Load role from localStorage on mount
  useEffect(() => {
    setIsClient(true)
    try {
      const storedRole = localStorage.getItem(STORAGE_KEY) as UserRole | null
      if (storedRole === 'form-teacher' || storedRole === 'year-head') {
        setRoleState(storedRole)
      }
    } catch (error) {
      console.error('Failed to load user role from localStorage:', error)
    }
  }, [])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    if (isClient) {
      try {
        localStorage.setItem(STORAGE_KEY, newRole)
      } catch (error) {
        console.error('Failed to save user role to localStorage:', error)
      }
    }
  }

  const value: UserRoleContextValue = {
    role,
    setRole,
  }

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>
}

export function useUserRole() {
  const context = useContext(UserRoleContext)
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider')
  }
  return context
}

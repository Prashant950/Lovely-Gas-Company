import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../services/api'
import { tokenStore } from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, if a token exists, restore the session.
  useEffect(() => {
    let active = true
    async function bootstrap() {
      if (!tokenStore.get()) {
        setLoading(false)
        return
      }
      try {
        const me = await authApi.me()
        if (active) setUser(me)
      } catch {
        tokenStore.clear()
      } finally {
        if (active) setLoading(false)
      }
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await authApi.login({ email, password })
    tokenStore.set(token)
    setUser(u)
    return u
  }, [])

  const setSession = useCallback((token, u) => {
    tokenStore.set(token)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    login,
    setSession,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

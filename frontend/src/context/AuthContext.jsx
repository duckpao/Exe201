import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    return data.user
  }, [])

  const loginWithGoogle = useCallback(async (idToken) => {
    const data = await authService.loginWithGoogle(idToken)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const data = await authService.me()
    setUser(data.user)
    return data.user
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider')
  return context
}

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { logout as logoutRequest, me } from '../services/authService.js'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    me()
      .then((data) => {
        if (cancelled) return
        setAdmin(data.user?.role === 'admin' ? data.user : null)
      })
      .catch(() => {
        if (!cancelled) setAdmin(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest().catch(() => {})
    setAdmin(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ admin, loading, setAdmin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return context
}

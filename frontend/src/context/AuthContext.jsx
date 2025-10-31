import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    // backend response: { success, message, data: { id,name,email,role,token } }
    const { data } = res.data || {}
    const token = data?.token
    const user = token ? { id: data.id, name: data.name, email: data.email, role: data.role } : null
    if (!token || !user) throw new Error('Invalid login response')
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const signup = async (payload) => {
    // backend endpoint is /api/auth/register
    const res = await api.post('/auth/register', payload)
    return res.data
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch (_) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updatePassword = async ({ newPassword }) => {
    // backend expects PUT /api/auth/password with { password }
    return api.put('/auth/password', { password: newPassword })
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

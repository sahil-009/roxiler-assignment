import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateEmail, validatePassword, validateName } from '../utils/validators'

const PrimaryButton = ({ children, ...props }) => (
  <button {...props} className={`w-full bg-primary text-white py-2.5 rounded-md disabled:opacity-50 ${props.className || ''}`}>{children}</button>
)

export default function AuthRole() {
  const { role } = useParams()
  const [searchParams] = useSearchParams()
  const modeParam = searchParams.get('mode')
  const [mode, setMode] = useState(modeParam === 'signup' ? 'signup' : 'login')
  const navigate = useNavigate()
  const { login, signup } = useAuth()

  const titles = useMemo(() => ({
    login: `Login as ${role === 'owner' ? 'Store Owner' : role === 'admin' ? 'Admin' : 'User'}`,
    signup: `Signup as ${role === 'owner' ? 'Store Owner' : role === 'admin' ? 'Admin' : 'User'}`,
  }), [role])

  // Common fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [storeName, setStoreName] = useState('')
  const [error, setError] = useState(null)
  const [welcome, setWelcome] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    if (!validateEmail(email)) return setError('Invalid email')
    if (!validatePassword(password)) return setError('Invalid password format')

    try {
      const user = await login(email, password)
      setWelcome(`Welcome back, ${user.role === 'admin' ? 'Admin' : user.role === 'owner' ? 'Store Owner' : 'User'}!`)
      setTimeout(() => {
        if (user.role === 'admin') navigate('/admin/dashboard')
        else if (user.role === 'owner') navigate('/owner/dashboard')
        else navigate('/user/home')
      }, 800)
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null)
    if (!validateName(name)) return setError('Name must be between 20 and 60 characters')
    if (!validateEmail(email)) return setError('Invalid email')
    if (!validatePassword(password)) return setError('Password must be 8-16 chars, include uppercase and special char')

    try {
      const payload = { name, email, password, role }
      if (role === 'user') payload.address = address
      if (role === 'owner') payload.storeName = storeName
      await signup(payload)
      navigate(`/auth/${role}/login`)
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed')
    }
  }

  const isSignup = mode === 'signup'

  return (
    <div className="min-h-[780px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-soft bg-white">
      <div className="hidden lg:flex bg-gradient-to-br from-primary to-blue-600 p-10 text-white flex-col justify-center">
        <div className="max-w-md">
          <div className="text-3xl font-semibold">StoreManager</div>
          <p className="mt-4 text-blue-100">Manage stores, users, and ratings with a clean and modern dashboard.</p>
          <div className="mt-10 h-48 rounded-xl bg-white/10 border border-white/20 grid place-items-center text-blue-100">Illustration</div>
        </div>
      </div>
      <div className="p-8 lg:p-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{isSignup ? titles.signup : titles.login}</h2>
            <Link to="/auth/role" className="text-primary text-sm hover:underline">Change role</Link>
          </div>

          {welcome && (
            <div className="mt-4 p-3 rounded-md bg-blue-50 text-blue-700 border border-blue-100">{welcome}</div>
          )}

          {!isSignup && (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-600">Email</label>
                <input className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Password</label>
                <input type="password" className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <PrimaryButton type="submit">Login</PrimaryButton>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div>No account? <button type="button" onClick={() => setMode('signup')} className="text-primary hover:underline">Create one</button></div>
                <div className="text-slate-500">Forgot password? Change it from your profile after login.</div>
              </div>
            </form>
          )}

          {isSignup && (
            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <input className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              {role === 'user' && (
                <div>
                  <label className="text-sm text-slate-600">Address</label>
                  <textarea className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              )}
              {role === 'owner' && (
                <div>
                  <label className="text-sm text-slate-600">Store Name</label>
                  <input className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
              )}
              <div>
                <label className="text-sm text-slate-600">Email</label>
                <input className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Password</label>
                <input type="password" className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <PrimaryButton type="submit">Create Account</PrimaryButton>
              <div className="text-sm text-slate-600">Already have an account? <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline">Login instead</button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}


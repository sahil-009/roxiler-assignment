import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateEmail, validatePassword } from '../utils/validators'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!validateEmail(email)) return setError('Invalid email')
    if (!validatePassword(password)) return setError('Invalid password format')

    try {
      const user = await login(email, password)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'owner') navigate('/owner')
      else navigate('/stores')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-[780px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-soft bg-white">
      <div className="hidden lg:flex bg-gradient-to-br from-primary to-blue-600 p-10 text-white flex-col justify-center">
        <div className="max-w-md">
          <div className="text-3xl font-semibold">StoreManager</div>
          <p className="mt-4 text-blue-100">Manage stores, users, and ratings with a clean and modern dashboard. Fast. Minimal. Powerful.</p>
          <div className="mt-10 h-48 rounded-xl bg-white/10 border border-white/20 grid place-items-center text-blue-100">Illustration</div>
        </div>
      </div>
      <div className="p-8 lg:p-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold">Login</h2>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-600">Email</label>
              <input className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Password</label>
              <input type="password" className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button className="w-full bg-primary text-white py-2.5 rounded-md" type="submit">Login</button>
          </form>
          <div className="mt-4 text-sm text-slate-600">No account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></div>
        </div>
      </div>
    </div>
  )
}

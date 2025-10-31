import React, { useState } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Stores from './pages/Stores'
import AdminDashboard from './pages/AdminDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import { useAuth } from './context/AuthContext'
import AdminLayout from './components/AdminLayout'
import AdminUsers from './pages/AdminUsers'
import AdminStores from './pages/AdminStores'
import AdminUserDetails from './pages/AdminUserDetails'
import RoleSelect from './pages/RoleSelect'
import AuthRole from './pages/AuthRole'
import ConfirmModal from './components/ConfirmModal'
import NotFound from './pages/NotFound'
import UserProfile from './pages/UserProfile'
import OwnerProfile from './pages/OwnerProfile'
import MyRatings from './pages/MyRatings'

export default function App() {
  const { user, logout } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogoutClick = () => setConfirmOpen(true)
  const handleConfirmLogout = async () => {
    setConfirmOpen(false)
    await logout()
    navigate('/auth/role')
  }

  return (
    <div className="app-root">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link to="/stores" className="text-xl font-semibold text-primary">StoreManager</Link>
          <nav className="flex items-center gap-4 text-slate-700">
            {!user && <Link to="/auth/role" className="hover:text-primary">Login</Link>}
            {!user && <Link to="/auth/role?mode=signup" className="hover:text-primary">Sign up</Link>}
            {user && user.role === 'admin' && <Link to="/admin/dashboard" className="hover:text-primary">Admin</Link>}
            {user && user.role === 'owner' && <Link to="/owner/dashboard" className="hover:text-primary">Owner</Link>}
            {user && user.role === 'user' && <Link to="/user/home" className="hover:text-primary">Home</Link>}
            {user && <button onClick={handleLogoutClick} className="text-white bg-primary px-3 py-1.5 rounded-md">Logout</button>}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-8">
        <Routes>
          {/* Legacy auth routes fallback */}
          <Route path="/login" element={<Navigate to="/auth/role" />} />
          <Route path="/signup" element={<Navigate to="/auth/role?mode=signup" />} />

          {/* Public pages */}
          <Route path="/stores" element={<Stores />} />
          <Route path="/auth/role" element={<RoleSelect />} />
          <Route path="/auth/:role/login" element={<AuthRole />} />
          <Route path="/auth/:role/signup" element={<AuthRole />} />

          {/* Admin */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <AdminLayout><AdminDashboard /></AdminLayout> : <Navigate to="/auth/role" />} />
          <Route path="/admin/users" element={user && user.role === 'admin' ? <AdminLayout><AdminUsers /></AdminLayout> : <Navigate to="/auth/role" />} />
          <Route path="/admin/stores" element={user && user.role === 'admin' ? <AdminLayout><AdminStores /></AdminLayout> : <Navigate to="/auth/role" />} />
          <Route path="/admin/users/:id" element={user && user.role === 'admin' ? <AdminLayout><AdminUserDetails /></AdminLayout> : <Navigate to="/auth/role" />} />

          {/* Owner */}
          <Route path="/owner" element={<Navigate to="/owner/dashboard" />} />
          <Route path="/owner/dashboard" element={user && (user.role === 'owner' || user.role === 'admin') ? <OwnerDashboard /> : <Navigate to="/auth/role" />} />
          <Route path="/owner/profile" element={user && (user.role === 'owner' || user.role === 'admin') ? <OwnerProfile /> : <Navigate to="/auth/role" />} />

          {/* User */}
          <Route path="/user/home" element={<Stores />} />
          <Route path="/user/ratings" element={user ? <MyRatings /> : <Navigate to="/auth/role" />} />
          <Route path="/user/profile" element={user ? <UserProfile /> : <Navigate to="/auth/role" />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

          <Route path="/" element={<Navigate to="/stores" />} />
        </Routes>
      </main>

      <footer className="footer">© Roxiler</footer>

      <ConfirmModal
        open={confirmOpen}
        title="Logout?"
        description="You will be signed out of your session."
        confirmText="Logout"
        cancelText="Cancel"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  )
}

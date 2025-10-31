import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ChartMini from '../components/ChartMini'

export default function AdminDashboard(){
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [q, setQ] = useState('')

  const fetch = async () => {
    try{
      const s = await api.get('/admin/dashboard')
      setStats(s.data?.data || null)
    }catch(e){ console.warn(e) }

    try{
      const u = await api.get('/admin/users')
      const st = await api.get('/admin/stores')
      setUsers(u.data?.data || [])
      setStores(st.data?.data || [])
    }catch(e){ console.warn(e) }
  }

  useEffect(()=>{ fetch() },[])

  const filter = (items) => items.filter(it =>
    it.name?.toLowerCase().includes(q.toLowerCase()) ||
    it.email?.toLowerCase().includes(q.toLowerCase()) ||
    it.address?.toLowerCase().includes(q.toLowerCase()) ||
    (it.role && it.role.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Welcome, Admin</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-slate-500">Total Users</div>
          <div className="text-3xl font-semibold mt-1">{stats?.totalUsers ?? '—'}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-slate-500">Total Stores</div>
          <div className="text-3xl font-semibold mt-1">{stats?.totalStores ?? '—'}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-slate-500">Active Ratings</div>
          <div className="text-3xl font-semibold mt-1">{stats?.totalRatings ?? '—'}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="text-slate-700 font-medium mb-3">System Overview</div>
        <ChartMini />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Stores</h3>
          <input className="w-72 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Filter by name/email/address/role" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-slate-500 text-sm">
                <th className="py-2 border-b">Name</th>
                <th className="py-2 border-b">Email</th>
                <th className="py-2 border-b">Address</th>
                <th className="py-2 border-b">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filter(stores).map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-2 border-b">{s.name}</td>
                  <td className="py-2 border-b">{s.email}</td>
                  <td className="py-2 border-b">{s.address}</td>
                  <td className="py-2 border-b">{s.averageRating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-slate-500 text-sm">
                <th className="py-2 border-b">Name</th>
                <th className="py-2 border-b">Email</th>
                <th className="py-2 border-b">Address</th>
                <th className="py-2 border-b">Role</th>
              </tr>
            </thead>
            <tbody>
              {filter(users).map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-2 border-b">{u.name}</td>
                  <td className="py-2 border-b">{u.email}</td>
                  <td className="py-2 border-b">{u.address}</td>
                  <td className="py-2 border-b">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

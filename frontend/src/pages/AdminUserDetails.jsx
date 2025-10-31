import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

export default function AdminUserDetails(){
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ (async()=>{
    setLoading(true)
    try{ const res = await api.get(`/admin/users/${id}`); setUser(res.data?.data || null) }catch(e){ /* noop */ } finally { setLoading(false) }
  })() },[id])

  if (loading) return <div className="text-slate-500">Loading...</div>

  if (!user) return <div className="text-slate-500">User not found</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center text-primary text-xl font-semibold">{user.name?.[0] || 'U'}</div>
        <div className="mt-4">
          <div className="text-xl font-semibold">{user.name}</div>
          <div className="text-slate-500">{user.role}</div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <div className="text-slate-700 font-medium mb-4">User Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-slate-500 text-sm">Email</div>
              <div>{user.email}</div>
            </div>
            <div>
              <div className="text-slate-500 text-sm">Location</div>
              <div>{user.address || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500 text-sm">Registered</div>
              <div>{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {user.ownerInfo && (
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-slate-700 font-medium mb-4">Owner Insights</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-slate-500 text-sm">Store</div>
                <div>{user.ownerInfo.storeName}</div>
              </div>
              <div>
                <div className="text-slate-500 text-sm">Average Rating</div>
                <div className="text-xl font-semibold">{Number(user.ownerInfo.averageRating || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-soft">
          <div className="text-slate-700 font-medium mb-4">Store Review Interactions</div>
          <div className="h-40 rounded-lg bg-gradient-to-r from-blue-50 to-white border border-dashed border-blue-200 grid place-items-center text-slate-400">Activity Placeholder</div>
        </div>
      </div>
    </div>
  )
}



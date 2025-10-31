import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { validatePassword } from '../utils/validators'

export default function OwnerProfile(){
  const { user, updatePassword } = useAuth()
  const [store, setStore] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(()=>{ (async()=>{
    try{ const res = await api.get('/owner/dashboard'); setStore(res.data?.data?.store || null) }catch(e){ /* noop */ }
  })() },[])

  const onChangePassword = async (e) => {
    e.preventDefault()
    setErr(''); setMsg('')
    if (!validatePassword(newPassword)) return setErr('Password must be 8-16 chars with uppercase and special char')
    setSaving(true)
    try{
      await updatePassword({ newPassword })
      setMsg('Password updated successfully')
      setNewPassword('')
    }catch(e){ setErr(e?.response?.data?.message || 'Failed to update password') }
    finally{ setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="text-xl font-semibold">Owner Profile</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500">Name</div>
            <div>{user?.name}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Email</div>
            <div>{user?.email}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-slate-500">Store</div>
            <div>{store?.name || '—'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="text-lg font-medium mb-3">Change Password</div>
        <form onSubmit={onChangePassword} className="space-y-3 max-w-md">
          <input type="password" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          {err && <div className="text-sm text-red-600">{err}</div>}
          {msg && <div className="text-sm text-green-600">{msg}</div>}
          <button disabled={saving} className="bg-primary text-white px-4 py-2 rounded-md">Update Password</button>
        </form>
      </div>
    </div>
  )
}




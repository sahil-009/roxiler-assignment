import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { validateEmail, validateName, validatePassword } from '../utils/validators'

export default function AdminUsers(){
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try{ const res = await api.get('/admin/users'); setUsers(res.data?.data || []) }catch(e){ /* noop */ }
  }

  useEffect(()=>{ (async()=>{ await load() })() },[])

  const filtered = users.filter(u =>
    (u.name||'').toLowerCase().includes(q.toLowerCase()) ||
    (u.email||'').toLowerCase().includes(q.toLowerCase()) ||
    (u.role||'').toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <button onClick={()=>setAddOpen(true)} className="bg-primary text-white px-4 py-2 rounded-md shadow-soft">Add New User</button>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-soft flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, email, role" className="w-full md:w-96 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="bg-white rounded-xl p-4 shadow-soft overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-slate-500 text-sm">
              <th className="py-2 border-b">Name</th>
              <th className="py-2 border-b">Email</th>
              <th className="py-2 border-b">Role</th>
              <th className="py-2 border-b">Status</th>
              <th className="py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
              {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-2 border-b"><Link className="text-primary hover:underline" to={`/admin/users/${u.id}`}>{u.name}</Link></td>
                <td className="py-2 border-b">{u.email}</td>
                <td className="py-2 border-b">{u.role}</td>
                <td className="py-2 border-b"><span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">Active</span></td>
                <td className="py-2 border-b">
                  <div className="flex gap-2">
                    <button onClick={async()=>{ try{ const r=await api.get(`/admin/users/${u.id}`); setDetail(r.data?.data||null) }catch(e){ /* noop */ } }} className="px-3 py-1 rounded-md border text-slate-600 hover:bg-slate-50">View</button>
                    <button className="px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-soft">
            <div className="text-lg font-semibold mb-3">Add User</div>
            <div className="grid grid-cols-1 gap-3">
              <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200">
                <option value="admin">Admin</option>
                <option value="user">Normal</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setAddOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
              <button disabled={saving} onClick={async()=>{
                if (!validateName(form.name)) return alert('Name must be 20-60 chars')
                if (!validateEmail(form.email)) return alert('Invalid email')
                if (!validatePassword(form.password)) return alert('Weak password')
                setSaving(true)
                try{ await api.post('/admin/users', form); await load(); setAddOpen(false) }catch(e){ alert(e?.response?.data?.message || 'Failed') } finally{ setSaving(false) }
              }} className="px-4 py-2 rounded-md bg-primary text-white">Create</button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-soft">
            <div className="text-lg font-semibold mb-3">User Details</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-slate-500">Name</div>
                <div>{detail.name}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Email</div>
                <div>{detail.email}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-slate-500">Address</div>
                <div>{detail.address || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Role</div>
                <div>{detail.role}</div>
              </div>
              {detail.ownerInfo && (
                <div>
                  <div className="text-sm text-slate-500">Avg Rating</div>
                  <div>{Number(detail.ownerInfo.averageRating || 0).toFixed(2)}</div>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={()=>setDetail(null)} className="px-4 py-2 rounded-md bg-primary text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



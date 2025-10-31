import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminStores(){
  const [stores, setStores] = useState([])
  const [q, setQ] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [owners, setOwners] = useState([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' })

  const load = async () => {
    try{ const res = await api.get('/admin/stores'); setStores(res.data?.data || []) }catch(e){ /* noop */ }
  }

  useEffect(()=>{ (async()=>{ await load() })() },[])

  const openAdd = async () => {
    try{ const res = await api.get('/admin/users?role=owner'); setOwners(res.data?.data || []) }catch(e){ /* noop */ }
    setAddOpen(true)
  }

  const filtered = stores.filter(s =>
    (s.name||'').toLowerCase().includes(q.toLowerCase()) ||
    (s.owner?.name||'').toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Stores</h2>
        <button onClick={openAdd} className="bg-primary text-white px-4 py-2 rounded-md shadow-soft">Add New Store</button>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-soft flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or owner" className="w-full md:w-96 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="bg-white rounded-xl p-4 shadow-soft overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-slate-500 text-sm">
              <th className="py-2 border-b">Store Name</th>
              <th className="py-2 border-b">Owner</th>
              <th className="py-2 border-b">Rating</th>
              <th className="py-2 border-b">Status</th>
              <th className="py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="py-2 border-b">{s.name}</td>
                <td className="py-2 border-b">{s.owner?.name}</td>
                <td className="py-2 border-b">{Number(s.averageRating || 0).toFixed(1)}</td>
                <td className="py-2 border-b"><span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">Active</span></td>
                <td className="py-2 border-b">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-md border text-slate-600 hover:bg-slate-50">Edit</button>
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
            <div className="text-lg font-semibold mb-3">Add Store</div>
            <div className="grid grid-cols-1 gap-3">
              <input placeholder="Store Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <select value={form.ownerId} onChange={e=>setForm({...form, ownerId:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200">
                <option value="">Select Owner</option>
                {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setAddOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
              <button disabled={saving} onClick={async()=>{
                if (!form.name || !form.email || !form.ownerId) return alert('Name, email and owner are required')
                setSaving(true)
                try{ await api.post('/admin/stores', form); await load(); setAddOpen(false) }catch(e){ alert(e?.response?.data?.message || 'Failed') } finally{ setSaving(false) }
              }} className="px-4 py-2 rounded-md bg-primary text-white">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function OwnerDashboard(){
  const [store, setStore] = useState(null)
  const [raters, setRaters] = useState([])
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [products, setProducts] = useState([])
  const [pForm, setPForm] = useState({ id: null, name: '', price: '', description: '' })
  const [pOpen, setPOpen] = useState(false)

  const fetch = async () => {
    try{
      const res = await api.get('/owner/dashboard')
      const data = res.data?.data
      if (data) {
        // store: { id, name }, averageRating: number, raters: [{ id, rating, user: { name, email } }]
        if (data.store) {
          setStore({ ...data.store, averageRating: data.averageRating })
          setRaters((data.raters || []).map(r => ({ name: r.user?.name, email: r.user?.email, rating: r.rating, userId: r.user?.id, id: r.id })))
          try { const pr = await api.get('/owner/products'); setProducts(pr.data?.data || []) } catch (_) {}
        } else {
          setStore(null)
          setRaters([])
          setProducts([])
        }
      }
    }catch(e){ console.warn(e) }
  }

  useEffect(()=>{ fetch() },[])

  return (
    <div>
      <div className="card">
        <h3>Your Store</h3>
        {!store && (
          <div>
            <div className="text-slate-600 mb-3">No store yet. Create your store to get started.</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="Store Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              <input placeholder="Contact Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
              <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
            </div>
            <div className="mt-3">
              <button disabled={creating} onClick={async()=>{
                setCreating(true)
                try{ await api.post('/owner/store', form); await fetch() }catch(e){ alert(e?.response?.data?.message || 'Failed to create store') } finally{ setCreating(false) }
              }} className="bg-primary text-white px-4 py-2 rounded-md">Create Store</button>
            </div>
          </div>
        )}
        {store && (
          <div>
            <div><strong>{store.name}</strong></div>
            <div>Average Rating: {store.averageRating ?? 'N/A'}</div>
          </div>
        )}
      </div>

      {store && (
        <>
          <div className="card">
            <h4>Products</h4>
            <div className="mb-3">
              <button onClick={()=>{ setPForm({ id: null, name: '', price: '', description: '' }); setPOpen(true) }} className="bg-primary text-white px-3 py-1.5 rounded-md">Add Product</button>
            </div>
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Price</th><th>Description</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td><td>₹{Number(p.price).toFixed(2)}</td><td>{p.description || '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={()=>{ setPForm({ id: p.id, name: p.name, price: String(p.price), description: p.description || '' }); setPOpen(true) }} className="px-3 py-1 rounded-md border">Edit</button>
                        <button onClick={async()=>{ if(!confirm('Delete product?')) return; try{ await api.delete(`/owner/products/${p.id}`); await fetch() }catch(e){ alert('Delete failed') } }} className="px-3 py-1 rounded-md bg-red-50 text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={4} className="text-slate-500">No products yet.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h4>Users who rated your store</h4>
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Rating</th></tr>
              </thead>
              <tbody>
                {raters.map(r => (
                  <tr key={r.userId}><td>{r.name}</td><td>{r.email}</td><td>{r.rating}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pOpen && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-soft">
            <div className="text-lg font-semibold mb-3">{pForm.id ? 'Edit Product' : 'Add Product'}</div>
            <div className="grid grid-cols-1 gap-3">
              <input placeholder="Name" value={pForm.name} onChange={e=>setPForm({...pForm, name:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <input placeholder="Price" value={pForm.price} onChange={e=>setPForm({...pForm, price:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
              <textarea placeholder="Description" value={pForm.description} onChange={e=>setPForm({...pForm, description:e.target.value})} className="px-3 py-2 rounded-md border border-slate-200" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setPOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={async()=>{
                try{
                  if (pForm.id) await api.put(`/owner/products/${pForm.id}`, { name: pForm.name, price: Number(pForm.price), description: pForm.description })
                  else await api.post('/owner/products', { name: pForm.name, price: Number(pForm.price), description: pForm.description })
                  setPOpen(false); await fetch()
                }catch(e){ alert(e?.response?.data?.message || 'Save failed') }
              }} className="px-4 py-2 rounded-md bg-primary text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

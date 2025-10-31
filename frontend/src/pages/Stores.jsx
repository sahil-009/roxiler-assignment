import React, { useEffect, useState } from 'react'
import api from '../services/api'
import StoreCard from '../components/StoreCard'
import { useAuth } from '../context/AuthContext'

export default function Stores() {
  const [stores, setStores] = useState([])
  const [query, setQuery] = useState('')
  const [filterAddr, setFilterAddr] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchStores = async () => {
    setLoading(true)
    try {
      const res = await api.get('/stores')
      // backend: { success, data: [...] }
      setStores(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStores() }, [])

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) && s.address.toLowerCase().includes(filterAddr.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Explore Stores</h2>
        <div className="hidden md:block text-sm text-slate-500">Find top-rated places</div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search by name" value={query} onChange={e => setQuery(e.target.value)} />
          <input className="px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Filter by address" value={filterAddr} onChange={e => setFilterAddr(e.target.value)} />
          <select className="px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>All Ratings</option>
            <option>4+ stars</option>
            <option>3+ stars</option>
          </select>
        </div>
      </div>

      {loading ? <div className="text-slate-500">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(store => (
            <div key={store.id} className="bg-white rounded-xl p-5 shadow-soft">
              <div className="h-28 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100 mb-4" />
              <StoreCard store={store} currentUser={user} onUpdated={fetchStores} />
            </div>
          ))}
          {filtered.length === 0 && <div className="text-slate-500">No stores found.</div>}
        </div>
      )}
    </div>
  )
}

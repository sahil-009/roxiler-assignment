import React, { useState } from 'react'
import api from '../services/api'
import RatingStars from './RatingStars'

export default function StoreCard({ store, currentUser, onUpdated }) {
  // store expected shape: { id, name, address, averageRating, userRating }
  const [rating, setRating] = useState(store.userRating || 0)
  const [saving, setSaving] = useState(false)
  const isUser = !currentUser || currentUser.role === 'user' || currentUser.role === 'normal'

  const submitRating = async () => {
    if (!rating || rating < 1 || rating > 5) return alert('Rating must be 1-5')
    setSaving(true)
    try {
      await api.post(`/ratings/${store.id}`, { rating })
      onUpdated && onUpdated()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit rating')
    } finally { setSaving(false) }
  }

  const modifyRating = async () => submitRating()

  return (
    <div>
      <h4 className="text-lg font-semibold">{store.name}</h4>
      <div className="text-slate-500 text-sm">{store.address}</div>
      <div className="mt-2"><RatingStars value={Number(store.averageRating || 0)} /></div>
      <div className="mt-1 text-sm">Your Rating: <strong>{store.userRating ?? '—'}</strong></div>

      {isUser && (
        <div className="mt-3 flex items-center gap-2">
          <select className="px-2 py-1 rounded-md border border-slate-200" value={rating} onChange={e => setRating(Number(e.target.value))}>
            <option value={0}>Rate...</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button className="px-3 py-1.5 rounded-md bg-primary text-white" onClick={submitRating} disabled={saving}>Submit</button>
          {store.userRating != null && <button className="px-3 py-1.5 rounded-md border" onClick={modifyRating} disabled={saving}>Modify</button>}
        </div>
      )}
    </div>
  )
}

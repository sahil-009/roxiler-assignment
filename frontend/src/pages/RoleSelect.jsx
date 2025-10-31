import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoleSelect() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const roles = [
    { key: 'admin', label: 'Admin', icon: '👑' },
    { key: 'owner', label: 'Store Owner', icon: '🏪' },
    { key: 'user', label: 'User', icon: '🙋' },
  ]

  const onContinue = () => {
    if (!selected) return
    navigate(`/auth/${selected}/login`)
  }

  return (
    <div className="w-full grid place-items-center">
      <div className="w-[800px] h-[500px] bg-white rounded-2xl shadow-soft border border-slate-200 p-8 flex flex-col">
        <h1 className="text-2xl font-semibold text-slate-800">Select Your Role</h1>
        <p className="text-slate-500 mt-1">Choose how you want to continue.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {roles.map((r) => {
            const active = selected === r.key
            return (
              <button
                key={r.key}
                onClick={() => setSelected(r.key)}
                className={
                  `flex flex-col items-center justify-center gap-3 rounded-xl border p-6 transition shadow-sm bg-white ` +
                  (active
                    ? 'border-primary ring-2 ring-primary/30 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)]'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow')
                }
              >
                <div className={`text-4xl ${active ? 'drop-shadow-[0_2px_8px_rgba(59,130,246,0.7)]' : ''}`}>{r.icon}</div>
                <div className={`text-lg font-medium ${active ? 'text-primary' : 'text-slate-700'}`}>{r.label}</div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onContinue}
            disabled={!selected}
            className={`px-5 py-2.5 rounded-md text-white bg-primary disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}



import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="w-full grid place-items-center">
      <div className="w-[800px] h-[500px] bg-white rounded-2xl shadow-soft border border-slate-200 p-10 flex flex-col items-center justify-center text-center">
        <div className="w-64 h-40 rounded-xl bg-slate-50 border border-slate-200 grid place-items-center text-slate-400">Illustration</div>
        <h1 className="mt-8 text-2xl font-semibold text-slate-800">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you are looking for doesn’t exist or has been moved.</p>
        <div className="mt-6 flex items-center gap-3">
          <Link to="/stores" className="px-4 py-2 rounded-md bg-primary text-white">Go to Home</Link>
          <Link to="/auth/role" className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">Select Role</Link>
        </div>
      </div>
    </div>
  )
}



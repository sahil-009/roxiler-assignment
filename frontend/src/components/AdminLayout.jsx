import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IconDashboard, IconUsers, IconStore, IconProfile } from './icons'

export default function AdminLayout({ children }){
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="flex">
        <aside className="hidden md:block w-64 bg-white shadow-soft min-h-screen">
          <div className="px-6 py-5 border-b"><Link to="/admin" className="text-xl font-semibold text-primary">StoreManager</Link></div>
          <nav className="p-4 space-y-1">
            <NavLink to="/admin" end className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded-md ${isActive? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
              <IconDashboard className="text-primary" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded-md ${isActive? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
              <IconUsers className="text-primary" />
              <span>Users</span>
            </NavLink>
            <NavLink to="/admin/stores" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded-md ${isActive? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
              <IconStore className="text-primary" />
              <span>Stores</span>
            </NavLink>
            <NavLink to="/stores" className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded-md ${isActive? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
              <IconProfile className="text-primary" />
              <span>Public</span>
            </NavLink>
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          <header className="bg-white shadow-soft">
            <div className="px-4 md:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <input placeholder="Search..." className="w-full md:w-96 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 grid place-items-center text-primary font-semibold">A</div>
              </div>
            </div>
          </header>
          <main className="p-4 md:p-8 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}



import React from 'react'

export default function ConfirmModal({ open, title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }){
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onCancel} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            {description && <p className="mt-2 text-slate-600 text-sm">{description}</p>}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={onCancel} className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">{cancelText}</button>
              <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-primary text-white">{confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



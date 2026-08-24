'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PotensiForm from './PotensiForm'

export default function PotensiActions({ potensi }: { potensi: any }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Hapus potensi ini?')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/konten/potensi/${potensi.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus')
      router.refresh()
    } catch (e: any) {
      alert(e.message)
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="absolute inset-0 bg-white z-10 p-5 flex flex-col justify-center border-b border-gray-100 shadow-xl">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Edit Potensi</h3>
        <PotensiForm initialData={potensi} onSuccess={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 relative">
      <button 
        onClick={() => setIsEditing(true)} 
        disabled={isDeleting}
        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition"
      >
        Edit
      </button>
      <button 
        onClick={handleDelete} 
        disabled={isDeleting}
        className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition"
      >
        {isDeleting ? '...' : 'Hapus'}
      </button>
    </div>
  )
}

'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function GaleriActions({ id, fotoUrl }: { id: string; fotoUrl: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Hapus foto ini?')) return
    setLoading(true)
    await fetch(`/api/admin/galeri/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition">
      {loading ? '...' : '🗑 Hapus'}
    </button>
  )
}

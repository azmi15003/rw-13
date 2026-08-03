'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function PengumumanActions({ id, isPublished, canEdit }: { id: string; isPublished: boolean; canEdit: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function togglePublish() {
    setLoading(true)
    await fetch(`/api/dashboard/pengumuman/${id}/publish`, { method: 'PATCH' })
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Yakin hapus pengumuman ini?')) return
    setLoading(true)
    await fetch(`/api/dashboard/pengumuman/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {canEdit && (
        <>
          <button onClick={togglePublish} disabled={loading}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${isPublished ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
            {loading ? '...' : isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <Link href={`/dashboard/pengumuman/edit/${id}`}
            className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
            Edit
          </Link>
          <button onClick={handleDelete} disabled={loading}
            className="text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
            Hapus
          </button>
        </>
      )}
    </div>
  )
}

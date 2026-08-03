'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function KontenActions({ id, type, isPublished }: { id: string; type: 'kegiatan' | 'pengumuman' | 'dokumen'; isPublished: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function togglePublish() {
    setLoading(true)
    const endpoint = type === 'kegiatan'
      ? `/api/admin/konten/kegiatan/${id}/publish`
      : `/api/dashboard/pengumuman/${id}/publish`
    await fetch(endpoint, { method: 'PATCH' })
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm(`Yakin hapus ${type} ini?`)) return
    setLoading(true)
    const endpoints: Record<string, string> = {
      kegiatan: `/api/admin/konten/kegiatan/${id}`,
      pengumuman: `/api/dashboard/pengumuman/${id}`,
      dokumen: `/api/admin/konten/dokumen/${id}`,
    }
    await fetch(endpoints[type], { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-1">
      {type !== 'dokumen' && (
        <button onClick={togglePublish} disabled={loading}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${isPublished ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
          {loading ? '...' : isPublished ? 'Unpublish' : 'Publish'}
        </button>
      )}
      {type === 'kegiatan' && (
        <Link href={`/admin/konten/kegiatan/${id}/edit`}
          className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
          Edit
        </Link>
      )}
      <button onClick={handleDelete} disabled={loading}
        className="text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
        Hapus
      </button>
    </div>
  )
}

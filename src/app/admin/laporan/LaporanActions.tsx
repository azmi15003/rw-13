'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS = ['masuk', 'diproses', 'selesai', 'ditolak']

export default function LaporanActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [catatan, setCatatan] = useState('')
  const [newStatus, setNewStatus] = useState(currentStatus)

  async function handleUpdate() {
    setLoading(true)
    await fetch(`/api/admin/laporan/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, catatanAdmin: catatan }),
    })
    router.refresh()
    setShowDetail(false)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Yakin hapus laporan ini?')) return
    setLoading(true)
    await fetch(`/api/admin/laporan/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex-shrink-0">
      {showDetail ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 w-56">
          <p className="text-xs font-medium text-gray-700 mb-2">Update Status</p>
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white mb-2 focus:outline-none focus:ring-1 focus:ring-gray-900">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <textarea value={catatan} onChange={e => setCatatan(e.target.value)}
            placeholder="Catatan admin (opsional)" rows={2}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg mb-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-900" />
          <div className="flex gap-1">
            <button onClick={() => setShowDetail(false)}
              className="flex-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-white transition text-gray-600">
              Batal
            </button>
            <button onClick={handleUpdate} disabled={loading}
              className="flex-1 text-xs py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition">
              {loading ? '...' : 'Simpan'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <button onClick={() => setShowDetail(true)}
            className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
            Update
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
            Hapus
          </button>
        </div>
      )}
    </div>
  )
}

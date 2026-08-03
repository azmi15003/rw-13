'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifikasiButton({
  kkId,
  currentStatus,
}: {
  kkId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggleVerifikasi() {
    setLoading(true)
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified'
    await fetch(`/api/dashboard/kk/${kkId}/verifikasi`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={toggleVerifikasi}
      disabled={loading}
      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
        currentStatus === 'verified'
          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          : 'bg-green-100 text-green-700 hover:bg-green-200'
      }`}
    >
      {loading ? '...' : currentStatus === 'verified' ? 'Batalkan Verifikasi' : '✓ Verifikasi'}
    </button>
  )
}

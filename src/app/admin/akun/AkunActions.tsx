'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AkunActions({
  userId, currentRole, rtList,
}: {
  userId: string
  currentRole: string
  rtList: { id: string; nomorRt: string }[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Yakin hapus akun ini? Data tidak bisa dikembalikan.')) return
    setLoading(true)
    await fetch(`/api/admin/akun/${userId}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  async function handleResetPassword() {
    const newPassword = prompt('Masukkan password baru (min. 8 karakter):')
    if (!newPassword || newPassword.length < 8) return
    setLoading(true)
    const res = await fetch(`/api/admin/akun/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset_password', newPassword }),
    })
    if (res.ok) alert('Password berhasil direset.')
    setLoading(false)
  }

  if (currentRole === 'super_admin') return <span className="text-xs text-gray-400">—</span>

  return (
    <div className="flex items-center gap-1">
      <button onClick={handleResetPassword} disabled={loading}
        className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
        Reset PW
      </button>
      <button onClick={handleDelete} disabled={loading}
        className="text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
        Hapus
      </button>
    </div>
  )
}

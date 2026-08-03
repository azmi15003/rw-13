'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TambahAkunForm({ rtList }: { rtList: { id: string; nomorRt: string; namaKetua: string }[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ namaLengkap: '', email: '', password: '', rtId: '', role: 'admin_rt' })

  function update(field: string, value: string) { setForm(p => ({ ...p, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin/akun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat akun.')
      setSuccess(`Akun untuk ${form.namaLengkap} berhasil dibuat!`)
      setForm({ namaLengkap: '', email: '', password: '', rtId: '', role: 'admin_rt' })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
          <input value={form.namaLengkap} onChange={e => update('namaLengkap', e.target.value)} required placeholder="Nama admin RT" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Email <span className="text-red-500">*</span></label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="admin.rt01@rw13.id" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Password <span className="text-red-500">*</span></label>
          <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required placeholder="Min. 8 karakter" minLength={8} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Assign ke RT <span className="text-red-500">*</span></label>
          <select value={form.rtId} onChange={e => update('rtId', e.target.value)} required className={inputClass + " bg-white"}>
            <option value="">Pilih RT</option>
            {rtList.map(rt => (
              <option key={rt.id} value={rt.id}>RT {rt.nomorRt} — {rt.namaKetua}</option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">{error}</div>}
      {success && <div className="mt-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2">✓ {success}</div>}
      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition">
          {loading ? 'Membuat akun...' : 'Buat Akun Admin RT'}
        </button>
      </div>
    </form>
  )
}

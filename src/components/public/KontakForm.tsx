'use client'
import { useState } from 'react'

export default function KontakForm() {
  const [form, setForm] = useState({ nama: '', email: '', judul: '', pesan: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function update(field: string, value: string) { setForm(p => ({ ...p, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulasi kirim — bisa dihubungkan ke email service / WhatsApp API
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"

  if (sent) return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
      <p className="text-4xl mb-3">✅</p>
      <p className="text-emerald-800 font-bold mb-2">Pesan Terkirim!</p>
      <p className="text-sm text-emerald-600">Terima kasih. Pengurus akan segera menghubungi Anda melalui email atau WhatsApp.</p>
      <button onClick={() => setSent(false)} className="mt-6 text-xs text-emerald-700 font-semibold hover:underline">Kirim pesan lain</button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
          <input value={form.nama} onChange={e => update('nama', e.target.value)} placeholder="Nama Anda" required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="nama@email.com" required className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Judul Pesan</label>
        <input value={form.judul} onChange={e => update('judul', e.target.value)} placeholder="Topik pembicaraan" required className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Pesan</label>
        <textarea value={form.pesan} onChange={e => update('pesan', e.target.value)} rows={4}
          placeholder="Tuliskan aspirasi atau pertanyaan Anda di sini..." required className={inputClass + " resize-none"} />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 text-white text-sm font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 disabled:opacity-50 disabled:hover:shadow-none transition-all duration-200">
        {loading ? 'Mengirim pesan...' : 'Kirim Pesan'}
      </button>
    </form>
  )
}

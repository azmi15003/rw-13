'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const KATEGORI = [
  { value: 'kehilangan', label: '🔍 Kehilangan Barang' },
  { value: 'kerusakan_fasilitas', label: '🔧 Kerusakan Fasilitas' },
  { value: 'keamanan', label: '🛡️ Keamanan & Gangguan' },
  { value: 'kebersihan', label: '🧹 Kebersihan Lingkungan' },
  { value: 'sosial', label: '🤝 Masalah Sosial' },
  { value: 'administrasi', label: '📋 Administrasi' },
  { value: 'lainnya', label: '📌 Lainnya' },
]

export default function TambahLaporanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    pelaporNama: '', pelaporNik: '', pelaporHp: '',
    kategori: 'kehilangan', judul: '', deskripsi: '',
    lokasiKejadian: '', tanggalKejadian: '',
  })

  function update(field: string, value: string) { setForm(p => ({ ...p, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan.')
      router.push('/admin/laporan')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/laporan" className="text-gray-400 hover:text-gray-700 text-sm">← Laporan</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Buat Laporan Warga</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            💡 Laporan ini dibuat oleh Admin RT atas nama warga. Pastikan data pelapor sudah diverifikasi.
          </p>

          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Data Pelapor</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Pelapor <span className="text-red-500">*</span></label>
                <input value={form.pelaporNama} onChange={e => update('pelaporNama', e.target.value)}
                  required placeholder="Nama lengkap warga" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">NIK Pelapor</label>
                <input value={form.pelaporNik} onChange={e => update('pelaporNik', e.target.value)}
                  placeholder="16 digit NIK" maxLength={16} className={inputClass + " font-mono"} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">No. HP Pelapor</label>
                <input value={form.pelaporHp} onChange={e => update('pelaporHp', e.target.value)}
                  placeholder="08xxxxxxxxxx" className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Detail Laporan</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori Laporan <span className="text-red-500">*</span></label>
                <select value={form.kategori} onChange={e => update('kategori', e.target.value)} className={inputClass + " bg-white"}>
                  {KATEGORI.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Judul Laporan <span className="text-red-500">*</span></label>
                <input value={form.judul} onChange={e => update('judul', e.target.value)}
                  required placeholder="Contoh: Kehilangan motor di depan Blok A" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi Lengkap <span className="text-red-500">*</span></label>
                <textarea value={form.deskripsi} onChange={e => update('deskripsi', e.target.value)}
                  required rows={5} placeholder="Ceritakan detail kejadian secara lengkap..." className={inputClass + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Lokasi Kejadian</label>
                  <input value={form.lokasiKejadian} onChange={e => update('lokasiKejadian', e.target.value)}
                    placeholder="Blok A No. 5 RT 03" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Tanggal Kejadian</label>
                  <input type="date" value={form.tanggalKejadian} onChange={e => update('tanggalKejadian', e.target.value)}
                    className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/admin/laporan" className="px-5 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 text-gray-600">Batal</Link>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition">
              {loading ? 'Menyimpan...' : 'Simpan Laporan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

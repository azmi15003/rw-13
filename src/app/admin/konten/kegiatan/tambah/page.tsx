'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const KATEGORI = ['sosial', 'kesehatan', 'pendidikan', 'keamanan', 'olahraga', 'lingkungan', 'ekonomi', 'lainnya']

export default function TambahKegiatanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    judul: '', deskripsi: '', kategori: 'sosial',
    tanggalMulai: '', tanggalSelesai: '', lokasi: '', publish: false,
  })

  function update(field: string, value: any) { setForm(p => ({ ...p, [field]: value })) }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFoto(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  function removeFoto() {
    setFoto(null)
    setFotoPreview(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let fotoUrl: string | null = null

      // Upload foto ke Supabase Storage
      if (foto) {
        const supabase = createClient()
        const ext = foto.name.split('.').pop()
        const fileName = `kegiatan-${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('photo-activity')
          .upload(fileName, foto)
        if (uploadError) throw new Error('Gagal upload foto: ' + uploadError.message)
        const { data: { publicUrl } } = supabase.storage.from('photo-activity').getPublicUrl(fileName)
        fotoUrl = publicUrl
      }

      const res = await fetch('/api/admin/konten/kegiatan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fotoUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan.')
      router.push('/admin/konten')
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
        <Link href="/admin/konten" className="text-gray-400 hover:text-gray-700 text-sm">← Konten</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Tambah Kegiatan</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">

          {/* Upload Foto */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Foto Kegiatan <span className="text-gray-400">(opsional)</span>
            </label>
            {fotoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img src={fotoPreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeFoto}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg hover:bg-black/80 transition"
                >
                  ✕ Hapus Foto
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                  {foto?.name} · {foto && (foto.size / 1024).toFixed(0)} KB
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition group">
                <span className="text-4xl mb-2 group-hover:scale-110 transition">📸</span>
                <span className="text-sm font-medium text-gray-500">Klik untuk upload foto kegiatan</span>
                <span className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP · Maks. 5 MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Judul Kegiatan <span className="text-red-500">*</span></label>
            <input value={form.judul} onChange={e => update('judul', e.target.value)}
              required placeholder="Kerja Bakti Massal RW 13" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori</label>
              <select value={form.kategori} onChange={e => update('kategori', e.target.value)} className={inputClass + " bg-white"}>
                {KATEGORI.map(k => <option key={k} value={k} className="capitalize">{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Lokasi</label>
              <input value={form.lokasi} onChange={e => update('lokasi', e.target.value)}
                placeholder="Lapangan Serbaguna RW 13" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tanggal & Jam Mulai <span className="text-red-500">*</span></label>
              <input type="datetime-local" value={form.tanggalMulai}
                onChange={e => update('tanggalMulai', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tanggal & Jam Selesai</label>
              <input type="datetime-local" value={form.tanggalSelesai}
                onChange={e => update('tanggalSelesai', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi Kegiatan</label>
            <textarea value={form.deskripsi} onChange={e => update('deskripsi', e.target.value)}
              rows={5} placeholder="Deskripsi detail kegiatan..."
              className={inputClass + " resize-none"} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.publish} onChange={e => update('publish', e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-700">Publikasikan sekarang</span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/admin/konten" className="px-5 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 text-gray-600">
              Batal
            </Link>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition">
              {loading ? 'Menyimpan...' : form.publish ? 'Publish Kegiatan' : 'Simpan Draft'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

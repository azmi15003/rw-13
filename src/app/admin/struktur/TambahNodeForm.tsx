'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TIPE_OPTIONS = [
  { value: 'rw', label: 'Pengurus RW', color: '#185FA5' },
  { value: 'sie', label: 'Sie / Bidang', color: '#1D9E75' },
  { value: 'rt', label: 'Ketua RT', color: '#6B7280' },
]

export default function TambahNodeForm({ nodes }: {
  nodes: { id: string; nama: string; jabatan: string }[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    nama: '', jabatan: '', tipe: 'rw',
    parent_id: '', warna: '#185FA5', urutan: '0',
  })

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
    // Auto set warna sesuai tipe
    if (field === 'tipe') {
      const tipe = TIPE_OPTIONS.find(t => t.value === value)
      if (tipe) setForm(p => ({ ...p, tipe: value, warna: tipe.color }))
    }
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFoto(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let foto_url: string | null = null

      if (foto) {
        if (foto.size > 5 * 1024 * 1024) {
          throw new Error('Ukuran foto maksimal 5MB')
        }
        const supabase = createClient()
        const ext = foto.name.split('.').pop()
        const fileName = `org-${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('foto-profil')
          .upload(fileName, foto)
        if (uploadErr) throw new Error('Gagal upload foto: ' + uploadErr.message)
        const { data: { publicUrl } } = supabase.storage.from('foto-profil').getPublicUrl(fileName)
        foto_url = publicUrl
      }

      const res = await fetch('/api/admin/struktur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, foto_url, urutan: parseInt(form.urutan) || 0 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan.')

      setSuccess(`${form.nama} berhasil ditambahkan!`)
      setForm({ nama: '', jabatan: '', tipe: 'rw', parent_id: '', warna: '#185FA5', urutan: '0' })
      setFoto(null)
      setFotoPreview(null)
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
      <div className="grid grid-cols-2 gap-4">
        {/* Upload Foto */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Foto <span className="text-gray-400">(opsional)</span>
          </label>
          <div className="flex items-center gap-4">
            {fotoPreview ? (
              <div className="relative">
                <img src={fotoPreview} alt="preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                <button type="button" onClick={() => { setFoto(null); setFotoPreview(null) }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-300 text-2xl">
                👤
              </div>
            )}
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
              <span>📷</span> Pilih Foto
              <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
            </label>
            <p className="text-xs text-gray-400">JPG, PNG · Maks. 2MB</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
          <input value={form.nama} onChange={e => update('nama', e.target.value)}
            required placeholder="Nama pengurus" className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Jabatan <span className="text-red-500">*</span></label>
          <input value={form.jabatan} onChange={e => update('jabatan', e.target.value)}
            required placeholder="Ketua RW / Sekretaris / dll" className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Tipe</label>
          <select value={form.tipe} onChange={e => update('tipe', e.target.value)} className={inputClass + " bg-white"}>
            {TIPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Atasan (Parent)</label>
          <select value={form.parent_id} onChange={e => update('parent_id', e.target.value)} className={inputClass + " bg-white"}>
            <option value="">— Tidak ada (Root) —</option>
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.nama} · {n.jabatan}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Warna Node</label>
          <div className="flex items-center gap-3">
            <input type="color" value={form.warna} onChange={e => update('warna', e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
            <input value={form.warna} onChange={e => update('warna', e.target.value)}
              placeholder="#185FA5" className={inputClass + " flex-1"} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Urutan Tampil</label>
          <input type="number" value={form.urutan} onChange={e => update('urutan', e.target.value)}
            min="0" className={inputClass} />
        </div>
      </div>

      {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">{error}</div>}
      {success && <div className="mt-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2">✓ {success}</div>}

      <div className="flex justify-end mt-4">
        <button type="submit" disabled={loading}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition">
          {loading ? 'Menyimpan...' : '+ Tambah Anggota'}
        </button>
      </div>
    </form>
  )
}

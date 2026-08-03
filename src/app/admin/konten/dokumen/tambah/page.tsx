'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const KATEGORI = ['kependudukan', 'pernikahan', 'kematian', 'regulasi', 'lainnya']

export default function TambahDokumenPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({ nama: '', deskripsi: '', kategori: 'kependudukan' })

  function update(field: string, value: string) { setForm(p => ({ ...p, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Pilih file terlebih dahulu.'); return }
    setLoading(true)
    setError('')

    try {
      // Upload ke Supabase Storage
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('document-public')
        .upload(fileName, file)

      if (uploadError) throw new Error('Gagal upload file: ' + uploadError.message)

      const { data: { publicUrl } } = supabase.storage.from('document-public').getPublicUrl(fileName)

      // Simpan metadata ke database
      const res = await fetch('/api/admin/konten/dokumen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fileUrl: publicUrl,
          tipeFile: ext?.toLowerCase() || 'pdf',
          ukuranBytes: file.size,
        }),
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
        <h1 className="text-xl font-semibold text-gray-900">Upload Dokumen</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Dokumen <span className="text-red-500">*</span></label>
            <input value={form.nama} onChange={e => update('nama', e.target.value)} required
              placeholder="Formulir Pindah Datang (F1.01)" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori</label>
              <select value={form.kategori} onChange={e => update('kategori', e.target.value)} className={inputClass + " bg-white"}>
                {KATEGORI.map(k => <option key={k} value={k} className="capitalize">{k}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={e => update('deskripsi', e.target.value)} rows={3}
              placeholder="Keterangan singkat tentang dokumen ini..." className={inputClass + " resize-none"} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">File Dokumen <span className="text-red-500">*</span></label>
            <div className={`${inputClass} cursor-pointer`}>
              <input type="file" accept=".pdf,.doc,.docx,.xlsx,.xls"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-700" />
            </div>
            {file && (
              <p className="text-xs text-gray-500 mt-1">
                {file.name} · {(file.size / 1024).toFixed(0)} KB
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">Format: PDF, DOCX, XLSX · Maks. 10 MB</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/admin/konten" className="px-5 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 text-gray-600">Batal</Link>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition">
              {loading ? 'Mengupload...' : 'Upload Dokumen'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

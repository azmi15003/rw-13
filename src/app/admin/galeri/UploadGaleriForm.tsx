'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UploadGaleriForm({
  kegiatan,
}: {
  kegiatan: { id: string; judul: string }[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [kegiatanId, setKegiatanId] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return
    const arr = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...arr])
    arr.forEach(f => {
      const url = URL.createObjectURL(f)
      setPreviews(prev => [...prev, url])
    })
  }

  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (files.length === 0) { setError('Pilih minimal 1 foto.'); return }
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      let uploaded = 0

      // Filter out files that are larger than 5MB
      const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024)
      if (validFiles.length < files.length) {
        setError('Beberapa file diabaikan karena ukurannya melebihi 5 MB.')
      }

      await Promise.all(
        validFiles.map(async (file) => {
          const ext = file.name.split('.').pop()
          const fileName = `galeri-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

          const { error: uploadErr } = await supabase.storage
            .from('foto-kegiatan')
            .upload(fileName, file)
          if (uploadErr) return

          const { data: { publicUrl } } = supabase.storage.from('foto-kegiatan').getPublicUrl(fileName)

          const res = await fetch('/api/admin/galeri', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              foto_url: publicUrl,
              kegiatan_id: kegiatanId || null,
              keterangan: keterangan || null,
            }),
          })
          
          if (res.ok) {
            uploaded++
          }
        })
      )

      setSuccess(`${uploaded} dari ${files.length} foto berhasil diupload!`)
      setFiles([])
      setPreviews([])
      setKeterangan('')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition ${isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
      >
        <span className="text-4xl block mb-2">📸</span>
        <p className="text-sm font-medium text-gray-600 mb-1">Drag & drop foto di sini</p>
        <p className="text-xs text-gray-400 mb-3">atau klik tombol di bawah untuk memilih file</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition">
          📂 Pilih Foto (bisa multiple)
          <input type="file" accept="image/*" multiple onChange={e => addFiles(e.target.files)} className="hidden" />
        </label>
        <p className="text-xs text-gray-300 mt-2">JPG, PNG, WEBP · Maks. 5 MB per foto</p>
      </div>

      {/* Preview */}
      {previews.length > 0 && (
        <div className="grid grid-cols-6 gap-2">
          {previews.map((url, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Tautkan ke Kegiatan (opsional)</label>
          <select value={kegiatanId} onChange={e => setKegiatanId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">— Pilih Kegiatan —</option>
            {kegiatan.map(k => <option key={k.id} value={k.id}>{k.judul}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Keterangan Foto (opsional)</label>
          <input value={keterangan} onChange={e => setKeterangan(e.target.value)}
            placeholder="Deskripsi singkat foto..."
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2">✓ {success}</div>}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{files.length} foto dipilih</p>
        <button type="submit" disabled={loading || files.length === 0}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition">
          {loading ? 'Mengupload...' : `Upload ${files.length > 0 ? `(${files.length} foto)` : ''}`}
        </button>
      </div>
    </form>
  )
}

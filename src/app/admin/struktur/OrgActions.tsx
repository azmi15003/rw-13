'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TIPE_OPTIONS = [
  { value: 'rw', label: 'Pengurus RW', color: '#185FA5' },
  { value: 'sie', label: 'Sie / Bidang', color: '#1D9E75' },
  { value: 'rt', label: 'Ketua RT', color: '#6B7280' },
]

type NodeData = {
  id: string
  nama: string
  jabatan: string
  foto_url: string | null
  warna: string
  tipe: string
  urutan: number
  parent_id: string | null
}

export default function OrgActions({ node, allNodes }: {
  node: NodeData
  allNodes: { id: string; nama: string; jabatan: string }[]
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    nama: node.nama,
    jabatan: node.jabatan,
    tipe: node.tipe,
    parent_id: node.parent_id || '',
    warna: node.warna,
    urutan: String(node.urutan),
  })

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
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

  async function handleSave() {
    setLoading(true)
    try {
      let foto_url = node.foto_url

      if (foto) {
        const supabase = createClient()
        const ext = foto.name.split('.').pop()
        const fileName = `org-${Date.now()}.${ext}`
        const { error } = await supabase.storage.from('foto-profil').upload(fileName, foto)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('foto-profil').getPublicUrl(fileName)
          foto_url = publicUrl
        }
      }

      await fetch(`/api/admin/struktur/${node.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, foto_url, urutan: parseInt(form.urutan) || 0 }),
      })
      setEditing(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Hapus "${node.nama}"? Semua anggota di bawahnya juga akan terhapus.`)) return
    setLoading(true)
    await fetch(`/api/admin/struktur/${node.id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  const inputClass = "w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"

  if (editing) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 w-72 space-y-2">
        {/* Foto */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0"
            style={{ backgroundColor: form.warna }}>
            {(fotoPreview || node.foto_url) ? (
              <img src={fotoPreview || node.foto_url!} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                {node.nama[0]}
              </span>
            )}
          </div>
          <label className="text-xs text-blue-600 cursor-pointer hover:underline">
            Ganti Foto
            <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
          </label>
        </div>

        <input value={form.nama} onChange={e => update('nama', e.target.value)} placeholder="Nama" className={inputClass} />
        <input value={form.jabatan} onChange={e => update('jabatan', e.target.value)} placeholder="Jabatan" className={inputClass} />

        <div className="grid grid-cols-2 gap-2">
          <select value={form.tipe} onChange={e => update('tipe', e.target.value)} className={inputClass + " bg-white"}>
            {TIPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <input type="number" value={form.urutan} onChange={e => update('urutan', e.target.value)}
            placeholder="Urutan" className={inputClass} />
        </div>

        <select value={form.parent_id} onChange={e => update('parent_id', e.target.value)} className={inputClass + " bg-white"}>
          <option value="">— Root —</option>
          {allNodes.filter(n => n.id !== node.id).map(n => (
            <option key={n.id} value={n.id}>{n.nama}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input type="color" value={form.warna} onChange={e => update('warna', e.target.value)}
            className="w-8 h-8 rounded border border-gray-200 p-0.5 cursor-pointer" />
          <span className="text-xs text-gray-400">Warna node</span>
        </div>

        <div className="flex gap-1 pt-1">
          <button onClick={() => setEditing(false)}
            className="flex-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-white text-gray-600">
            Batal
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 text-xs py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
            {loading ? '...' : 'Simpan'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setEditing(true)}
        className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition">
        Edit
      </button>
      <button onClick={handleDelete} disabled={loading}
        className="text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
        Hapus
      </button>
    </div>
  )
}

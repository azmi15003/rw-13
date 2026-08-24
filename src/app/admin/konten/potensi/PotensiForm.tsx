'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TEMA_WARNA = [
  { label: 'Biru', base: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  { label: 'Hijau', base: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700' },
  { label: 'Oranye', base: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  { label: 'Ungu', base: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  { label: 'Merah', base: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700' },
  { label: 'Teal', base: 'bg-teal-50 border-teal-200', badge: 'bg-teal-100 text-teal-700' },
]

export default function PotensiForm({ 
  initialData, 
  onSuccess 
}: { 
  initialData?: any, 
  onSuccess?: () => void 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEdit = !!initialData

  const [form, setForm] = useState({
    icon: initialData?.icon || '📌',
    judul: initialData?.judul || '',
    deskripsi: initialData?.deskripsi || '',
    count_label: initialData?.count_label || '',
    warna: initialData?.warna || TEMA_WARNA[0].base,
    badge_warna: initialData?.badge_warna || TEMA_WARNA[0].badge,
    poin_1: initialData?.detail_poin?.[0] || '',
    poin_2: initialData?.detail_poin?.[1] || '',
    poin_3: initialData?.detail_poin?.[2] || '',
    poin_4: initialData?.detail_poin?.[3] || '',
  })

  function update(field: string, value: string) { setForm(p => ({ ...p, [field]: value })) }

  function handleTema(idx: number) {
    const tema = TEMA_WARNA[idx]
    setForm(p => ({ ...p, warna: tema.base, badge_warna: tema.badge }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const detail_poin = [form.poin_1, form.poin_2, form.poin_3, form.poin_4].filter(Boolean)

    const payload = {
      icon: form.icon,
      judul: form.judul,
      deskripsi: form.deskripsi,
      count_label: form.count_label,
      warna: form.warna,
      badge_warna: form.badge_warna,
      detail_poin
    }

    try {
      const url = isEdit ? `/api/admin/konten/potensi/${initialData.id}` : '/api/admin/konten/potensi'
      const method = isEdit ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) throw new Error('Gagal menyimpan')
      
      if (!isEdit) {
        setForm({
          icon: '📌', judul: '', deskripsi: '', count_label: '', 
          warna: TEMA_WARNA[0].base, badge_warna: TEMA_WARNA[0].badge,
          poin_1: '', poin_2: '', poin_3: '', poin_4: ''
        })
      }
      
      router.refresh()
      if (onSuccess) onSuccess()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Ikon (Emoji)</label>
          <input value={form.icon} onChange={e => update('icon', e.target.value)} required className={inputClass} placeholder="⚽" />
        </div>
        <div className="md:col-span-6">
          <label className="block text-xs font-medium text-gray-600 mb-1">Judul Potensi</label>
          <input value={form.judul} onChange={e => update('judul', e.target.value)} required className={inputClass} placeholder="Rumah Belajar" />
        </div>
        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Label Jumlah</label>
          <input value={form.count_label} onChange={e => update('count_label', e.target.value)} required className={inputClass} placeholder="2 Rumah Belajar" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi Lengkap</label>
        <textarea value={form.deskripsi} onChange={e => update('deskripsi', e.target.value)} required rows={2} className={inputClass + " resize-none"} placeholder="Deskripsi mengenai potensi ini..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Poin Detail 1</label>
          <input value={form.poin_1} onChange={e => update('poin_1', e.target.value)} required className={inputClass} placeholder="Contoh: Bimbel gratis" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Poin Detail 2</label>
          <input value={form.poin_2} onChange={e => update('poin_2', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Poin Detail 3</label>
          <input value={form.poin_3} onChange={e => update('poin_3', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Poin Detail 4</label>
          <input value={form.poin_4} onChange={e => update('poin_4', e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Tema Warna</label>
        <div className="flex gap-2">
          {TEMA_WARNA.map((t, idx) => (
            <button key={t.label} type="button" onClick={() => handleTema(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${t.badge} ${form.warna === t.base ? 'ring-2 ring-gray-900 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 flex gap-2">
        {isEdit && (
          <button type="button" onClick={onSuccess} className="flex-1 text-sm bg-gray-100 text-gray-600 py-2.5 rounded-xl hover:bg-gray-200 transition font-medium">Batal</button>
        )}
        <button type="submit" disabled={loading} className={`text-sm bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-700 transition font-medium ${isEdit ? 'flex-1' : 'w-full md:w-auto px-8'}`}>
          {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Potensi')}
        </button>
      </div>
    </form>
  )
}

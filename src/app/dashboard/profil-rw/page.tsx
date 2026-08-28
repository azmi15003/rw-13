'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ProfilRWPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    visi: '',
    misiText: '', // We'll manage misi as text here and convert to JSON array on submit
    judul_lingkungan: '',
    deskripsi_lingkungan: '',
    foto_kantor_url: '',
    foto_peta_url: ''
  })
  
  const [tugasFungsi, setTugasFungsi] = useState<{icon: string, judul: string, desc: string}[]>([])

  const [fotoKantor, setFotoKantor] = useState<File | null>(null)
  const [fotoPeta, setFotoPeta] = useState<File | null>(null)
  
  const [fotoKantorPreview, setFotoKantorPreview] = useState<string | null>(null)
  const [fotoPetaPreview, setFotoPetaPreview] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/profil-rw')
        if (res.ok) {
          const data = await res.json()
          let misiStr = ''
          if (data.misi) {
            try {
              const arr = JSON.parse(data.misi)
              if (Array.isArray(arr)) misiStr = arr.join('\n')
            } catch (e) {
              misiStr = data.misi
            }
          }

          setForm({
            visi: data.visi || '',
            misiText: misiStr,
            judul_lingkungan: data.judul_lingkungan || '',
            deskripsi_lingkungan: data.deskripsi_lingkungan || '',
            foto_kantor_url: data.foto_kantor_url || '',
            foto_peta_url: data.foto_peta_url || ''
          })
          if (data.foto_kantor_url) setFotoKantorPreview(data.foto_kantor_url)
          if (data.foto_peta_url) setFotoPetaPreview(data.foto_peta_url)
          
          if (data.tugas_fungsi) {
            try {
              const tfArr = typeof data.tugas_fungsi === 'string' ? JSON.parse(data.tugas_fungsi) : data.tugas_fungsi
              if (Array.isArray(tfArr)) setTugasFungsi(tfArr)
            } catch (e) {
              console.error('Failed to parse tugas_fungsi', e)
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch data', err)
      } finally {
        setFetching(false)
      }
    }
    loadData()
  }, [])

  function update(field: string, value: any) {
    setForm(p => ({ ...p, [field]: value }))
  }

  function handleFotoKantorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoKantor(file)
    setFotoKantorPreview(URL.createObjectURL(file))
  }

  function handleFotoPetaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoPeta(file)
    setFotoPetaPreview(URL.createObjectURL(file))
  }

  async function uploadFile(file: File, prefix: string) {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${prefix}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('photo-activity')
      .upload(fileName, file)
    if (uploadError) throw new Error(`Gagal upload ${prefix}: ${uploadError.message}`)
    const { data: { publicUrl } } = supabase.storage.from('photo-activity').getPublicUrl(fileName)
    return publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let finalFotoKantorUrl = form.foto_kantor_url
      let finalFotoPetaUrl = form.foto_peta_url

      if (fotoKantor) {
        finalFotoKantorUrl = await uploadFile(fotoKantor, 'kantor')
      }
      if (fotoPeta) {
        finalFotoPetaUrl = await uploadFile(fotoPeta, 'peta')
      }

      // Convert misiText to JSON array
      const misiArr = form.misiText.split('\n').map(l => l.trim()).filter(l => l.length > 0)
      const misiJson = JSON.stringify(misiArr)

      const res = await fetch('/api/dashboard/profil-rw', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visi: form.visi,
          misi: misiJson,
          tugas_fungsi: tugasFungsi,
          judul_lingkungan: form.judul_lingkungan,
          deskripsi_lingkungan: form.deskripsi_lingkungan,
          foto_kantor_url: finalFotoKantorUrl,
          foto_peta_url: finalFotoPetaUrl
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan.')
      
      setSuccess('Profil RW berhasil diperbarui!')
      
      // Update form state with new URLs
      setForm(prev => ({
        ...prev,
        foto_kantor_url: finalFotoKantorUrl,
        foto_peta_url: finalFotoPetaUrl
      }))
      setFotoKantor(null)
      setFotoPeta(null)
      
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"

  if (fetching) return <div className="p-8 text-center text-gray-500">Memuat data...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 text-sm">← Dashboard</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Pengaturan Profil RW</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>}
        {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm">{success}</div>}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Konten Teks</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Lingkungan Kita</label>
            <input value={form.judul_lingkungan} onChange={e => update('judul_lingkungan', e.target.value)}
              placeholder="Lingkungan Kita" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Lingkungan Kita</label>
            <textarea value={form.deskripsi_lingkungan} onChange={e => update('deskripsi_lingkungan', e.target.value)}
              rows={4} placeholder="RW 013 adalah lingkungan yang asri..." className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Visi</label>
            <input value={form.visi} onChange={e => update('visi', e.target.value)}
              placeholder="Menjadi lingkungan yang bersih, indah..." className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Misi <span className="text-gray-400 font-normal">(Pisahkan dengan baris baru / Enter)</span></label>
            <textarea value={form.misiText} onChange={e => update('misiText', e.target.value)}
              rows={5} placeholder="Menjaga kerukunan antar warga..." className={inputClass} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-lg font-bold text-gray-900">Tugas & Fungsi Kepengurusan</h2>
            <button type="button" onClick={() => setTugasFungsi([...tugasFungsi, {icon: '📌', judul: '', desc: ''}])}
              className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200">
              + Tambah Item
            </button>
          </div>
          
          <div className="space-y-4">
            {tugasFungsi.map((tf, i) => (
              <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                <div className="w-16">
                  <input value={tf.icon} onChange={e => { const newTf = [...tugasFungsi]; newTf[i].icon = e.target.value; setTugasFungsi(newTf) }}
                    className={inputClass + " text-center text-xl p-0 h-10"} placeholder="Icon" />
                </div>
                <div className="flex-1 space-y-3">
                  <input value={tf.judul} onChange={e => { const newTf = [...tugasFungsi]; newTf[i].judul = e.target.value; setTugasFungsi(newTf) }}
                    className={inputClass} placeholder="Judul (mis: Administratif Warga)" />
                  <textarea value={tf.desc} onChange={e => { const newTf = [...tugasFungsi]; newTf[i].desc = e.target.value; setTugasFungsi(newTf) }}
                    className={inputClass} rows={2} placeholder="Deskripsi tugas..." />
                </div>
                <div>
                  <button type="button" onClick={() => { const newTf = [...tugasFungsi]; newTf.splice(i, 1); setTugasFungsi(newTf) }}
                    className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100">✕</button>
                </div>
              </div>
            ))}
            {tugasFungsi.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada tugas & fungsi. Klik tombol + Tambah Item.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Gambar Pendukung</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Foto Kantor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Foto Kantor Sekretariat</label>
              {fotoKantorPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-[4/3]">
                  <img src={fotoKantorPreview} alt="Preview Kantor" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setFotoKantor(null); setFotoKantorPreview(form.foto_kantor_url || null) }}
                    className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg hover:bg-black/80">
                    Batal Ubah
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
                  <span className="text-3xl mb-2">🏢</span>
                  <span className="text-sm text-gray-400">Pilih Foto Kantor</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFotoKantorChange} className="hidden" />
                </label>
              )}
            </div>

            {/* Foto Peta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Foto Peta Wilayah</label>
              {fotoPetaPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-[4/3]">
                  <img src={fotoPetaPreview} alt="Preview Peta" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setFotoPeta(null); setFotoPetaPreview(form.foto_peta_url || null) }}
                    className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg hover:bg-black/80">
                    Batal Ubah
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
                  <span className="text-3xl mb-2">🗺️</span>
                  <span className="text-sm text-gray-400">Pilih Foto Peta</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFotoPetaChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading}
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition shadow-lg">
            {loading ? 'Menyimpan Perubahan...' : 'Simpan Profil RW'}
          </button>
        </div>
      </form>
    </div>
  )
}

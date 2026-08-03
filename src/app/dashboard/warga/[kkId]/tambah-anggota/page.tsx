'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'

const AGAMA_OPTIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']
const PENDIDIKAN_OPTIONS = ['tidak_sekolah', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']
const STATUS_KELUARGA_OPTIONS = [
  { value: 'kepala_kk', label: 'Kepala KK' },
  { value: 'istri', label: 'Istri' },
  { value: 'anak', label: 'Anak' },
  { value: 'lain', label: 'Lainnya' },
]
const STATUS_NIKAH_OPTIONS = [
  { value: 'belum_menikah', label: 'Belum Menikah' },
  { value: 'menikah', label: 'Menikah' },
  { value: 'cerai_hidup', label: 'Cerai Hidup' },
  { value: 'cerai_mati', label: 'Cerai Mati' },
]

export default function TambahAnggotaPage({
  params,
}: {
  params: Promise<{ kkId: string }>
}) {
  const { kkId } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nik: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'L',
    statusKeluarga: 'anak',
    agama: 'Islam',
    pendidikan: 'SMA',
    pekerjaan: '',
    statusPernikahan: 'belum_menikah',
    nomorHp: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/dashboard/kk/${kkId}/anggota`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan.')
      router.push(`/dashboard/warga/${kkId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
  const selectClass = inputClass + " bg-white"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/warga/${kkId}`} className="text-gray-400 hover:text-gray-700 text-sm">← Detail KK</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Tambah Anggota Keluarga</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">NIK <span className="text-red-500">*</span></label>
              <input value={form.nik} onChange={e => update('nik', e.target.value)}
                placeholder="16 digit NIK" maxLength={16} required className={inputClass + " font-mono"} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
              <input value={form.namaLengkap} onChange={e => update('namaLengkap', e.target.value)}
                placeholder="Nama sesuai KTP" required className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tempat Lahir <span className="text-red-500">*</span></label>
              <input value={form.tempatLahir} onChange={e => update('tempatLahir', e.target.value)}
                placeholder="Bandung" required className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tanggal Lahir <span className="text-red-500">*</span></label>
              <input type="date" value={form.tanggalLahir} onChange={e => update('tanggalLahir', e.target.value)}
                required className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
              <select value={form.jenisKelamin} onChange={e => update('jenisKelamin', e.target.value)} className={selectClass}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status dalam Keluarga <span className="text-red-500">*</span></label>
              <select value={form.statusKeluarga} onChange={e => update('statusKeluarga', e.target.value)} className={selectClass}>
                {STATUS_KELUARGA_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Agama <span className="text-red-500">*</span></label>
              <select value={form.agama} onChange={e => update('agama', e.target.value)} className={selectClass}>
                {AGAMA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Pendidikan Terakhir <span className="text-red-500">*</span></label>
              <select value={form.pendidikan} onChange={e => update('pendidikan', e.target.value)} className={selectClass}>
                {PENDIDIKAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Pekerjaan</label>
              <input value={form.pekerjaan} onChange={e => update('pekerjaan', e.target.value)}
                placeholder="Karyawan swasta" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status Pernikahan <span className="text-red-500">*</span></label>
              <select value={form.statusPernikahan} onChange={e => update('statusPernikahan', e.target.value)} className={selectClass}>
                {STATUS_NIKAH_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nomor HP</label>
              <input value={form.nomorHp} onChange={e => update('nomorHp', e.target.value)}
                placeholder="08xxxxxxxxxx" className={inputClass} />
            </div>

          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href={`/dashboard/warga/${kkId}`}
              className="px-5 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 transition text-gray-600">
              Batal
            </Link>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition">
              {loading ? 'Menyimpan...' : 'Simpan Anggota'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

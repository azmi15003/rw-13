'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const AGAMA_OPTIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']
const PENDIDIKAN_OPTIONS = ['tidak_sekolah', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']
const STATUS_KELUARGA_OPTIONS = ['kepala_kk', 'istri', 'anak', 'lain']
const STATUS_NIKAH_OPTIONS = ['belum_menikah', 'menikah', 'cerai_hidup', 'cerai_mati']
const LABEL_STATUS = { kepala_kk: 'Kepala KK', istri: 'Istri', anak: 'Anak', lain: 'Lainnya' }
const LABEL_NIKAH = { belum_menikah: 'Belum Menikah', menikah: 'Menikah', cerai_hidup: 'Cerai Hidup', cerai_mati: 'Cerai Mati' }

type Anggota = {
  nik: string
  namaLengkap: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: 'L' | 'P'
  statusKeluarga: string
  agama: string
  pendidikan: string
  pekerjaan: string
  statusPernikahan: string
  nomorHp: string
}

const emptyAnggota = (): Anggota => ({
  nik: '', namaLengkap: '', tempatLahir: '', tanggalLahir: '',
  jenisKelamin: 'L', statusKeluarga: 'kepala_kk', agama: 'Islam',
  pendidikan: 'SMA', pekerjaan: '', statusPernikahan: 'belum_menikah', nomorHp: '',
})

export default function TambahKKPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [nomorKK, setNomorKK] = useState('')
  const [alamat, setAlamat] = useState('')
  const [blokNomor, setBlokNomor] = useState('')
  const [anggota, setAnggota] = useState<Anggota[]>([{ ...emptyAnggota() }])

  function updateAnggota(index: number, field: keyof Anggota, value: string) {
    setAnggota(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a))
  }

  function addAnggota() {
    const last = anggota[anggota.length - 1]
    setAnggota(prev => [...prev, {
      ...emptyAnggota(),
      statusKeluarga: prev.length === 0 ? 'kepala_kk' : 'anak',
    }])
  }

  function removeAnggota(index: number) {
    if (anggota.length === 1) return
    setAnggota(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!anggota.some(a => a.statusKeluarga === 'kepala_kk')) {
      setError('Harus ada minimal 1 anggota dengan status Kepala KK.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/dashboard/kk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomorKK, alamat, blokNomor, anggota }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan data.')
      router.push('/dashboard/warga')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/warga" className="text-gray-400 hover:text-gray-700 text-sm">← Kembali</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Tambah Kartu Keluarga</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Data KK */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Data Kartu Keluarga</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nomor KK <span className="text-red-500">*</span></label>
              <input
                value={nomorKK}
                onChange={e => setNomorKK(e.target.value)}
                placeholder="16 digit nomor KK"
                maxLength={16}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Alamat Lengkap <span className="text-red-500">*</span></label>
              <textarea
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                placeholder="Jl. Nama Jalan No. X, RT 0X RW 13..."
                required
                rows={2}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Blok / Nomor Rumah</label>
              <input
                value={blokNomor}
                onChange={e => setBlokNomor(e.target.value)}
                placeholder="Blok A No. 12"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Anggota Keluarga */}
        <div className="space-y-3">
          {anggota.map((a, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Anggota {index + 1}
                  {a.statusKeluarga === 'kepala_kk' && (
                    <span className="ml-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">Kepala KK</span>
                  )}
                </h2>
                {anggota.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAnggota(index)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">NIK <span className="text-red-500">*</span></label>
                  <input
                    value={a.nik}
                    onChange={e => updateAnggota(index, 'nik', e.target.value)}
                    placeholder="16 digit NIK"
                    maxLength={16}
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input
                    value={a.namaLengkap}
                    onChange={e => updateAnggota(index, 'namaLengkap', e.target.value)}
                    placeholder="Nama sesuai KTP"
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Tempat Lahir <span className="text-red-500">*</span></label>
                  <input
                    value={a.tempatLahir}
                    onChange={e => updateAnggota(index, 'tempatLahir', e.target.value)}
                    placeholder="Bandung"
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Tanggal Lahir <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={a.tanggalLahir}
                    onChange={e => updateAnggota(index, 'tanggalLahir', e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <select
                    value={a.jenisKelamin}
                    onChange={e => updateAnggota(index, 'jenisKelamin', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Status dalam Keluarga <span className="text-red-500">*</span></label>
                  <select
                    value={a.statusKeluarga}
                    onChange={e => updateAnggota(index, 'statusKeluarga', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    {STATUS_KELUARGA_OPTIONS.map(s => (
                      <option key={s} value={s}>{LABEL_STATUS[s as keyof typeof LABEL_STATUS]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Agama <span className="text-red-500">*</span></label>
                  <select
                    value={a.agama}
                    onChange={e => updateAnggota(index, 'agama', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    {AGAMA_OPTIONS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Pendidikan Terakhir <span className="text-red-500">*</span></label>
                  <select
                    value={a.pendidikan}
                    onChange={e => updateAnggota(index, 'pendidikan', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    {PENDIDIKAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Pekerjaan</label>
                  <input
                    value={a.pekerjaan}
                    onChange={e => updateAnggota(index, 'pekerjaan', e.target.value)}
                    placeholder="Karyawan swasta"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Status Pernikahan <span className="text-red-500">*</span></label>
                  <select
                    value={a.statusPernikahan}
                    onChange={e => updateAnggota(index, 'statusPernikahan', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    {STATUS_NIKAH_OPTIONS.map(s => (
                      <option key={s} value={s}>{LABEL_NIKAH[s as keyof typeof LABEL_NIKAH]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Nomor HP</label>
                  <input
                    value={a.nomorHp}
                    onChange={e => updateAnggota(index, 'nomorHp', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAnggota}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition"
          >
            + Tambah Anggota Keluarga
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            href="/dashboard/warga"
            className="px-5 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 transition text-gray-600"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition"
          >
            {loading ? 'Menyimpan...' : 'Simpan Data KK'}
          </button>
        </div>
      </form>
    </div>
  )
}

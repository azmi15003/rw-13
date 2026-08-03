import { requireAdminRT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import VerifikasiButton from './VerifikasiButton'

const LABEL_STATUS_KELUARGA: Record<string, string> = {
  kepala_kk: 'Kepala KK', istri: 'Istri', anak: 'Anak', lain: 'Lainnya'
}
const LABEL_STATUS_AKTIF: Record<string, string> = {
  aktif: 'Aktif', pindah: 'Pindah', meninggal: 'Meninggal'
}

export default async function DetailKKPage({
  params,
}: {
  params: Promise<{ kkId: string }>
}) {
  await requireAdminRT()
  const { kkId } = await params

  const kk = await prisma.kartu_keluarga.findUnique({
    where: { id: kkId },
    include: {
      rt: true,
      warga: { orderBy: [{ status_keluarga: 'asc' }, { nama_lengkap: 'asc' }] },
      users: { select: { nama_lengkap: true } },
    }
  })

  if (!kk) notFound()

  const kepala = kk.warga.find(w => w.status_keluarga === 'kepala_kk')
  const totalAktif = kk.warga.filter(w => w.status_aktif === 'aktif').length

  return (
    <div className="max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/warga" className="text-gray-400 hover:text-gray-700 text-sm">← Data Warga</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Detail KK</h1>
      </div>

      {/* KK Info Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">{kk.nomor_kk}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                kk.status_verifikasi === 'verified'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {kk.status_verifikasi === 'verified' ? '✓ Verified' : '⏳ Pending'}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{kepala?.nama_lengkap || 'Kepala KK belum diisi'}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{kk.blok_nomor || kk.alamat_lengkap} · RT {kk.rt.nomor_rt}</p>
            <p className="text-xs text-gray-400 mt-1">{totalAktif} jiwa aktif · Diinput oleh: {kk.users?.nama_lengkap || 'Sistem'}</p>
          </div>
          <div className="flex items-center gap-2">
            <VerifikasiButton kkId={kk.id} currentStatus={kk.status_verifikasi} />
            <Link
              href={`/dashboard/warga/${kk.id}/tambah-anggota`}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600"
            >
              + Anggota
            </Link>
          </div>
        </div>
      </div>

      {/* Daftar Anggota */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Anggota Keluarga ({kk.warga.length})</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {kk.warga.map(w => {
            const initials = w.nama_lengkap.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            const umur = new Date().getFullYear() - new Date(w.tanggal_lahir).getFullYear()
            return (
              <div key={w.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                  w.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{w.nama_lengkap}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {LABEL_STATUS_KELUARGA[w.status_keluarga]}
                    </span>
                    {w.status_aktif !== 'aktif' && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {LABEL_STATUS_AKTIF[w.status_aktif]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    NIK: {w.nik} · {w.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} · {umur} thn · {w.agama} · {w.pendidikan}
                  </p>
                  {w.pekerjaan && <p className="text-xs text-gray-400">{w.pekerjaan}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {w.nomor_hp && (
                    <a href={`https://wa.me/${w.nomor_hp.replace(/^0/, '62')}`}
                      target="_blank"
                      className="text-xs text-green-600 hover:text-green-800">
                      📱 WA
                    </a>
                  )}
                  <Link
                    href={`/dashboard/warga/${kk.id}/edit-anggota/${w.id}`}
                    className="text-xs border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50 transition text-gray-600"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            )
          })}
          {kk.warga.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Belum ada anggota. Klik "+ Anggota" untuk menambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

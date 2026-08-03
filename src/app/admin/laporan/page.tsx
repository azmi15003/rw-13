import { requireAdminRT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import LaporanActions from './LaporanActions'

const STATUS_COLOR: Record<string, string> = {
  masuk: 'bg-blue-100 text-blue-700',
  diproses: 'bg-amber-100 text-amber-700',
  selesai: 'bg-green-100 text-green-700',
  ditolak: 'bg-red-100 text-red-700',
}

const KATEGORI_ICON: Record<string, string> = {
  kehilangan: '🔍',
  kerusakan_fasilitas: '🔧',
  keamanan: '🛡️',
  kebersihan: '🧹',
  sosial: '🤝',
  administrasi: '📋',
  lainnya: '📌',
}

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; kategori?: string }>
}) {
  const profile = await requireAdminRT()
  const params = await searchParams
  const isSuperAdmin = profile.role === 'super_admin'

  const where = {
    ...(isSuperAdmin ? {} : { rt_id: profile.rt_id! }),
    ...(params.status ? { status: params.status as any } : {}),
    ...(params.kategori ? { kategori: params.kategori as any } : {}),
  }

  const [laporan, totalByStatus] = await Promise.all([
    prisma.laporan.findMany({
      where,
      include: { rt: true },
      orderBy: { created_at: 'desc' },
    }),
    prisma.laporan.groupBy({
      by: ['status'],
      where: isSuperAdmin ? {} : { rt_id: profile.rt_id! },
      _count: { id: true },
    }),
  ])

  const statusCount = Object.fromEntries(totalByStatus.map(s => [s.status, s._count.id]))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Laporan Warga</h1>
          <p className="text-sm text-gray-500">{isSuperAdmin ? 'Semua RT' : `RT ${profile.rt?.nomor_rt}`} — {laporan.length} laporan</p>
        </div>
        <Link href="/admin/laporan/tambah"
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-700 transition">
          + Buat Laporan
        </Link>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { status: 'masuk', label: 'Masuk', icon: '📥' },
          { status: 'diproses', label: 'Diproses', icon: '⚙️' },
          { status: 'selesai', label: 'Selesai', icon: '✅' },
          { status: 'ditolak', label: 'Ditolak', icon: '❌' },
        ].map(s => (
          <Link key={s.status} href={`/admin/laporan?status=${s.status}`}
            className={`bg-white rounded-2xl border p-4 hover:border-gray-400 transition ${params.status === s.status ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'}`}>
            <p className="text-xs text-gray-400 mb-1">{s.icon} {s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{statusCount[s.status] || 0}</p>
          </Link>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Link href="/admin/laporan"
          className={`text-xs px-3 py-1.5 rounded-full border transition ${!params.status && !params.kategori ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          Semua
        </Link>
        {['kehilangan', 'kerusakan_fasilitas', 'keamanan', 'kebersihan', 'sosial', 'administrasi', 'lainnya'].map(k => (
          <Link key={k} href={`/admin/laporan?kategori=${k}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${params.kategori === k ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {KATEGORI_ICON[k]} {k.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {/* Laporan List */}
      <div className="space-y-2">
        {laporan.map(l => (
          <div key={l.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                {KATEGORI_ICON[l.kategori] || '📌'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{l.judul}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[l.status]}`}>
                    {l.status}
                  </span>
                  {isSuperAdmin && (
                    <span className="text-xs text-gray-400">RT {l.rt.nomor_rt}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{l.deskripsi}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-gray-400">👤 {l.pelapor_nama}</span>
                  {l.pelapor_hp && <span className="text-xs text-gray-400">📱 {l.pelapor_hp}</span>}
                  {l.lokasi_kejadian && <span className="text-xs text-gray-400">📍 {l.lokasi_kejadian}</span>}
                  <span className="text-xs text-gray-400">
                    {new Date(l.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {l.catatan_admin && (
                  <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 text-xs text-blue-700">
                    📝 Catatan Admin: {l.catatan_admin}
                  </div>
                )}
              </div>
              <LaporanActions id={l.id} currentStatus={l.status} />
            </div>
          </div>
        ))}
        {laporan.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-400">
            Belum ada laporan{params.status ? ` dengan status "${params.status}"` : ''}.
          </div>
        )}
      </div>
    </div>
  )
}

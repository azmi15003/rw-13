import { requireAdminRT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DataWargaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const profile = await requireAdminRT()
  const params = await searchParams
  const isSuperAdmin = profile.role === 'super_admin'

  const q = params.q || ''
  const status = params.status || ''
  const page = parseInt(params.page || '1')
  const perPage = 10

  const whereKK = {
    ...(isSuperAdmin ? {} : { rt_id: profile.rt_id! }),
    ...(status ? { status_verifikasi: status as any } : {}),
    ...(q ? {
      OR: [
        { nomor_kk: { contains: q, mode: 'insensitive' as any } },
        { alamat_lengkap: { contains: q, mode: 'insensitive' as any } },
        { warga: { some: { nama_lengkap: { contains: q, mode: 'insensitive' as any } } } },
      ]
    } : {}),
  }

  const [kartuKeluarga, totalKK] = await Promise.all([
    prisma.kartu_keluarga.findMany({
      where: whereKK,
      include: {
        rt: true,
        warga: { where: { status_aktif: 'aktif' } },
        users: { select: { nama_lengkap: true } },
      },
      orderBy: { updated_at: 'desc' },
      take: perPage,
      skip: (page - 1) * perPage,
    }),
    prisma.kartu_keluarga.count({ where: whereKK }),
  ])

  const totalPages = Math.ceil(totalKK / perPage)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Data Warga</h1>
          <p className="text-sm text-gray-500">
            {isSuperAdmin ? 'Semua RT' : `RT ${profile.rt?.nomor_rt}`} — {totalKK} Kartu Keluarga
          </p>
        </div>
        <Link
          href="/dashboard/warga/tambah"
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-700 transition"
        >
          + Tambah KK
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <form className="flex items-center gap-3 flex-1" method="GET">
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari nama, nomor KK, atau alamat..."
              className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <select
              name="status"
              defaultValue={status}
              className="px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Semua Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition"
            >
              Cari
            </button>
            {(q || status) && (
              <Link
                href="/dashboard/warga"
                className="px-4 py-2 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 transition text-gray-600"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['NO. KK', 'KEPALA KELUARGA', 'ALAMAT', 'RT', 'JIWA', 'STATUS', 'AKSI'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {kartuKeluarga.map(kk => {
              const kepala = kk.warga.find(w => w.status_keluarga === 'kepala_kk')
              const initials = kepala?.nama_lengkap?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'KK'
              return (
                <tr key={kk.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{kk.nomor_kk}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{kepala?.nama_lengkap || '—'}</p>
                        <p className="text-xs text-gray-400">NIK: {kepala?.nik || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-48">
                    <p className="truncate">{kk.blok_nomor || kk.alamat_lengkap}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">RT {kk.rt.nomor_rt}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{kk.warga.length} jiwa</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                      kk.status_verifikasi === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {kk.status_verifikasi === 'verified' ? '✓ Verified' : '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/dashboard/warga/${kk.id}`}
                        className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600"
                      >
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {kartuKeluarga.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                  {q || status ? 'Tidak ada hasil yang cocok.' : 'Belum ada data KK. Klik "+ Tambah KK" untuk mulai.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalKK)} dari {totalKK} KK
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={`/dashboard/warga?page=${p}${q ? `&q=${q}` : ''}${status ? `&status=${status}` : ''}`}
                  className={`w-8 h-8 flex items-center justify-center text-xs rounded-lg transition ${
                    p === page
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { requireAdminRT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const profile = await requireAdminRT()
  const isSuperAdmin = profile.role === 'super_admin'

  // Query statistik berdasarkan role
  const whereKK = isSuperAdmin ? {} : { rt_id: profile.rt_id! }

  const [totalKK, totalWarga, totalLaki, totalPerempuan, recentKK] = await Promise.all([
    prisma.kartu_keluarga.count({ where: whereKK }),
    prisma.warga.count({
      where: {
        status_aktif: 'aktif',
        kartu_keluarga: whereKK,
      }
    }),
    prisma.warga.count({
      where: { jenis_kelamin: 'L', status_aktif: 'aktif', kartu_keluarga: whereKK }
    }),
    prisma.warga.count({
      where: { jenis_kelamin: 'P', status_aktif: 'aktif', kartu_keluarga: whereKK }
    }),
    prisma.kartu_keluarga.findMany({
      where: whereKK,
      take: 5,
      orderBy: { updated_at: 'desc' },
      include: {
        warga: { where: { status_keluarga: 'kepala_kk' }, take: 1 },
        rt: true,
      }
    }),
  ])

  // Upcoming event
  const nextEvent = await prisma.kegiatan.findFirst({
    where: {
      tanggal_mulai: { gte: new Date() },
      published_at: { not: null },
    },
    orderBy: { tanggal_mulai: 'asc' },
  })

  const rtLabel = isSuperAdmin ? 'Semua RT' : `RT ${profile.rt?.nomor_rt}`

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{rtLabel} Overview</h1>
          <p className="text-sm text-gray-500">Data per hari ini</p>
        </div>
        <input
          type="text"
          placeholder="Search records..."
          className="px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-56"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'TOTAL FAMILY (KK)', value: totalKK, sub: null },
          { label: 'TOTAL RESIDENTS', value: totalWarga, sub: 'active' },
          { label: 'MALE (L)', value: totalLaki, sub: null },
          { label: 'FEMALE (P)', value: totalPerempuan, sub: null },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">
              {stat.value.toLocaleString('id-ID')}
              {stat.sub && <span className="text-sm font-normal text-gray-400 ml-1">{stat.sub}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Recent KK Table */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Recent Family Records</h2>
              <p className="text-xs text-gray-400">5 data KK terbaru</p>
            </div>
            <button className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition">
              Export PDF
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['ID', 'KEPALA KK', 'ALAMAT', 'STATUS', ''].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentKK.map(kk => {
                const kepala = kk.warga[0]
                const initials = kepala?.nama_lengkap?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'KK'
                return (
                  <tr key={kk.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-xs font-mono text-gray-500">
                      #{kk.nomor_kk.slice(-5)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                          {initials}
                        </div>
                        <span className="text-sm text-gray-900 truncate max-w-28">
                          {kepala?.nama_lengkap || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 truncate max-w-32">
                      {kk.blok_nomor || kk.alamat_lengkap.slice(0, 20)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        kk.status_verifikasi === 'verified'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {kk.status_verifikasi === 'verified' ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-700 text-sm">✏️</button>
                        <button className="text-gray-400 hover:text-red-500 text-sm">🗑️</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {recentKK.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                    Belum ada data KK. Klik "Tambah Data KK" untuk mulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Next Event */}
        <div className="bg-gray-900 rounded-2xl p-5 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium bg-white/20 rounded-full px-3 py-1">NEXT EVENT</span>
            {nextEvent ? (
              <>
                <h3 className="text-lg font-bold mt-3 mb-2">{nextEvent.judul}</h3>
                <p className="text-sm text-white/60 line-clamp-3">{nextEvent.deskripsi}</p>
                <p className="text-sm text-white/80 mt-3">
                  📅 {new Date(nextEvent.tanggal_mulai).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                {nextEvent.lokasi && (
                  <p className="text-sm text-white/60">📍 {nextEvent.lokasi}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-white/60 mt-3">Belum ada kegiatan mendatang.</p>
            )}
          </div>
          <button className="mt-4 bg-white text-gray-900 text-sm font-medium py-2 rounded-xl hover:bg-gray-100 transition">
            Lihat Detail →
          </button>
        </div>
      </div>
    </div>
  )
}

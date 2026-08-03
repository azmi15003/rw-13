import { requireAdminRT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function StatistikPage() {
  const profile = await requireAdminRT()
  const isSuperAdmin = profile.role === 'super_admin'
  const whereKK = isSuperAdmin ? {} : { rt_id: profile.rt_id! }
  const whereWarga = { status_aktif: 'aktif' as const, kartu_keluarga: whereKK }

  const [
    totalKK, totalWarga, totalLaki, totalPerempuan,
    byAgama, byPendidikan, byPekerjaan,
    totalPindah, totalMeninggal,
  ] = await Promise.all([
    prisma.kartu_keluarga.count({ where: whereKK }),
    prisma.warga.count({ where: whereWarga }),
    prisma.warga.count({ where: { ...whereWarga, jenis_kelamin: 'L' } }),
    prisma.warga.count({ where: { ...whereWarga, jenis_kelamin: 'P' } }),
    prisma.warga.groupBy({ by: ['agama'], where: whereWarga, _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.warga.groupBy({ by: ['pendidikan'], where: whereWarga, _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.warga.groupBy({ by: ['pekerjaan'], where: { ...whereWarga, pekerjaan: { not: null } }, _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 5 }),
    prisma.warga.count({ where: { status_aktif: 'pindah', kartu_keluarga: whereKK } }),
    prisma.warga.count({ where: { status_aktif: 'meninggal', kartu_keluarga: whereKK } }),
  ])

  // Hitung kelompok usia
  const allWarga = await prisma.warga.findMany({
    where: whereWarga,
    select: { tanggal_lahir: true }
  })
  const now = new Date()
  const usia = { '0-12': 0, '13-18': 0, '19-45': 0, '46-60': 0, '60+': 0 }
  allWarga.forEach(w => {
    const umur = now.getFullYear() - new Date(w.tanggal_lahir).getFullYear()
    if (umur <= 12) usia['0-12']++
    else if (umur <= 18) usia['13-18']++
    else if (umur <= 45) usia['19-45']++
    else if (umur <= 60) usia['46-60']++
    else usia['60+']++
  })

  const maxUsia = Math.max(...Object.values(usia))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Statistik</h1>
        <p className="text-sm text-gray-500">{isSuperAdmin ? 'Semua RT' : `RT ${profile.rt?.nomor_rt}`}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total KK', value: totalKK, color: 'bg-gray-900 text-white' },
          { label: 'Total Jiwa', value: totalWarga, color: 'bg-white' },
          { label: 'Laki-laki', value: totalLaki, color: 'bg-blue-50' },
          { label: 'Perempuan', value: totalPerempuan, color: 'bg-pink-50' },
          { label: 'Pindah/Meninggal', value: totalPindah + totalMeninggal, color: 'bg-red-50' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border border-gray-100 p-4 ${s.color}`}>
            <p className={`text-xs font-medium mb-1 ${s.color.includes('900') ? 'text-gray-300' : 'text-gray-400'}`}>{s.label}</p>
            <p className={`text-2xl font-bold ${s.color.includes('900') ? 'text-white' : 'text-gray-900'}`}>{s.value.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Distribusi Usia */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Distribusi Usia</h3>
          <div className="space-y-3">
            {Object.entries(usia).map(([range, count]) => (
              <div key={range} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12">{range}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gray-900 h-2 rounded-full transition-all"
                    style={{ width: maxUsia > 0 ? `${(count / maxUsia) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8 text-right">{count}</span>
                <span className="text-xs text-gray-400 w-10">
                  {totalWarga > 0 ? `${Math.round((count / totalWarga) * 100)}%` : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agama */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Agama</h3>
          <div className="space-y-2.5">
            {byAgama.map((item: any) => (
              <div key={item.agama} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.agama}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-gray-900 h-1.5 rounded-full"
                      style={{ width: totalWarga > 0 ? `${(item._count.id / totalWarga) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{item._count.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pendidikan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Pendidikan Terakhir</h3>
          <div className="space-y-2.5">
            {byPendidikan.map((item: any) => (
              <div key={item.pendidikan} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.pendidikan}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: totalWarga > 0 ? `${(item._count.id / totalWarga) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{item._count.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pekerjaan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Top 5 Pekerjaan</h3>
          <div className="space-y-2.5">
            {byPekerjaan.length > 0 ? byPekerjaan.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate max-w-40">{item.pekerjaan || 'Tidak diisi'}</span>
                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                  {item._count.id}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-400">Belum ada data pekerjaan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

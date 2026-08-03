import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminOverviewPage() {
  await requireSuperAdmin()

  const rtList = await prisma.rt.findMany({ orderBy: { nomor_rt: 'asc' } })

  const rtStats = await Promise.all(
    rtList.map(async rt => {
      const [totalKK, totalWarga, totalLaki, totalPerempuan, pendingKK] = await Promise.all([
        prisma.kartu_keluarga.count({ where: { rt_id: rt.id } }),
        prisma.warga.count({ where: { status_aktif: 'aktif', kartu_keluarga: { rt_id: rt.id } } }),
        prisma.warga.count({ where: { jenis_kelamin: 'L', status_aktif: 'aktif', kartu_keluarga: { rt_id: rt.id } } }),
        prisma.warga.count({ where: { jenis_kelamin: 'P', status_aktif: 'aktif', kartu_keluarga: { rt_id: rt.id } } }),
        prisma.kartu_keluarga.count({ where: { rt_id: rt.id, status_verifikasi: 'pending' } }),
      ])
      return { ...rt, totalKK, totalWarga, totalLaki, totalPerempuan, pendingKK }
    })
  )

  const totalKK = rtStats.reduce((s, r) => s + r.totalKK, 0)
  const totalWarga = rtStats.reduce((s, r) => s + r.totalWarga, 0)
  const totalPending = rtStats.reduce((s, r) => s + r.pendingKK, 0)

  return (
    <div className="max-w-8xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Overview RW 13</h1>
        <p className="text-sm text-gray-500">Rekap data seluruh RT</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total KK', value: totalKK },
          { label: 'Total Jiwa Aktif', value: totalWarga },
          { label: 'Jumlah RT', value: rtList.length },
          { label: 'KK Pending Verifikasi', value: totalPending, warn: totalPending > 0 },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border p-4 ${s.warn ? 'border-amber-200 bg-amber-50' : 'bg-white border-gray-200'}`}>
            <p className={`text-xs font-medium mb-1 ${s.warn ? 'text-amber-600' : 'text-gray-400'}`}>{s.label}</p>
            <p className={`text-3xl font-bold ${s.warn ? 'text-amber-700' : 'text-gray-900'}`}>{s.value.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>

      {/* Per RT Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Data Per RT</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['RT', 'KETUA RT', 'TOTAL KK', 'TOTAL JIWA', 'LAKI-LAKI', 'PEREMPUAN', 'PENDING'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rtStats.map(rt => (
              <tr key={rt.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-xs font-bold rounded-lg">
                    {rt.nomor_rt}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">{rt.nama_ketua}</td>
                <td className="px-5 py-3 text-sm font-medium text-gray-900">{rt.totalKK}</td>
                <td className="px-5 py-3 text-sm font-medium text-gray-900">{rt.totalWarga}</td>
                <td className="px-5 py-3 text-sm text-blue-600">{rt.totalLaki}</td>
                <td className="px-5 py-3 text-sm text-pink-600">{rt.totalPerempuan}</td>
                <td className="px-5 py-3">
                  {rt.pendingKK > 0 ? (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      {rt.pendingKK} pending
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50">
              <td className="px-5 py-3 text-xs font-semibold text-gray-500" colSpan={2}>TOTAL</td>
              <td className="px-5 py-3 text-sm font-bold text-gray-900">{totalKK}</td>
              <td className="px-5 py-3 text-sm font-bold text-gray-900">{totalWarga}</td>
              <td className="px-5 py-3 text-sm font-bold text-blue-600">{rtStats.reduce((s, r) => s + r.totalLaki, 0)}</td>
              <td className="px-5 py-3 text-sm font-bold text-pink-600">{rtStats.reduce((s, r) => s + r.totalPerempuan, 0)}</td>
              <td className="px-5 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

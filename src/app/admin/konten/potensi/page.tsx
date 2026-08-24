import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PotensiForm from './PotensiForm'
import PotensiActions from './PotensiActions'

export default async function AdminPotensiPage() {
  await requireSuperAdmin()

  const potensi = await prisma.potensi.findMany({
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Potensi Wilayah</h1>
          <p className="text-sm text-gray-500">Kelola informasi potensi RW 13 untuk halaman publik</p>
        </div>
        <Link href="/potensi" target="_blank"
          className="flex items-center gap-2 border border-gray-200 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 text-gray-600 transition">
          👁 Preview Publik
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Tambah Potensi Baru</h2>
        <PotensiForm />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-900">Daftar Potensi ({potensi.length})</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['IKON', 'JUDUL & DESKRIPSI', 'LABEL/JUMLAH', 'POIN DETAIL', 'AKSI'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {potensi.map(p => {
              const detailPoin = (p.detail_poin as string[]) || []
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 w-16 text-center">
                    <span className="text-3xl">{p.icon}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-900">{p.judul}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-sm">{p.deskripsi}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.badge_warna}`}>
                      {p.count_label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
                      {detailPoin.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-4">
                    <PotensiActions potensi={{ ...p, detail_poin: detailPoin }} />
                  </td>
                </tr>
              )
            })}
            {potensi.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">Belum ada data potensi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

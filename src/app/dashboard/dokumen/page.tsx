import { requireAdminRT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const KATEGORI_ICON: Record<string, string> = {
  kependudukan: '🪪',
  pernikahan: '💒',
  kematian: '🕊️',
  regulasi: '📋',
  lainnya: '📎',
}

const KATEGORI_COLOR: Record<string, string> = {
  kependudukan: 'bg-blue-100 text-blue-700',
  pernikahan: 'bg-pink-100 text-pink-700',
  kematian: 'bg-gray-100 text-gray-600',
  regulasi: 'bg-purple-100 text-purple-700',
  lainnya: 'bg-orange-100 text-orange-700',
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DokumenPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string }>
}) {
  await requireAdminRT()
  const params = await searchParams
  const kategoriFilter = params.kategori || ''
  const q = params.q || ''

  const dokumen = await prisma.dokumen.findMany({
    where: {
      ...(kategoriFilter ? { kategori: kategoriFilter as any } : {}),
      ...(q ? { OR: [{ nama: { contains: q, mode: 'insensitive' } }, { deskripsi: { contains: q, mode: 'insensitive' } }] } : {}),
    },
    orderBy: { updated_at: 'desc' },
  })

  const byKategori = await prisma.dokumen.groupBy({
    by: ['kategori'],
    _count: { id: true },
  })

  const kategoriList = ['kependudukan', 'pernikahan', 'kematian', 'regulasi', 'lainnya']

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pusat Dokumen Digital</h1>
          <p className="text-sm text-gray-500">Akses berkas administratif dan formulir kependudukan RW 13</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="col-span-2 space-y-3">
          {/* Search & Filter */}
          <form method="GET" className="flex gap-2">
            <input name="q" defaultValue={q} placeholder="Cari nama dokumen..."
              className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
            {kategoriFilter && <input type="hidden" name="kategori" value={kategoriFilter} />}
            <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl">Cari</button>
          </form>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            <Link href="/dashboard/dokumen"
              className={`text-xs px-3 py-1.5 rounded-full border transition ${!kategoriFilter ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              Semua
            </Link>
            {kategoriList.map(k => (
              <Link key={k} href={`/dashboard/dokumen?kategori=${k}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition capitalize ${kategoriFilter === k ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {KATEGORI_ICON[k]} {k}
              </Link>
            ))}
          </div>

          {/* Dokumen List */}
          <div className="space-y-2">
            {dokumen.map(dok => (
              <div key={dok.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-300 transition">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {KATEGORI_ICON[dok.kategori] || '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{dok.nama}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${KATEGORI_COLOR[dok.kategori]}`}>
                      {dok.kategori}
                    </span>
                  </div>
                  {dok.deskripsi && <p className="text-xs text-gray-500 truncate">{dok.deskripsi}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update: {new Date(dok.updated_at).toLocaleDateString('id-ID')} · {dok.tipe_file.toUpperCase()} · {formatBytes(dok.ukuran_bytes)} · {dok.jumlah_unduh}x diunduh
                  </p>
                </div>
                <a href={`/api/dashboard/dokumen/${dok.id}/download`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-xl hover:bg-gray-700 transition flex-shrink-0">
                  ⬇ Unduh
                </a>
              </div>
            ))}
            {dokumen.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-400">
                {q || kategoriFilter ? 'Tidak ada dokumen yang cocok.' : 'Belum ada dokumen. Admin dapat menambahkan dokumen melalui menu Konten.'}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Kategori Count */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategori Berkas</h3>
            <div className="space-y-2">
              {kategoriList.map(k => {
                const count = byKategori.find(b => b.kategori === k)?._count.id || 0
                return (
                  <Link key={k} href={`/dashboard/dokumen?kategori=${k}`}
                    className="flex items-center justify-between py-1.5 hover:opacity-70 transition">
                    <span className="text-sm text-gray-600 capitalize">{KATEGORI_ICON[k]} {k}</span>
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{count} Berkas</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Bantuan */}
          <div className="bg-gray-900 rounded-2xl p-4 text-white">
            <h3 className="text-sm font-semibold mb-2">Bantuan Admin</h3>
            <p className="text-xs text-white/70 mb-3">Mengalami kesulitan dalam pengurusan dokumen? Hubungi sekretariat RW 13.</p>
            <p className="text-xs text-white/80 font-medium">📱 WhatsApp Admin</p>
            <p className="text-xs text-white/60 mb-2">Lihat info RW untuk nomor kontak</p>
            <Link href="/" className="block text-center bg-white text-gray-900 text-xs font-medium py-2 rounded-xl hover:bg-gray-100 transition">
              Info Kontak RW
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 60

const KATEGORI_COLOR: Record<string, string> = {
  pembangunan: 'bg-orange-100 text-orange-700',
  kesehatan: 'bg-green-100 text-green-700',
  digital: 'bg-blue-100 text-blue-700',
  keamanan: 'bg-red-100 text-red-700',
  sosial: 'bg-purple-100 text-purple-700',
  administrasi: 'bg-gray-100 text-gray-700',
  lainnya: 'bg-gray-100 text-gray-600',
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>
}) {
  const params = await searchParams
  const kategoriFilter = params.kategori || ''

  const [berita, kegiatan] = await Promise.all([
    prisma.pengumuman.findMany({
      where: {
        published_at: { not: null },
        ...(kategoriFilter ? { kategori: kategoriFilter as any } : {}),
      },
      orderBy: { published_at: 'desc' },
      take: 12,
    }),
    prisma.kegiatan.findMany({
      where: { published_at: { not: null } },
      orderBy: { tanggal_mulai: 'desc' },
      take: 6,
    }),
  ])

  const BULAN = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES']

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Portal Informasi</p>
          <h1 className="text-3xl font-bold mb-2">Berita & Kegiatan</h1>
          <p className="text-sm text-white/60">Informasi terkini seputar kegiatan dan perkembangan RW 13.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Main — Berita */}
          <div className="col-span-2">
            {/* Filter Kategori */}
            <div className="flex gap-2 flex-wrap mb-6">
              <Link href="/berita"
                className={`text-xs px-3 py-1.5 rounded-full border transition ${!kategoriFilter ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                Semua
              </Link>
              {['pembangunan', 'kesehatan', 'digital', 'keamanan', 'sosial', 'administrasi'].map(k => (
                <Link key={k} href={`/berita?kategori=${k}`}
                  className={`text-xs px-3 py-1.5 rounded-full border transition capitalize ${kategoriFilter === k ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {k}
                </Link>
              ))}
            </div>

            <div className="space-y-4">
              {berita.map(b => (
                <article key={b.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4 hover:border-gray-300 transition">
                  <div className="w-28 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {b.foto_url ? (
                      <img src={b.foto_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-2xl opacity-30">📢</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${KATEGORI_COLOR[b.kategori] || 'bg-gray-100 text-gray-600'}`}>
                        {b.kategori}
                      </span>
                      <span className="text-xs text-gray-400">
                        {b.published_at && new Date(b.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{b.judul}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: b.konten.replace(/<[^>]+>/g, '') }} />
                  </div>
                </article>
              ))}
              {berita.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">Belum ada berita yang dipublikasikan.</div>
              )}
            </div>
          </div>

          {/* Sidebar — Kegiatan */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">📅 Agenda Kegiatan</h3>
            <div className="space-y-3">
              {kegiatan.map(k => {
                const tgl = new Date(k.tanggal_mulai)
                return (
                  <div key={k.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start gap-3 hover:border-gray-300 transition">
                    <div className="bg-gray-900 text-white rounded-xl p-2.5 flex-shrink-0 text-center min-w-[48px]">
                      <p className="text-xs font-medium text-white/60">{BULAN[tgl.getMonth()]}</p>
                      <p className="text-lg font-bold leading-tight">{tgl.getDate()}</p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 line-clamp-2">{k.judul}</h4>
                      {k.lokasi && <p className="text-xs text-gray-400 mt-0.5">📍 {k.lokasi}</p>}
                    </div>
                  </div>
                )
              })}
              {kegiatan.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">Belum ada agenda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

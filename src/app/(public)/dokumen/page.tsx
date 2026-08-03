import { prisma } from '@/lib/prisma'

export const revalidate = 60

const KATEGORI_ICON: Record<string, string> = {
  kependudukan: '🪪', pernikahan: '💒', kematian: '🕊️', regulasi: '📋', lainnya: '📎',
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DokumenPublikPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>
}) {
  const params = await searchParams
  const kategoriFilter = params.kategori || ''

  const dokumen = await prisma.dokumen.findMany({
    where: kategoriFilter ? { kategori: kategoriFilter as any } : {},
    orderBy: { created_at: 'desc' },
  })

  const kategoriList = ['kependudukan', 'pernikahan', 'kematian', 'regulasi', 'lainnya']

  return (
    <div className="pt-14">
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Unduh Berkas</p>
          <h1 className="text-3xl font-bold mb-2">Dokumen & Formulir</h1>
          <p className="text-sm text-white/60">Unduh formulir dan berkas administratif resmi RW 13.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[{ value: '', label: 'Semua Dokumen' }, ...kategoriList.map(k => ({ value: k, label: k }))].map(item => (
            <a key={item.value} href={item.value ? `/dokumen?kategori=${item.value}` : '/dokumen'}
              className={`text-xs px-4 py-2 rounded-full border transition capitalize ${kategoriFilter === item.value ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {item.value ? `${KATEGORI_ICON[item.value]} ${item.label}` : item.label}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {dokumen.map(d => (
            <div key={d.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                {KATEGORI_ICON[d.kategori] || '📄'}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{d.nama}</h3>
              {d.deskripsi && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{d.deskripsi}</p>}
              <p className="text-xs text-gray-400 mb-4">
                {d.tipe_file.toUpperCase()} · {formatBytes(d.ukuran_bytes)} · {d.jumlah_unduh}× diunduh
              </p>
              <a href={d.file_url} target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white text-xs font-medium py-2.5 rounded-xl hover:bg-gray-700 transition">
                ⬇ Unduh {d.tipe_file.toUpperCase()}
              </a>
            </div>
          ))}
          {dokumen.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400 text-sm">
              Belum ada dokumen tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

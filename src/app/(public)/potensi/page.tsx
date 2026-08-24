import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function PotensiPage() {
  let potensiDB: any[] = []
  try {
    potensiDB = await prisma.potensi.findMany({
      orderBy: { created_at: 'asc' }
    })
  } catch (error) {
    console.error('Failed to fetch potensi', error)
  }

  const stats = [
    { value: '302+', label: 'Kepala Keluarga' },
    { value: '1.131+', label: 'Warga Aktif' },
    { value: '8', label: 'RT Aktif' },
    { value: '45+', label: 'UMKM Warga' },
  ]

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Keunggulan Wilayah</p>
          <h1 className="text-3xl font-bold mb-2">Potensi RW 13</h1>
          <p className="text-sm text-white/60">Kekayaan sumber daya manusia dan potensi wilayah Komplek Bukit Padjajaran.</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#185FA5] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-4 divide-x divide-white/20">
            {stats.map((s, i) => (
              <div key={i} className="text-center px-6">
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-xs text-white/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-5">
          {potensiDB.map((p, i) => {
            const detailPoin = (p.detail_poin as string[]) || []
            return (
            <div key={i} className={`border rounded-2xl p-6 hover:shadow-sm transition ${p.warna}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{p.icon}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.badge_warna}`}>
                  {p.count_label}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{p.judul}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{p.deskripsi}</p>
              <div className="space-y-1.5">
                {detailPoin.map((d, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-[10px]">🔸</span> {d}
                  </div>
                ))}
              </div>
            </div>
          )})}
        </div>

        {/* CTA Bergabung */}
        <div className="mt-10 bg-gray-900 text-white rounded-2xl p-8">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Punya Potensi yang Ingin Dikenal?</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Jika kamu adalah warga RW 13 yang memiliki usaha, keahlian, atau kegiatan positif yang ingin dipublikasikan,
                hubungi pengurus RW untuk pendaftaran.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a href="mailto:asep.sholahuddin@gmail.com"
                className="flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-3 rounded-xl hover:bg-gray-100 transition">
                📧 Kirim Email ke Admin
              </a>
              <a href="/#kontak"
                className="flex items-center justify-center gap-2 border border-white/30 text-white text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/10 transition">
                💬 Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

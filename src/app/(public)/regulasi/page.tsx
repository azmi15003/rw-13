import { prisma } from '@/lib/prisma'

export const revalidate = 300

const REGULASI_DEFAULT = [
  {
    judul: 'Anggaran Dasar & Anggaran Rumah Tangga RW 13',
    deskripsi: 'Dokumen dasar organisasi dan tata kelola RW 13',
    tahun: '2024',
    kategori: 'AD/ART',
  },
  {
    judul: 'Tata Tertib Lingkungan RW 13',
    deskripsi: 'Peraturan kebersihan, keamanan, dan ketertiban lingkungan',
    tahun: '2024',
    kategori: 'Tata Tertib',
  },
  {
    judul: 'SOP Pelayanan Administrasi Warga',
    deskripsi: 'Prosedur standar pelayanan surat menyurat dan administrasi',
    tahun: '2024',
    kategori: 'SOP',
  },
]

export default async function RegulasiPage() {
  const dokumenRegulasiDB = await prisma.dokumen.findMany({
    where: { kategori: 'regulasi' },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="pt-14">
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Hukum & Aturan</p>
          <h1 className="text-3xl font-bold mb-2">Regulasi</h1>
          <p className="text-sm text-white/60">Peraturan dan kebijakan resmi yang berlaku di lingkungan RW 13.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Info */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-8 flex items-start gap-3">
          <span className="text-amber-500 text-xl mt-0.5">⚖️</span>
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">Tentang Regulasi RW 13</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Seluruh regulasi ini berlaku bagi semua warga yang berdomisili di wilayah RW 13, Komplek Bukit Padjajaran.
              Warga diharapkan mematuhi semua peraturan demi terciptanya lingkungan yang aman, nyaman, dan harmonis.
            </p>
          </div>
        </div>

        {/* Dokumen dari database */}
        {dokumenRegulasiDB.length > 0 ? (
          <div className="space-y-3 mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Dokumen Regulasi ({dokumenRegulasiDB.length})</h2>
            {dokumenRegulasiDB.map(d => (
              <div key={d.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-300 transition">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📋</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{d.nama}</h3>
                  {d.deskripsi && <p className="text-xs text-gray-500 mt-0.5">{d.deskripsi}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {d.tipe_file.toUpperCase()} · {new Date(d.created_at).getFullYear()}
                  </p>
                </div>
                <a href={d.file_url} target="_blank"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-xl hover:bg-gray-700 transition flex-shrink-0">
                  ⬇ Unduh
                </a>
              </div>
            ))}
          </div>
        ) : (
          // Default regulasi kalau belum ada di database
          <div className="space-y-3 mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Regulasi RW 13</h2>
            {REGULASI_DEFAULT.map((r, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📋</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900">{r.judul}</h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{r.kategori}</span>
                  </div>
                  <p className="text-xs text-gray-500">{r.deskripsi}</p>
                  <p className="text-xs text-gray-400 mt-1">Tahun {r.tahun}</p>
                </div>
                <span className="text-xs text-gray-400 italic flex-shrink-0">Segera tersedia</span>
              </div>
            ))}
            <p className="text-xs text-center text-gray-400 mt-4">
              Dokumen regulasi dapat diunduh setelah diupload oleh admin. Hubungi pengurus untuk informasi lebih lanjut.
            </p>
          </div>
        )}

        {/* Tata Tertib Ringkas */}
        <div className="bg-gray-900 text-white rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-4">📌 Tata Tertib Ringkas Lingkungan</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              '🧹 Buang sampah pada tempatnya dan ikuti jadwal pengangkutan sampah',
              '🔇 Tidak membuat keributan di atas pukul 22.00 WIB',
              '🚗 Parkir kendaraan tidak menghalangi akses warga lain',
              '🐕 Pemilik hewan peliharaan bertanggung jawab atas kotorannya',
              '🏗️ Renovasi rumah wajib melapor ke RT dan RW terlebih dahulu',
              '👥 Tamu menginap lebih dari 1x24 jam wajib lapor ke RT',
              '🌿 Ikut serta dalam kegiatan kebersihan lingkungan',
              '🤝 Menjaga kerukunan dan saling menghormati antar warga',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
                <span className="flex-shrink-0">{item.slice(0, 2)}</span>
                <span>{item.slice(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

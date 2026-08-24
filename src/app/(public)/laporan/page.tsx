import { prisma } from '@/lib/prisma'
import LaporanClient from './LaporanClient'

export const revalidate = 60 // Revalidate every minute

export default async function LaporanPublicPage() {
  // Fetch laporan safely. DO NOT select NIK or Phone number.
  // We only fetch 'masuk', 'diproses', 'selesai'. (maybe exclude 'ditolak')
  let laporanDB: any[] = []
  try {
    laporanDB = await prisma.laporan.findMany({
      where: {
        status: { in: ['masuk', 'diproses', 'selesai'] }
      },
      select: {
        id: true,
        judul: true,
        kategori: true,
        deskripsi: true,
        lokasi_kejadian: true,
        tanggal_kejadian: true,
        status: true,
        created_at: true,
        pelapor_nama: true,
        rt: { select: { nomor_rt: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 50 // Limit to latest 50 reports
    })
  } catch (error) {
    console.error('Failed to fetch laporan for public:', error)
  }

  // Mask reporter names (e.g., Budi Santoso -> Budi S***)
  const safeLaporan = laporanDB.map(l => {
    let safeName = 'Warga'
    if (l.pelapor_nama) {
      const parts = l.pelapor_nama.split(' ')
      if (parts.length === 1) {
        safeName = parts[0].slice(0, 3) + '***'
      } else {
        safeName = parts[0] + ' ' + parts[1].slice(0, 1) + '***'
      }
    }

    return {
      ...l,
      pelapor_nama: safeName
    }
  })

  return (
    <div className="pt-14">
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Transparansi & Informasi</p>
          <h1 className="text-3xl font-bold mb-2">Papan Laporan Warga</h1>
          <p className="text-sm text-white/60">
            Daftar laporan kejadian, kehilangan, dan kerusakan fasilitas di lingkungan RW 13.
            Sebagian nama pelapor disamarkan untuk menjaga privasi.
          </p>
        </div>
      </div>

      <LaporanClient initialData={safeLaporan} />
    </div>
  )
}

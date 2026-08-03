import { prisma } from '@/lib/prisma'
import GaleriClient from './GaleriClient'

export const revalidate = 60

export default async function GaleriPage() {
  let galeri: any[] = []
  let beritaFoto: any[] = []

  try {
    galeri = await prisma.galeri_kegiatan.findMany({
      include: {
        kegiatan: { select: { judul: true, kategori: true, tanggal_mulai: true } },
      },
      orderBy: { uploaded_at: 'desc' },
      take: 50,
    })

    beritaFoto = await prisma.pengumuman.findMany({
      where: {
        foto_url: { not: null },
        published_at: { not: null },
      },
      orderBy: { published_at: 'desc' },
      take: 20,
    })
  } catch (e) {
    console.error('[GaleriPage] Failed to fetch data at build/runtime', e)
  }

  const totalFoto = galeri.length + beritaFoto.length

  // Serialize dates for client component
  const serializedGaleri = galeri.map((g) => ({
    id: g.id,
    foto_url: g.foto_url,
    keterangan: g.keterangan,
    uploaded_at: g.uploaded_at.toISOString(),
    kegiatan: g.kegiatan
      ? {
          judul: g.kegiatan.judul,
          kategori: g.kegiatan.kategori,
          tanggal_mulai: g.kegiatan.tanggal_mulai.toISOString(),
        }
      : null,
  }))

  const serializedBerita = beritaFoto
    .filter((b) => b.foto_url !== null)
    .map((b) => ({
      id: b.id,
      foto_url: b.foto_url!,
      judul: b.judul,
      kategori: b.kategori,
      published_at: b.published_at?.toISOString() ?? null,
    }))

  return (
    <div className="pt-14">
      {/* ── HERO HEADER ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.1) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(14,165,233,0.1) 0%, transparent 50%)',
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
              <a href="/" className="hover:text-white/60 transition">
                Beranda
              </a>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-white/60">Galeri</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Galeri
              <span className="block text-white/60 text-3xl sm:text-4xl mt-1">Kegiatan Warga</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-lg mb-8">
              Kumpulan dokumentasi foto kegiatan, acara, dan momen kebersamaan warga RW 13. Setiap foto menceritakan kisah komunitas kita.
            </p>

            {/* Quick stats */}
            {totalFoto > 0 && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-white/70">
                    <strong className="text-white font-semibold">{totalFoto}</strong> foto tersedia
                  </span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <span className="text-sm text-white/50">Diperbarui berkala</span>
              </div>
            )}
          </div>

          {/* Decorative element */}
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
            <div className="grid grid-cols-3 gap-3 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-xl border border-white/20"
                  style={{
                    animation: `pulse ${2 + (i % 3) * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 200}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60V30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── GALLERY CONTENT ── */}
      <section className="pb-16">
        <GaleriClient galeri={serializedGaleri} beritaFoto={serializedBerita} />
      </section>
    </div>
  )
}

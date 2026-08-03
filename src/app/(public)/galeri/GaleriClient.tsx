'use client'

import { useState, useEffect, useRef } from 'react'

type GaleriFoto = {
  id: string
  foto_url: string
  keterangan: string | null
  uploaded_at: string
  kegiatan: {
    judul: string
    kategori: string
    tanggal_mulai: string
  } | null
}

type BeritaFoto = {
  id: string
  foto_url: string
  judul: string
  kategori: string
  published_at: string | null
}

type Props = {
  galeri: GaleriFoto[]
  beritaFoto: BeritaFoto[]
}

const KATEGORI_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  sosial: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  kesehatan: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  pendidikan: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  keamanan: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
  olahraga: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  lingkungan: { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-400' },
  pembangunan: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  digital: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  lainnya: { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
  administrasi: { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
}

function formatTanggal(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animation based on index within viewport batch
          setTimeout(() => setVisible(true), (index % 4) * 80)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
      }}
    >
      {children}
    </div>
  )
}

export default function GaleriClient({ galeri, beritaFoto }: Props) {
  const [lightbox, setLightbox] = useState<{
    src: string
    title: string
    kategori: string
    tanggal: string
  } | null>(null)

  const totalFoto = galeri.length + beritaFoto.length

  // Close lightbox on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Combine all photos into a unified feed
  const allPhotos = [
    ...galeri.map((foto) => ({
      id: foto.id,
      src: foto.foto_url,
      title: foto.keterangan || foto.kegiatan?.judul || 'Foto Kegiatan',
      kategori: foto.kegiatan?.kategori || 'lainnya',
      tanggal: foto.kegiatan?.tanggal_mulai
        ? formatTanggal(foto.kegiatan.tanggal_mulai)
        : formatTanggal(foto.uploaded_at),
      type: 'kegiatan' as const,
    })),
    ...beritaFoto.map((b) => ({
      id: b.id,
      src: b.foto_url,
      title: b.judul,
      kategori: b.kategori,
      tanggal: b.published_at ? formatTanggal(b.published_at) : '-',
      type: 'berita' as const,
    })),
  ]

  const colors = (kategori: string) => KATEGORI_COLOR[kategori] || KATEGORI_COLOR.lainnya

  return (
    <>
      {/* ── LIGHTBOX MODAL ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            style={{ animation: 'fadeIn 200ms ease-out' }}
          />

          {/* Content */}
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scaleIn 300ms cubic-bezier(0.16,1,0.3,1)' }}
          >
            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 text-white/60 hover:text-white transition text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tutup</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Info */}
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="text-white font-semibold text-base mb-1">{lightbox.title}</h3>
                <p className="text-white/50 text-xs">{lightbox.tanggal}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${colors(lightbox.kategori).bg} ${colors(lightbox.kategori).text}`}
              >
                {lightbox.kategori}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {totalFoto > 0 ? (
          <>
            {/* Stats bar */}
            <div className="flex items-center gap-6 py-8 border-b border-gray-100 mb-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{totalFoto}</p>
                  <p className="text-xs text-gray-400">Total Foto</p>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{galeri.length}</p>
                  <p className="text-xs text-gray-400">Foto Kegiatan</p>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V4.875c0-.621.504-1.125 1.125-1.125h3.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{beritaFoto.length}</p>
                  <p className="text-xs text-gray-400">Foto Berita</p>
                </div>
              </div>
            </div>

            {/* ── MASONRY-STYLE GALLERY GRID ── */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {allPhotos.map((foto, i) => (
                <AnimatedCard key={foto.id} index={i}>
                  <div
                    className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
                    onClick={() =>
                      setLightbox({
                        src: foto.src,
                        title: foto.title,
                        kategori: foto.kategori,
                        tanggal: foto.tanggal,
                      })
                    }
                  >
                    {/* Image */}
                    <img
                      src={foto.src}
                      alt={foto.title}
                      loading="lazy"
                      className="w-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />

                    {/* Top badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium capitalize backdrop-blur-md ${colors(foto.kategori).bg}/80 ${colors(foto.kategori).text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${colors(foto.kategori).dot}`} />
                        {foto.kategori}
                      </span>
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-md font-medium">
                        {foto.type === 'kegiatan' ? '📸 Kegiatan' : '📢 Berita'}
                      </span>
                    </div>

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Bottom info on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1 drop-shadow-lg">
                        {foto.title}
                      </h3>
                      <p className="text-white/60 text-xs flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {foto.tanggal}
                      </p>
                    </div>

                    {/* Zoom icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* ── CTA Section ── */}
            <div className="mt-16 mb-8 text-center">
              <div className="inline-flex flex-col items-center gap-3 bg-gray-50 rounded-2xl px-10 py-8 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Punya foto kegiatan?</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  Hubungi pengurus RT/RW untuk menambahkan dokumentasi kegiatan lingkungan ke dalam galeri.
                </p>
                <a
                  href="/#kontak"
                  className="mt-2 inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Hubungi Pengurus
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </>
        ) : (
          /* ── EMPTY STATE ── */
          <div className="text-center py-28">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 mb-6">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Foto</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Dokumentasi foto kegiatan dan momen bersama warga akan ditampilkan di sini setelah admin menambahkan melalui menu Konten.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/berita"
                className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-700 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V4.875c0-.621.504-1.125 1.125-1.125h3.5" />
                </svg>
                Lihat Berita &amp; Kegiatan
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                Kembali ke Beranda
              </a>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}

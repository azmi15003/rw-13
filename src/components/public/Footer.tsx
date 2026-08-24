import Link from 'next/link'

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-gray-900 text-xs font-bold">RW</span>
              </div>
              <span className="font-semibold text-sm">Warga RW 13</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Digital Governance for the Community. Mewujudkan tata kelola lingkungan yang transparan dan akuntabel.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Navigasi</h4>
            <div className="space-y-2.5">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/berita', label: 'Berita & Kegiatan' },
                { href: '/layanan', label: 'Layanan Warga' },
                { href: '/dokumen', label: 'Dokumen' },
                { href: '/galeri', label: 'Galeri' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-sm text-white/60 hover:text-white transition">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Informasi</h4>
            <div className="space-y-2.5">
              {[
                { href: '/profil', label: 'Profil RW' },
                { href: '/profil/struktur', label: 'Struktur Organisasi' },
                { href: '/regulasi', label: 'Regulasi' },
                { href: '/potensi', label: 'Potensi Wilayah' },
                { href: '/#kontak', label: 'Kontak Kami' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-sm text-white/60 hover:text-white transition">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Kontak</h4>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>Komplek Bukit Padjadjaran RW 13 Desa Cikadut, Kecamatan Cimenyan, Kabupaten Bandung</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>(021) 555-0123</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span>+62 812-3456-7890</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex items-center justify-between">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Warga RW 13. Digital Governance for the Community.</p>
          <div className="flex items-center gap-4">
            <Link href="/profil" className="text-xs text-white/40 hover:text-white/70 transition">Profil RW</Link>
            <Link href="/#kontak" className="text-xs text-white/40 hover:text-white/70 transition">Kontak Kami</Link>
            <Link href="/peta-lokasi" className="text-xs text-white/40 hover:text-white/70 transition">Peta Lokasi</Link>
            <Link href="/kebijakan-privasi" className="text-xs text-white/40 hover:text-white/70 transition">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

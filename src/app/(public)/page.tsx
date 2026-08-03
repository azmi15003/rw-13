import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import KontakForm from '@/components/public/KontakForm'
import AnimatedSection from '@/components/public/AnimatedSection'

export const revalidate = 60

export default async function HomePage() {
  const [rw, totalKK, totalWarga, rtList, beritaTerbaru, kegiatanMendatang, dokumenTerbaru] = await Promise.all([
    prisma.rw.findFirst(),
    prisma.kartu_keluarga.count(),
    prisma.warga.count({ where: { status_aktif: 'aktif' } }),
    prisma.rt.findMany({ orderBy: { nomor_rt: 'asc' } }),
    prisma.pengumuman.findMany({
      where: { published_at: { not: null } },
      orderBy: { published_at: 'desc' },
      take: 3,
    }),
    prisma.kegiatan.findMany({
      where: {
        tanggal_mulai: { gte: new Date() },
        published_at: { not: null },
      },
      orderBy: { tanggal_mulai: 'asc' },
      take: 3,
    }),
    prisma.dokumen.findMany({
      orderBy: { created_at: 'desc' },
      take: 4,
    }),
  ])

  const KATEGORI_COLOR: Record<string, string> = {
    pembangunan: 'bg-orange-100 text-orange-700 border-orange-200',
    kesehatan: 'bg-green-100 text-green-700 border-green-200',
    digital: 'bg-blue-100 text-blue-700 border-blue-200',
    keamanan: 'bg-red-100 text-red-700 border-red-200',
    sosial: 'bg-purple-100 text-purple-700 border-purple-200',
    administrasi: 'bg-gray-100 text-gray-700 border-gray-200',
    lainnya: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  const BULAN = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES']

  return (
    <div className="pt-14 overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-gray-900/80 to-gray-900/95 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1555899434-94d1368aa7ae?q=80&w=2000"
            alt="Lingkungan RW"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] z-10 animate-pulse delay-1000" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <AnimatedSection animation="fade-up">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium tracking-widest uppercase mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Sistem Informasi Warga
              </span>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={100}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                Layanan Warga<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  RW 13 Digital Core
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Mewujudkan tata kelola lingkungan yang transparan, responsif, dan terintegrasi untuk kenyamanan serta kesejahteraan seluruh warga.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/layanan" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold hover:bg-gray-100 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300">
                  Jelajahi Layanan
                </Link>
                <Link href="/#panduan" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-medium backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                  Panduan Warga
                </Link>
              </div>
            </AnimatedSection>
          </div>

          {/* Quick Access Glass Card */}
          <div className="hidden lg:block w-[400px]">
            <AnimatedSection animation="scale-up" delay={400}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-white font-semibold mb-6 text-lg">Akses Cepat</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Berita & Pengumuman', desc: 'Informasi terkini lingkungan', icon: '📢', href: '/berita' },
                    { title: 'Agenda Kegiatan', desc: 'Jadwal kerja bakti & acara', icon: '🗓️', href: '/berita' },
                    { title: 'Dokumen Warga', desc: 'Formulir & peraturan RW', icon: '📄', href: '/dokumen' },
                    { title: 'Galeri Foto', desc: 'Dokumentasi momen warga', icon: '📸', href: '/galeri' },
                  ].map((item, i) => (
                    <Link key={i} href={item.href} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/10 transition group border border-transparent hover:border-white/10">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1 group-hover:text-blue-300 transition-colors">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="relative z-30 -mt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 border border-gray-100">
              {[
                { label: 'Total Kepala Keluarga', value: totalKK.toLocaleString('id-ID'), icon: '🏠', color: 'bg-blue-50 text-blue-600' },
                { label: 'Warga Aktif', value: totalWarga.toLocaleString('id-ID'), icon: '👥', color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Rukun Tetangga (RT)', value: String(rtList.length).padStart(2, '0'), icon: '🏘️', color: 'bg-purple-50 text-purple-600' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-5 p-4 hover:scale-105 transition-transform duration-300">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${s.color}`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{s.value}</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── TENTANG KAMI ── */}
      <section id="tentang-kami" className="py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-[0.3em] text-blue-600 uppercase mb-2 block">Profil Wilayah</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Mengenal Lebih Dekat RW 13</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Kiri - Konten */}
            <div className="space-y-12">
              <AnimatedSection animation="slide-right">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl">🌳</div>
                    <h3 className="text-xl font-bold text-gray-900">Lingkungan Kita</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    RW 013 adalah lingkungan yang asri dan strategis di wilayah Kelurahan Cikadut, Kecamatan Cimenyan, Kabupaten Bandung. Wilayah kami terus berkembang dengan semangat kebersamaan dan gotong royong yang kuat.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-right" delay={200}>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">🎯</div>
                    <h3 className="text-xl font-bold text-gray-900">Visi & Misi</h3>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Visi</p>
                    <p className="text-lg text-gray-800 font-medium italic border-l-4 border-blue-500 pl-4">
                      "{rw?.visi || 'Menjadi Lingkungan yang Bersih, Indah, Aman dan Beriman'}"
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Misi</p>
                    <ul className="space-y-3">
                      {(rw?.misi ? JSON.parse(rw.misi as string) : [
                        'Menjaga kerukunan antar warga dengan meningkatkan silaturahmi',
                        'Meningkatkan kepedulian sosial antar warga',
                        'Menjaga keamanan, ketertiban, dan kebersihan lingkungan',
                      ]).map((m: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600">
                          <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="leading-relaxed">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Kanan - Images */}
            <div className="space-y-6">
              <AnimatedSection animation="slide-left" delay={100}>
                <div className="group relative w-full h-[320px] rounded-[2rem] overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80"
                    alt="Lingkungan RW 13"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Pusat Layanan</p>
                    <p className="text-xl font-medium">Kantor Sekretariat RW 13</p>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-left" delay={300}>
                <div className="group relative w-full h-[240px] rounded-[2rem] overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                    alt="Peta Wilayah"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span className="font-medium tracking-wide">Peta Wilayah Interaktif</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── TUGAS DAN FUNGSI ── */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-[0.3em] text-blue-400 uppercase mb-2 block">Peran Strategis</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Tugas & Fungsi Kepengurusan</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📁',
                judul: 'Administratif Warga',
                desc: 'Pengelolaan data kependudukan, pencatatan warga masuk/keluar, dan pembuatan tata tertib lingkungan secara terstruktur dan digital.',
                color: 'from-blue-500 to-cyan-400'
              },
              {
                icon: '🤝',
                judul: 'Pelayanan Publik',
                desc: 'Fasilitasi pembuatan surat pengantar, layanan kependudukan, resolusi konflik warga, dan penghubung dengan instansi pemerintah di atasnya.',
                color: 'from-purple-500 to-pink-400'
              },
              {
                icon: '🛠️',
                judul: 'Pembangunan Lingkungan',
                desc: 'Penggerak kerja bakti, inisiator pembangunan fasilitas umum, pemeliharaan keamanan, dan peningkatan kesejahteraan sosial warga.',
                color: 'from-amber-500 to-orange-400'
              },
            ].map((item, i) => (
              <AnimatedSection key={i} animation="fade-up" delay={i * 200}>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:bg-gray-800 transition-colors h-full group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.judul}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFO TERKINI (BERITA & KEGIATAN) ── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Berita Terkini */}
            <div className="lg:col-span-8">
              <AnimatedSection animation="fade-up">
                <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
                  <h2 className="text-3xl font-bold text-gray-900">Warta Lingkungan</h2>
                  <Link href="/berita" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-2 group">
                    Semua Berita
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </AnimatedSection>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {beritaTerbaru.map((b, i) => (
                  <AnimatedSection key={b.id} animation="fade-up" delay={i * 150}>
                    <Link href={`/berita/${b.id}`}>
                      <article className="group cursor-pointer">
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-5 bg-gray-100">
                          {b.foto_url ? (
                            <img src={b.foto_url} alt={b.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                              <span className="text-5xl opacity-20">📰</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border bg-white/90 backdrop-blur-sm shadow-sm ${KATEGORI_COLOR[b.kategori] || 'text-gray-700'}`}>
                              {b.kategori}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {b.published_at && new Date(b.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {b.judul}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: b.konten.replace(/<[^>]+>/g, '') }} />
                      </article>
                    </Link>
                  </AnimatedSection>
                ))}
                {beritaTerbaru.length === 0 && (
                  <div className="col-span-2 text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400">Belum ada berita terbaru</p>
                  </div>
                )}
              </div>
            </div>

            {/* Agenda Mendatang */}
            <div className="lg:col-span-4">
              <AnimatedSection animation="fade-up" delay={200}>
                <div className="bg-gradient-to-b from-blue-50 to-white rounded-[2rem] p-8 border border-blue-100 shadow-sm h-full">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <span className="text-2xl">🗓️</span> Agenda Warga
                  </h2>

                  <div className="space-y-6">
                    {kegiatanMendatang.map((k, i) => {
                      const tgl = new Date(k.tanggal_mulai)
                      return (
                        <AnimatedSection key={k.id} animation="slide-left" delay={i * 200}>
                          <div className="group flex gap-5 bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition cursor-pointer">
                            <div className="w-16 flex flex-col items-center justify-center bg-gray-900 rounded-xl text-white py-2 group-hover:bg-blue-600 transition-colors">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{BULAN[tgl.getMonth()]}</span>
                              <span className="text-2xl font-black leading-none my-1">{tgl.getDate()}</span>
                            </div>
                            <div className="flex-1 py-1">
                              <h4 className="font-bold text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{k.judul}</h4>
                              {k.lokasi && (
                                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                  {k.lokasi}
                                </p>
                              )}
                            </div>
                          </div>
                        </AnimatedSection>
                      )
                    })}
                    {kegiatanMendatang.length === 0 && (
                      <div className="text-center py-10">
                        <span className="text-gray-400 text-sm">Tidak ada agenda dalam waktu dekat.</span>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── HUBUNGI KAMI ── */}
      <section id="kontak" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-gray-800/40 p-8 sm:p-12 rounded-[3rem] border border-gray-700/50 backdrop-blur-md shadow-2xl">
            
            <AnimatedSection animation="slide-right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Mari Terhubung</h2>
                <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                  Kami selalu terbuka untuk mendengar aspirasi, keluhan, maupun saran konstruktif dari seluruh warga. Jangan ragu untuk menghubungi pengurus RW 13.
                </p>

                <div className="space-y-6 mb-10">
                  {[
                    { icon: '📍', title: 'Alamat Sekretariat', value: rw?.alamat_kantor || 'Jl. Melati No. 13, Kelurahan Digital, Kota Pintar' },
                    { icon: '📞', title: 'Telepon Pengurus', value: rw?.telepon || '(021) 555-0123' },
                    { icon: '💬', title: 'WhatsApp Admin', value: rw?.whatsapp_admin || '+62 812-3456-7890' },
                  ].map((info, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">{info.title}</p>
                        <p className="text-lg font-semibold text-white">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-left" delay={200}>
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl text-gray-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
                <KontakForm />
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>
    </div>
  )
}

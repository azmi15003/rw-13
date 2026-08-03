export default function PotensiPage() {
  const potensi = [
    {
      icon: '🏪',
      judul: 'UMKM Warga',
      desc: 'Lebih dari 45 usaha mikro aktif di wilayah RW 13, mulai dari kuliner rumahan, fashion, kerajinan, hingga jasa.',
      count: '45+ Usaha',
      color: 'bg-orange-50 border-orange-200',
      badge: 'bg-orange-100 text-orange-700',
      detail: ['Kuliner & Katering', 'Fashion & Kerajinan', 'Jasa & Teknologi', 'Perdagangan'],
    },
    {
      icon: '🌱',
      judul: 'Urban Farming',
      desc: 'Program pertanian perkotaan di lahan kosong RT 03, RT 06, dan RT 08 yang menghasilkan sayuran segar untuk warga.',
      count: '3 Titik Lahan',
      color: 'bg-green-50 border-green-200',
      badge: 'bg-green-100 text-green-700',
      detail: ['Sayuran organik', 'Toga & tanaman obat', 'Composting mandiri', 'Biopori'],
    },
    {
      icon: '🎨',
      judul: 'Sentra Kerajinan',
      desc: 'Kelompok pengrajin batik dan kerajinan tangan yang aktif berproduksi dan mengikuti pameran tingkat kota.',
      count: '12 Pengrajin',
      color: 'bg-purple-50 border-purple-200',
      badge: 'bg-purple-100 text-purple-700',
      detail: ['Batik tulis', 'Anyaman bambu', 'Kerajinan daur ulang', 'Souvenir lokal'],
    },
    {
      icon: '📚',
      judul: 'Rumah Belajar',
      desc: 'Fasilitas belajar gratis untuk anak-anak warga yang dikelola oleh relawan muda dan karang taruna RW 13.',
      count: '2 Rumah Belajar',
      color: 'bg-blue-50 border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      detail: ['Bimbel gratis', 'Perpustakaan mini', 'Kelas coding', 'Kelas bahasa Inggris'],
    },
    {
      icon: '⚽',
      judul: 'Olahraga & Seni',
      desc: 'Lapangan serbaguna dan sanggar seni yang aktif menggelar latihan rutin dan pertandingan antar RT.',
      count: '8 Klub Aktif',
      color: 'bg-red-50 border-red-200',
      badge: 'bg-red-100 text-red-700',
      detail: ['Futsal & badminton', 'Senam ibu-ibu', 'Karang taruna seni', 'Pencak silat'],
    },
    {
      icon: '🏥',
      judul: 'Posyandu & Lansia',
      desc: 'Layanan kesehatan rutin untuk balita dan warga lansia yang dikelola kader kesehatan terlatih RW 13.',
      count: '3 Posyandu',
      color: 'bg-teal-50 border-teal-200',
      badge: 'bg-teal-100 text-teal-700',
      detail: ['Posyandu balita', 'Posbindu lansia', 'Konsultasi gizi', 'Pengukuran rutin'],
    },
  ]

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
          {potensi.map((p, i) => (
            <div key={i} className={`border rounded-2xl p-6 hover:shadow-sm transition ${p.color}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{p.icon}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.badge}`}>
                  {p.count}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{p.judul}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{p.desc}</p>
              <div className="space-y-1.5">
                {p.detail.map((d, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          ))}
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

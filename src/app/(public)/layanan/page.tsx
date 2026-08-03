import Link from 'next/link'

const LAYANAN = [
  {
    icon: '📄',
    judul: 'Surat Keterangan Domisili',
    desc: 'Surat keterangan tempat tinggal untuk keperluan administrasi, melamar kerja, atau perbankan.',
    syarat: ['KTP asli & fotokopi', 'KK asli & fotokopi', 'Surat pengantar RT'],
    waktu: '1 hari kerja',
    biaya: 'Gratis',
  },
  {
    icon: '💼',
    judul: 'Surat Keterangan Usaha',
    desc: 'Surat keterangan untuk keperluan usaha, pengajuan KUR, atau izin usaha mikro.',
    syarat: ['KTP asli & fotokopi', 'KK asli & fotokopi', 'Foto lokasi usaha', 'Surat pengantar RT'],
    waktu: '1 hari kerja',
    biaya: 'Gratis',
  },
  {
    icon: '🏥',
    judul: 'Surat Keterangan Tidak Mampu',
    desc: 'Untuk keperluan beasiswa, BPJS, bantuan sosial, atau keringanan biaya pendidikan.',
    syarat: ['KTP asli & fotokopi', 'KK asli & fotokopi', 'Surat pengantar RT'],
    waktu: '1 hari kerja',
    biaya: 'Gratis',
  },
  {
    icon: '🎓',
    judul: 'Surat Pengantar Sekolah',
    desc: 'Surat pengantar untuk keperluan pendaftaran sekolah atau perguruan tinggi.',
    syarat: ['KTP orang tua asli & fotokopi', 'KK asli & fotokopi', 'Akta kelahiran'],
    waktu: '1 hari kerja',
    biaya: 'Gratis',
  },
  {
    icon: '🏠',
    judul: 'Surat Keterangan Pindah',
    desc: 'Pengantar untuk proses pindah domisili ke wilayah lain atau antar RT dalam RW.',
    syarat: ['KTP asli & fotokopi', 'KK asli & fotokopi', 'Surat pengantar RT'],
    waktu: '1-2 hari kerja',
    biaya: 'Gratis',
  },
  {
    icon: '📋',
    judul: 'Surat Pengantar SKCK',
    desc: 'Surat pengantar untuk pembuatan Surat Keterangan Catatan Kepolisian (SKCK).',
    syarat: ['KTP asli & fotokopi', 'KK asli & fotokopi', 'Pas foto 4x6 (3 lembar)'],
    waktu: '1 hari kerja',
    biaya: 'Gratis',
  },
  {
    icon: '👶',
    judul: 'Surat Pengantar Akta Kelahiran',
    desc: 'Surat pengantar untuk pengurusan akta kelahiran anak di Dinas Kependudukan.',
    syarat: ['Surat keterangan lahir dari RS/bidan', 'KTP kedua orang tua', 'KK', 'Buku nikah'],
    waktu: '1 hari kerja',
    biaya: 'Gratis',
  },
  {
    icon: '🕊️',
    judul: 'Surat Keterangan Kematian',
    desc: 'Surat keterangan kematian untuk keperluan administrasi waris atau asuransi.',
    syarat: ['Surat keterangan kematian dari RS/dokter', 'KTP almarhum', 'KK', 'KTP pelapor'],
    waktu: '1 hari kerja',
    biaya: 'Gratis',
  },
  {
    icon: '💒',
    judul: 'Surat Pengantar Nikah (N1-N4)',
    desc: 'Surat pengantar pernikahan untuk diserahkan ke KUA setempat.',
    syarat: ['KTP calon mempelai', 'KK', 'Akta kelahiran', 'Pas foto 2x3 & 4x6', 'Surat pengantar RT'],
    waktu: '1-2 hari kerja',
    biaya: 'Gratis',
  },
]

export default function LayananPage() {
  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Administrasi</p>
          <h1 className="text-3xl font-bold mb-2">Layanan Warga</h1>
          <p className="text-sm text-white/60">Layanan surat menyurat dan administrasi kependudukan RW 13.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-10 flex items-start gap-3">
          <span className="text-blue-500 text-xl mt-0.5 flex-shrink-0">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Cara Mengurus Surat</p>
            <div className="grid grid-cols-4 gap-4">
              {[
                { step: '1', text: 'Siapkan dokumen persyaratan sesuai jenis surat yang dibutuhkan' },
                { step: '2', text: 'Datang ke kantor RT untuk mendapat surat pengantar' },
                { step: '3', text: 'Bawa ke kantor RW 13 pada jam kerja (Senin–Jumat, 08.00–15.00)' },
                { step: '4', text: 'Surat selesai pada hari yang sama atau maksimal 2 hari kerja' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Jam Operasional */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: '🕐', label: 'Jam Operasional', value: 'Senin – Jumat', sub: '08.00 – 15.00 WIB' },
            { icon: '📍', label: 'Lokasi', value: 'Kantor RW 13', sub: 'Komplek Bukit Padjajaran' },
            { icon: '📱', label: 'Info & Konsultasi', value: 'WhatsApp Admin', sub: 'Respon cepat di hari kerja' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Layanan Grid */}
        <h2 className="text-lg font-bold text-gray-900 mb-5">Jenis Layanan ({LAYANAN.length})</h2>
        <div className="grid grid-cols-3 gap-4">
          {LAYANAN.map((l, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 hover:shadow-sm transition">
              <span className="text-3xl mb-3 block">{l.icon}</span>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{l.judul}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{l.desc}</p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">Persyaratan:</p>
                  <ul className="space-y-1">
                    {l.syarat.map((s, j) => (
                      <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-1.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Waktu</p>
                    <p className="text-xs font-medium text-gray-700">{l.waktu}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Biaya</p>
                    <p className="text-xs font-medium text-green-600">{l.biaya}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
          <p className="text-sm text-white/60 mb-5">Hubungi pengurus RW 13 melalui WhatsApp atau datang langsung.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/dokumen"
              className="bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition">
              📄 Download Formulir
            </Link>
            <Link href="/#kontak"
              className="border border-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-white/10 transition">
              💬 Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

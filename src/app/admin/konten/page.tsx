import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import KontenActions from './KontenActions'

export default async function AdminKontenPage() {
  await requireSuperAdmin()

  const [kegiatan, pengumuman, dokumen] = await Promise.all([
    prisma.kegiatan.findMany({ orderBy: { created_at: 'desc' }, take: 10, include: { users: { select: { nama_lengkap: true } } } }),
    prisma.pengumuman.findMany({ orderBy: { created_at: 'desc' }, take: 10, include: { users: { select: { nama_lengkap: true } } } }),
    prisma.dokumen.findMany({ orderBy: { created_at: 'desc' } }),
  ])

  return (
    <div className="max-w-8xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-gray-900">Manajemen Konten</h1>
        <p className="text-sm text-gray-500">Kelola berita, kegiatan, dan dokumen RW 13</p>
      </div>

      {/* KEGIATAN */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">🗓 Kegiatan ({kegiatan.length})</h2>
          <Link href="/admin/konten/kegiatan/tambah"
            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">
            + Tambah Kegiatan
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {kegiatan.map(k => (
            <div key={k.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                🗓
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{k.judul}</p>
                <p className="text-xs text-gray-400">
                  {new Date(k.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {k.lokasi && ` · ${k.lokasi}`}
                  {' · '}{k.kategori}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {k.published_at
                  ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Published</span>
                  : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Draft</span>
                }
                <KontenActions id={k.id} type="kegiatan" isPublished={!!k.published_at} />
              </div>
            </div>
          ))}
          {kegiatan.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Belum ada kegiatan.</div>
          )}
        </div>
      </div>

      {/* PENGUMUMAN */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">📢 Pengumuman & Berita ({pengumuman.length})</h2>
          <Link href="/dashboard/pengumuman/tambah"
            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">
            + Buat Pengumuman
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {pengumuman.map(p => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{p.judul}</p>
                <p className="text-xs text-gray-400">{p.kategori} · {p.scope} · oleh {p.users?.nama_lengkap}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.published_at
                  ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Published</span>
                  : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Draft</span>
                }
                <KontenActions id={p.id} type="pengumuman" isPublished={!!p.published_at} />
              </div>
            </div>
          ))}
          {pengumuman.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Belum ada pengumuman.</div>
          )}
        </div>
      </div>

      {/* DOKUMEN */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">📄 Dokumen ({dokumen.length})</h2>
          <Link href="/admin/konten/dokumen/tambah"
            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">
            + Upload Dokumen
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {dokumen.map(d => (
            <div key={d.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{d.nama}</p>
                <p className="text-xs text-gray-400">{d.kategori} · {d.tipe_file.toUpperCase()} · {d.jumlah_unduh}x diunduh</p>
              </div>
              <KontenActions id={d.id} type="dokumen" isPublished={true} />
            </div>
          ))}
          {dokumen.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Belum ada dokumen.</div>
          )}
        </div>
      </div>
    </div>
  )
}

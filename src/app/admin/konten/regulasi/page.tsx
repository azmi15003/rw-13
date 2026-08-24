import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import KontenActions from '../KontenActions'

export default async function AdminRegulasiPage() {
  await requireSuperAdmin()

  const regulasi = await prisma.dokumen.findMany({
    where: { kategori: 'regulasi' },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Regulasi</h1>
          <p className="text-sm text-gray-500">Kelola dokumen peraturan dan kebijakan RW 13</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/regulasi" target="_blank"
            className="flex items-center gap-2 border border-gray-200 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 text-gray-600 transition">
            👁 Preview Publik
          </Link>
          <Link href="/admin/konten/dokumen/tambah"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition">
            + Tambah Regulasi
          </Link>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
        <span className="text-xl">ℹ️</span>
        <div>
          <p className="font-semibold mb-1">Cara Menambah Regulasi</p>
          <p>
            Regulasi adalah bagian dari sistem Dokumen. Untuk menambah Regulasi baru, klik tombol <strong>+ Tambah Regulasi</strong> di atas, dan pastikan Anda memilih kategori <strong>Regulasi</strong> pada saat mengunggah form dokumen.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-900">Daftar Dokumen Regulasi ({regulasi.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {regulasi.map(d => (
            <div key={d.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                📋
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{d.nama}</p>
                <p className="text-xs text-gray-500 mt-1">{d.deskripsi || 'Tidak ada deskripsi'}</p>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                    {d.tipe_file.toUpperCase()}
                  </span>
                  <span>{(d.ukuran_bytes / 1024).toFixed(0)} KB</span>
                  <span>·</span>
                  <span>{new Date(d.created_at).toLocaleDateString('id-ID')}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a href={d.file_url} target="_blank" className="text-xs font-medium text-blue-600 hover:underline">
                  Lihat File
                </a>
                <KontenActions id={d.id} type="dokumen" isPublished={true} />
              </div>
            </div>
          ))}
          {regulasi.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Belum ada dokumen regulasi.</div>
          )}
        </div>
      </div>
    </div>
  )
}

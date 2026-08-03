import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import GaleriActions from './GaleriActions'
import UploadGaleriForm from './UploadGaleriForm'

export default async function AdminGaleriPage() {
  await requireSuperAdmin()

  const [galeri, kegiatan] = await Promise.all([
    prisma.galeri_kegiatan.findMany({
      include: { kegiatan: { select: { judul: true } } },
      orderBy: { uploaded_at: 'desc' },
    }),
    prisma.kegiatan.findMany({
      orderBy: { tanggal_mulai: 'desc' },
      take: 20,
      select: { id: true, judul: true },
    }),
  ])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Galeri Foto</h1>
          <p className="text-sm text-gray-500">{galeri.length} foto terdaftar</p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Upload Foto Kegiatan</h2>
        <UploadGaleriForm kegiatan={kegiatan} />
      </div>

      {/* Grid Foto */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Semua Foto ({galeri.length})</h2>
        </div>
        {galeri.length > 0 ? (
          <div className="grid grid-cols-4 gap-3 p-5">
            {galeri.map(foto => (
              <div key={foto.id} className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={foto.foto_url}
                    alt={foto.keterangan || 'Foto kegiatan'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {foto.keterangan && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{foto.keterangan}</p>
                )}
                {foto.kegiatan && (
                  <p className="text-xs text-gray-400 truncate">{foto.kegiatan.judul}</p>
                )}
                <div className="mt-1">
                  <GaleriActions id={foto.id} fotoUrl={foto.foto_url} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-gray-400">
            <p className="text-4xl mb-3">📷</p>
            <p>Belum ada foto. Upload foto pertama di atas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

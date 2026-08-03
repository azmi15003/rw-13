import { requireAdminRT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PengumumanActions from './PengumumanActions'

const KATEGORI_COLORS: Record<string, string> = {
  pembangunan: 'bg-orange-100 text-orange-700',
  kesehatan: 'bg-green-100 text-green-700',
  digital: 'bg-blue-100 text-blue-700',
  keamanan: 'bg-red-100 text-red-700',
  sosial: 'bg-purple-100 text-purple-700',
  administrasi: 'bg-gray-100 text-gray-700',
  lainnya: 'bg-gray-100 text-gray-600',
}

export default async function PengumumanPage() {
  const profile = await requireAdminRT()
  const isSuperAdmin = profile.role === 'super_admin'

  const pengumuman = await prisma.pengumuman.findMany({
    where: isSuperAdmin
      ? {}
      : { OR: [{ scope: 'rw' }, { rt_id: profile.rt_id! }] },
    include: { rt: true, users: { select: { nama_lengkap: true } } },
    orderBy: { created_at: 'desc' },
  })

  const published = pengumuman.filter(p => p.published_at)
  const draft = pengumuman.filter(p => !p.published_at)

  return (
    <div className="max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pengumuman</h1>
          <p className="text-sm text-gray-500">{pengumuman.length} total pengumuman</p>
        </div>
        <Link
          href="/dashboard/pengumuman/tambah"
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-700 transition"
        >
          + Buat Pengumuman
        </Link>
      </div>

      {/* Draft */}
      {draft.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Draft ({draft.length})</h2>
          <div className="space-y-2">
            {draft.map(p => (
              <div key={p.id} className="bg-white border border-dashed border-gray-200 rounded-2xl p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${KATEGORI_COLORS[p.kategori] || 'bg-gray-100 text-gray-600'}`}>
                      {p.kategori}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Draft</span>
                    <span className="text-xs text-gray-400">{p.scope === 'rt_specific' ? `RT ${p.rt?.nomor_rt}` : 'Semua RW'}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">{p.judul}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">oleh {p.users?.nama_lengkap}</p>
                </div>
                <PengumumanActions id={p.id} isPublished={false} canEdit={isSuperAdmin || p.scope === 'rt_specific'} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Published */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dipublikasikan ({published.length})</h2>
        <div className="space-y-2">
          {published.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start gap-4 hover:border-gray-300 transition">
              {p.foto_url && (
                <img src={p.foto_url} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${KATEGORI_COLORS[p.kategori] || 'bg-gray-100 text-gray-600'}`}>
                    {p.kategori}
                  </span>
                  <span className="text-xs text-gray-400">{p.scope === 'rt_specific' ? `RT ${p.rt?.nomor_rt}` : 'Semua RW'}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{p.judul}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1"
                  dangerouslySetInnerHTML={{ __html: p.konten.replace(/<[^>]+>/g, '') }} />
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(p.published_at!).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' · '}oleh {p.users?.nama_lengkap}
                </p>
              </div>
              <PengumumanActions id={p.id} isPublished={true} canEdit={isSuperAdmin || p.scope === 'rt_specific'} />
            </div>
          ))}
          {published.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-sm text-gray-400">
              Belum ada pengumuman yang dipublikasikan.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

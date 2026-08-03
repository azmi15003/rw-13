import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import OrgActions from './OrgActions'
import TambahNodeForm from './TambahNodeForm'

const TIPE_COLOR: Record<string, string> = {
  rw: 'bg-blue-100 text-blue-700',
  sie: 'bg-green-100 text-green-700',
  rt: 'bg-gray-100 text-gray-600',
}

const TIPE_LABEL: Record<string, string> = {
  rw: 'Pengurus RW',
  sie: 'Sie / Bidang',
  rt: 'Ketua RT',
}

export default async function AdminStrukturPage() {
  await requireSuperAdmin()

  const nodes = await prisma.org_chart_node.findMany({
    orderBy: [{ urutan: 'asc' }, { created_at: 'asc' }],
  })

  // Build parent map for display
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Struktur Organisasi</h1>
          <p className="text-sm text-gray-500">{nodes.length} anggota terdaftar</p>
        </div>
        <Link href="/profil/struktur" target="_blank"
          className="flex items-center gap-2 border border-gray-200 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 text-gray-600 transition">
          👁 Preview Publik
        </Link>
      </div>

      {/* Form Tambah */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Tambah Anggota Baru</h2>
        <TambahNodeForm
          nodes={nodes.map(n => ({ id: n.id, nama: n.nama, jabatan: n.jabatan }))}
        />
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Daftar Anggota ({nodes.length})</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['FOTO', 'NAMA & JABATAN', 'TIPE', 'ATASAN', 'URUTAN', 'AKSI'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {nodes.map(node => {
              const parent = node.parent_id ? nodeMap[node.parent_id] : null
              const initials = node.nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
              return (
                <tr key={node.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: node.warna || '#185FA5' }}
                    >
                      {node.foto_url
                        ? <img src={node.foto_url} alt={node.nama} className="w-full h-full object-cover" />
                        : initials
                      }
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-900">{node.nama}</p>
                    <p className="text-xs text-gray-400">{node.jabatan}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TIPE_COLOR[node.tipe || 'rw']}`}>
                      {TIPE_LABEL[node.tipe || 'rw']}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {parent ? (
                      <span>{parent.nama}<br /><span className="text-xs text-gray-400">{parent.jabatan}</span></span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Root</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{node.urutan}</td>
                  <td className="px-5 py-3">
                    <OrgActions node={{
                      id: node.id,
                      nama: node.nama,
                      jabatan: node.jabatan,
                      foto_url: node.foto_url,
                      warna: node.warna || '#185FA5',
                      tipe: node.tipe || 'rw',
                      urutan: node.urutan,
                      parent_id: node.parent_id,
                    }} allNodes={nodes.map(n => ({ id: n.id, nama: n.nama, jabatan: n.jabatan }))} />
                  </td>
                </tr>
              )
            })}
            {nodes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                  Belum ada data. Tambahkan anggota pertama di atas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

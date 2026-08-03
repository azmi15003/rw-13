import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AkunActions from './AkunActions'
import TambahAkunForm from './TambahAkunForm'

export default async function ManajemenAkunPage() {
  await requireSuperAdmin()

  const [users, rtList] = await Promise.all([
    prisma.users.findMany({
      include: { rt: true },
      orderBy: [{ role: 'asc' }, { created_at: 'asc' }],
    }),
    prisma.rt.findMany({ orderBy: { nomor_rt: 'asc' } }),
  ])

  return (
    <div className="max-w-8xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Manajemen Akun</h1>
        <p className="text-sm text-gray-500">Kelola akun Admin RT dan Super Admin</p>
      </div>

      {/* Tambah Akun */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Buat Akun Admin RT Baru</h2>
        <TambahAkunForm rtList={rtList.map(r => ({ id: r.id, nomorRt: r.nomor_rt, namaKetua: r.nama_ketua }))} />
      </div>

      {/* Daftar Akun */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Daftar Akun ({users.length})</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['NAMA', 'EMAIL', 'ROLE', 'RT', 'DIBUAT', 'AKSI'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {u.nama_lengkap[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{u.nama_lengkap}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role === 'super_admin' ? '👑 Super Admin' : '🛡 Admin RT'}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600">
                  {u.rt ? `RT ${u.rt.nomor_rt}` : '—'}
                </td>
                <td className="px-5 py-3 text-xs text-gray-400">
                  {new Date(u.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="px-5 py-3">
                  <AkunActions userId={u.id} currentRole={u.role} rtList={rtList.map(r => ({ id: r.id, nomorRt: r.nomor_rt }))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

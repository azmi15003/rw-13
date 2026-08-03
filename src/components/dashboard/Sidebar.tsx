'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/dashboard/warga', label: 'Data Warga', icon: '👥' },
  { href: '/dashboard/statistik', label: 'Statistik', icon: '📊' },
  { href: '/dashboard/pengumuman', label: 'Pengumuman', icon: '📢' },
  { href: '/dashboard/dokumen', label: 'Layanan Mandiri', icon: '📄' },
]

const adminMenuItems = [
  { href: '/admin', label: 'Overview RW', icon: '🏘️' },
  { href: '/admin/akun', label: 'Manajemen Akun', icon: '👤' },
  { href: '/admin/struktur', label: 'Struktur Organisasi', icon: '👤' },
  { href: '/admin/konten', label: 'Konten', icon: '✏️' },
  { href: '/admin/laporan', label: 'Laporan', icon: '📈' },
]

export default function DashboardSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const isSuperAdmin = profile?.role === 'super_admin'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-52 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">RW</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">Admin Panel</p>
            <p className="text-xs text-gray-400 truncate">RW 13 Digital Core</p>
          </div>
        </div>
      </div>

      {/* Tambah KK Button */}
      <div className="p-3 border-b border-gray-100">
        <Link
          href="/dashboard/warga/tambah"
          className="flex items-center justify-center gap-1.5 w-full bg-gray-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-gray-700 transition"
        >
          <span>+</span> Tambah Data KK
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {menuItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              pathname === item.href
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* Super Admin section */}
        {isSuperAdmin && (
          <>
            <div className="pt-3 pb-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3">
                Super Admin
              </p>
            </div>
            {adminMenuItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  pathname.startsWith(item.href)
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
        >
          <span>🌐</span> Portal Publik
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition w-full text-left"
        >
          <span>↩</span> Keluar
        </button>
      </div>
    </aside>
  )
}

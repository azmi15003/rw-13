import DashboardSidebar from '@/components/dashboard/Sidebar'
import { requireSuperAdmin, getUserProfile } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireSuperAdmin()
  const profile = await getUserProfile()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar profile={profile} />
      <div className="flex-1 pl-52">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

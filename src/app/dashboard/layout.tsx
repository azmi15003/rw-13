import DashboardSidebar from '@/components/dashboard/Sidebar'
import { getUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getUserProfile()
  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar profile={profile} />
      <div className="flex-1 pl-52">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

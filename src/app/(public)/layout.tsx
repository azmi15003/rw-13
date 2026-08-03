import PublicNavbar from '@/components/public/Navbar'
import PublicFooter from '@/components/public/Footer'

export const dynamic = 'force-dynamic'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}

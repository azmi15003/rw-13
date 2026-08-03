'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  {
    label: 'Profil RW',
    href: '/profil',
    children: [
      { href: '/#tentang-kami', label: 'Tentang RW 13', scroll: true },
      { href: '/#visi-misi', label: 'Visi & Misi', scroll: true },
      { href: '/profil/struktur', label: 'Struktur Organisasi' },
    ]
  },
  { href: '/berita', label: 'Berita Kegiatan' },
  {
    label: 'Layanan',
    href: '/layanan',
    children: [
      { href: '/layanan', label: 'Semua Layanan' },
      { href: '/dokumen', label: 'Dokumen & Formulir' },
    ]
  },
  { href: '/regulasi', label: 'Regulasi' },
  { href: '/potensi', label: 'Potensi' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/dokumen', label: 'Dokumen' },
]

export default function PublicNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleMouseEnter(label: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenDropdown(label)
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 200)
  }

  function handleDropdownMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  function handleScrollLink(href: string, scroll?: boolean) {
    setOpenDropdown(null)
    setMobileOpen(false)

    if (scroll && href.includes('#')) {
      const sectionId = href.split('#')[1]
      if (pathname === '/') {
        // Sudah di homepage, langsung scroll
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // Navigate ke homepage dulu, lalu scroll setelah loaded
        router.push('/')
        setTimeout(() => {
          const el = document.getElementById(sectionId)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 500)
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14" ref={dropdownRef}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">RW</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">SiWarga RW 13</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(link => (
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition select-none ${
                    pathname.startsWith(link.href)
                      ? 'text-gray-900 font-medium bg-gray-100'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {openDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {link.children.map(child => (
                      child.scroll ? (
                        <button
                          key={child.href}
                          onClick={() => handleScrollLink(child.href, true)}
                          className="w-full text-left block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                        >
                          {child.label}
                        </button>
                      ) : (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                        >
                          {child.label}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm rounded-lg transition ${
                  pathname === link.href
                    ? 'text-gray-900 font-medium bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-gray-700 transition"
          >
            Masuk Portal
          </Link>
          <button
            className="md:hidden p-1.5 text-gray-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(link => (
            link.children ? (
              <div key={link.label}>
                <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{link.label}</p>
                {link.children.map(child => (
                  child.scroll ? (
                    <button
                      key={child.href}
                      onClick={() => handleScrollLink(child.href, true)}
                      className="w-full text-left block px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      {child.label}
                    </button>
                  ) : (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      {child.label}
                    </Link>
                  )
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
      )}
    </nav>
  )
}

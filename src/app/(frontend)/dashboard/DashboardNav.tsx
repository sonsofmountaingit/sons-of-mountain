'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '@/lib/auth-client'

const NAV = [
  { label: 'АКАУНТ', href: '/dashboard' },
  { label: 'ПРОФИЛ', href: '/dashboard/profile' },
  { label: 'РЕГИСТРАЦИИ', href: '/dashboard/registrations' },
  { label: 'ПОРЪЧКИ', href: '/dashboard/orders' },
  { label: 'ВАУЧЕРИ', href: '/dashboard/vouchers' },
  { label: 'МЕДИЯ', href: '/dashboard/media' },
  { label: 'ОЦЕНКИ', href: '/dashboard/ratings' },
  { label: 'ЛЮБИМИ', href: '/dashboard/wishlist' },
  { label: 'ГАЛЕРИИ', href: '/dashboard/gallery' },
]

export function DashboardNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-white/10 flex items-center justify-around px-2 py-2">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex flex-col items-center gap-0.5 px-1 py-1 rounded-sm transition-colors',
              isActive(item.href) ? 'text-white' : 'text-white/30 hover:text-white/60',
            ].join(' ')}
          >
            <span className="text-[9px] tracking-widest">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/10 py-10 px-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-8">
          <p className="text-xs tracking-widest text-white/30 uppercase mb-1">Акаунт</p>
          <p className="text-sm text-white/80 truncate">{name || email}</p>
          <p className="text-xs text-white/30 truncate mt-0.5">{email}</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'text-xs tracking-widest px-3 py-2.5 rounded-sm transition-colors',
                isActive(item.href)
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="text-xs tracking-widest text-white/30 hover:text-red-400 transition-colors text-left px-3 py-2 mt-4"
        >
          ИЗХОД
        </button>
      </aside>
    </>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import { HeaderBar } from '@/components/header-bar'

export function ConditionalHeader() {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/signup') {
    return null
  }

  return <HeaderBar />
}
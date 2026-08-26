import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const roleRoutes: Record<string, string> = {
  ADMIN: '/admin',
  CENTRAL: '/central',
  STATE: '/state',
  DISTRICT: '/district',
  AGENCY: '/agency',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const role = session.user.role

  if (!role || !roleRoutes[role]) {
    redirect('/')
  }

  redirect(roleRoutes[role])
}
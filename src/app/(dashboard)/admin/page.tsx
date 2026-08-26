import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ApproveRejectButtons } from '@/components/approve-reject-buttons'
import { CreateAdminForm } from '@/components/create-admin-form'
import { ShieldCheck } from 'lucide-react'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return <div className="p-6">Not authorized.</div>
  }

  const pendingUsers = await prisma.user.findMany({
    where: { verificationStatus: 'PENDING' },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <DashboardLayout title="Admin — Pending Approvals" role="ADMIN">
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-dark">Create Admin</h2>
            <p className="text-sm text-slate-500">Register a new administrator account</p>
          </div>
        </div>
        <CreateAdminForm />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-navy-dark mb-4">Pending Approvals</h2>
        {pendingUsers.length === 0 ? (
          <p className="text-slate-500 text-sm">No pending approvals right now.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="gov-table-header hover:bg-navy-dark">
                <TableHead className="text-white/80">Name</TableHead>
                <TableHead className="text-white/80">Email</TableHead>
                <TableHead className="text-white/80">Requested Role</TableHead>
                <TableHead className="text-white/80">State/District</TableHead>
                <TableHead className="text-white/80">Doc</TableHead>
                <TableHead className="text-white/80">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <span className="gov-badge bg-navy/10 text-navy-dark">{u.role}</span>
                  </TableCell>
                  <TableCell>{u.state}{u.district ? ` / ${u.district}` : ''}</TableCell>
                  <TableCell>
                    {u.verificationDocUrl ? (
                      <a href={u.verificationDocUrl} target="_blank" className="text-gold hover:text-gold-light underline font-medium">View</a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ApproveRejectButtons userId={u.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ApproveRejectButtons } from '@/components/approve-reject-buttons'
import { CreateAdminForm } from '@/components/create-admin-form'

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
      <CreateAdminForm />

      {pendingUsers.length === 0 ? (
        <p className="text-slate-500 text-sm">No pending approvals right now.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Requested Role</TableHead>
              <TableHead>State/District</TableHead>
              <TableHead>Doc</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.state}{u.district ? ` / ${u.district}` : ''}</TableCell>
                <TableCell>
                  {u.verificationDocUrl ? (
                    <a href={u.verificationDocUrl} target="_blank" className="text-blue-600 underline">View</a>
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
    </DashboardLayout>
  )
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VALID_STAGES = [
  'PROPOSAL_SUBMITTED', 'UNDER_SCRUTINY', 'NOTIFICATION_ISSUED',
  'AWARD_DECLARED', 'COMPENSATION_DISBURSED', 'POSSESSION_TAKEN', 'RR_COMPLETED',
]

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only admins can configure required documents' }, { status: 403 })
  }

  const body = await req.json()
  const { stage, docType } = body

  if (!stage || !docType) {
    return NextResponse.json({ error: 'stage and docType are required' }, { status: 400 })
  }
  if (!VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
  }

  try {
    const requiredDoc = await prisma.requiredDocument.create({
      data: { stage, docType },
    })
    return NextResponse.json(requiredDoc)
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'This document type is already required for this stage' },
        { status: 400 }
      )
    }
    throw err
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // anyone logged in can view the requirements list (e.g. to know what to upload)
  const requiredDocs = await prisma.requiredDocument.findMany({ orderBy: { stage: 'asc' } })
  return NextResponse.json(requiredDocs)
}
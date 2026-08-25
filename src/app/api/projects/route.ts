import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { role, state: userState } = session.user

  if (role !== 'CENTRAL' && role !== 'STATE') {
    return NextResponse.json({ error: 'You are not authorized to create projects' }, { status: 403 })
  }

  const body = await req.json()

  if (!body.name || !body.state || !body.sector || !body.implementingAgency) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // STATE users can only create projects in their own state
  if (role === 'STATE' && body.state !== userState) {
    return NextResponse.json(
      { error: `As a State user, you can only create projects for ${userState}` },
      { status: 403 }
    )
  }

  const project = await prisma.project.create({
    data: {
      name: body.name,
      ministry: body.ministry,
      implementingAgency: body.implementingAgency,
      state: body.state,
      sector: body.sector,
      targetCompletion: body.targetCompletion ? new Date(body.targetCompletion) : null,
    },
  })
  return NextResponse.json(project)
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { role, state } = session.user

  const where =
    role === 'STATE' && state
      ? { state }
      : {}

  const projects = await prisma.project.findMany({ where, include: { parcels: true } })
  return NextResponse.json(projects)
}
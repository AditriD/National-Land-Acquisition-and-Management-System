import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const docType = formData.get('docType') as string
  const parcelId = formData.get('parcelId') as string

  if (!file || !docType || !parcelId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const filename = `${Date.now()}-${safeName}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
  await writeFile(filepath, buffer)

  const existing = await prisma.documentRecord.findFirst({
    where: { parcelId, docType },
    orderBy: { version: 'desc' },
  })
  const version = existing ? existing.version + 1 : 1

  const record = await prisma.documentRecord.create({
    data: {
      parcelId,
      docType,
      fileUrl: `/uploads/${filename}`,
      version,
      uploadedById: session.user.id,
    },
  })

  return NextResponse.json(record)
}
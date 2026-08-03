import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dok = await prisma.dokumen.findUnique({ where: { id } })
  if (!dok) return NextResponse.json({ error: 'Tidak ditemukan.' }, { status: 404 })

  // Increment jumlah unduh
  await prisma.dokumen.update({ where: { id }, data: { jumlah_unduh: { increment: 1 } } })

  // Redirect ke file URL di Supabase Storage
  return NextResponse.redirect(dok.file_url)
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const current = await prisma.kegiatan.findUnique({ where: { id }, select: { published_at: true } })
  await prisma.kegiatan.update({
    where: { id },
    data: { published_at: current?.published_at ? null : new Date() }
  })
  return NextResponse.json({ success: true })
}

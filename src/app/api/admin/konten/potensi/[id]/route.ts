import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { icon, judul, deskripsi, count_label, warna, badge_warna, detail_poin } = body

    const updated = await prisma.potensi.update({
      where: { id },
      data: {
        icon,
        judul,
        deskripsi,
        count_label,
        warna,
        badge_warna,
        detail_poin,
      }
    })
    revalidatePath('/potensi')
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('[PATCH /api/admin/konten/potensi]', error)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.potensi.delete({ where: { id } })
    revalidatePath('/potensi')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[DELETE /api/admin/konten/potensi]', error)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

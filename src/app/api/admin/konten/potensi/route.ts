import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const data = await prisma.potensi.findMany({
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { icon, judul, deskripsi, count_label, warna, badge_warna, detail_poin } = body

    const newItem = await prisma.potensi.create({
      data: {
        icon: icon || '📌',
        judul,
        deskripsi,
        count_label,
        warna: warna || 'bg-blue-50 border-blue-200',
        badge_warna: badge_warna || 'bg-blue-100 text-blue-700',
        detail_poin: detail_poin || [],
      }
    })
    revalidatePath('/potensi')
    return NextResponse.json(newItem)
  } catch (error: any) {
    console.error('[POST /api/admin/konten/potensi]', error)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { foto_url, kegiatan_id, keterangan } = await req.json()
    if (!foto_url) return NextResponse.json({ error: 'URL foto wajib diisi.' }, { status: 400 })

    const data = await prisma.galeri_kegiatan.create({
      data: {
        foto_url,
        kegiatan_id: kegiatan_id || null,
        keterangan: keterangan || null,
        uploaded_by: user.id,
      }
    })
    return NextResponse.json({ success: true, id: data.id })
  } catch (error: any) {
    console.error('[POST /api/admin/galeri]', error)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

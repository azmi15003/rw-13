import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profile = await prisma.users.findUnique({ where: { id: user.id } })
    if (!profile) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })

    const { judul, konten, kategori, scope, publish, fotoUrl } = await req.json()
    if (!judul || !konten) return NextResponse.json({ error: 'Judul dan konten wajib diisi.' }, { status: 400 })

    const scopeValue = scope === 'rt_specific' ? 'rt_specific' : 'rw'

    const data = await prisma.pengumuman.create({
      data: {
        judul,
        konten,
        kategori: kategori || 'administrasi',
        scope: scopeValue,
        rt_id: scopeValue === 'rt_specific' ? (profile.rt_id ?? null) : null,
        foto_url: fotoUrl || null,
        created_by: user.id,
        published_at: publish ? new Date() : null,
      }
    })
    return NextResponse.json({ success: true, id: data.id })
  } catch (error: any) {
    console.error('[POST /api/dashboard/pengumuman]', error)
    return NextResponse.json({ error: error?.message || 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const data = await prisma.pengumuman.findMany({
      where: { published_at: { not: null } },
      include: { rt: true },
      orderBy: { published_at: 'desc' },
      take: 20,
    })
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[GET /api/dashboard/pengumuman]', error)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { judul, deskripsi, kategori, tanggalMulai, tanggalSelesai, lokasi, publish, fotoUrl } = await req.json()
    if (!judul || !tanggalMulai) return NextResponse.json({ error: 'Judul dan tanggal wajib diisi.' }, { status: 400 })

    const data = await prisma.kegiatan.create({
      data: {
        judul,
        deskripsi: deskripsi || null,
        kategori,
        lokasi: lokasi || null,
        tanggal_mulai: new Date(tanggalMulai),
        tanggal_selesai: tanggalSelesai ? new Date(tanggalSelesai) : null,
        foto_url: fotoUrl || null,
        created_by: user.id,
        published_at: publish ? new Date() : null,
      }
    })
    return NextResponse.json({ success: true, id: data.id })
  } catch (error: any) {
    console.error('[POST /api/admin/konten/kegiatan]', error)
    return NextResponse.json({ error: error?.message || 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

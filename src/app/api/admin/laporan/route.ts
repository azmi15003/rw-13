import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profile = await prisma.user.findUnique({ where: { id: user.id } })
    if (!profile) return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 })

    const { pelaporNama, pelaporNik, pelaporHp, kategori, judul, deskripsi, lokasiKejadian, tanggalKejadian } = await req.json()

    if (!pelaporNama || !judul || !deskripsi) {
      return NextResponse.json({ error: 'Nama pelapor, judul, dan deskripsi wajib diisi.' }, { status: 400 })
    }

    const rtId = profile.role === 'super_admin'
      ? (await prisma.rt.findFirst({ orderBy: { nomorRt: 'asc' } }))?.id
      : profile.rtId

    if (!rtId) return NextResponse.json({ error: 'RT tidak ditemukan.' }, { status: 400 })

    const data = await prisma.laporan.create({
      data: {
        rtId,
        pelaporNama,
        pelaporNik: pelaporNik || null,
        pelaporHp: pelaporHp || null,
        kategori,
        judul,
        deskripsi,
        lokasiKejadian: lokasiKejadian || null,
        tanggalKejadian: tanggalKejadian ? new Date(tanggalKejadian) : null,
        createdBy: user.id,
        status: 'masuk',
      }
    })
    return NextResponse.json({ success: true, id: data.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan.' }, { status: 500 })
  }
}

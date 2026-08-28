import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const rw = await prisma.rw.findFirst()
    return NextResponse.json(rw || {})
  } catch (error: any) {
    console.error('[GET /api/dashboard/profil-rw]', error)
    return NextResponse.json({ error: error?.message || 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await req.json()
    const { visi, misi, tugas_fungsi, judul_lingkungan, deskripsi_lingkungan, foto_kantor_url, foto_peta_url } = data

    // Cari data rw pertama, jika tidak ada buat baru
    let rw = await prisma.rw.findFirst()

    if (rw) {
      rw = await prisma.rw.update({
        where: { id: rw.id },
        data: {
          visi,
          misi,
          tugas_fungsi,
          judul_lingkungan,
          deskripsi_lingkungan,
          foto_kantor_url,
          foto_peta_url,
          updated_at: new Date()
        }
      })
    } else {
      rw = await prisma.rw.create({
        data: {
          nama_rw: 'RW 13',
          visi,
          misi,
          tugas_fungsi,
          judul_lingkungan,
          deskripsi_lingkungan,
          foto_kantor_url,
          foto_peta_url,
        }
      })
    }

    return NextResponse.json({ success: true, data: rw })
  } catch (error: any) {
    console.error('[PUT /api/dashboard/profil-rw]', error)
    return NextResponse.json({ error: error?.message || 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

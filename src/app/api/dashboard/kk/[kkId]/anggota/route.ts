import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ kkId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { kkId } = await params
    const body = await req.json()

    if (!body.nik || body.nik.length !== 16) {
      return NextResponse.json({ error: 'NIK harus 16 digit.' }, { status: 400 })
    }
    if (!body.namaLengkap || !body.tempatLahir || !body.tanggalLahir) {
      return NextResponse.json({ error: 'Data wajib belum lengkap.' }, { status: 400 })
    }

    const warga = await prisma.warga.create({
      data: {
        kk_id: kkId,
        nik: body.nik,
        nama_lengkap: body.namaLengkap,
        tempat_lahir: body.tempatLahir,
        tanggal_lahir: new Date(body.tanggalLahir),
        jenis_kelamin: body.jenisKelamin,
        status_keluarga: body.statusKeluarga,
        agama: body.agama,
        pendidikan: body.pendidikan,
        pekerjaan: body.pekerjaan || null,
        status_pernikahan: body.statusPernikahan,
        nomor_hp: body.nomorHp || null,
        status_aktif: 'aktif',
      }
    })

    return NextResponse.json({ success: true, id: warga.id })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'NIK sudah terdaftar.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

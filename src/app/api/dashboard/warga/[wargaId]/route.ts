import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ wargaId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { wargaId } = await params
    const warga = await prisma.warga.findUnique({ where: { id: wargaId } })
    if (!warga) return NextResponse.json({ error: 'Tidak ditemukan.' }, { status: 404 })

    return NextResponse.json(warga)
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ wargaId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { wargaId } = await params
    const body = await req.json()

    const updated = await prisma.warga.update({
      where: { id: wargaId },
      data: {
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
        status_aktif: body.statusAktif,
        tanggal_tidak_aktif: body.tanggalTidakAktif ? new Date(body.tanggalTidakAktif) : null,
        keterangan_tidak_aktif: body.keteranganTidakAktif || null,
      }
    })

    return NextResponse.json({ success: true, id: updated.id })
  } catch (error: any) {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

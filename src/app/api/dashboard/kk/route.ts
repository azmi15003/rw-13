import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profile = await prisma.users.findUnique({
      where: { id: user.id },
      include: { rt: true }
    })
    if (!profile) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })

    const { nomorKK, alamat, blokNomor, anggota } = await req.json()

    // Validasi
    if (!nomorKK || nomorKK.length !== 16) {
      return NextResponse.json({ error: 'Nomor KK harus 16 digit.' }, { status: 400 })
    }
    if (!alamat) {
      return NextResponse.json({ error: 'Alamat wajib diisi.' }, { status: 400 })
    }
    if (!anggota || anggota.length === 0) {
      return NextResponse.json({ error: 'Minimal 1 anggota keluarga.' }, { status: 400 })
    }
    if (!anggota.some((a: any) => a.statusKeluarga === 'kepala_kk')) {
      return NextResponse.json({ error: 'Harus ada Kepala KK.' }, { status: 400 })
    }

    // Tentukan rtId
    const rtId = profile.role === 'super_admin'
      ? (await prisma.rt.findFirst({ orderBy: { nomor_rt: 'asc' } }))?.id
      : profile.rt_id

    if (!rtId) return NextResponse.json({ error: 'RT tidak ditemukan.' }, { status: 400 })

    const result = await prisma.$transaction(async (tx) => {
      const kk = await tx.kartu_keluarga.create({
        data: {
          nomor_kk: nomorKK,
          rt_id: rtId,
          alamat_lengkap: alamat,
          blok_nomor: blokNomor || null,
          status_verifikasi: 'pending',
          created_by: user.id,
        }
      })

      const wargaData = anggota.map((a: any) => ({
        kk_id: kk.id,
        nik: a.nik,
        nama_lengkap: a.namaLengkap,
        tempat_lahir: a.tempatLahir,
        tanggal_lahir: new Date(a.tanggalLahir),
        jenis_kelamin: a.jenisKelamin,
        status_keluarga: a.statusKeluarga,
        agama: a.agama,
        pendidikan: a.pendidikan,
        pekerjaan: a.pekerjaan || null,
        status_pernikahan: a.statusPernikahan,
        nomor_hp: a.nomorHp || null,
        status_aktif: 'aktif',
      }))

      await tx.warga.createMany({
        data: wargaData,
      })
      return kk
    })

    console.log(result, 'ini result');

    return NextResponse.json({ success: true, id: result.id })
  } catch (error: any) {
    console.log(error, 'ini error')
    console.error('Error creating KK:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Nomor KK atau NIK sudah terdaftar.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

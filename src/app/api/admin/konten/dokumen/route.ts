import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { nama, deskripsi, kategori, fileUrl, tipeFile, ukuranBytes } = await req.json()
    if (!nama || !fileUrl) return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 })

    const tipeMap: Record<string, string> = { pdf: 'pdf', docx: 'docx', doc: 'docx', xlsx: 'xlsx', xls: 'xlsx' }
    const tipeValid = tipeMap[tipeFile?.toLowerCase()] || 'pdf'

    const data = await prisma.dokumen.create({
      data: {
        nama,
        deskripsi: deskripsi || null,
        kategori,
        file_url: fileUrl,
        tipe_file: tipeValid as any,
        ukuran_bytes: Number(ukuranBytes),
        uploaded_by: user.id,
      }
    })
    return NextResponse.json({ success: true, id: data.id })
  } catch (error: any) {
    console.error('[POST /api/admin/konten/dokumen]', error)
    return NextResponse.json({ error: error?.message || 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

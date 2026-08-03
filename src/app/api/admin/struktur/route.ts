import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { nama, jabatan, tipe, parent_id, warna, urutan, foto_url } = await req.json()
    if (!nama || !jabatan) return NextResponse.json({ error: 'Nama dan jabatan wajib diisi.' }, { status: 400 })

    const data = await prisma.org_chart_node.create({
      data: {
        nama,
        jabatan,
        tipe: tipe || 'rw',
        parent_id: parent_id || null,
        warna: warna || '#185FA5',
        urutan: urutan || 0,
        foto_url: foto_url || null,
      }
    })
    return NextResponse.json({ success: true, id: data.id })
  } catch (error: any) {
    console.error('[POST /api/admin/struktur]', error)
    return NextResponse.json({ error: error?.message || 'Terjadi kesalahan.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const data = await prisma.org_chart_node.findMany({
      orderBy: [{ urutan: 'asc' }, { created_at: 'asc' }],
    })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

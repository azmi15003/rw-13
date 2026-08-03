import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { nama, jabatan, tipe, parent_id, warna, urutan, foto_url } = await req.json()

    await prisma.org_chart_node.update({
      where: { id },
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
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[PATCH /api/admin/struktur]', error)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    // Cascade delete sudah dihandle di database (ON DELETE CASCADE)
    await prisma.org_chart_node.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[DELETE /api/admin/struktur]', error)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

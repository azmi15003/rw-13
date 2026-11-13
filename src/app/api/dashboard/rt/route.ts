import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rts = await prisma.rt.findMany({
      orderBy: { nomor_rt: 'asc' },
      select: {
        id: true,
        nomor_rt: true,
        nama_ketua: true,
      },
    })
    return NextResponse.json(rts)
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal mengambil data RT' }, { status: 500 })
  }
}


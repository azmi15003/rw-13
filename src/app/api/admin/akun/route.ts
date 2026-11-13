import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserProfile } from '@/lib/auth'
import { hashPassword } from '@/lib/session'

export async function POST(req: NextRequest) {
  // Verify caller is super_admin
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await req.json()
  const { namaLengkap, email, password, rtId, role } = body

  if (!namaLengkap || !email || !password) {
    return NextResponse.json({ error: 'Nama, email, dan password wajib diisi.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password minimal 8 karakter.' }, { status: 400 })
  }

  try {
    const hashedPassword = await hashPassword(password)

    const user = await prisma.users.upsert({
      where: {
        email: email.toLowerCase().trim(),
      },
      update: {
        nama_lengkap: namaLengkap,
        password_hash: hashedPassword,
        role: role || 'admin_rt',
        rt_id: rtId || null,
      },
      create: {
        nama_lengkap: namaLengkap,
        email: email.toLowerCase().trim(),
        password_hash: hashedPassword,
        role: role || 'admin_rt',
        rt_id: rtId || null,
      },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err: any) {
    console.error('Error creating admin account:', err)
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan.' }, { status: 500 })
  }
}

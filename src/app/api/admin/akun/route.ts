import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getUserProfile } from '@/lib/auth'

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
    // 1. Create auth user in Supabase using admin client (bypasses RLS)
    const supabaseAdmin = createAdminClient()
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // 2. Insert into users table via Prisma
    await prisma.users.upsert({
      where: {
        email,
      },
      update: {
        nama_lengkap: namaLengkap,
        role: role || 'admin_rt',
        rt_id: rtId || null,
      },
      create: {
        id: authData.user.id,
        nama_lengkap: namaLengkap,
        email,
        role: role || 'admin_rt',
        rt_id: rtId || null,
      },
    })

    return NextResponse.json({ success: true, userId: authData.user.id })
  } catch (err: any) {
    console.error('Error creating admin account:', err)
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan.' }, { status: 500 })
  }
}

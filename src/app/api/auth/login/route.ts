import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, createSessionToken } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 })
    }

    let user = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    // Jika database masih kosong sama sekali dan belum ada user super_admin, buat otomatis user pertama sebagai super_admin
    const userCount = await prisma.users.count()
    if (!user && userCount === 0) {
      const hashedPassword = await hashPassword(password)
      user = await prisma.users.create({
        data: {
          nama_lengkap: 'Super Admin RW 13',
          email: email.toLowerCase().trim(),
          password_hash: hashedPassword,
          role: 'super_admin',
        },
      })
    } else if (!user) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 })
    } else {
      // Verifikasi password
      const isValid = user.password_hash ? await verifyPassword(password, user.password_hash) : false
      if (!isValid) {
        return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 })
      }
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (err: any) {
    console.error('[Login Error]', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server: ' + (err.message || '') }, { status: 500 })
  }
}


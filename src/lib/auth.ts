import { createClient } from './supabase/server'
import { prisma } from './prisma'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
})

export const getUserProfile = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const profile = await prisma.users.findUnique({
    where: { id: user.id },
    include: { rt: true }
  })
  return profile
})

// Wajib login — redirect ke /login kalau belum
export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

// Wajib Super Admin — redirect kalau bukan
export async function requireSuperAdmin() {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'super_admin') {
    redirect('/dashboard')
  }
  return profile
}

// Wajib Admin RT atau Super Admin
export async function requireAdminRT() {
  const profile = await getUserProfile()
  if (!profile) redirect('/login')
  if (profile.role !== 'admin_rt' && profile.role !== 'super_admin') {
    redirect('/')
  }
  return profile
}

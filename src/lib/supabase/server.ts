import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/session'

export async function createClient() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  return {
    auth: {
      async getUser() {
        if (!token) {
          return { data: { user: null }, error: new Error('No session') }
        }
        const payload = await verifySessionToken(token)
        if (!payload) {
          return { data: { user: null }, error: new Error('Invalid session') }
        }
        return {
          data: {
            user: {
              id: payload.id,
              email: payload.email,
              role: payload.role,
            },
          },
          error: null,
        }
      },
    },
  }
}

export function createAdminClient() {
  return {
    auth: {
      admin: {
        async createUser({ email, password }: { email: string; password: string }) {
          return { data: { user: { id: '', email } }, error: null }
        },
      },
    },
  }
}

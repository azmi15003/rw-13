export function createClient() {
  return {
    auth: {
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          if (!res.ok) {
            return { data: null, error: new Error(data.error || 'Login gagal') }
          }
          return { data: { user: data.user }, error: null }
        } catch (err: any) {
          return { data: null, error: err }
        }
      },
      async signOut() {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
        } finally {
          window.location.href = '/login'
        }
      },
      async getUser() {
        // Pada client-side, jika dibutuhkan bisa fetch ke session check atau biarkan null
        return { data: { user: null }, error: null }
      },
    },
    storage: {
      from(bucket: string) {
        return {
          async upload(fileName: string, file: File | Blob) {
            try {
              const formData = new FormData()
              formData.append('bucket', bucket)
              formData.append('fileName', fileName)
              formData.append('file', file)

              const res = await fetch('/api/storage/upload', {
                method: 'POST',
                body: formData,
              })
              const data = await res.json()
              if (!res.ok) {
                return { data: null, error: new Error(data.error || 'Upload gagal') }
              }
              return { data: { path: fileName, ...data.data }, error: null }
            } catch (err: any) {
              return { data: null, error: err }
            }
          },
          getPublicUrl(fileName: string) {
            const safeFileName = fileName.replace(/^\/+/, '')
            return {
              data: {
                publicUrl: `/uploads/${bucket}/${safeFileName}`,
              },
            }
          },
        }
      },
    },
  }
}

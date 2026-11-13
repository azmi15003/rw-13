import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import fs from 'node:fs/promises'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const bucket = (formData.get('bucket') as string) || 'general'
    const fileName = (formData.get('fileName') as string) || `file-${Date.now()}`
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Simpan ke direktori public/uploads/<bucket>/
    const targetDir = path.join(process.cwd(), 'public', 'uploads', bucket)
    await fs.mkdir(targetDir, { recursive: true })

    const safeFileName = path.basename(fileName)
    const filePath = path.join(targetDir, safeFileName)
    await fs.writeFile(filePath, buffer)

    const publicUrl = `/uploads/${bucket}/${safeFileName}`
    return NextResponse.json({
      data: { path: safeFileName, publicUrl },
      publicUrl,
    })
  } catch (err: any) {
    console.error('[Upload Error]', err)
    return NextResponse.json({ error: 'Gagal upload file: ' + (err.message || '') }, { status: 500 })
  }
}


import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envLocalPath = path.resolve(__dirname, '../.env.local')

let databaseUrl = ''
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8')
  const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)
  if (match) {
    databaseUrl = match[1]
  }
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL tidak ditemukan di .env.local')
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

async function main() {
  const rts = [
    { nomor_rt: '01', nama_ketua: 'Ketua RT 01' },
    { nomor_rt: '02', nama_ketua: 'Ketua RT 02' },
    { nomor_rt: '03', nama_ketua: 'Ketua RT 03' },
    { nomor_rt: '04', nama_ketua: 'Ketua RT 04' },
    { nomor_rt: '05', nama_ketua: 'Ketua RT 05' },
  ]

  console.log('Seeding RT 01 sampai RT 05...')

  for (const item of rts) {
    const existing = await prisma.rt.findFirst({
      where: { nomor_rt: item.nomor_rt },
    })

    if (!existing) {
      const created = await prisma.rt.create({
        data: item,
      })
      console.log(`✓ Berhasil membuat RT ${created.nomor_rt}`)
    } else {
      console.log(`ℹ RT ${item.nomor_rt} sudah ada`)
    }
  }

  const allRt = await prisma.rt.findMany({ orderBy: { nomor_rt: 'asc' } })
  console.log('Daftar RT di database:', allRt.map(r => `RT ${r.nomor_rt} (${r.nama_ketua})`))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

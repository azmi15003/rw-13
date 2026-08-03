import { prisma } from '@/lib/prisma'
import StrukturClient from './StrukturClient'

export const revalidate = 300

const DEFAULT_NODES = [
  { id: '1', parent_id: null, nama: 'H. Ahmad Sulaiman', jabatan: 'Ketua RW 13', foto_url: null, warna: '#185FA5', urutan: 0, tipe: 'rw' },
  { id: '2', parent_id: '1', nama: 'Ibu Maya Sari', jabatan: 'Sekretaris', foto_url: null, warna: '#185FA5', urutan: 1, tipe: 'rw' },
  { id: '3', parent_id: '1', nama: 'Bpk. Bambang Heru', jabatan: 'Bendahara', foto_url: null, warna: '#185FA5', urutan: 2, tipe: 'rw' },
  { id: '4', parent_id: '1', nama: 'Keamanan & Tibum', jabatan: 'Sie Keamanan', foto_url: null, warna: '#1D9E75', urutan: 3, tipe: 'sie' },
  { id: '5', parent_id: '1', nama: 'Lingkungan Hidup', jabatan: 'Sie Kebersihan', foto_url: null, warna: '#1D9E75', urutan: 4, tipe: 'sie' },
  { id: '6', parent_id: '1', nama: 'Kesra & Posyandu', jabatan: 'Sie Kesehatan', foto_url: null, warna: '#1D9E75', urutan: 5, tipe: 'sie' },
  { id: '7', parent_id: '1', nama: 'Informasi & IT', jabatan: 'Sie Humas', foto_url: null, warna: '#1D9E75', urutan: 6, tipe: 'sie' },
  { id: '8', parent_id: '2', nama: 'Ketua RT 01', jabatan: 'RT 01', foto_url: null, warna: '#6B7280', urutan: 7, tipe: 'rt' },
  { id: '9', parent_id: '2', nama: 'Ketua RT 02', jabatan: 'RT 02', foto_url: null, warna: '#6B7280', urutan: 8, tipe: 'rt' },
  { id: '10', parent_id: '2', nama: 'Ketua RT 03', jabatan: 'RT 03', foto_url: null, warna: '#6B7280', urutan: 9, tipe: 'rt' },
  { id: '11', parent_id: '3', nama: 'Ketua RT 04', jabatan: 'RT 04', foto_url: null, warna: '#6B7280', urutan: 10, tipe: 'rt' },
  { id: '12', parent_id: '3', nama: 'Ketua RT 05', jabatan: 'RT 05', foto_url: null, warna: '#6B7280', urutan: 11, tipe: 'rt' },
  { id: '13', parent_id: '3', nama: 'Ketua RT 06', jabatan: 'RT 06', foto_url: null, warna: '#6B7280', urutan: 12, tipe: 'rt' },
  { id: '14', parent_id: '3', nama: 'Ketua RT 07', jabatan: 'RT 07', foto_url: null, warna: '#6B7280', urutan: 13, tipe: 'rt' },
  { id: '15', parent_id: '3', nama: 'Ketua RT 08', jabatan: 'RT 08', foto_url: null, warna: '#6B7280', urutan: 14, tipe: 'rt' },
]

export default async function StrukturPage() {
  let nodes = DEFAULT_NODES
  try {
    const dbNodes = await prisma.org_chart_node.findMany({ orderBy: { urutan: 'asc' } })
    if (dbNodes.length > 0) {
      nodes = dbNodes.map(n => ({
        id: n.id,
        parent_id: n.parent_id,
        nama: n.nama,
        jabatan: n.jabatan,
        foto_url: n.foto_url,
        warna: n.warna || '#185FA5',
        urutan: n.urutan,
        tipe: n.tipe || 'rw',
      }))
    }
  } catch (e) {
    // pakai default data
  }

  return (
    <div className="pt-14">
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Kepengurusan</p>
          <h1 className="text-3xl font-bold mb-2">Struktur Organisasi</h1>
          <p className="text-sm text-white/60">Tata kelola lingkungan RW 13 yang transparan dan akuntabel.</p>
        </div>
      </div>
      <div className="bg-gray-50 min-h-screen">
        <StrukturClient nodes={nodes} />
      </div>
    </div>
  )
}

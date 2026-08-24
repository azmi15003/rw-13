'use client'

import { useState } from 'react'

const KATEGORI = ['semua', 'kehilangan', 'kerusakan fasilitas', 'keamanan', 'kebersihan', 'sosial', 'administrasi', 'lainnya']

export default function LaporanClient({ initialData }: { initialData: any[] }) {
  const [filterKat, setFilterKat] = useState('semua')

  const filteredData = filterKat === 'semua' 
    ? initialData 
    : initialData.filter(d => d.kategori === filterKat)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'masuk': return 'bg-blue-100 text-blue-700'
      case 'diproses': return 'bg-amber-100 text-amber-700'
      case 'selesai': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getIcon = (kategori: string) => {
    switch (kategori) {
      case 'kehilangan': return '🔍'
      case 'kerusakan fasilitas': return '🔧'
      case 'keamanan': return '🛡️'
      case 'kebersihan': return '🧹'
      case 'sosial': return '🤝'
      default: return '📝'
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {KATEGORI.map(k => (
          <button
            key={k}
            onClick={() => setFilterKat(k)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition ${
              filterKat === k 
                ? 'bg-gray-900 text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredData.map(l => (
          <div key={l.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getIcon(l.kategori)}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {l.kategori}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getStatusColor(l.status)}`}>
                {l.status}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
              {l.judul}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {l.deskripsi}
            </p>

            <div className="pt-4 border-t border-gray-100 mt-auto space-y-2">
              {l.lokasi_kejadian && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>📍</span>
                  <span className="truncate">{l.lokasi_kejadian}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>👤</span>
                <span>{l.pelapor_nama} (RT {l.rt.nomor_rt})</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>🕒</span>
                <span>{new Date(l.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-gray-900 font-bold mb-1">Tidak ada laporan</p>
            <p className="text-sm text-gray-500">Belum ada laporan untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
        <p className="text-sm text-gray-500 font-medium">Memuat data admin...</p>
      </div>
    </div>
  )
}

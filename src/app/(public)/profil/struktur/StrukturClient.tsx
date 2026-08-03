'use client'

import { useState, useRef, useCallback } from 'react'

export type OrgNode = {
  id: string
  parent_id: string | null
  nama: string
  jabatan: string
  foto_url: string | null
  warna: string
  urutan: number
  tipe: string
}

function getInitials(nama: string) {
  return nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function NodeCard({ node, isRoot, collapsed, hasChildren, onToggle }: {
  node: OrgNode
  isRoot?: boolean
  collapsed: boolean
  hasChildren: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`relative select-none transition-all duration-150 ${hasChildren ? 'cursor-pointer' : ''}`}
      onClick={hasChildren ? onToggle : undefined}
    >
      <div
        className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow
          ${isRoot ? 'w-56' : 'w-44'}
          ${hasChildren ? 'hover:border-gray-400' : ''}
        `}
        style={{ borderTop: `4px solid ${node.warna}` }}
      >
        <div className="flex items-center gap-3 p-3">
          {/* Avatar */}
          <div
            className={`rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white overflow-hidden
              ${isRoot ? 'w-12 h-12 text-sm' : 'w-10 h-10 text-xs'}`}
            style={{ backgroundColor: node.warna }}
          >
            {node.foto_url
              ? <img src={node.foto_url} alt={node.nama} className="w-full h-full object-cover" />
              : getInitials(node.nama)
            }
          </div>
          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-gray-800 leading-tight truncate ${isRoot ? 'text-sm' : 'text-xs'}`}>
              {node.nama}
            </p>
            <p className={`text-gray-400 truncate ${isRoot ? 'text-xs' : 'text-[11px]'}`}>
              {node.jabatan}
            </p>
          </div>
        </div>
      </div>

      {/* Collapse indicator */}
      {hasChildren && (
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 shadow flex items-center justify-center z-10"
          style={{ borderColor: node.warna }}
        >
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
            style={{ color: node.warna }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </div>
  )
}

function OrgTree({ node, allNodes, collapsed, onToggle }: {
  node: OrgNode
  allNodes: OrgNode[]
  collapsed: Set<string>
  onToggle: (id: string) => void
}) {
  const children = allNodes
    .filter(n => n.parent_id === node.id)
    .sort((a, b) => a.urutan - b.urutan)

  const isCollapsed = collapsed.has(node.id)
  const hasChildren = children.length > 0
  const showChildren = hasChildren && !isCollapsed
  const isRoot = node.parent_id === null

  return (
    <div className="flex flex-col items-center">
      <NodeCard
        node={node}
        isRoot={isRoot}
        collapsed={isCollapsed}
        hasChildren={hasChildren}
        onToggle={() => onToggle(node.id)}
      />

      {showChildren && (
        <>
          {/* Line down from parent */}
          <div className="w-px bg-gray-300 mt-3" style={{ height: 28 }} />

          <div className="flex items-start gap-6">
            {children.map((child, i) => (
              <div key={child.id} className="flex flex-col items-center relative">
                {/* Horizontal connector line */}
                {children.length > 1 && (
                  <div
                    className="absolute top-0 bg-gray-300"
                    style={{
                      height: 1,
                      left: i === 0 ? '50%' : 0,
                      right: i === children.length - 1 ? '50%' : 0,
                    }}
                  />
                )}
                {/* Line down to child */}
                <div className="w-px bg-gray-300" style={{ height: 28 }} />
                <OrgTree
                  node={child}
                  allNodes={allNodes}
                  collapsed={collapsed}
                  onToggle={onToggle}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function StrukturClient({ nodes }: { nodes: OrgNode[] }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const scrollLeft = useRef(0)
  const scrollTop = useRef(0)

  const toggle = useCallback((id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  function collapseAll() {
    const withChildren = nodes.filter(n => nodes.some(c => c.parent_id === n.id))
    setCollapsed(new Set(withChildren.map(n => n.id)))
  }

  function expandAll() {
    setCollapsed(new Set())
  }

  // Drag scroll handlers
  function onMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('[data-node]')) return
    isDragging.current = true
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0)
    startY.current = e.pageY - (containerRef.current?.offsetTop || 0)
    scrollLeft.current = containerRef.current?.scrollLeft || 0
    scrollTop.current = containerRef.current?.scrollTop || 0
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing'
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - (containerRef.current.offsetLeft || 0)
    const y = e.pageY - (containerRef.current.offsetTop || 0)
    containerRef.current.scrollLeft = scrollLeft.current - (x - startX.current)
    containerRef.current.scrollTop = scrollTop.current - (y - startY.current)
  }

  function onMouseUp() {
    isDragging.current = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
  }

  const roots = nodes.filter(n => n.parent_id === null)

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 mb-4 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Legend */}
          {[
            { color: '#185FA5', label: 'Pengurus RW' },
            { color: '#1D9E75', label: 'Sie / Bidang' },
            { color: '#6B7280', label: 'Ketua RT' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
          ))}
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs text-gray-400">💡 Klik node untuk buka/tutup · Drag untuk geser</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={expandAll}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition">
            Buka Semua
          </button>
          <button onClick={collapseAll}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition">
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Diagram */}
      <div
        ref={containerRef}
        className="bg-white rounded-2xl border border-gray-200 overflow-auto"
        style={{
          cursor: 'grab',
          minHeight: 480,
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="p-12 flex justify-center" style={{ minWidth: 'max-content' }}>
          {roots.map(root => (
            <OrgTree
              key={root.id}
              node={root}
              allNodes={nodes}
              collapsed={collapsed}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

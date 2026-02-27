import { useState, useRef, useCallback } from 'react'
import { cn } from '../lib/cn.js'

export interface Layer {
  id: string
  label: string
  /** Thumbnail image URL */
  thumbnail?: string
  visible: boolean
  locked: boolean
  /** 0–100 */
  opacity: number
}

export interface LayerStackProps {
  layers: Layer[]
  /** Currently selected layer */
  selectedId?: string
  onSelect?: (id: string) => void
  /** Called with reordered array after drag-drop */
  onReorder?: (layers: Layer[]) => void
  onToggleVisibility?: (id: string) => void
  onToggleLock?: (id: string) => void
  onOpacityChange?: (id: string, opacity: number) => void
  onRemove?: (id: string) => void
  /** Optional add layer button */
  onAdd?: () => void
  /** Compact mode for narrow sidebars */
  compact?: boolean
  className?: string
}

export function LayerStack({
  layers,
  selectedId,
  onSelect,
  onReorder,
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onRemove,
  onAdd,
  compact = false,
  className,
}: LayerStackProps) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [editingOpacity, setEditingOpacity] = useState<string | null>(null)
  const dragStartIndex = useRef<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragStart = useCallback((e: React.PointerEvent, id: string, index: number) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragId(id)
    dragStartIndex.current = index
    setDropIndex(index)
  }, [])

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragId || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const rowHeight = compact ? 32 : 44
    const y = e.clientY - rect.top
    const idx = Math.max(0, Math.min(layers.length - 1, Math.floor(y / rowHeight)))
    setDropIndex(idx)
  }, [dragId, layers.length, compact])

  const handleDragEnd = useCallback(() => {
    if (dragId !== null && dropIndex !== null && onReorder) {
      const fromIdx = layers.findIndex(l => l.id === dragId)
      if (fromIdx !== -1 && fromIdx !== dropIndex) {
        const reordered = [...layers]
        const [moved] = reordered.splice(fromIdx, 1)
        if (moved) {
          reordered.splice(dropIndex, 0, moved)
          onReorder(reordered)
        }
      }
    }
    setDragId(null)
    setDropIndex(null)
  }, [dragId, dropIndex, layers, onReorder])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string, index: number) => {
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      const prev = layers[index - 1]
      if (prev) onSelect?.(prev.id)
    } else if (e.key === 'ArrowDown' && index < layers.length - 1) {
      e.preventDefault()
      const next = layers[index + 1]
      if (next) onSelect?.(next.id)
    } else if (e.key === ' ') {
      e.preventDefault()
      onToggleVisibility?.(id)
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      onRemove?.(id)
    }
  }, [layers, onSelect, onToggleVisibility, onRemove])

  const rowHeight = compact ? 32 : 44
  const thumbSize = compact ? 20 : 28

  return (
    <div
      ref={containerRef}
      className={cn('forge-layer-stack', className)}
      role="list"
      aria-label="Layer stack"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--forge-bg)',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-lg)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `var(--forge-space-1-5) var(--forge-space-3)`,
        borderBottom: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
        minHeight: '32px',
      }}>
        <span style={{
          fontSize: 'var(--forge-font-size-xs)',
          fontFamily: 'var(--forge-font-mono)',
          color: 'var(--forge-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Layers ({layers.length})
        </span>
        {onAdd && (
          <button
            type="button"
            aria-label="Add layer"
            onClick={onAdd}
            style={{
              background: 'none',
              border: '1px solid var(--forge-border)',
              borderRadius: 'var(--forge-radius-sm)',
              cursor: 'pointer',
              color: 'var(--forge-text-muted)',
              fontSize: 'var(--forge-font-size-sm)',
              padding: '1px 8px',
              lineHeight: '1.4',
            }}
          >+</button>
        )}
      </div>

      {/* Layer rows */}
      <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
        {layers.map((layer, index) => {
          const isSelected = layer.id === selectedId
          const isDragging = layer.id === dragId
          const showDropIndicator = dropIndex === index && dragId !== null && dragId !== layer.id

          return (
            <div key={layer.id} style={{ position: 'relative' }}>
              {/* Drop indicator */}
              {showDropIndicator && (
                <div aria-hidden="true" style={{
                  position: 'absolute',
                  top: 0,
                  left: 'var(--forge-space-2)',
                  right: 'var(--forge-space-2)',
                  height: '2px',
                  backgroundColor: 'var(--forge-accent)',
                  borderRadius: '1px',
                  zIndex: 2,
                }} />
              )}
              <div
                role="listitem"
                data-selected={isSelected ? 'true' : undefined}
                aria-label={`${layer.label}${!layer.visible ? ', hidden' : ''}${layer.locked ? ', locked' : ''}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelect?.(layer.id)}
                onKeyDown={(e) => handleKeyDown(e, layer.id, index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--forge-space-2)',
                  height: `${rowHeight}px`,
                  padding: `0 var(--forge-space-2)`,
                  borderBottom: '1px solid var(--forge-border)',
                  backgroundColor: isSelected ? 'var(--forge-surface)' : 'transparent',
                  opacity: isDragging ? 0.4 : layer.visible ? 1 : 0.4,
                  cursor: 'default',
                  outline: 'none',
                  transition: 'background-color 0.1s',
                }}
              >
                {/* Drag handle */}
                {onReorder && (
                  <div
                    aria-label={`Drag to reorder ${layer.label}`}
                    style={{
                      cursor: 'grab',
                      color: 'var(--forge-text-muted)',
                      fontSize: 'var(--forge-font-size-xs)',
                      padding: '2px',
                      touchAction: 'none',
                      lineHeight: 1,
                    }}
                    onPointerDown={(e) => { e.stopPropagation(); handleDragStart(e, layer.id, index) }}
                  >
                    ⠿
                  </div>
                )}

                {/* Thumbnail */}
                {layer.thumbnail && (
                  <div style={{
                    width: thumbSize,
                    height: thumbSize,
                    borderRadius: 'var(--forge-radius-sm)',
                    border: '1px solid var(--forge-border)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundImage: `
                      linear-gradient(45deg, var(--forge-surface) 25%, transparent 25%),
                      linear-gradient(-45deg, var(--forge-surface) 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, var(--forge-surface) 75%),
                      linear-gradient(-45deg, transparent 75%, var(--forge-surface) 75%)
                    `,
                    backgroundSize: '6px 6px',
                    backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0',
                  }}>
                    <img
                      src={layer.thumbnail}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        imageRendering: 'pixelated',
                      }}
                    />
                  </div>
                )}

                {/* Label */}
                <span style={{
                  flex: '1 1 auto',
                  fontSize: compact ? 'var(--forge-font-size-xs)' : 'var(--forge-font-size-sm)',
                  color: 'var(--forge-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {layer.label}
                </span>

                {/* Opacity */}
                {!compact && (
                  editingOpacity === layer.id ? (
                    <input
                      type="number"
                      aria-label={`Opacity for ${layer.label}`}
                      min={0}
                      max={100}
                      value={layer.opacity}
                      onChange={(e) => onOpacityChange?.(layer.id, Math.max(0, Math.min(100, Number(e.target.value))))}
                      onBlur={() => setEditingOpacity(null)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setEditingOpacity(null); e.stopPropagation() }}
                      autoFocus
                      style={{
                        width: '40px',
                        backgroundColor: 'var(--forge-surface)',
                        border: '1px solid var(--forge-accent)',
                        borderRadius: 'var(--forge-radius-sm)',
                        color: 'var(--forge-text)',
                        fontSize: 'var(--forge-font-size-xs)',
                        fontFamily: 'var(--forge-font-mono)',
                        textAlign: 'center',
                        padding: '1px',
                        outline: 'none',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={`Opacity: ${layer.opacity}%`}
                      onClick={(e) => { e.stopPropagation(); setEditingOpacity(layer.id) }}
                      style={{
                        fontSize: 'var(--forge-font-size-xs)',
                        fontFamily: 'var(--forge-font-mono)',
                        color: 'var(--forge-text-muted)',
                        minWidth: '32px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderRadius: 'var(--forge-radius-sm)',
                        padding: '1px 2px',
                      }}
                    >
                      {layer.opacity}%
                    </span>
                  )
                )}

                {/* Visibility toggle */}
                <button
                  type="button"
                  aria-label={layer.visible ? `Hide ${layer.label}` : `Show ${layer.label}`}
                  onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(layer.id) }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: compact ? '12px' : '14px',
                    padding: '2px',
                    color: layer.visible ? 'var(--forge-text-muted)' : 'var(--forge-border)',
                    lineHeight: 1,
                  }}
                >
                  {layer.visible ? '👁' : '👁‍🗨'}
                </button>

                {/* Lock toggle */}
                <button
                  type="button"
                  aria-label={layer.locked ? `Unlock ${layer.label}` : `Lock ${layer.label}`}
                  onClick={(e) => { e.stopPropagation(); onToggleLock?.(layer.id) }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: compact ? '12px' : '14px',
                    padding: '2px',
                    color: layer.locked ? 'var(--forge-accent)' : 'var(--forge-border)',
                    lineHeight: 1,
                  }}
                >
                  {layer.locked ? '🔒' : '🔓'}
                </button>

                {/* Remove button */}
                {onRemove && !compact && (
                  <button
                    type="button"
                    aria-label={`Remove ${layer.label}`}
                    onClick={(e) => { e.stopPropagation(); onRemove(layer.id) }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '2px',
                      color: 'var(--forge-text-muted)',
                      opacity: 0.5,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

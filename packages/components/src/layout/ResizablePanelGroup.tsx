import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '../lib/cn.js'

type Direction = 'horizontal' | 'vertical'

interface ResizablePanelProps {
  children: React.ReactNode
  /** Minimum size in pixels */
  minSize?: number
  /** Maximum size in pixels */
  maxSize?: number
  /**
   * Initial size of this panel.
   * - When a sibling has `flex`, this is treated as **pixels** (e.g. 250).
   * - When NO sibling has `flex`, values are treated as **proportional weights**
   *   (e.g. 25/50/25 → 25%/50%/25% of available space).
   */
  defaultSize?: number
  /** When true, this panel takes remaining space (flex: 1) */
  flex?: boolean
  className?: string
  style?: React.CSSProperties
}

interface ResizablePanelGroupProps {
  children: React.ReactNode
  direction?: Direction
  storageKey?: string
  className?: string
  style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// ResizableHandle
// ---------------------------------------------------------------------------
interface ResizableHandleProps {
  direction: Direction
  onDrag: (delta: number) => void
}

function ResizableHandle({ direction, onDrag }: ResizableHandleProps) {
  const dragging = useRef(false)
  const lastPos = useRef(0)
  const isHorizontal = direction === 'horizontal'

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    lastPos.current = isHorizontal ? e.clientX : e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const pos = isHorizontal ? e.clientX : e.clientY
    const delta = pos - lastPos.current
    lastPos.current = pos
    onDrag(delta)
  }

  const handlePointerUp = () => {
    dragging.current = false
  }

  return (
    <div
      role="separator"
      aria-orientation={direction}
      style={{
        flexShrink: 0,
        backgroundColor: 'var(--forge-border)',
        cursor: isHorizontal ? 'col-resize' : 'row-resize',
        width: isHorizontal ? '4px' : '100%',
        height: isHorizontal ? '100%' : '4px',
        transition: `background-color var(--forge-duration-fast) var(--forge-easing-default)`,
        userSelect: 'none',
        touchAction: 'none',
        position: 'relative',
        zIndex: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--forge-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--forge-border)'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}

// ---------------------------------------------------------------------------
// ResizablePanel
// ---------------------------------------------------------------------------
export function ResizablePanel({
  children,
  minSize = 100,
  maxSize,
  defaultSize,
  flex = false,
  className,
  style,
}: ResizablePanelProps) {
  return (
    <div
      className={cn('forge-resizable-panel', className)}
      data-min-size={minSize}
      data-max-size={maxSize}
      data-default-size={defaultSize}
      data-flex={flex}
      style={{
        ...(flex ? { flex: '1 1 auto', overflow: 'hidden', minWidth: 0 } : { overflow: 'auto' }),
        ...(defaultSize && !flex ? { width: undefined, height: undefined } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ResizablePanelGroup
// ---------------------------------------------------------------------------
export function ResizablePanelGroup({
  children,
  direction = 'horizontal',
  storageKey,
  className,
  style,
}: ResizablePanelGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isHorizontal = direction === 'horizontal'

  // Parse panel children and insert handles between them
  const panels = Array.isArray(children) ? children.flat() : [children]
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const [sizes, setSizes] = useState<(number | null)[]>(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`forge-panel-${storageKey}`)
        if (stored) return JSON.parse(stored) as number[]
      } catch {
        /* ignore */
      }
    }
    return panels.map(() => null)
  })

  // Apply sizes to panels
  useEffect(() => {
    sizes.forEach((size, i) => {
      const el = panelRefs.current[i]
      if (!el || size === null) return
      // Pin the dragged panel at the new size via flex-basis
      el.style.flex = `0 1 ${size}px`
      if (isHorizontal) {
        el.style.width = `${size}px`
      } else {
        el.style.height = `${size}px`
      }
    })
  }, [sizes, isHorizontal])

  const handleDrag = useCallback(
    (panelIndex: number, delta: number) => {
      setSizes((prev) => {
        const next = [...prev]
        const el = panelRefs.current[panelIndex]
        if (!el) return prev
        const currentSize = isHorizontal ? el.offsetWidth : el.offsetHeight
        const panel = panels[panelIndex] as React.ReactElement<ResizablePanelProps>
        const minSize = panel?.props?.minSize ?? 100
        const maxSize = panel?.props?.maxSize ?? Infinity
        const newSize = Math.max(minSize, Math.min(maxSize, currentSize + delta))
        next[panelIndex] = newSize
        if (storageKey) {
          try {
            localStorage.setItem(`forge-panel-${storageKey}`, JSON.stringify(next))
          } catch {
            /* ignore */
          }
        }
        return next
      })
    },
    [panels, isHorizontal, storageKey],
  )

  const hasFlexPanel = panels.some(
    (p) => (p as React.ReactElement<ResizablePanelProps>)?.props?.flex,
  )

  const items: React.ReactNode[] = []
  panels.forEach((panel, i) => {
    const panelProps = (panel as React.ReactElement<ResizablePanelProps>)?.props
    const isFlex = panelProps?.flex
    const panelMinSize = panelProps?.minSize ?? 100
    const panelDefaultSize = panelProps?.defaultSize

    // Determine flex behavior:
    // - flex panels always fill remaining space
    // - non-flex panels alongside a flex sibling stay fixed at defaultSize
    // - when no panel has flex, distribute space proportionally by defaultSize
    let flexStyle: string
    if (isFlex) {
      flexStyle = '1 1 auto'
    } else if (hasFlexPanel) {
      flexStyle = panelDefaultSize ? `0 1 ${panelDefaultSize}px` : '0 1 auto'
    } else {
      flexStyle = `${panelDefaultSize ?? 1} 1 0px`
    }

    items.push(
      <div
        key={`panel-${i}`}
        ref={(el) => {
          panelRefs.current[i] = el
        }}
        style={{
          flex: flexStyle,
          overflowX: isHorizontal ? 'hidden' : 'auto',
          overflowY: isHorizontal ? 'auto' : 'hidden',
          minWidth: isHorizontal ? (isFlex ? 0 : panelMinSize) : undefined,
          minHeight: !isHorizontal ? (isFlex ? 0 : panelMinSize) : undefined,
        }}
      >
        {panel}
      </div>,
    )
    if (i < panels.length - 1) {
      items.push(
        <ResizableHandle
          key={`handle-${i}`}
          direction={direction}
          onDrag={(d) => handleDrag(i, d)}
        />,
      )
    }
  })

  return (
    <div
      ref={containerRef}
      className={cn('forge-resizable-panel-group', className)}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {items}
    </div>
  )
}

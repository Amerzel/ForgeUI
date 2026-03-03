import * as RadixScrollArea from '@radix-ui/react-scroll-area'
import { cn } from '../lib/cn.js'

type ScrollOrientation = 'horizontal' | 'vertical' | 'both'

interface ScrollAreaProps {
  /** Scroll directions to enable. Default: 'vertical' */
  orientation?: ScrollOrientation
  /** Scrollbar thumb size in px. Default: 6 */
  scrollbarSize?: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

/**
 * Custom-styled scroll container. Preserves native scroll behavior while
 * matching the ForgeUI dark theme scrollbar styling.
 */
export function ScrollArea({
  orientation = 'vertical',
  scrollbarSize = 6,
  className,
  style,
  children,
}: ScrollAreaProps) {
  const showVertical = orientation === 'vertical' || orientation === 'both'
  const showHorizontal = orientation === 'horizontal' || orientation === 'both'

  const thumbStyle: React.CSSProperties = {
    background: 'var(--forge-scrollbar-thumb)',
    borderRadius: 'var(--forge-radius-full)',
    transition: `background var(--forge-duration-fast) var(--forge-easing-default)`,
  }

  const scrollbarStyle = (orient: 'vertical' | 'horizontal'): React.CSSProperties => ({
    display: 'flex',
    padding: '2px',
    background: 'var(--forge-scrollbar-track)',
    userSelect: 'none',
    touchAction: 'none',
    ...(orient === 'vertical'
      ? { width: scrollbarSize + 4, flexDirection: 'column' }
      : { height: scrollbarSize + 4, flexDirection: 'row' }),
  })

  return (
    <RadixScrollArea.Root
      className={cn('forge-scroll-area', className)}
      style={{ overflow: 'hidden', ...style }}
    >
      <RadixScrollArea.Viewport style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}>
        {children}
      </RadixScrollArea.Viewport>

      {showVertical && (
        <RadixScrollArea.Scrollbar orientation="vertical" style={scrollbarStyle('vertical')}>
          <RadixScrollArea.Thumb style={thumbStyle} />
        </RadixScrollArea.Scrollbar>
      )}
      {showHorizontal && (
        <RadixScrollArea.Scrollbar orientation="horizontal" style={scrollbarStyle('horizontal')}>
          <RadixScrollArea.Thumb style={thumbStyle} />
        </RadixScrollArea.Scrollbar>
      )}
      {showVertical && showHorizontal && <RadixScrollArea.Corner />}
    </RadixScrollArea.Root>
  )
}

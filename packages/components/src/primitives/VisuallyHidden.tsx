import { Slot } from '@radix-ui/react-slot'

interface VisuallyHiddenProps {
  /** When true, merges props onto its child element instead of rendering a span */
  asChild?: boolean
  children: React.ReactNode
}

/**
 * Renders content that is visible only to screen readers.
 * Use for accessible labels on icon-only buttons, decorative content, etc.
 */
export function VisuallyHidden({ asChild = false, children }: VisuallyHiddenProps) {
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    >
      {children}
    </Comp>
  )
}

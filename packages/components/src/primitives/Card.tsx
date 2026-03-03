import { Slot } from '@radix-ui/react-slot'
import { cn } from '../lib/cn.js'

type CardVariant = 'default' | 'ghost' | 'outlined'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
  variant?: CardVariant
  padding?: CardPadding
  /** Elevates the card with a stronger shadow and raised surface background. */
  elevated?: boolean
}

const PADDING_VARS: Record<CardPadding, string> = {
  none: '0',
  sm: 'var(--forge-space-3)',
  md: 'var(--forge-space-4)',
  lg: 'var(--forge-space-6)',
}

const VARIANT_STYLE: Record<CardVariant, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--forge-surface-raised)',
    border: '1px solid var(--forge-border)',
    boxShadow: 'var(--forge-shadow-sm)',
  },
  ghost: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' },
  outlined: {
    backgroundColor: 'transparent',
    border: '1px solid var(--forge-border)',
    boxShadow: 'none',
  },
}

function CardRoot({
  asChild = false,
  variant = 'default',
  padding = 'md',
  elevated = false,
  className,
  style,
  ...props
}: CardRootProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      className={cn('forge-card', className)}
      style={{
        borderRadius: 'var(--forge-radius-lg)',
        padding: PADDING_VARS[padding],
        ...VARIANT_STYLE[variant],
        ...(elevated
          ? { boxShadow: 'var(--forge-shadow-lg)', backgroundColor: 'var(--forge-surface-raised)' }
          : {}),
        ...style,
      }}
      {...props}
    />
  )
}

function CardHeader({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('forge-card__header', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--forge-space-1)',
        paddingBottom: 'var(--forge-space-3)',
        borderBottom: '1px solid var(--forge-border-subtle)',
        marginBottom: 'var(--forge-space-3)',
        ...style,
      }}
      {...props}
    />
  )
}

function CardBody({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('forge-card__body', className)}
      style={{ flex: '1 1 auto', ...style }}
      {...props}
    />
  )
}

function CardFooter({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('forge-card__footer', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--forge-space-2)',
        paddingTop: 'var(--forge-space-3)',
        borderTop: '1px solid var(--forge-border-subtle)',
        marginTop: 'var(--forge-space-3)',
        ...style,
      }}
      {...props}
    />
  )
}

/**
 * Surface container with border and shadow tokens.
 * Use compound sub-components for structured layout:
 *   <Card><Card.Header /><Card.Body /><Card.Footer /></Card>
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})

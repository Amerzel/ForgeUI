import * as RadixToggle from '@radix-ui/react-toggle'
import { cn } from '../lib/cn.js'

type ToggleVariant = 'default' | 'outline'
type ToggleSize = 'sm' | 'md' | 'lg'

interface ToggleProps extends React.ComponentPropsWithoutRef<typeof RadixToggle.Root> {
  variant?: ToggleVariant
  size?: ToggleSize
}

const SIZE_STYLE: Record<ToggleSize, React.CSSProperties> = {
  sm: { height: '28px', paddingInline: 'var(--forge-space-2)', fontSize: 'var(--forge-font-size-sm)', gap: 'var(--forge-space-1)' },
  md: { height: '34px', paddingInline: 'var(--forge-space-3)', fontSize: 'var(--forge-font-size-base)', gap: 'var(--forge-space-2)' },
  lg: { height: '42px', paddingInline: 'var(--forge-space-4)', fontSize: 'var(--forge-font-size-md)', gap: 'var(--forge-space-2)' },
}

export function Toggle({ variant = 'default', size = 'md', pressed, disabled, className, style, ...props }: ToggleProps) {
  const isPressed = pressed

  return (
    <RadixToggle.Root
      pressed={pressed}
      disabled={disabled}
      className={cn('forge-toggle', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--forge-radius-md)',
        border: variant === 'outline'
          ? `1px solid ${isPressed ? 'var(--forge-accent)' : 'var(--forge-border)'}`
          : '1px solid transparent',
        backgroundColor: isPressed
          ? `color-mix(in srgb, var(--forge-accent) 15%, transparent)`
          : variant === 'default'
            ? 'transparent'
            : 'var(--forge-surface)',
        color: isPressed ? 'var(--forge-accent)' : 'var(--forge-text)',
        fontFamily: 'var(--forge-font-sans)',
        fontWeight: 'var(--forge-font-medium)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        userSelect: 'none',
        transition: `background-color var(--forge-duration-fast) var(--forge-easing-default),
                     color var(--forge-duration-fast) var(--forge-easing-default)`,
        ...SIZE_STYLE[size],
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
        e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
      }}
      onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
      {...props}
    />
  )
}

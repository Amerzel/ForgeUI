import * as RadixAvatar from '@radix-ui/react-avatar'
import { cn } from '../lib/cn.js'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  alt: string
  /** Initials shown when image fails to load */
  fallback?: string
  size?: AvatarSize
  className?: string
}

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
}

const FONT_SIZE: Record<AvatarSize, string> = {
  xs: 'var(--forge-font-size-xs)',
  sm: 'var(--forge-font-size-xs)',
  md: 'var(--forge-font-size-sm)',
  lg: 'var(--forge-font-size-base)',
  xl: 'var(--forge-font-size-lg)',
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const px = SIZE_PX[size]

  return (
    <RadixAvatar.Root
      className={cn('forge-avatar', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${px}px`,
        height: `${px}px`,
        borderRadius: 'var(--forge-radius-full)',
        overflow: 'hidden',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      <RadixAvatar.Image
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <RadixAvatar.Fallback
        delayMs={src ? 400 : 0}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'color-mix(in srgb, var(--forge-accent) 20%, transparent)',
          color: 'var(--forge-accent)',
          fontSize: FONT_SIZE[size],
          fontWeight: 'var(--forge-font-semibold)',
          fontFamily: 'var(--forge-font-sans)',
        }}
      >
        {fallback ?? alt.slice(0, 2).toUpperCase()}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}

import { cn } from '../lib/cn.js'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('forge-breadcrumb', className)}>
      <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--forge-space-1)', listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--forge-font-size-sm)' }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-1)' }}>
              {i > 0 && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: 'var(--forge-text-muted)', flexShrink: 0 }}>
                  <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{ color: isLast ? 'var(--forge-text)' : 'var(--forge-text-muted)' }}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  style={{
                    color: 'var(--forge-text-muted)',
                    textDecoration: 'none',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'; e.currentTarget.style.borderRadius = 'var(--forge-radius-sm)' }}
                  onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--forge-text)'; e.currentTarget.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--forge-text-muted)'; e.currentTarget.style.textDecoration = 'none' }}
                >
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

import { cn } from '../lib/cn.js'

interface AppShellProps {
  /** Sidebar/panel area */
  sidebar?: React.ReactNode
  /** Top navigation bar */
  nav?: React.ReactNode
  /** Main content area */
  children: React.ReactNode
  /** Sidebar width. Default: '240px' */
  sidebarWidth?: string
  /** Nav height. Default: '48px' */
  navHeight?: string
  className?: string
}

/**
 * Root layout wrapper for ForgeUI tools.
 * CSS grid layout, fixed viewport height.
 *
 * Slots: nav (top bar), sidebar (left panel), children (main content).
 */
export function AppShell({
  sidebar,
  nav,
  children,
  sidebarWidth = '240px',
  navHeight = '48px',
  className,
}: AppShellProps) {
  const hasSidebar = sidebar !== undefined
  const hasNav = nav !== undefined

  return (
    <div
      className={cn('forge-app-shell', className)}
      style={{
        display: 'grid',
        gridTemplateRows: hasNav ? `${navHeight} 1fr` : '1fr',
        gridTemplateColumns: hasSidebar ? `${sidebarWidth} 1fr` : '1fr',
        gridTemplateAreas: hasNav && hasSidebar
          ? `"nav nav" "sidebar main"`
          : hasNav
            ? `"nav" "main"`
            : hasSidebar
              ? `"sidebar main"`
              : `"main"`,
        width: '100%',
        height: '100dvh',
        minHeight: '720px',
        minWidth: '1280px',
        overflow: 'hidden',
        backgroundColor: 'var(--forge-bg)',
        '--forge-shell-sidebar-width': sidebarWidth,
        '--forge-shell-nav-height': navHeight,
      } as React.CSSProperties}
    >
      {hasNav && (
        <header
          style={{
            gridArea: 'nav',
            display: 'flex',
            alignItems: 'center',
            height: navHeight,
            backgroundColor: 'var(--forge-surface)',
            borderBottom: '1px solid var(--forge-border)',
            flexShrink: 0,
            zIndex: 'var(--forge-z-sticky)',
          }}
        >
          {nav}
        </header>
      )}
      {hasSidebar && (
        <aside
          style={{
            gridArea: 'sidebar',
            width: sidebarWidth,
            backgroundColor: 'var(--forge-surface)',
            borderRight: '1px solid var(--forge-border)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {sidebar}
        </aside>
      )}
      <main
        style={{
          gridArea: 'main',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </main>
    </div>
  )
}

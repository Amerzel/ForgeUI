import { useState, useCallback } from 'react'
import { Highlight } from 'prism-react-renderer'
import type { PrismTheme } from 'prism-react-renderer'
import { cn } from '../lib/cn.js'

/** A ForgeUI-aware Prism theme that reads CSS custom properties at render time. */
function forgeTheme(): PrismTheme {
  return {
    plain: {
      color: 'var(--forge-text)',
      backgroundColor: 'var(--forge-surface-sunken)',
    },
    styles: [
      { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--forge-text-muted)' } },
      { types: ['punctuation'], style: { color: 'var(--forge-text-muted)' } },
      { types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'], style: { color: 'var(--forge-info)' } },
      { types: ['selector', 'attr-name', 'string', 'char', 'builtin'], style: { color: 'var(--forge-success)' } },
      { types: ['operator', 'entity', 'url'], style: { color: 'var(--forge-warning)' } },
      { types: ['atrule', 'attr-value', 'keyword'], style: { color: 'var(--forge-accent)' } },
      { types: ['function', 'class-name'], style: { color: 'var(--forge-danger)' } },
      { types: ['regex', 'important', 'variable'], style: { color: 'var(--forge-warning)' } },
    ],
  }
}

export interface CodeBlockProps {
  /** Code string to display */
  code: string
  /** Language for syntax highlighting */
  language?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Show copy-to-clipboard button */
  showCopy?: boolean
  /** Maximum height before scrolling (CSS value) */
  maxHeight?: string
  className?: string
}

export function CodeBlock({
  code,
  language = 'text',
  showLineNumbers = false,
  showCopy = true,
  maxHeight,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement('textarea')
      ta.value = code
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [code])

  const trimmed = code.replace(/\n$/, '')
  const theme = forgeTheme()

  return (
    <div
      className={cn('forge-codeblock', className)}
      style={{
        position: 'relative',
        borderRadius: 'var(--forge-radius-lg)',
        border: '1px solid var(--forge-border)',
        overflow: 'hidden',
        fontSize: 'var(--forge-font-size-sm)',
        lineHeight: 'var(--forge-line-height-sm)',
        fontFamily: 'var(--forge-font-mono)',
      }}
    >
      {/* Header with language label + copy button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--forge-space-1) var(--forge-space-3)',
          backgroundColor: 'var(--forge-surface)',
          borderBottom: '1px solid var(--forge-border)',
        }}
      >
        <span style={{ fontSize: 'var(--forge-font-size-xs)', color: 'var(--forge-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--forge-tracking-wide)' }}>
          {language}
        </span>
        {showCopy && (
          <button
            type="button"
            onClick={() => void handleCopy()}
            aria-label={copied ? 'Copied' : 'Copy code'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--forge-space-1)',
              padding: '2px var(--forge-space-2)',
              border: '1px solid var(--forge-border)',
              borderRadius: 'var(--forge-radius-md)',
              backgroundColor: 'transparent',
              color: copied ? 'var(--forge-success)' : 'var(--forge-text-muted)',
              fontSize: 'var(--forge-font-size-xs)',
              fontFamily: 'var(--forge-font-sans)',
              cursor: 'pointer',
              transition: `color var(--forge-duration-fast) var(--forge-easing-default)`,
            }}
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* Code area */}
      <Highlight theme={theme} code={trimmed} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{
              margin: 0,
              padding: 'var(--forge-space-3)',
              backgroundColor: 'var(--forge-surface-sunken)',
              overflowX: 'auto',
              maxHeight,
              overflowY: maxHeight ? 'auto' : undefined,
            }}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            role="region"
            aria-label={`Code block, ${language}`}
          >
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line })
                return (
                  <div key={i} {...lineProps} style={{ ...lineProps.style, display: 'flex' }}>
                    {showLineNumbers && (
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'inline-block',
                          width: `${String(tokens.length).length + 1}ch`,
                          textAlign: 'right',
                          paddingRight: 'var(--forge-space-3)',
                          color: 'var(--forge-text-disabled)',
                          userSelect: 'none',
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                    )}
                    <span style={{ flex: 1 }}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}

import * as RadixAccordion from '@radix-ui/react-accordion'
import { cn } from '../lib/cn.js'

type AccordionType = 'single' | 'multiple'

interface AccordionItem {
  value: string
  trigger: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

interface AccordionProps {
  type?: AccordionType
  items: AccordionItem[]
  /** Controlled value (single) */
  value?: string
  /** Controlled value (multiple) */
  values?: string[]
  onValueChange?: (value: string) => void
  onValuesChange?: (values: string[]) => void
  /** Allow closing the open item by clicking it again (single only) */
  collapsible?: boolean
  className?: string
}

const CHEVRON_STYLE: React.CSSProperties = {
  width: '14px',
  height: '14px',
  transition: `transform var(--forge-duration-fast) var(--forge-easing-default)`,
  flexShrink: 0,
}

export function Accordion({
  type = 'single',
  items,
  value,
  values,
  onValueChange,
  onValuesChange,
  collapsible = true,
  className,
}: AccordionProps) {
  const rootProps = type === 'single'
    ? {
        type: 'single' as const,
        value,
        onValueChange,
        collapsible,
      }
    : {
        type: 'multiple' as const,
        value: values,
        onValueChange: onValuesChange,
      }

  return (
    <RadixAccordion.Root
      {...rootProps}
      className={cn('forge-accordion', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-md)',
        overflow: 'hidden',
      }}
    >
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          style={{
            borderBottom: '1px solid var(--forge-border)',
            opacity: item.disabled ? 0.5 : 1,
          }}
          className="forge-accordion-item"
        >
          <RadixAccordion.Header asChild>
            <h3 style={{ margin: 0 }}>
              <RadixAccordion.Trigger
                className="forge-accordion-trigger"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: `var(--forge-space-3) var(--forge-space-4)`,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--forge-text)',
                  fontFamily: 'var(--forge-font-sans)',
                  fontSize: 'var(--forge-font-size-base)',
                  fontWeight: 'var(--forge-font-medium)',
                  textAlign: 'left',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  transition: `background-color var(--forge-duration-fast) var(--forge-easing-default)`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
                  e.currentTarget.style.outlineOffset = '-2px'
                }}
                onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
                onMouseEnter={(e) => {
                  if (!item.disabled) e.currentTarget.style.backgroundColor = 'var(--forge-surface-hover)'
                }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {item.trigger}
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  style={CHEVRON_STYLE}
                  className="forge-accordion-chevron"
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </RadixAccordion.Trigger>
            </h3>
          </RadixAccordion.Header>
          <RadixAccordion.Content
            style={{
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: `0 var(--forge-space-4) var(--forge-space-4)`,
                fontSize: 'var(--forge-font-size-base)',
                color: 'var(--forge-text-muted)',
                lineHeight: 'var(--forge-line-height-base)',
              }}
            >
              {item.content}
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}

      {/* Rotate chevron for open items; remove bottom border from last item */}
      <style>{`
        .forge-accordion-item:last-child { border-bottom: none; }
        .forge-accordion-item[data-state="open"] .forge-accordion-chevron {
          transform: rotate(180deg);
        }
      `}</style>
    </RadixAccordion.Root>
  )
}

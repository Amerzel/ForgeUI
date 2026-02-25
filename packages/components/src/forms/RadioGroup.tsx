import * as RadixRadioGroup from '@radix-ui/react-radio-group'

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  name?: string
}

let _idCounter = 0

export function RadioGroup({ options, value, onValueChange, orientation = 'vertical', disabled, name }: RadioGroupProps) {
  const groupId = `forge-radio-${++_idCounter}`

  return (
    <RadixRadioGroup.Root
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      disabled={disabled}
      name={name}
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: orientation === 'horizontal' ? 'var(--forge-space-4)' : 'var(--forge-space-2)',
      }}
    >
      {options.map((opt) => {
        const itemId = `${groupId}-${opt.value}`
        const isDisabled = disabled || opt.disabled
        return (
          <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)' }}>
            <RadixRadioGroup.Item
              id={itemId}
              value={opt.value}
              disabled={isDisabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '16px',
                height: '16px',
                flexShrink: 0,
                backgroundColor: 'var(--forge-surface)',
                border: `1px solid var(--forge-border)`,
                borderRadius: 'var(--forge-radius-full)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                outline: 'none',
                transition: `border-color var(--forge-duration-fast) var(--forge-easing-default)`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = 'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
                e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
                e.currentTarget.style.borderColor = 'var(--forge-accent)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
                e.currentTarget.style.borderColor = 'var(--forge-border)'
              }}
            >
              <RadixRadioGroup.Indicator
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--forge-accent)',
                  borderRadius: 'var(--forge-radius-full)',
                }}
              />
            </RadixRadioGroup.Item>
            <label
              htmlFor={itemId}
              style={{
                fontSize: 'var(--forge-font-size-base)',
                color: isDisabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                userSelect: 'none',
              }}
            >
              {opt.label}
            </label>
          </div>
        )
      })}
    </RadixRadioGroup.Root>
  )
}

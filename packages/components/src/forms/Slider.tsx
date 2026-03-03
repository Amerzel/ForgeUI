import * as RadixSlider from '@radix-ui/react-slider'

interface SliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadixSlider.Root>,
  'value' | 'defaultValue'
> {
  value?: number[]
  defaultValue?: number[]
  /** Accessible label forwarded to each thumb (required for single-thumb sliders) */
  'aria-label'?: string
  /** id of an external label element */
  'aria-labelledby'?: string
}

export function Slider({
  value,
  defaultValue = [0],
  disabled,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SliderProps) {
  return (
    <RadixSlider.Root
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        touchAction: 'none',
        width: '100%',
        height: '20px',
      }}
      {...props}
    >
      <RadixSlider.Track
        style={{
          position: 'relative',
          flexGrow: 1,
          height: '4px',
          backgroundColor: 'var(--forge-border)',
          borderRadius: 'var(--forge-radius-full)',
          overflow: 'visible',
        }}
      >
        <RadixSlider.Range
          style={{
            position: 'absolute',
            height: '100%',
            backgroundColor: disabled ? 'var(--forge-text-disabled)' : 'var(--forge-accent)',
            borderRadius: 'var(--forge-radius-full)',
          }}
        />
      </RadixSlider.Track>
      {(value ?? defaultValue).map((_, i) => (
        <RadixSlider.Thumb
          key={i}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          style={{
            display: 'block',
            width: '16px',
            height: '16px',
            backgroundColor: disabled ? 'var(--forge-text-disabled)' : 'var(--forge-accent)',
            border: `2px solid var(--forge-surface-raised)`,
            borderRadius: 'var(--forge-radius-full)',
            boxShadow: 'var(--forge-shadow-sm)',
            cursor: disabled ? 'not-allowed' : 'grab',
            outline: 'none',
            transition: `transform var(--forge-duration-fast) var(--forge-easing-default)`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline =
              'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
            e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.cursor = 'grabbing'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.cursor = 'grab'
          }}
        />
      ))}
    </RadixSlider.Root>
  )
}

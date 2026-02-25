import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import {
  Input, Textarea, Select, Checkbox, Switch, RadioGroup,
  Slider, Toggle, ToggleGroup, FormField, NumberInput,
} from '../index.js'

function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

const OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
]

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Themed><Input aria-label="Search" placeholder="Search…" /></Themed>)
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Themed><Input aria-label="Name" onChange={onChange} /></Themed>)
    await user.type(screen.getByRole('textbox'), 'hello')
    expect(onChange).toHaveBeenCalled()
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><Input aria-label="Name" disabled /></Themed>)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('sets aria-invalid when error=true', () => {
    render(<Themed><Input aria-label="Name" error /></Themed>)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows clear button when clearable and has value', () => {
    render(<Themed><Input aria-label="Name" clearable value="hello" onClear={vi.fn()} onChange={vi.fn()} /></Themed>)
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
  })

  it('calls onClear when clear button clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<Themed><Input aria-label="Name" clearable value="hello" onClear={onClear} onChange={vi.fn()} /></Themed>)
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <FormField label="Username" htmlFor="inp-a11y">
          <Input id="inp-a11y" />
        </FormField>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------
describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Themed><Textarea aria-label="Notes" placeholder="Enter notes…" /></Themed>)
    expect(screen.getByPlaceholderText('Enter notes…')).toBeInTheDocument()
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><Textarea aria-label="Notes" disabled /></Themed>)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('sets aria-invalid when error=true', () => {
    render(<Themed><Textarea aria-label="Notes" error /></Themed>)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <FormField label="Notes" htmlFor="ta-a11y">
          <Textarea id="ta-a11y" />
        </FormField>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------
describe('Select', () => {
  it('renders the trigger with placeholder', () => {
    render(<Themed><Select options={OPTIONS} placeholder="Pick one" /></Themed>)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('shows selected value when value is set', () => {
    render(<Themed><Select options={OPTIONS} value="a" onValueChange={vi.fn()} /></Themed>)
    expect(screen.getByText('Option A')).toBeInTheDocument()
  })

  it('trigger has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <FormField label="Category" htmlFor="sel-a11y">
          <Select id="sel-a11y" options={OPTIONS} />
        </FormField>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------
describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Themed><Checkbox label="Accept terms" /></Themed>)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
  })

  it('has correct role', () => {
    render(<Themed><Checkbox label="Accept" /></Themed>)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('is checked when checked=true', () => {
    render(<Themed><Checkbox label="Accept" checked onCheckedChange={vi.fn()} /></Themed>)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><Checkbox label="Accept" disabled /></Themed>)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('calls onCheckedChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Themed><Checkbox label="Accept" onCheckedChange={onChange} /></Themed>)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Checkbox label="Accept terms" /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------
describe('Switch', () => {
  it('renders with label', () => {
    render(<Themed><Switch label="Dark mode" /></Themed>)
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('has correct role', () => {
    render(<Themed><Switch aria-label="Toggle" /></Themed>)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('is checked when checked=true', () => {
    render(<Themed><Switch aria-label="Toggle" checked onCheckedChange={vi.fn()} /></Themed>)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><Switch label="Dark mode" disabled /></Themed>)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Switch label="Enable feature" /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------
describe('RadioGroup', () => {
  it('renders all options', () => {
    render(<Themed><RadioGroup options={OPTIONS} /></Themed>)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('marks selected option as checked', () => {
    render(<Themed><RadioGroup options={OPTIONS} value="b" onValueChange={vi.fn()} /></Themed>)
    const radios = screen.getAllByRole('radio')
    expect(radios[1]).toBeChecked()
  })

  it('disables individual options', () => {
    render(<Themed><RadioGroup options={OPTIONS} /></Themed>)
    const radios = screen.getAllByRole('radio')
    expect(radios[2]).toBeDisabled()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <fieldset>
          <legend>Choose</legend>
          <RadioGroup options={OPTIONS.slice(0, 2)} />
        </fieldset>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------
describe('Slider', () => {
  it('renders a slider thumb', () => {
    render(<Themed><Slider defaultValue={[50]} min={0} max={100} aria-label="Volume" /></Themed>)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('sets aria-valuenow from value', () => {
    render(<Themed><Slider value={[42]} onValueChange={vi.fn()} min={0} max={100} aria-label="Volume" /></Themed>)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '42')
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><Slider disabled defaultValue={[50]} aria-label="Volume" /></Themed>)
    // Radix Slider Thumb uses data-disabled (span, not input/button)
    expect(screen.getByRole('slider')).toHaveAttribute('data-disabled')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <Slider defaultValue={[50]} aria-label="Volume" />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------
describe('Toggle', () => {
  it('renders children', () => {
    render(<Themed><Toggle>Bold</Toggle></Themed>)
    expect(screen.getByText('Bold')).toBeInTheDocument()
  })

  it('has button role', () => {
    render(<Themed><Toggle>B</Toggle></Themed>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows as pressed when pressed=true', () => {
    render(<Themed><Toggle pressed>B</Toggle></Themed>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><Toggle disabled>B</Toggle></Themed>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Toggle aria-label="Bold">B</Toggle></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// ToggleGroup
// ---------------------------------------------------------------------------
describe('ToggleGroup', () => {
  const items = [
    { value: 'left',   label: 'Left',   'aria-label': 'Align left' },
    { value: 'center', label: 'Center', 'aria-label': 'Align center' },
    { value: 'right',  label: 'Right',  'aria-label': 'Align right' },
  ]

  it('renders all items', () => {
    render(<Themed><ToggleGroup type="single" items={items} /></Themed>)
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Center')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('marks selected item as pressed (single)', () => {
    render(<Themed><ToggleGroup type="single" items={items} value="center" onValueChange={vi.fn()} /></Themed>)
    expect(screen.getByRole('radio', { name: 'Align center' })).toHaveAttribute('data-state', 'on')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <ToggleGroup type="single" items={items} aria-label="Text alignment" />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// FormField
// ---------------------------------------------------------------------------
describe('FormField', () => {
  it('renders label and children', () => {
    render(
      <Themed>
        <FormField label="Email" htmlFor="email">
          <input id="email" />
        </FormField>
      </Themed>
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows required asterisk when required=true', () => {
    render(
      <Themed>
        <FormField label="Email" required>
          <input />
        </FormField>
      </Themed>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error message with role=alert', () => {
    render(
      <Themed>
        <FormField label="Email" error="Invalid email">
          <input />
        </FormField>
      </Themed>
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email')
  })

  it('shows hint when no error', () => {
    render(
      <Themed>
        <FormField label="Email" hint="We'll never share your email">
          <input />
        </FormField>
      </Themed>
    )
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(
      <Themed>
        <FormField label="Email" error="Required" hint="Enter your email">
          <input />
        </FormField>
      </Themed>
    )
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <FormField label="Email" htmlFor="ff-a11y" hint="Your work email">
          <input id="ff-a11y" type="email" />
        </FormField>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// NumberInput
// ---------------------------------------------------------------------------
describe('NumberInput', () => {
  it('renders with value', () => {
    render(<Themed><NumberInput value={42} aria-label="Count" /></Themed>)
    expect(screen.getByDisplayValue('42')).toBeInTheDocument()
  })

  it('renders increment and decrement buttons', () => {
    render(<Themed><NumberInput value={5} aria-label="Count" /></Themed>)
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument()
  })

  it('calls onChange with incremented value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Themed><NumberInput value={5} step={1} onChange={onChange} aria-label="Count" /></Themed>)
    await user.click(screen.getByRole('button', { name: 'Increase' }))
    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('calls onChange with decremented value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Themed><NumberInput value={5} step={1} onChange={onChange} aria-label="Count" /></Themed>)
    await user.click(screen.getByRole('button', { name: 'Decrease' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('respects min — decrement button disabled at min', () => {
    render(<Themed><NumberInput value={0} min={0} aria-label="Count" /></Themed>)
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
  })

  it('respects max — increment button disabled at max', () => {
    render(<Themed><NumberInput value={10} max={10} aria-label="Count" /></Themed>)
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
  })

  it('commits value on blur', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Themed><NumberInput value={5} onChange={onChange} aria-label="Count" /></Themed>)
    const input = screen.getByDisplayValue('5')
    await user.clear(input)
    await user.type(input, '12')
    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalledWith(12)
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><NumberInput value={5} disabled aria-label="Count" /></Themed>)
    expect(screen.getByDisplayValue('5')).toBeDisabled()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Themed>
        <FormField label="Opacity" htmlFor="num-a11y">
          <NumberInput id="num-a11y" value={100} min={0} max={100} />
        </FormField>
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

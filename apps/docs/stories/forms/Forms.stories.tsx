import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Input, Textarea, Select, Checkbox, Switch, RadioGroup,
  Slider, Toggle, ToggleGroup, FormField, NumberInput,
} from '@forgeui/components'

const meta: Meta = {
  title: 'Forms/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'ForgeUI Phase 1 form components.' } },
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
export const Inputs: Story = {
  name: 'Input — states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
      <FormField label="Default" htmlFor="inp-default">
        <Input id="inp-default" placeholder="Type here…" />
      </FormField>
      <FormField label="With hint" htmlFor="inp-hint" hint="Enter your username">
        <Input id="inp-hint" placeholder="username" />
      </FormField>
      <FormField label="Error state" htmlFor="inp-error" error="This field is required">
        <Input id="inp-error" error placeholder="Required field" />
      </FormField>
      <FormField label="Disabled" htmlFor="inp-disabled">
        <Input id="inp-disabled" disabled value="Read only value" onChange={() => {}} />
      </FormField>
      <FormField label="Clearable" htmlFor="inp-clear">
        <InputClearable />
      </FormField>
    </div>
  ),
}

function InputClearable() {
  const [value, setValue] = useState('Some value')
  return (
    <Input
      id="inp-clear"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      clearable
      onClear={() => setValue('')}
    />
  )
}

export const InputSizes: Story = {
  name: 'Input — sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
      <Input aria-label="Small input" size="sm" placeholder="Small" />
      <Input aria-label="Medium input" size="md" placeholder="Medium" />
      <Input aria-label="Large input" size="lg" placeholder="Large" />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------
export const Textareas: Story = {
  name: 'Textarea',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
      <FormField label="Notes" htmlFor="ta-default">
        <Textarea id="ta-default" placeholder="Enter your notes…" rows={3} />
      </FormField>
      <FormField label="Error" htmlFor="ta-error" error="Required">
        <Textarea id="ta-error" error placeholder="Required" rows={3} />
      </FormField>
      <FormField label="Auto-grow" htmlFor="ta-auto">
        <Textarea id="ta-auto" autoGrow placeholder="Grows as you type…" />
      </FormField>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------
const SELECT_OPTIONS = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go', disabled: true },
]

export const Selects: Story = {
  name: 'Select',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px' }}>
      <FormField label="Language" htmlFor="sel-default">
        <Select id="sel-default" options={SELECT_OPTIONS} placeholder="Select language…" />
      </FormField>
      <FormField label="Error state" htmlFor="sel-error" error="Selection required">
        <Select id="sel-error" options={SELECT_OPTIONS} error />
      </FormField>
      <FormField label="Disabled" htmlFor="sel-disabled">
        <Select id="sel-disabled" options={SELECT_OPTIONS} disabled />
      </FormField>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------
export const Checkboxes: Story = {
  name: 'Checkbox',
  render: function CheckboxDemo() {
    const [a, setA] = useState(false)
    const [b, setB] = useState(true)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Checkbox label="Unchecked" checked={a} onCheckedChange={(v) => setA(v === true)} />
        <Checkbox label="Checked" checked={b} onCheckedChange={(v) => setB(v === true)} />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled unchecked" disabled />
        <Checkbox label="Disabled checked" checked disabled />
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------
export const Switches: Story = {
  name: 'Switch',
  render: function SwitchDemo() {
    const [on, setOn] = useState(false)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch label="Dark mode" checked={on} onCheckedChange={setOn} />
        <Switch label="Enabled (on)" checked size="md" onCheckedChange={() => {}} />
        <Switch label="Small" checked={on} onCheckedChange={setOn} size="sm" />
        <Switch label="Disabled" disabled />
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------
const RADIO_OPTIONS = [
  { value: 'low',    label: 'Low priority' },
  { value: 'medium', label: 'Medium priority' },
  { value: 'high',   label: 'High priority' },
  { value: 'urgent', label: 'Urgent (disabled)', disabled: true },
]

export const RadioGroups: Story = {
  name: 'RadioGroup',
  render: function RadioDemo() {
    const [value, setValue] = useState('medium')
    return (
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ color: 'var(--forge-text-muted)', fontSize: '13px', marginBottom: '8px' }}>Priority</legend>
        <RadioGroup options={RADIO_OPTIONS} value={value} onValueChange={setValue} />
      </fieldset>
    )
  },
}

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------
export const Sliders: Story = {
  name: 'Slider',
  render: function SliderDemo() {
    const [value, setValue] = useState([50])
    const [range, setRange] = useState([20, 80])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
        <FormField label={`Volume: ${value[0]}`} htmlFor="sl-volume">
          <Slider value={value} onValueChange={setValue} min={0} max={100} aria-label="Volume" />
        </FormField>
        <FormField label={`Range: ${range[0]}–${range[1]}`} htmlFor="sl-range">
          <Slider value={range} onValueChange={setRange} min={0} max={100} aria-label="Range" />
        </FormField>
        <FormField label="Disabled" htmlFor="sl-disabled">
          <Slider defaultValue={[30]} disabled aria-label="Disabled slider" />
        </FormField>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------
export const Toggles: Story = {
  name: 'Toggle',
  render: function ToggleDemo() {
    const [bold, setBold] = useState(false)
    const [italic, setItalic] = useState(true)
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">B</Toggle>
        <Toggle pressed={italic} onPressedChange={setItalic} variant="outline" aria-label="Italic">I</Toggle>
        <Toggle pressed={false} size="sm" aria-label="Small toggle">S</Toggle>
        <Toggle pressed={false} size="lg" aria-label="Large toggle">L</Toggle>
        <Toggle disabled aria-label="Disabled toggle">D</Toggle>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// ToggleGroup
// ---------------------------------------------------------------------------
export const ToggleGroups: Story = {
  name: 'ToggleGroup',
  render: function ToggleGroupDemo() {
    const [align, setAlign] = useState('left')
    const [fmt, setFmt] = useState<string[]>(['bold'])

    const ALIGN_ITEMS = [
      { value: 'left',   label: '⬅',   'aria-label': 'Align left' },
      { value: 'center', label: '↔',   'aria-label': 'Align center' },
      { value: 'right',  label: '➡',   'aria-label': 'Align right' },
    ]
    const FMT_ITEMS = [
      { value: 'bold',      label: 'B', 'aria-label': 'Bold' },
      { value: 'italic',    label: 'I', 'aria-label': 'Italic' },
      { value: 'underline', label: 'U', 'aria-label': 'Underline' },
    ]
    return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <ToggleGroup
          type="single"
          items={ALIGN_ITEMS}
          value={align}
          onValueChange={(v) => { if (v) setAlign(v) }}
          aria-label="Text alignment"
        />
        <ToggleGroup
          type="multiple"
          items={FMT_ITEMS}
          value={fmt}
          onValueChange={setFmt}
          aria-label="Text formatting"
        />
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// NumberInput
// ---------------------------------------------------------------------------
export const NumberInputs: Story = {
  name: 'NumberInput',
  render: function NumberDemo() {
    const [count, setCount] = useState(5)
    const [angle, setAngle] = useState(45.5)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <FormField label="Count" htmlFor="num-count">
          <NumberInput id="num-count" value={count} onChange={setCount} min={0} max={100} step={1} />
        </FormField>
        <FormField label="Angle" htmlFor="num-angle">
          <NumberInput id="num-angle" value={angle} onChange={setAngle} min={-360} max={360} step={0.5} precision={1} />
        </FormField>
        <FormField label="Disabled" htmlFor="num-disabled">
          <NumberInput id="num-disabled" value={10} disabled />
        </FormField>
      </div>
    )
  },
}

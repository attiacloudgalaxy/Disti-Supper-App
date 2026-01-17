import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox, CheckboxGroup } from './Checkbox'

/**
 * Checkbox Component Tests
 *
 * These tests demonstrate user interaction testing patterns
 * for the Checkbox component including toggle, indeterminate state.
 */
describe('Checkbox Component', () => {
  it('renders with default props', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Checkbox label="Option" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('is checked when checked prop is true', () => {
    render(<Checkbox label="Option" checked />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('shows checkmark when checked', () => {
    render(<Checkbox label="Option" checked />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox.parentElement.querySelector('svg')).toBeInTheDocument()
  })

  it('does not show checkmark when unchecked', () => {
    render(<Checkbox label="Option" checked={false} />)
    const checkbox = screen.getByRole('checkbox')
    const label = checkbox.parentElement.querySelector('label')
    expect(label.querySelector('svg')).toBeNull()
  })

  it('shows minus icon when indeterminate', () => {
    render(<Checkbox label="Option" indeterminate />)
    const checkbox = screen.getByRole('checkbox')
    const label = checkbox.parentElement.querySelector('label')
    expect(label.querySelector('svg')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox label="Option" disabled />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="Option" disabled onChange={handleChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('shows required indicator', () => {
    render(<Checkbox label="Accept terms" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(
      <Checkbox
        label="Subscribe"
        description="Receive weekly updates"
      />
    )
    expect(screen.getByText('Receive weekly updates')).toBeInTheDocument()
  })

  it('renders with error state', () => {
    render(
      <Checkbox
        label="Accept terms"
        error="You must accept the terms"
      />
    )
    expect(screen.getByText('You must accept the terms')).toBeInTheDocument()
  })

  it('applies error styling when error is present', () => {
    render(
      <Checkbox
        label="Option"
        error="This field is required"
      />
    )
    const checkbox = screen.getByRole('checkbox')
    const label = checkbox.parentElement.querySelector('label')
    expect(label).toHaveClass('border-destructive')
  })

  it('applies custom size', () => {
    render(<Checkbox label="Option" size="lg" />)
    const checkbox = screen.getByRole('checkbox')
    const label = checkbox.parentElement.querySelector('label')
    expect(label).toHaveClass('h-5', 'w-5')
  })

  it('applies small size', () => {
    render(<Checkbox label="Option" size="sm" />)
    const checkbox = screen.getByRole('checkbox')
    const label = checkbox.parentElement.querySelector('label')
    expect(label).toHaveClass('h-4', 'w-4')
  })

  it('applies custom className', () => {
    render(<Checkbox label="Option" className="custom-class" />)
    const wrapper = screen.getByRole('checkbox').parentElement.parentElement
    expect(wrapper).toHaveClass('custom-class')
  })

  it('generates unique ID when not provided', () => {
    const { container: container1 } = render(<Checkbox label="Option 1" />)
    const { container: container2 } = render(<Checkbox label="Option 2" />)
    
    const checkbox1 = container1.querySelector('input')
    const checkbox2 = container2.querySelector('input')
    
    expect(checkbox1.id).not.toBe(checkbox2.id)
  })

  it('uses provided ID', () => {
    render(<Checkbox id="custom-id" label="Option" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox.id).toBe('custom-id')
  })

  it('associates label with input via htmlFor', () => {
    render(<Checkbox id="test-checkbox" label="Test Label" />)
    const checkbox = screen.getByRole('checkbox')
    const label = screen.getByText('Test Label')
    
    expect(label.htmlFor).toBe('test-checkbox')
  })

  it('can be clicked to toggle', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="Option" onChange={handleChange} />)
    
    const label = screen.getByText('Option')
    await user.click(label)
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be toggled via keyboard (Space)', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="Option" onChange={handleChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    checkbox.focus()
    await user.keyboard(' ')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be focused via Tab', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Option" />)
    
    await user.tab()
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveFocus()
  })

  it('shows error text instead of description when error is present', () => {
    render(
      <Checkbox
        label="Option"
        description="This is a description"
        error="This is an error"
      />
    )
    expect(screen.getByText('This is an error')).toBeInTheDocument()
    expect(screen.queryByText('This is a description')).not.toBeInTheDocument()
  })

  it('applies error styling to label', () => {
    render(
      <Checkbox
        label="Option"
        error="This field is required"
      />
    )
    const label = screen.getByText('Option')
    expect(label).toHaveClass('text-destructive')
  })

  it('renders controlled checkbox', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Checkbox label="Option" checked={false} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    
    rerender(<Checkbox label="Option" checked={true} />)
    expect(checkbox).toBeChecked()
  })
})

describe('CheckboxGroup Component', () => {
  it('renders with label', () => {
    render(
      <CheckboxGroup label="Select options">
        <Checkbox label="Option 1" />
        <Checkbox label="Option 2" />
      </CheckboxGroup>
    )
    expect(screen.getByText('Select options')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(
      <CheckboxGroup
        label="Select options"
        description="Choose all that apply"
      >
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    )
    expect(screen.getByText('Choose all that apply')).toBeInTheDocument()
  })

  it('renders with error state', () => {
    render(
      <CheckboxGroup
        label="Select options"
        error="At least one option is required"
      >
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    )
    expect(screen.getByText('At least one option is required')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(
      <CheckboxGroup label="Select options" required>
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('disables all checkboxes when group is disabled', () => {
    render(
      <CheckboxGroup label="Select options" disabled>
        <Checkbox label="Option 1" />
        <Checkbox label="Option 2" />
      </CheckboxGroup>
    )
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeDisabled()
    })
  })

  it('applies custom className', () => {
    render(
      <CheckboxGroup label="Select options" className="custom-group">
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    )
    const fieldset = screen.getByRole('group')
    expect(fieldset).toHaveClass('custom-group')
  })

  it('renders multiple checkboxes', () => {
    render(
      <CheckboxGroup label="Select options">
        <Checkbox label="Option 1" />
        <Checkbox label="Option 2" />
        <Checkbox label="Option 3" />
      </CheckboxGroup>
    )
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  })

  it('shows error text instead of description when error is present', () => {
    render(
      <CheckboxGroup
        label="Select options"
        description="Choose all that apply"
        error="At least one option is required"
      >
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    )
    expect(screen.getByText('At least one option is required')).toBeInTheDocument()
    expect(screen.queryByText('Choose all that apply')).not.toBeInTheDocument()
  })
})

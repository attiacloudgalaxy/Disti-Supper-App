import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

/**
 * Input Component Tests
 *
 * These tests demonstrate user interaction testing patterns
 * for the Input component including typing, focus, and validation states.
 */
describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders with label', () => {
    render(<Input label="Email Address" placeholder="Enter email" />)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(
      <Input
        label="Password"
        description="Must be at least 8 characters"
        placeholder="Enter password"
      />
    )
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument()
  })

  it('renders with error state', () => {
    render(
      <Input
        label="Email"
        error="Invalid email format"
        placeholder="Enter email"
      />
    )
    expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Enter email')
    expect(input).toHaveClass('border-destructive')
  })

  it('renders required indicator', () => {
    render(
      <Input
        label="Email"
        required
        placeholder="Enter email"
      />
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('allows user to type text', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)
    
    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'Hello World')
    
    expect(input).toHaveValue('Hello World')
  })

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input placeholder="Type here" onChange={handleChange} />)
    
    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'test')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input placeholder="Disabled input" disabled />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
  })

  it('does not allow typing when disabled', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Disabled input" disabled />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    await user.type(input, 'test')
    
    expect(input).toHaveValue('')
  })

  it('renders checkbox type', () => {
    render(<Input type="checkbox" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('renders radio type', () => {
    render(<Input type="radio" />)
    const radio = screen.getByRole('radio')
    expect(radio).toBeInTheDocument()
  })

  it('renders password type', () => {
    render(<Input type="password" placeholder="Password" />)
    const input = screen.getByPlaceholderText('Password')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('renders email type', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('renders number type', () => {
    render(<Input type="number" placeholder="Number" />)
    const input = screen.getByPlaceholderText('Number')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input-class')
  })

  it('generates unique ID when not provided', () => {
    const { container: container1 } = render(<Input label="Field 1" />)
    const { container: container2 } = render(<Input label="Field 2" />)
    
    const input1 = container1.querySelector('input')
    const input2 = container2.querySelector('input')
    
    expect(input1.id).not.toBe(input2.id)
  })

  it('uses provided ID', () => {
    render(<Input id="custom-id" label="Field" />)
    const input = screen.getByRole('textbox')
    expect(input.id).toBe('custom-id')
  })

  it('associates label with input via htmlFor', () => {
    render(<Input id="test-input" label="Test Label" />)
    const input = screen.getByRole('textbox')
    const label = screen.getByText('Test Label')
    
    expect(label.htmlFor).toBe('test-input')
  })

  it('shows error text instead of description when error is present', () => {
    render(
      <Input
        label="Field"
        description="This is a description"
        error="This is an error"
      />
    )
    expect(screen.getByText('This is an error')).toBeInTheDocument()
    expect(screen.queryByText('This is a description')).not.toBeInTheDocument()
  })

  it('applies error styling to label', () => {
    render(
      <Input
        label="Email"
        error="Invalid email"
      />
    )
    const label = screen.getByText('Email')
    expect(label).toHaveClass('text-destructive')
  })

  it('can be focused programmatically', () => {
    render(<Input placeholder="Focus me" />)
    const input = screen.getByPlaceholderText('Focus me')
    input.focus()
    expect(input).toHaveFocus()
  })

  it('can receive focus via click', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Click me" />)
    const input = screen.getByPlaceholderText('Click me')
    
    await user.click(input)
    expect(input).toHaveFocus()
  })

  it('can be blurred', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Blur me" />)
    const input = screen.getByPlaceholderText('Blur me')
    
    input.focus()
    expect(input).toHaveFocus()
    
    await user.tab() // Tab away to blur
    expect(input).not.toHaveFocus()
  })
})

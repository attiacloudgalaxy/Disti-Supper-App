import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Select from './Select'

/**
 * Select Component Tests
 *
 * These tests demonstrate user interaction testing patterns
 * for the Select component including option selection, search, and multiple selection.
 */
describe('Select Component', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  it('renders with default props', () => {
    render(<Select options={defaultOptions} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Select options={defaultOptions} placeholder="Choose an option" />)
    expect(screen.getByText('Choose an option')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(
      <Select
        options={defaultOptions}
        label="Select an option"
      />
    )
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(
      <Select
        options={defaultOptions}
        label="Select"
        description="Choose from the list below"
      />
    )
    expect(screen.getByText('Choose from the list below')).toBeInTheDocument()
  })

  it('renders with error state', () => {
    render(
      <Select
        options={defaultOptions}
        label="Select"
        error="This field is required"
      />
    )
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(
      <Select
        options={defaultOptions}
        label="Select"
        required
      />
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<Select options={defaultOptions} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Select options={defaultOptions} />
        <div data-testid="outside">Outside</div>
      </div>
    )
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    
    await user.click(screen.getByTestId('outside'))
    
    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    })
  })

  it('selects an option when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Select options={defaultOptions} onChange={handleChange} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const option = screen.getByText('Option 2')
    await user.click(option)
    
    expect(handleChange).toHaveBeenCalledWith('option2')
  })

  it('displays selected option', () => {
    render(<Select options={defaultOptions} value="option2" />)
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('displays placeholder when no value is selected', () => {
    render(<Select options={defaultOptions} placeholder="Select..." />)
    expect(screen.getByText('Select...')).toBeInTheDocument()
  })

  it('closes dropdown after selecting an option', async () => {
    const user = userEvent.setup()
    render(<Select options={defaultOptions} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const option = screen.getByText('Option 1')
    await user.click(option)
    
    await waitFor(() => {
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
    })
  })

  it('is disabled when disabled prop is true', () => {
    render(<Select options={defaultOptions} disabled />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not open dropdown when disabled', async () => {
    const user = userEvent.setup()
    render(<Select options={defaultOptions} disabled />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('shows loading spinner when loading prop is true', () => {
    render(<Select options={defaultOptions} loading />)
    const button = screen.getByRole('button')
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows clear button when clearable and has value', () => {
    render(<Select options={defaultOptions} value="option1" clearable />)
    const button = screen.getByRole('button')
    expect(button.querySelector('button')).toBeInTheDocument()
  })

  it('clears value when clear button is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Select
        options={defaultOptions}
        value="option1"
        clearable
        onChange={handleChange}
      />
    )
    
    const button = screen.getByRole('button')
    const clearButton = button.querySelector('button')
    await user.click(clearButton)
    
    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('shows search input when searchable is true', async () => {
    const user = userEvent.setup()
    render(<Select options={defaultOptions} searchable />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByPlaceholderText('Search options...')).toBeInTheDocument()
  })

  it('filters options based on search term', async () => {
    const user = userEvent.setup()
    render(<Select options={defaultOptions} searchable />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const searchInput = screen.getByPlaceholderText('Search options...')
    await user.type(searchInput, '2')
    
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument()
  })

  it('shows "No options found" when search has no results', async () => {
    const user = userEvent.setup()
    render(<Select options={defaultOptions} searchable />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const searchInput = screen.getByPlaceholderText('Search options...')
    await user.type(searchInput, 'xyz')
    
    expect(screen.getByText('No options found')).toBeInTheDocument()
  })

  it('shows "No options available" when options array is empty', async () => {
    const user = userEvent.setup()
    render(<Select options={[]} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('No options available')).toBeInTheDocument()
  })

  it('handles multiple selection', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Select
        options={defaultOptions}
        multiple
        onChange={handleChange}
      />
    )
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const option1 = screen.getByText('Option 1')
    await user.click(option1)
    expect(handleChange).toHaveBeenCalledWith(['option1'])
    
    const option2 = screen.getByText('Option 2')
    await user.click(option2)
    expect(handleChange).toHaveBeenCalledWith(['option1', 'option2'])
  })

  it('displays count when multiple options selected', () => {
    render(
      <Select
        options={defaultOptions}
        multiple
        value={['option1', 'option2']}
      />
    )
    expect(screen.getByText('2 items selected')).toBeInTheDocument()
  })

  it('shows checkmark for selected multiple options', async () => {
    const user = userEvent.setup()
    render(
      <Select
        options={defaultOptions}
        multiple
        value={['option1']}
      />
    )
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const option1 = screen.getByText('Option 1')
    expect(option1.parentElement.querySelector('svg')).toBeInTheDocument()
    
    const option2 = screen.getByText('Option 2')
    expect(option2.parentElement.querySelector('svg')).toBeNull()
  })

  it('deselects option in multiple mode', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Select
        options={defaultOptions}
        multiple
        value={['option1', 'option2']}
        onChange={handleChange}
      />
    )
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const option1 = screen.getByText('Option 1')
    await user.click(option1)
    
    expect(handleChange).toHaveBeenCalledWith(['option2'])
  })

  it('does not close dropdown in multiple mode after selection', async () => {
    const user = userEvent.setup()
    render(<Select options={defaultOptions} multiple />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const option1 = screen.getByText('Option 1')
    await user.click(option1)
    
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('disables individual options', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1', disabled: true },
      { value: 'option2', label: 'Option 2' },
    ]
    render(<Select options={optionsWithDisabled} onChange={handleChange} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const option1 = screen.getByText('Option 1')
    await user.click(option1)
    
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Select options={defaultOptions} className="custom-select" />)
    const wrapper = screen.getByRole('button').parentElement
    expect(wrapper).toHaveClass('custom-select')
  })

  it('generates unique ID when not provided', () => {
    const { container: container1 } = render(<Select options={defaultOptions} label="Select 1" />)
    const { container: container2 } = render(<Select options={defaultOptions} label="Select 2" />)
    
    const select1 = container1.querySelector('button')
    const select2 = container2.querySelector('button')
    
    expect(select1.id).not.toBe(select2.id)
  })

  it('uses provided ID', () => {
    render(<Select id="custom-id" options={defaultOptions} label="Select" />)
    const button = screen.getByRole('button')
    expect(button.id).toBe('custom-id')
  })

  it('associates label with select via htmlFor', () => {
    render(<Select id="test-select" label="Test Label" options={defaultOptions} />)
    const button = screen.getByRole('button')
    const label = screen.getByText('Test Label')
    
    expect(label.htmlFor).toBe('test-select')
  })

  it('calls onOpenChange when dropdown opens', async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()
    render(<Select options={defaultOptions} onOpenChange={handleOpenChange} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleOpenChange).toHaveBeenCalledWith(true)
  })

  it('calls onOpenChange when dropdown closes', async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()
    render(<Select options={defaultOptions} onOpenChange={handleOpenChange} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const option = screen.getByText('Option 1')
    await user.click(option)
    
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows option description', async () => {
    const user = userEvent.setup()
    const optionsWithDescription = [
      { value: 'option1', label: 'Option 1', description: 'First option' },
    ]
    render(<Select options={optionsWithDescription} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('First option')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    render(
      <Select
        options={defaultOptions}
        label="Select"
        error="This field is required"
      />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-destructive')
  })

  it('renders hidden native select for form submission', () => {
    render(<Select options={defaultOptions} name="test-select" value="option1" />)
    const nativeSelect = screen.getByRole('combobox', { hidden: true })
    expect(nativeSelect).toBeInTheDocument()
    expect(nativeSelect).toHaveValue('option1')
  })
})

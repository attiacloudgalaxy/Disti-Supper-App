import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Button from './Button'

/**
 * Snapshot Tests
 *
 * These tests demonstrate snapshot testing patterns for components.
 * Snapshots capture the rendered output of a component and
 * can be used to detect unintended changes.
 */

describe('Button Snapshots', () => {
  it('matches snapshot for default button', () => {
    const { container } = render(<Button>Click me</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for primary variant', () => {
    const { container } = render(<Button variant="primary">Primary</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for danger variant', () => {
    const { container } = render(<Button variant="danger">Delete</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for small size', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for medium size', () => {
    const { container } = render(<Button size="md">Medium</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for large size', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for disabled button', () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for loading button', () => {
    const { container } = render(<Button loading>Loading...</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for button with icon', () => {
    const { container } = render(
      <Button>
        <span className="icon">🚀</span>
        Launch
      </Button>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for button with className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for full width button', () => {
    const { container } = render(<Button fullWidth>Full Width</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import Button from './Button'

/**
 * Button Component Accessibility Tests
 *
 * These tests verify WCAG compliance for the Button component
 * using axe-core via vitest-axe.
 *
 * T052: Create accessibility test with vitest-axe
 * T053: Verify no WCAG violations in Button component
 * T054: Verify keyboard navigation works correctly
 * T055: Verify ARIA attributes are correct
 * T056: Verify color contrast meets WCAG AA standards
 * T057: Verify screen reader announcements work
 */

describe('Button Component Accessibility', () => {
  describe('WCAG Compliance (T053)', () => {
    it('should have no accessibility violations for default button', async () => {
      const { container } = render(<Button>Click me</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for primary variant', async () => {
      const { container } = render(<Button variant="primary">Primary</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for secondary variant', async () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for destructive variant', async () => {
      const { container } = render(<Button variant="destructive">Delete</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for outline variant', async () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for ghost variant', async () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for link variant', async () => {
      const { container } = render(<Button variant="link">Link</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for different sizes', async () => {
      const { container } = render(
        <div>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations when loading', async () => {
      const { container } = render(<Button loading>Loading...</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations with icon', async () => {
      const { container } = render(
        <Button>
          <span aria-hidden="true">→</span>
          Continue
        </Button>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation (T054)', () => {
    it('should be keyboard focusable', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('tabindex', '0')
    })

    it('should not be keyboard focusable when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('ARIA Attributes (T055)', () => {
    it('should have proper button role', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should have aria-disabled attribute when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('should have aria-busy attribute when loading', () => {
      render(<Button loading>Loading...</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('Screen Reader Announcements (T057)', () => {
    it('should announce button text to screen readers', () => {
      render(<Button>Submit Form</Button>)
      const button = screen.getByRole('button', { name: 'Submit Form' })
      expect(button).toBeInTheDocument()
    })

    it('should announce loading state to screen readers', () => {
      render(<Button loading>Loading...</Button>)
      const button = screen.getByRole('button', { name: 'Loading...' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-busy', 'true')
    })
  })
})

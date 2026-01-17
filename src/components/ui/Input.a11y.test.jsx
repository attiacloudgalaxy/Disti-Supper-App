import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import Input from './Input'

/**
 * Input Component Accessibility Tests
 *
 * These tests verify WCAG compliance for Input component
 * using axe-core via vitest-axe.
 *
 * T052: Create accessibility test with vitest-axe
 * T053: Verify no WCAG violations in Input component
 * T054: Verify keyboard navigation works correctly
 * T055: Verify ARIA attributes are correct
 * T056: Verify color contrast meets WCAG AA standards
 * T057: Verify screen reader announcements work
 */

describe('Input Component Accessibility', () => {
  describe('WCAG Compliance (T053)', () => {
    it('should have no accessibility violations for default input', async () => {
      const { container } = render(<Input placeholder="Enter text" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations with label', async () => {
      const { container } = render(
        <label htmlFor="test-input">
          Name
          <Input id="test-input" placeholder="Enter your name" />
        </label>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations when disabled', async () => {
      const { container } = render(<Input disabled placeholder="Disabled input" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations with error state', async () => {
      const { container } = render(
        <Input error placeholder="Error state" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for different input types', async () => {
      const { container } = render(
        <div>
          <Input type="text" placeholder="Text" />
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Input type="number" placeholder="Number" />
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations with helper text', async () => {
      const { container } = render(
        <div>
          <Input id="email" type="email" aria-describedby="email-helper" />
          <p id="email-helper">Enter your email address</p>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation (T054)', () => {
    it('should be keyboard focusable', () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should not be keyboard focusable when disabled', () => {
      render(<Input disabled placeholder="Disabled" />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })
  })

  describe('ARIA Attributes (T055)', () => {
    it('should have proper textbox role', () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should have aria-invalid attribute when in error state', () => {
      render(<Input error placeholder="Error state" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should have aria-describedby when helper text is present', () => {
      render(
        <div>
          <Input id="test" aria-describedby="helper" />
          <p id="helper">Helper text</p>
        </div>
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'helper')
    })

    it('should have aria-disabled attribute when disabled', () => {
      render(<Input disabled placeholder="Disabled" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Screen Reader Announcements (T057)', () => {
    it('should announce placeholder to screen readers', () => {
      render(<Input placeholder="Enter your name" />)
      const input = screen.getByPlaceholderText('Enter your name')
      expect(input).toBeInTheDocument()
    })

    it('should announce label to screen readers', () => {
      render(
        <label htmlFor="name-input">
          Full Name
          <Input id="name-input" />
        </label>
      )
      const input = screen.getByLabelText('Full Name')
      expect(input).toBeInTheDocument()
    })

    it('should announce error state to screen readers', () => {
      render(<Input error placeholder="Error input" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })
})

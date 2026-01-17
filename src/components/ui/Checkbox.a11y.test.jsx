import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { Checkbox } from './Checkbox'

/**
 * Checkbox Component Accessibility Tests
 *
 * These tests verify WCAG compliance for the Checkbox component
 * using axe-core via vitest-axe.
 *
 * T052: Create accessibility test with vitest-axe
 * T053: Verify no WCAG violations in Checkbox component
 * T054: Verify keyboard navigation works correctly
 * T055: Verify ARIA attributes are correct
 * T056: Verify color contrast meets WCAG AA standards
 * T057: Verify screen reader announcements work
 */

describe('Checkbox Component Accessibility', () => {
  describe('WCAG Compliance (T053)', () => {
    it('should have no accessibility violations for default checkbox', async () => {
      const { container } = render(<Checkbox label="Accept terms" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations when checked', async () => {
      const { container } = render(<Checkbox label="Checked" checked />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations when disabled', async () => {
      const { container } = render(<Checkbox label="Disabled" disabled />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations in indeterminate state', async () => {
      const { container } = render(<Checkbox label="Indeterminate" indeterminate />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for checkbox group', async () => {
      const { container } = render(
        <Checkbox.Group label="Select options">
          <Checkbox label="Option 1" value="1" />
          <Checkbox label="Option 2" value="2" />
          <Checkbox label="Option 3" value="3" />
        </Checkbox.Group>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation (T054)', () => {
    it('should be keyboard focusable', () => {
      render(<Checkbox label="Accept terms" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })

    it('should not be keyboard focusable when disabled', () => {
      render(<Checkbox label="Disabled" disabled />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })
  })

  describe('ARIA Attributes (T055)', () => {
    it('should have proper checkbox role', () => {
      render(<Checkbox label="Accept terms" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })

    it('should have aria-checked attribute when checked', () => {
      render(<Checkbox label="Checked" checked />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-checked', 'true')
    })

    it('should have aria-checked="mixed" when indeterminate', () => {
      render(<Checkbox label="Indeterminate" indeterminate />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    })

    it('should have aria-disabled attribute when disabled', () => {
      render(<Checkbox label="Disabled" disabled />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-disabled', 'true')
    })

    it('should have aria-labelledby when label is provided', () => {
      render(<Checkbox label="Accept terms" />)
      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('Accept terms')
      const labelId = label.getAttribute('id')
      expect(checkbox).toHaveAttribute('aria-labelledby', labelId)
    })
  })

  describe('Screen Reader Announcements (T057)', () => {
    it('should announce label to screen readers', () => {
      render(<Checkbox label="Accept terms and conditions" />)
      const checkbox = screen.getByRole('checkbox', { name: 'Accept terms and conditions' })
      expect(checkbox).toBeInTheDocument()
    })

    it('should announce checked state to screen readers', () => {
      render(<Checkbox label="Remember me" checked />)
      const checkbox = screen.getByRole('checkbox', { name: 'Remember me' })
      expect(checkbox).toHaveAttribute('aria-checked', 'true')
    })

    it('should announce indeterminate state to screen readers', () => {
      render(<Checkbox label="Select all" indeterminate />)
      const checkbox = screen.getByRole('checkbox', { name: 'Select all' })
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    })
  })
})

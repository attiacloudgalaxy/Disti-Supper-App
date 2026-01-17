import { describe, it, expect } from 'vitest'
import {
  sanitizeString,
  validateEmail,
  validatePhone,
  validateUrl,
  validateNumber,
  validateRequired,
  validatePartner,
  validateDeal,
  validateQuote,
  validateProduct,
  validateCompliance
} from './validators'

/**
 * Validators Utility Tests
 *
 * These tests demonstrate basic utility testing patterns
 * for the validators utility module.
 */
describe('Validators Utility', () => {
  describe('sanitizeString', () => {
    it('removes script tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      const result = sanitizeString(input)
      expect(result).not.toContain('<script>')
      expect(result).toContain('Hello')
    })

    it('removes javascript: protocol', () => {
      const input = 'javascript:alert("xss")'
      const result = sanitizeString(input)
      expect(result).not.toContain('javascript:')
    })

    it('removes iframe tags', () => {
      const input = '<iframe src="evil.com"></iframe>Content'
      const result = sanitizeString(input)
      expect(result).not.toContain('<iframe>')
      expect(result).toContain('Content')
    })

    it('escapes HTML entities', () => {
      const input = '&<>"test'
      const result = sanitizeString(input)
      // After escaping, HTML entities should be converted
      expect(result).toContain('&lt;')
      expect(result).toContain('&gt;')
      expect(result).toContain('&quot;')
    })

    it('handles non-string input', () => {
      expect(sanitizeString(null)).toBe('')
      expect(sanitizeString(undefined)).toBe('')
      expect(sanitizeString(123)).toBe('')
    })
  })

  describe('validateEmail', () => {
    it('validates correct email format', () => {
      const result = validateEmail('test@example.com')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('rejects invalid email format', () => {
      const result = validateEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid email format')
    })

    it('rejects missing email', () => {
      const result = validateEmail('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Email is required')
    })

    it('rejects email that is too long', () => {
      const longEmail = 'a'.repeat(255) + '@example.com'
      const result = validateEmail(longEmail)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Email is too long')
    })

    it('normalizes email to lowercase', () => {
      const result = validateEmail('TEST@EXAMPLE.COM')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validatePhone', () => {
    it('accepts valid phone number', () => {
      const result = validatePhone('+1-555-123-4567')
      expect(result.isValid).toBe(true)
    })

    it('accepts phone with spaces', () => {
      const result = validatePhone('1 555 123 4567')
      expect(result.isValid).toBe(true)
    })

    it('accepts null/undefined phone (optional)', () => {
      expect(validatePhone(null).isValid).toBe(true)
      expect(validatePhone(undefined).isValid).toBe(true)
    })

    it('rejects invalid phone format', () => {
      const result = validatePhone('abc')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid phone number format')
    })
  })

  describe('validateUrl', () => {
    it('accepts valid URL', () => {
      const result = validateUrl('https://example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts URL without protocol', () => {
      const result = validateUrl('example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts null/undefined URL (optional)', () => {
      expect(validateUrl(null).isValid).toBe(true)
      expect(validateUrl(undefined).isValid).toBe(true)
    })

    it('rejects invalid URL format', () => {
      const result = validateUrl('not-a-url')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid URL format')
    })
  })

  describe('validateNumber', () => {
    it('accepts valid number within range', () => {
      const result = validateNumber(50, { min: 0, max: 100 })
      expect(result.isValid).toBe(true)
    })

    it('rejects number below minimum', () => {
      const result = validateNumber(-10, { min: 0, max: 100 })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least 0')
    })

    it('rejects number above maximum', () => {
      const result = validateNumber(150, { min: 0, max: 100 })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at most 100')
    })

    it('rejects non-numeric value', () => {
      const result = validateNumber('not a number')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Must be a valid number')
    })

    it('accepts empty value when not required', () => {
      const result = validateNumber('', { required: false })
      expect(result.isValid).toBe(true)
    })

    it('rejects empty value when required', () => {
      const result = validateNumber('', { required: true })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('This field is required')
    })
  })

  describe('validateRequired', () => {
    it('accepts non-empty string', () => {
      const result = validateRequired('test value')
      expect(result.isValid).toBe(true)
    })

    it('rejects empty string', () => {
      const result = validateRequired('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('This field is required')
    })

    it('rejects string below minimum length', () => {
      const result = validateRequired('ab', 'Test field', { minLength: 5 })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least 5 characters')
    })

    it('rejects string above maximum length', () => {
      const result = validateRequired('a'.repeat(20), 'Test field', { maxLength: 10 })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at most 10 characters')
    })

    it('uses custom field name in error', () => {
      const result = validateRequired('', 'Email')
      expect(result.error).toBe('Email is required')
    })
  })

  describe('validatePartner', () => {
    it('accepts valid partner data', () => {
      const partner = {
        companyName: 'Test Company',
        contactName: 'John Doe',
        email: 'test@example.com',
        phone: '+1-555-123-4567',
        website: 'https://example.com'
      }
      const result = validatePartner(partner)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('rejects partner with missing company name', () => {
      const partner = {
        companyName: '',
        contactName: 'John Doe',
        email: 'test@example.com'
      }
      const result = validatePartner(partner)
      expect(result.isValid).toBe(false)
      expect(result.errors.companyName).toBeDefined()
    })

    it('rejects partner with invalid email', () => {
      const partner = {
        companyName: 'Test Company',
        contactName: 'John Doe',
        email: 'invalid-email'
      }
      const result = validatePartner(partner)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })
  })

  describe('validateDeal', () => {
    it('accepts valid deal data', () => {
      const deal = {
        name: 'Test Deal',
        company: 'Test Company',
        value: 10000,
        probability: 75
      }
      const result = validateDeal(deal)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('rejects deal with missing name', () => {
      const deal = {
        name: '',
        company: 'Test Company',
        value: 10000
      }
      const result = validateDeal(deal)
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBeDefined()
    })

    it('rejects deal with invalid probability', () => {
      const deal = {
        name: 'Test Deal',
        company: 'Test Company',
        value: 10000,
        probability: 150
      }
      const result = validateDeal(deal)
      expect(result.isValid).toBe(false)
      expect(result.errors.probability).toBeDefined()
    })
  })

  describe('validateQuote', () => {
    it('accepts valid quote data', () => {
      const quote = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        discountPercent: 10
      }
      const result = validateQuote(quote)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('rejects quote with invalid email', () => {
      const quote = {
        customerName: 'John Doe',
        customerEmail: 'invalid-email',
        discountPercent: 10
      }
      const result = validateQuote(quote)
      expect(result.isValid).toBe(false)
      expect(result.errors.customerEmail).toBeDefined()
    })
  })

  describe('validateProduct', () => {
    it('accepts valid product data', () => {
      const product = {
        sku: 'SKU-001',
        name: 'Test Product',
        manufacturer: 'Test Manufacturer',
        partnerPrice: 100,
        msrp: 150
      }
      const result = validateProduct(product)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('rejects product with missing SKU', () => {
      const product = {
        sku: '',
        name: 'Test Product',
        manufacturer: 'Test Manufacturer'
      }
      const result = validateProduct(product)
      expect(result.isValid).toBe(false)
      expect(result.errors.sku).toBeDefined()
    })
  })

  describe('validateCompliance', () => {
    it('accepts valid compliance requirement', () => {
      const requirement = {
        requirement: 'Test Requirement',
        type: 'Regulatory',
        responsible: 'John Doe',
        dueDate: '2025-12-31',
        progress: 50
      }
      const result = validateCompliance(requirement)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('rejects compliance with missing requirement text', () => {
      const requirement = {
        requirement: '',
        type: 'Regulatory',
        responsible: 'John Doe'
      }
      const result = validateCompliance(requirement)
      expect(result.isValid).toBe(false)
      expect(result.errors.requirement).toBeDefined()
    })

    it('rejects compliance with invalid progress', () => {
      const requirement = {
        requirement: 'Test Requirement',
        type: 'Regulatory',
        responsible: 'John Doe',
        dueDate: '2025-12-31',
        progress: 150
      }
      const result = validateCompliance(requirement)
      expect(result.isValid).toBe(false)
      expect(result.errors.progress).toBeDefined()
    })
  })
})

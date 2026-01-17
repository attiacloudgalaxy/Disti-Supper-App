/**
 * Combined MSW request handlers
 * Imports and exports all handler modules
 */

import { authHandlers } from './handlers/auth'
import { dealHandlers } from './handlers/deals'
import { partnerHandlers } from './handlers/partners'
import { auditHandlers, certificationHandlers } from './handlers/audit'

export const handlers = [
  ...authHandlers,
  ...dealHandlers,
  ...partnerHandlers,
  ...auditHandlers,
  ...certificationHandlers
]

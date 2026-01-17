# Research: Unit Testing Infrastructure

**Feature Branch**: `001-unit-testing`
**Date**: 2025-01-17
**Status**: Complete

## Research Summary

This document captures technology decisions and best practices research for implementing the unit testing infrastructure for DistributorHub.

---

## Decision 1: Test Framework Selection

**Decision**: Vitest

**Rationale**:
- Native integration with Vite (project's build tool)
- Jest-compatible API - minimal learning curve
- Significantly faster than Jest for Vite projects (native ESM support)
- Hot Module Replacement (HMR) for instant test re-runs
- Built-in watch mode with smart dependency tracking
- Shares Vite's plugin ecosystem (vite-tsconfig-paths works automatically)

**Alternatives Considered**:

| Alternative | Rejected Because |
|-------------|------------------|
| Jest | Slower with Vite, requires additional transform configuration |
| Mocha | No built-in assertion library, less React ecosystem support |
| Existing Chaos/Jest setup | Node.js focused, not optimized for React component testing |

---

## Decision 2: DOM Environment Selection

**Decision**: jsdom

**Rationale**:
- Full DOM API support for React component testing
- Required for vitest-axe accessibility testing (happy-dom incompatible)
- Mature and well-tested with React Testing Library
- Sufficient for unit and integration tests (not visual regression)

**Alternatives Considered**:

| Alternative | Rejected Because |
|-------------|------------------|
| happy-dom | Faster but incompatible with vitest-axe |
| Browser mode | Overkill for unit tests, slower execution |

---

## Decision 3: Component Testing Approach

**Decision**: React Testing Library with user-event

**Rationale**:
- Tests behavior from user perspective, not implementation details
- Encourages accessible component design
- Widely adopted industry standard
- Already included in project dependencies (needs upgrade to v14+)
- Works seamlessly with Vitest

**Best Practices**:
- Query by role, label, or text (not test IDs unless necessary)
- Use `userEvent` over `fireEvent` for realistic interactions
- Use `findBy*` queries for async operations (automatically waits)
- Avoid testing implementation details (state, props directly)
- Test what users see and do, not how components work internally

**Note**: Upgrade @testing-library/react from v11.2.7 to latest (v14+)

---

## Decision 4: API Mocking Strategy

**Decision**: Mock Service Worker (MSW) v2

**Rationale**:
- Intercepts at network level - tests actual fetch/axios calls
- Same mocks work in browser and Node.js
- Supports REST API patterns used by Supabase
- Handler-based architecture allows organized mock management
- No need to mock axios/fetch directly
- v2 uses @mswjs/interceptors (more robust)

**Alternatives Considered**:

| Alternative | Rejected Because |
|-------------|------------------|
| jest.mock() | Doesn't test actual network code path |
| nock | Node.js only, won't work in browser |
| axios-mock-adapter | Ties tests to axios implementation |

**Integration Pattern**:
```javascript
// vitest.setup.js lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

**Handler Organization**:
```
src/__mocks__/
├── handlers.js      # Combined exports
├── handlers/
│   ├── auth.js      # Authentication handlers
│   ├── deals.js     # Deal service handlers
│   └── partners.js  # Partner service handlers
└── server.js        # Node.js server setup
```

---

## Decision 5: Coverage Provider

**Decision**: V8 (Vitest default)

**Rationale**:
- ~10% performance overhead vs ~300% for Istanbul
- Since Vitest v3.2.0, accuracy matches Istanbul
- Better memory usage for large codebases
- Native Node.js integration
- Better for React JSX patterns

**Alternatives Considered**:

| Alternative | Rejected Because |
|-------------|------------------|
| Istanbul | 3x slower, no accuracy advantage since Vitest v3.2.0 |

**Configuration**:
```javascript
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'json'],
  include: ['src/**/*.{js,jsx}'],
  exclude: ['src/**/*.test.{js,jsx}', 'src/__mocks__/**'],
  thresholds: {
    lines: 80,
    branches: 75,
    functions: 80,
    statements: 80
  }
}
```

**Thresholds** (per Constitution):

| Category | Threshold |
|----------|-----------|
| Components | 80% |
| Services | 90% |
| Utils | 95% |
| Overall | 80% |

---

## Decision 6: Accessibility Testing

**Decision**: vitest-axe (NOT jest-axe)

**Rationale**:
- Vitest-optimized fork of jest-axe
- Automated WCAG 2.1 AA violation detection
- Integrates with React Testing Library render
- Clear violation reports with remediation guidance
- Requires jsdom environment (confirms Decision 2)

**Important**: Use vitest-axe, not jest-axe. jest-axe is Jest-specific.

**Usage Pattern**:
```javascript
import { axe } from 'vitest-axe'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

const { container } = render(<Component />)
expect(await axe(container)).toHaveNoViolations()
```

---

## Decision 7: Test File Organization

**Decision**: Co-located tests with source files

**Rationale**:
- Constitution specifies `Component.test.jsx` next to `Component.jsx`
- Tests live next to the code they test
- Easier to maintain - changes to component include test updates
- Clear ownership - one file, one test file
- Integration tests in separate folder for cross-component tests

**Structure**:
```
src/
├── components/
│   └── ui/
│       ├── Button.jsx
│       └── Button.test.jsx
├── services/
│   ├── authService.js
│   └── authService.test.js
└── __tests__/
    └── integration/     # Cross-component tests only
```

---

## Decision 8: Redux Testing Approach

**Decision**: Test components with real Redux store, not mocks

**Rationale**:
- Tests verify actual Redux integration
- No mock drift from real implementation
- Clean store per test prevents cross-test pollution
- Can pass preloadedState for specific scenarios
- Redux docs recommend NOT mocking hooks

**Patterns**:
```javascript
// Custom render with providers
function renderWithProviders(ui, { preloadedState } = {}) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState
  })
  return {
    store,
    ...render(ui, {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    })
  }
}
```

---

## Decision 9: Path Alias Resolution

**Decision**: vite-tsconfig-paths plugin

**Rationale**:
- Reads existing jsconfig.json configuration
- Converts path aliases to Vite resolve.alias automatically
- Works with Vitest (shared Vite config)
- No duplicate configuration needed
- Already installed in project

**Current jsconfig.json**:
```json
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

**Result**: Imports like `import { Button } from 'components/ui/Button'` resolve correctly in tests.

---

## Decision 10: Watch Mode Optimization

**Decision**: Use default parallel execution with forks pool

**Rationale**:
- `pool: 'forks'` (default) provides better stability than threads
- Parallel file execution for faster results
- Vitest's smart dependency tracking reruns only affected tests
- No isolation override (maintains test independence)
- `fileParallelism: true` runs multiple test files simultaneously

---

## Dependencies to Install

| Package | Purpose | Version |
|---------|---------|---------|
| vitest | Test framework | ^2.x |
| @vitest/coverage-v8 | Coverage reporting | ^2.x |
| @vitest/ui | Visual test UI (optional) | ^2.x |
| jsdom | DOM environment | ^24.x |
| msw | API mocking | ^2.x |
| vitest-axe | Accessibility testing | ^1.x |
| @testing-library/react | Upgrade existing | ^14.x |
| @testing-library/user-event | Upgrade existing | ^14.x |
| @testing-library/jest-dom | Already installed | existing |

**Install Command**:
```bash
npm install -D vitest @vitest/coverage-v8 @vitest/ui jsdom msw vitest-axe
npm install -D @testing-library/react@latest @testing-library/user-event@latest
```

---

## Configuration Files Summary

| File | Purpose |
|------|---------|
| `vitest.config.js` | Test runner configuration |
| `vitest.setup.js` | Test environment setup (matchers, MSW, cleanup) |
| `src/__mocks__/handlers.js` | MSW request handlers |
| `src/__mocks__/server.js` | MSW server setup |
| `src/test-utils/render.jsx` | Custom render with providers |

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing code not testable | High | Refactor components incrementally |
| MSW v2 learning curve | Medium | Provide example handlers and templates |
| Flaky async tests | Medium | Use Testing Library waitFor/findBy patterns |
| Coverage threshold too aggressive | Low | Start at current threshold, enforce on new code |
| @testing-library/react upgrade | Low | API is backward compatible, minor changes |

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW v2 Documentation](https://mswjs.io/docs/)
- [vitest-axe](https://github.com/chaance/vitest-axe)
- [Redux Testing Guide](https://redux.js.org/usage/writing-tests)
- [Vitest Coverage Guide](https://vitest.dev/guide/coverage)

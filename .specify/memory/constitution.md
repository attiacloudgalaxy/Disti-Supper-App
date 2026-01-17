# DistributorHub Constitution

<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0 → 1.0.1
- New constitution created with 5 core principles focused on testing and quality
- Added sections: Technology Stack, Development Workflow
- Templates pending update: N/A (initial creation)
- 1.0.1: Updated Technology Stack - jest-axe → vitest-axe, Istanbul → V8 (per research.md findings)
-->

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

All new features and bug fixes MUST follow test-driven development:
- Tests MUST be written before implementation code
- Red-Green-Refactor cycle strictly enforced
- No code merges without passing tests
- Minimum 80% code coverage for all new code

**Rationale**: Tests serve as living documentation and prevent regressions. Writing tests first ensures testable code design.

### II. Component Isolation

Every React component MUST be independently testable:
- Components MUST have clear, single responsibilities
- Props and state MUST be well-defined and typed
- Side effects MUST be isolated and mockable
- Components MUST render correctly in isolation

**Rationale**: Isolated components are easier to test, maintain, and reuse across the application.

### III. Service Layer Testing

All service layer code (API calls, business logic) MUST have comprehensive tests:
- API services MUST mock network requests
- Error handling MUST be tested for all failure scenarios
- Authentication flows MUST have security-focused tests
- Data transformations MUST be validated

**Rationale**: Services are critical infrastructure; failures cascade to the entire application.

### IV. Integration Testing

Integration tests MUST cover critical user journeys:
- Authentication flows (login, logout, session management)
- Core business operations (distribution management, deals, products)
- Navigation and routing between pages
- State management flows (Redux actions and selectors)

**Rationale**: Unit tests alone cannot catch issues in component interactions; integration tests validate the system works as a whole.

### V. Accessibility and Performance

Quality gates MUST include non-functional requirements:
- Components MUST be accessible (WCAG 2.1 AA compliance)
- Performance budgets MUST be defined and tested
- No accessibility regressions allowed
- Lighthouse scores MUST meet defined thresholds

**Rationale**: Quality is not just about functionality; accessibility and performance directly impact user experience.

## Technology Stack

**Testing Framework**: Vitest (optimized for Vite projects)
**Component Testing**: React Testing Library
**Mocking**: MSW (Mock Service Worker) for API mocking
**Accessibility**: vitest-axe for automated a11y testing
**Coverage**: V8 via Vitest (faster than Istanbul with equivalent accuracy)

**Stack Constraints**:
- React 18 with functional components and hooks
- Redux Toolkit for state management
- TailwindCSS for styling
- Vite for build tooling

## Development Workflow

### Quality Gates

1. **Pre-commit**: Lint and format checks
2. **Pre-push**: All unit tests MUST pass
3. **CI Pipeline**: Full test suite + coverage report
4. **PR Review**: Code review with test coverage verification

### Test Organization

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.jsx
│       └── ComponentName.test.jsx
├── services/
│   └── serviceName/
│       ├── serviceName.js
│       └── serviceName.test.js
└── __tests__/
    └── integration/
        └── featureName.test.jsx
```

### Coverage Requirements

| Category | Minimum Coverage |
|----------|-----------------|
| Components | 80% |
| Services | 90% |
| Utils | 95% |
| Overall | 80% |

## Governance

This constitution supersedes all other development practices for DistributorHub:
- All PRs MUST verify compliance with these principles
- Amendments require team discussion and documented rationale
- Exceptions MUST be documented with justification and remediation plan
- Quarterly reviews to assess principle effectiveness

**Version**: 1.0.1 | **Ratified**: 2025-01-17 | **Last Amended**: 2025-01-17

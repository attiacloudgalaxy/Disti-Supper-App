# Tasks: Unit Testing Infrastructure

**Input**: Design documents from `/specs/001-unit-testing/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create project structure for testing

- [x] T001 Install Vitest and core testing dependencies: `npm install -D vitest @vitest/coverage-v8 jsdom`
- [x] T002 Install React Testing Library packages: `npm install -D @testing-library/react@latest @testing-library/user-event@latest`
- [x] T003 [P] Install MSW for API mocking: `npm install -D msw`
- [x] T004 [P] Install vitest-axe for accessibility testing: `npm install -D vitest-axe`
- [x] T005 Add test scripts to package.json: `"test": "vitest"`, `"test:run": "vitest run"`, `"test:watch": "vitest --watch"`, `"test:coverage": "vitest run --coverage"`
- [x] T006 Create vitest.config.js with jsdom environment, globals, and coverage thresholds per research.md
- [x] T007 Create vitest.setup.js with jest-dom matchers and cleanup in vitest.setup.js

**Checkpoint**: Test infrastructure is installed and configured. Running `npm test` should start Vitest (even with no tests yet).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core test utilities that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create src/test-utils/ directory structure
- [x] T009 Create custom render wrapper with AuthProvider and BrowserRouter in src/test-utils/render.jsx
- [x] T010 [P] Create mock data factories for common entities in src/test-utils/mocks.js
- [x] T011 Create src/__mocks__/ directory structure for MSW handlers
- [x] T012 Create MSW server setup file in src/__mocks__/server.js
- [x] T013 Create combined MSW handlers export in src/__mocks__/handlers.js
- [x] T014 Update vitest.setup.js to import MSW server and add beforeAll/afterEach/afterAll lifecycle hooks
- [x] T015 Create .env.test file with test environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY mocks)
- [x] T016 Add coverage/ directory to .gitignore

**Checkpoint**: Foundation ready - `npm test` runs successfully with MSW initialized. Custom render wrapper available.

---

## Phase 3: User Story 1 - Developer Runs Tests Locally (Priority: P1)

**Goal**: Developers can run `npm test` and see pass/fail results within 30 seconds

**Independent Test**: Run `npm test` and verify test output shows results with timing information

### Implementation for User Story 1

- [ ] T017 [US1] Create example component test for Button in src/components/ui/Button.test.jsx demonstrating basic render test
- [ ] T018 [US1] Create example service test for validators in src/utils/validators.test.js demonstrating utility testing
- [ ] T019 [US1] Verify `npm test` executes and displays results with pass/fail status
- [ ] T020 [US1] Verify `npm run test:watch` runs in watch mode and re-runs on file changes
- [ ] T021 [US1] Verify test failure messages show clear assertion details with file and line numbers

**Checkpoint**: Developers can run tests locally with `npm test`. Watch mode works. Error messages are clear.

---

## Phase 4: User Story 2 - Component Testing with User Interactions (Priority: P1)

**Goal**: Developers can test React components with simulated clicks, inputs, and state changes

**Independent Test**: Write a component test that simulates a click and verifies the handler was called

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create comprehensive Button test with click handlers in src/components/ui/Button.test.jsx
- [ ] T023 [P] [US2] Create Input component test with user typing simulation in src/components/ui/Input.test.jsx
- [ ] T024 [P] [US2] Create Checkbox component test with toggle interaction in src/components/ui/Checkbox.test.jsx
- [ ] T025 [P] [US2] Create Select component test with option selection in src/components/ui/Select.test.jsx
- [ ] T026 [US2] Create NavigationSidebar test with navigation clicks in src/components/navigation/NavigationSidebar.test.jsx
- [ ] T027 [US2] Create UserProfileDropdown test with dropdown interactions in src/components/navigation/UserProfileDropdown.test.jsx
- [ ] T028 [US2] Verify userEvent simulates realistic interactions (typing delays, focus management)
- [ ] T029 [US2] Configure snapshot testing and create example snapshot test in src/components/ui/Button.test.jsx (FR-007)

**Checkpoint**: Component tests demonstrate user interaction testing and snapshot testing. All UI components have basic interaction tests.

---

## Phase 5: User Story 3 - API Service Mocking (Priority: P1)

**Goal**: Developers can mock API calls so tests run quickly without network dependencies

**Independent Test**: Write a service test that mocks Supabase response and verifies data handling

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create MSW handlers for auth endpoints in src/__mocks__/handlers/auth.js
- [ ] T031 [P] [US3] Create MSW handlers for deal endpoints in src/__mocks__/handlers/deals.js
- [ ] T032 [P] [US3] Create MSW handlers for partner endpoints in src/__mocks__/handlers/partners.js
- [ ] T033 [US3] Update src/__mocks__/handlers.js to combine all handler files
- [ ] T034 [US3] Create authService test with mocked login/logout in src/services/authService.test.js
- [ ] T035 [US3] Create dealService test with mocked CRUD operations in src/services/dealService.test.js
- [ ] T036 [US3] Create partnerService test with mocked API calls in src/services/partnerService.test.js
- [ ] T037 [US3] Demonstrate error response mocking (500, 404, network error) in service tests
- [ ] T038 [US3] Verify tests run without actual network calls (no external dependencies)

**Checkpoint**: Service tests demonstrate API mocking with MSW. Success and error scenarios covered.

---

## Phase 6: User Story 4 - Test Coverage Reporting (Priority: P2)

**Goal**: Developers can see coverage reports with line-by-line highlighting

**Independent Test**: Run `npm run test:coverage` and verify HTML report is generated in coverage/

### Implementation for User Story 4

- [ ] T039 [US4] Configure coverage thresholds in vitest.config.js (80% overall, 90% services, 95% utils)
- [ ] T040 [US4] Configure coverage reporters: text, html, json in vitest.config.js
- [ ] T041 [US4] Configure coverage include/exclude patterns to target src/ and exclude test files
- [ ] T042 [US4] Verify `npm run test:coverage` generates terminal summary
- [ ] T043 [US4] Verify coverage/index.html is generated with interactive report
- [ ] T044 [US4] Verify coverage failure when threshold not met (test with low coverage file)
- [ ] T045 [US4] Add coverage badge configuration for CI integration (optional)

**Checkpoint**: Coverage reports work. Thresholds enforced. HTML report accessible.

---

## Phase 7: User Story 5 - Redux State Testing (Priority: P2)

**Goal**: Developers can test Redux slices, selectors, and async thunks

**Independent Test**: Write a reducer test that dispatches an action and verifies state change

### Implementation for User Story 5

- [ ] T046 [US5] Update src/test-utils/render.jsx to accept preloadedState for Redux testing
- [ ] T047 [US5] Create example reducer test demonstrating action dispatch and state assertion
- [ ] T048 [US5] Create example selector test demonstrating derived state verification
- [ ] T049 [US5] Create example async thunk test with MSW mocking pending/fulfilled/rejected states
- [ ] T050 [US5] Create AuthContext test with auth state management in src/contexts/AuthContext.test.jsx
- [ ] T051 [US5] Verify store isolation between tests (no state pollution)

**Checkpoint**: Redux testing patterns documented with working examples. State management fully testable.

---

## Phase 8: User Story 6 - Accessibility Testing (Priority: P3)

**Goal**: Developers can run automated accessibility checks to catch WCAG violations

**Independent Test**: Write a component test that runs axe and reports violations

### Implementation for User Story 6

- [ ] T052 [US6] Add vitest-axe matchers to vitest.setup.js
- [ ] T053 [US6] Create Button accessibility test with axe checks in src/components/ui/Button.test.jsx
- [ ] T054 [US6] Create Input accessibility test verifying labels and ARIA in src/components/ui/Input.test.jsx
- [ ] T055 [US6] Create form component accessibility test for focus management
- [ ] T056 [US6] Verify axe violations provide remediation guidance in test output
- [ ] T057 [US6] Document accessibility testing pattern in quickstart.md examples

**Checkpoint**: Accessibility tests demonstrate axe integration. Violations reported with guidance.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Complete remaining component/service tests and documentation

### Remaining Component Tests

- [ ] T058 [P] Create AppIcon test in src/components/AppIcon.test.jsx
- [ ] T059 [P] Create AppImage test in src/components/AppImage.test.jsx
- [ ] T060 [P] Create CookieConsent test in src/components/CookieConsent.test.jsx
- [ ] T061 [P] Create BreadcrumbNavigation test in src/components/navigation/BreadcrumbNavigation.test.jsx
- [ ] T062 [P] Create NotificationCenter test in src/components/navigation/NotificationCenter.test.jsx
- [ ] T063 [P] Create QuickActionToolbar test in src/components/navigation/QuickActionToolbar.test.jsx

### Remaining Service Tests

- [ ] T064 [P] Create auditService test in src/services/auditService.test.js
- [ ] T065 [P] Create complianceService test in src/services/complianceService.test.js
- [ ] T066 [P] Create emailService test in src/services/emailService.test.js
- [ ] T067 [P] Create productService test in src/services/productService.test.js
- [ ] T068 [P] Create quoteService test in src/services/quoteService.test.js
- [ ] T069 [P] Create registrationService test in src/services/registrationService.test.js

### Utility Tests

- [ ] T070 [P] Create cn utility test in src/utils/cn.test.js

### Integration Tests

- [ ] T071 Create src/__tests__/integration/ directory
- [ ] T072 Create authentication integration test in src/__tests__/integration/authentication.test.jsx
- [ ] T073 Create deal management integration test in src/__tests__/integration/dealManagement.test.jsx

### Documentation & Cleanup

- [ ] T074 Verify all example tests in quickstart.md work correctly
- [ ] T075 Run full test suite and verify all tests pass
- [ ] T076 Run coverage report and verify thresholds met
- [ ] T077 Final code cleanup and formatting

**Checkpoint**: All tests passing. Coverage thresholds met. Documentation accurate.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1, US2, US3 are P1 priority - complete first
  - US4, US5 are P2 priority - complete after P1
  - US6 is P3 priority - complete last
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational - Requires some tests to exist for meaningful coverage
- **User Story 5 (P2)**: Can start after Foundational - No dependencies on other stories
- **User Story 6 (P3)**: Can start after Foundational - No dependencies on other stories

### Within Each User Story

- Configuration before implementation
- Shared utilities before specific tests
- Example tests before comprehensive tests

### Parallel Opportunities

- All Setup tasks T003-T004 marked [P] can run in parallel
- All Foundational tasks T010 marked [P] can run in parallel
- User Stories 1, 2, 3 can run in parallel (all P1, no dependencies)
- Component tests within US2 (T022-T025) can run in parallel
- MSW handler creation (T030-T032) can run in parallel
- All Polish component/service tests marked [P] can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all component tests in parallel:
Task: "Create comprehensive Button test with click handlers in src/components/ui/Button.test.jsx"
Task: "Create Input component test with user typing simulation in src/components/ui/Input.test.jsx"
Task: "Create Checkbox component test with toggle interaction in src/components/ui/Checkbox.test.jsx"
Task: "Create Select component test with option selection in src/components/ui/Select.test.jsx"
```

---

## Parallel Example: User Story 3

```bash
# Launch all MSW handler files in parallel:
Task: "Create MSW handlers for auth endpoints in src/__mocks__/handlers/auth.js"
Task: "Create MSW handlers for deal endpoints in src/__mocks__/handlers/deals.js"
Task: "Create MSW handlers for partner endpoints in src/__mocks__/handlers/partners.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run `npm test` and verify output
5. Developers can now run tests locally

### Incremental Delivery

1. Complete Setup + Foundational -> Test infrastructure ready
2. Add User Story 1 -> Basic testing works -> MVP!
3. Add User Story 2 -> Component interaction testing
4. Add User Story 3 -> API mocking works
5. Add User Story 4 -> Coverage reporting
6. Add User Story 5 -> Redux testing
7. Add User Story 6 -> Accessibility testing
8. Each story adds capability without breaking previous

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 + User Story 4
   - Developer B: User Story 2 + User Story 6
   - Developer C: User Story 3 + User Story 5
3. Polish phase: Divide remaining tests by component type

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests are INCLUDED in this feature since it IS a testing infrastructure feature
- Commit after each task or logical group
- Stop at any checkpoint to validate progress
- Avoid: vague tasks, same file conflicts, cross-story dependencies

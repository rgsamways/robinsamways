## ADDED Requirements

### Requirement: Web frontend maintains committed unit and e2e test suites
`web/` SHALL maintain a Vitest-based unit test suite and a Playwright-based end-to-end test suite, both committed to the repository and runnable via standard npm scripts, rather than one-off scripts written for a single verification pass and discarded.

#### Scenario: Unit suite runs and reports pass/fail
- **WHEN** a developer runs the unit test npm script in `web/`
- **THEN** the Vitest suite executes against committed test files and reports a clear pass/fail result

#### Scenario: E2E suite runs and reports pass/fail
- **WHEN** a developer runs the e2e test npm script in `web/`
- **THEN** the Playwright suite executes committed spec files against a running instance of the app and reports a clear pass/fail result

### Requirement: API maintains a committed unit and integration test suite
`api/` SHALL maintain a pytest-based test suite covering both unit tests (pure logic) and integration tests (endpoint behavior via `TestClient`), committed to the repository and runnable via a standard command, with test-only dependencies kept separate from the production `requirements.txt` that deployment actually uses.

#### Scenario: Test suite runs and reports pass/fail
- **WHEN** a developer runs pytest in `api/`
- **THEN** the suite executes committed test files and reports a clear pass/fail result

#### Scenario: Test dependencies don't affect production deployment
- **WHEN** Railway builds `api/` for deployment using `requirements.txt`
- **THEN** no test-only dependency is required for the build to succeed, since test dependencies live in a separate file

### Requirement: Each promoted portfolio piece maintains its own test suite
A portfolio piece promoted to its own deployable (per the "Portfolio piece isolation" convention) SHALL maintain its own committed, runnable test suite using a framework appropriate to that piece's own stack, rather than relying on ad-hoc verification scripts with no real test framework behind them.

#### Scenario: A promoted piece's test suite runs and reports pass/fail
- **WHEN** a developer runs the test command for a promoted piece (e.g. `npm test` in `pieces/farpost-pulse-func/`)
- **THEN** the suite executes committed test files using that piece's own chosen framework and reports a clear pass/fail result

### Requirement: New feature work includes tests as part of its own change
An OpenSpec change that adds or modifies application behavior SHALL include representative test coverage for that behavior as part of the same change's implementation, rather than deferring test coverage to a later, separate retrofit.

#### Scenario: A new change's tasks include test coverage
- **WHEN** a future OpenSpec change adds a new feature or modifies existing behavior
- **THEN** its `tasks.md` includes writing representative tests for that specific behavior, verified as part of that same change rather than left for later

<!--
  Sync Impact Report:
  - Version: 0.0.0 → 1.0.0 (Initial constitution creation)
  - Rationale: Initial MAJOR version for new project constitution
  - Principles created:
    * I. Security & Privacy First
    * II. Test-Driven Development (NON-NEGOTIABLE)
    * III. Code Maintainability
    * IV. Performance & Scalability
    * V. Data Integrity & Validation
  - Additional sections:
    * Healthcare-Specific Requirements
    * Development Workflow
  - Templates status:
    ✅ plan-template.md - aligned with Constitution Check section
    ✅ spec-template.md - aligned with requirements and user story structure
    ✅ tasks-template.md - aligned with testing and quality gates
  - Follow-up: None - all placeholders filled
-->

# CareNavi Constitution

## Core Principles

### I. Security & Privacy First

All healthcare and patient navigation data MUST be protected with industry-standard security practices. This principle is foundational to maintaining trust and safety.

**Rules:**
- All sensitive data MUST be encrypted at rest and in transit
- Authentication and authorization MUST be implemented before any data access
- Security vulnerabilities (OWASP Top 10) MUST be actively prevented: SQL injection, XSS, CSRF, command injection, insecure deserialization, etc.
- Data access MUST follow principle of least privilege
- Security reviews MUST be conducted for all PRs touching authentication, authorization, or data handling
- Personal health information (PHI) and personally identifiable information (PII) MUST be clearly identified and protected

**Rationale:** Healthcare applications handle sensitive patient data. A single security breach could compromise patient privacy, violate trust, and cause harm. Security cannot be retrofitted—it must be built in from the start.

### II. Test-Driven Development (NON-NEGOTIABLE)

Tests are written FIRST, approved by stakeholders, verified to FAIL, and THEN implementation begins. This is the foundation of quality assurance.

**Rules:**
- TDD cycle MUST be followed: Write test → Verify it fails → Implement → Verify it passes → Refactor
- Tests MUST be written before implementation code
- All tests MUST pass before code is merged
- Test coverage MUST include:
  - Unit tests for business logic
  - Integration tests for service interactions
  - Contract tests for API endpoints
  - End-to-end tests for critical user journeys
- New features without tests MUST be rejected in code review

**Rationale:** Healthcare navigation systems require high reliability. TDD ensures code correctness from the start, prevents regressions, and provides living documentation. Testing after implementation often results in tests that merely validate existing behavior rather than define requirements.

### III. Code Maintainability

Code MUST be clean, well-documented, and simple. Future developers (including your future self) should understand the code quickly.

**Rules:**
- Code MUST be self-documenting with clear variable/function names
- Complex logic MUST include explanatory comments describing "why" not "what"
- Functions MUST do one thing and do it well (Single Responsibility Principle)
- YAGNI principle applies: Don't build features until needed
- Magic numbers and strings MUST be replaced with named constants
- Public APIs MUST have documentation explaining purpose, parameters, return values, and examples
- Code duplication MUST be refactored into reusable functions

**Rationale:** CareNavi will evolve over time. Maintainable code reduces technical debt, accelerates feature development, and reduces bugs introduced during modifications. Healthcare software must be maintainable for years, not months.

### IV. Performance & Scalability

The system MUST perform efficiently and scale to handle growing user loads without degradation.

**Rules:**
- Response times MUST meet defined SLAs (to be specified per feature)
- Database queries MUST be optimized and indexed appropriately
- API endpoints MUST implement pagination for large datasets
- Resource-intensive operations MUST be asynchronous or queued
- Performance testing MUST be conducted for critical paths
- System MUST gracefully handle peak loads
- Caching strategies MUST be employed where appropriate

**Rationale:** Healthcare navigation requires timely information delivery. Slow response times frustrate users and can impact care decisions. As CareNavi grows, the system must scale without complete rewrites.

### V. Data Integrity & Validation

All data entering the system MUST be validated. Medical and navigation data MUST be accurate and consistent.

**Rules:**
- Input validation MUST occur at system boundaries (API layer, user input, external integrations)
- Data types MUST be strictly enforced
- Business rules MUST be validated before persistence
- Database constraints MUST enforce data integrity (foreign keys, unique constraints, not null)
- Error messages MUST be clear and actionable
- Data migrations MUST include validation checks
- External data sources MUST be validated and sanitized

**Rationale:** Inaccurate medical or navigation data can lead to serious consequences. Data integrity ensures the system remains trustworthy and reliable. Validation at boundaries prevents corrupt data from propagating through the system.

## Healthcare-Specific Requirements

### Compliance & Best Practices

While not pursuing specific compliance certifications (e.g., HIPAA, GDPR) at this time, CareNavi MUST follow healthcare industry security best practices:

- Audit logging for all data access and modifications
- Data retention policies clearly documented and enforced
- User consent mechanisms for data collection and usage
- Data anonymization capabilities for analytics and reporting
- Incident response procedures documented

### Patient Safety

- Critical errors (affecting patient safety) MUST be logged, alerted, and escalated immediately
- System degradation MUST fail safely (prefer conservative behavior)
- Error states MUST be clearly communicated to users
- Emergency contact information MUST remain accessible even during system failures

## Development Workflow

### Code Review Requirements

- All code MUST be reviewed by at least one other developer
- Security-sensitive code MUST be reviewed by a security-aware team member
- Reviews MUST verify:
  - Tests are present and passing
  - Code follows constitution principles
  - Security vulnerabilities are not introduced
  - Documentation is adequate

### Quality Gates

- Pre-merge: All tests passing, linting clean, no security warnings
- Pre-deployment: Integration tests passing, performance benchmarks met
- Post-deployment: Monitoring confirms system health

### Complexity Justification

If a feature violates constitution principles (e.g., requires performance trade-off with security), the violation MUST be:
- Explicitly documented in the implementation plan
- Justified with reasoning
- Reviewed and approved by team leads
- Include a plan for future resolution if possible

## Governance

### Constitution Authority

This constitution supersedes all other development practices, guidelines, and conventions. When conflicts arise, the constitution takes precedence.

### Amendment Process

Constitution amendments require:
1. Documented proposal with rationale
2. Team review and consensus
3. Version increment following semantic versioning
4. Update of all dependent templates and documentation
5. Communication to all team members

### Versioning Policy

- **MAJOR** version: Backward-incompatible changes, principle removals, fundamental redefinitions
- **MINOR** version: New principles added, significant expansions to existing principles
- **PATCH** version: Clarifications, wording improvements, typo fixes

### Compliance Review

- All pull requests MUST verify compliance with constitution principles
- Quarterly constitution review to ensure principles remain relevant
- Team members MUST be familiar with constitution contents

### Development Guidance

For detailed runtime development guidance and workflows, refer to `.claude/commands/speckit.*.md` files that provide specific execution instructions for each development phase.

**Version**: 1.0.0 | **Ratified**: 2025-12-12 | **Last Amended**: 2025-12-12

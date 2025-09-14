---
description: "Comprehensive testing guidelines for unit, integration, and end-to-end testing"
applyTo: "**/test/**,**/tests/**,**/*test*,**/*spec*"
---

# Testing Phase Instructions

## Test Strategy and Planning
- Create comprehensive test strategy covering unit, integration, and end-to-end testing
- Define test pyramid with appropriate distribution (70% unit, 20% integration, 10% E2E)
- Establish testing standards and conventions for the team
- Plan for different testing environments (development, staging, production-like)
- Include performance, security, and accessibility testing in the strategy
- **Production-Like Testing**: Mirror production environment as closely as possible in test environments
- **Real Data Usage**: Use actual data sources and databases for testing whenever feasible
- **Evidence-Based Validation**: All code must pass tests with documented evidence of functionality

## Test Evidence and Documentation Requirements
- **Test Results**: Document all test executions with timestamps and outcomes
- **Coverage Reports**: Generate and maintain code coverage reports
- **Performance Metrics**: Measure and document response times and resource usage
- **Error Scenarios**: Capture and document how the system handles failures
- **Data Validation**: Provide evidence that data transformations work correctly
- **Integration Proof**: Document successful interactions with real services

## Test Environment Management
- Use containerized environments that mirror production configurations
- Maintain test databases with production-like data structures and constraints
- Implement proper test data lifecycle management (setup, cleanup, isolation)
- Use environment-specific configuration that matches production settings
- Regular synchronization of test environments with production architecture

## Unit Testing Standards
- Achieve minimum 80% code coverage with focus on business logic
- Follow AAA pattern (Arrange, Act, Assert) for test structure
- Use descriptive test names that explain the scenario being tested
- Test one thing at a time - single assertion per test when possible
- **Minimal Mocking Policy**: Mock external dependencies only when absolutely necessary (see guidelines below)
- Include positive, negative, and edge case scenarios
- Use production-representative data volumes and complexity when feasible

### When Mocking is Acceptable
- **External Third-Party Services**: APIs you don't control (payment gateways, social media APIs)
- **Expensive Operations**: Database operations that are costly or time-consuming in CI/CD
- **Unreliable Dependencies**: Services with poor availability or rate limiting
- **Security Constraints**: When real credentials cannot be used in test environments

## Integration Testing Guidelines
- Test interactions between different modules and services
- Validate API contracts and data flow between components
- Test database interactions with real database instances
- Verify third-party service integrations with contract testing
- Include error scenarios and timeout handling
- Use test containers or similar tools for consistent test environments

## End-to-End Testing
- Focus on critical user journeys and business workflows
- Use page object model for maintainable UI tests
- Keep E2E tests stable and reliable, avoiding flaky tests
- Run E2E tests in production-like environments
- Include cross-browser and cross-device testing
- Implement visual regression testing for UI components

## Test Automation and CI/CD
- Integrate all tests into continuous integration pipeline
- Fail fast - run faster tests (unit) before slower tests (E2E)
- Implement parallel test execution to reduce feedback time
- Generate and publish test reports and coverage metrics
- Use test data management strategies for consistent test results
- Implement automated test retries for flaky tests with investigation

## Performance Testing
- Implement load testing for critical system components
- Test API response times under various load conditions
- Monitor memory usage and resource consumption during tests
- Include stress testing to identify system breaking points
- Test database performance with large datasets
- Validate caching mechanisms and optimization effectiveness

## Security Testing
- Implement automated security scanning in CI/CD pipeline
- Test authentication and authorization mechanisms
- Validate input sanitization and injection attack prevention
- Test for common vulnerabilities (OWASP Top 10)
- Include dependency vulnerability scanning
- Test secure communication protocols and certificate validation

## Test Maintenance and Quality
- Regular review and refactoring of test suites
- Remove obsolete tests and update tests for code changes
- Monitor test execution times and optimize slow tests
- Maintain test data and fixtures properly
- Document complex test scenarios and setup requirements
- Regular training on testing best practices for the team

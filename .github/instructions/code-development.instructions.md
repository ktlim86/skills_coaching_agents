---
description: "Production code development guidelines emphasizing quality, security, and maintainability"
applyTo: "web/*.{js,ts,py,java,cs,cpp,go,rs,rb,php,swift,kt}"
---

# Code Development Phase Instructions

## Universal Software Engineering Principles
- **SOLID Principles**: Follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication through proper abstraction
- **KISS (Keep It Simple, Stupid)**: Favor simple, readable solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Don't implement features until they are actually required
- **Separation of Concerns**: Each module should handle one specific responsibility
- **Fail Fast**: Detect and report errors as early as possible in the development process
- **Defensive Programming**: Always validate inputs, handle edge cases, and expect the unexpected

## Code Quality Standards
- Write self-documenting code with descriptive variable and function names
- Maintain consistent coding style and formatting across the project
- Include comprehensive error handling and logging
- Write unit tests with high coverage (minimum 80%)
- Perform regular code reviews and refactoring
- Follow language-specific best practices and conventions
- Use static analysis tools and linters
- Implement proper logging and monitoring
- Keep functions small and focused on single responsibilities (max 20-30 lines)
- Use meaningful comments for complex business logic, not obvious code
- Implement proper error handling with specific exception types
- Follow consistent indentation and formatting across the project

## SOLID Principles Implementation
- **Single Responsibility**: Each class/function should have one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable for base classes
- **Interface Segregation**: Many client-specific interfaces are better than one general-purpose interface
- **Dependency Inversion**: Depend on abstractions, not concretions

## Testing Requirements

**Reference**: For comprehensive testing guidelines, see [testing.instructions.md](./testing.instructions.md)

### Code Development Specific Testing Rules
- **Production-Like Testing**: Mirror production environment as closely as possible in test environments
- **Real Data Usage**: Use actual data sources and databases for testing whenever feasible
- **Evidence-Based Validation**: All code must pass tests with documented evidence of functionality
- **Minimal Mocking Policy**: Avoid MOCK data and services unless absolutely necessary

### When Mocking is Acceptable in Development
- **External Third-Party Services**: APIs you don't control (payment gateways, social media APIs)
- **Expensive Operations**: Database operations that are costly or time-consuming in CI/CD
- **Unreliable Dependencies**: Services with poor availability or rate limiting
- **Security Constraints**: When real credentials cannot be used in test environments

### Developer Testing Responsibilities
- Write unit tests for all business logic with minimum 80% code coverage
- Provide test evidence and documentation for all implemented features
- Ensure tests pass before code review and merge
- Test with production-representative data volumes and complexity when possible

## Security Best Practices
- Never hardcode secrets, API keys, or sensitive information
- Validate and sanitize all inputs to prevent injection attacks
- Use parameterized queries for database operations
- Implement proper authentication and authorization checks
- Never log or expose sensitive information (passwords, API keys, personal data)
- Use HTTPS for all external communications
- Implement rate limiting and input size restrictions
- Keep dependencies updated and scan for vulnerabilities
- Follow principle of least privilege
- Use secure coding practices specific to the technology stack

## Performance Considerations
- Optimize for readability first, performance second
- Profile before optimizing - measure actual bottlenecks
- Use appropriate data structures and algorithms for the use case
- Implement database query optimization (indexes, query analysis)
- Consider caching strategies for frequently accessed data
- Implement pagination for large data sets
- Use lazy loading where appropriate
- Monitor memory usage and prevent memory leaks
- Consider scalability from the beginning
- Monitor resource usage and set appropriate limits

## Code Review Standards
- All code must be reviewed by at least one other developer before merging
- Review for functionality, security, performance, and maintainability
- Ensure tests are comprehensive and passing
- Check for code style consistency and documentation quality
- Verify error handling and edge case coverage

## Documentation Requirements
- Include README files with setup and development instructions
- Document API endpoints with examples and response formats
- Create architectural diagrams for complex systems
- Document deployment procedures and environment configurations
- Maintain changelog for version releases

## Version Control Best Practices
- Use meaningful commit messages following conventional commit format
- Keep commits small and focused on single changes
- Use feature branches and pull requests for all changes
- Never commit secrets, credentials, or sensitive configuration
- Tag releases appropriately with semantic versioning

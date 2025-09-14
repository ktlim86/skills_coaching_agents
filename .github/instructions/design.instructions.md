---
description: "Design phase guidelines for creating scalable, maintainable system architectures"
applyTo: "docs/design/*.md,docs/architecture/*.md,docs/stories/*story*.md"
---

# Design Phase Instructions

## System Architecture Standards
- Follow established architectural patterns (MVC, microservices, layered architecture)
- Create clear separation between presentation, business logic, and data layers
- Design for scalability, maintainability, and testability from the start
- Document architectural decisions and trade-offs with Architecture Decision Records (ADRs)
- Consider distributed system challenges (consistency, availability, partition tolerance)

## API and Interface Design
- Design RESTful APIs following OpenAPI/Swagger specifications
- Use consistent naming conventions and HTTP status codes
- Implement proper versioning strategy for backward compatibility
- Include comprehensive error handling and response formats
- Consider rate limiting, authentication, and authorization requirements

## Data Architecture
- Design normalized database schemas with appropriate relationships
- Consider data consistency, integrity, and performance requirements
- Plan for data migration and backward compatibility
- Include data backup, recovery, and archival strategies
- Consider GDPR and data privacy requirements

## Security by Design
- Implement authentication and authorization at the design level
- Plan for secure communication (TLS, certificate management)
- Consider input validation and sanitization strategies
- Design audit trails and logging for security events
- Plan for secrets management and configuration security

## Design Documentation
- Create system diagrams using standard notation (UML, C4 model)
- Document component interactions and data flows
- Include sequence diagrams for complex workflows
- Maintain design specifications and interface contracts
- Regular design review sessions with technical stakeholders

## Best Practices
- Design for failure - plan error handling and recovery scenarios
- Consider performance requirements and bottlenecks early
- Plan for monitoring, logging, and observability
- Use design patterns appropriately without over-engineering
- Regular design validation against user stories and requirements

## Design Validation Approaches
- **Spike/Proof of Concept (POC)**: Use for technical feasibility validation - see [backlog.instructions.md](./backlog.instructions.md#spike-management-framework)
- **Prototype/MVP**: Use for user experience and feature validation - see [prototype.instructions.md](./prototype.instructions.md)
- **Architecture Decision Records (ADRs)**: Document design decisions and trade-offs

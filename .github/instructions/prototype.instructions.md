---
description: "Prototype development guidelines for rapid validation and iteration"
applyTo: "docs/stories/*story*.md"
---

# Prototype Phase Instructions

## Prototype vs. Spike Distinction
- **Prototype (Minimal Viable Product - MVP)**: User experience and feature validation, answer "Should we build it this way?"
- **Spike (Proof of Concept - POC)**: Technical feasibility investigation, answer "Can we build it?" - see [backlog.instructions.md](./backlog.instructions.md#spike-management-framework)

## Prototype Development Standards (MVP Focus)
- Focus on core user value validation over technical implementation
- Use rapid development frameworks and tools for quick iteration
- Implement minimal viable features that demonstrate user workflows
- Prioritize user experience and interface design validation
- Keep code simple and well-documented for future reference
- **Goal**: Validate user needs and business value, not technical feasibility

## When to Create a Prototype (MVP)
- **User Experience Validation**: Test user workflows and interfaces with real users
- **Feature Value Testing**: Validate business value and user adoption potential  
- **Design Validation**: Test UI/UX concepts and user interaction patterns
- **Market Validation**: Test product-market fit and user acceptance
- **Business Process Validation**: Test new business workflows and processes
- **User Feedback Collection**: Gather insights for product direction

## When to Create a Spike (POC) Instead
Use spikes for technical questions - see [backlog.instructions.md](./backlog.instructions.md) for:
- Technical feasibility questions
- Architecture decision validation
- Third-party integration capabilities
- Performance characteristics investigation
- New technology evaluation

## Technical Implementation
- Use established libraries and frameworks to accelerate development
- Implement basic error handling but avoid over-engineering
- Focus on happy path scenarios with minimal edge case handling
- Include basic logging for debugging and user behavior analysis
- Use mock data and services where appropriate to reduce complexity

## User Experience Focus
- Create interactive prototypes that demonstrate key user workflows
- Implement responsive design for different device types
- Include basic accessibility features (keyboard navigation, screen readers)
- Focus on intuitive user interfaces with clear navigation
- Gather user feedback through integrated feedback mechanisms

## Validation and Testing
- Conduct usability testing with target users
- Implement basic analytics to track user behavior and usage patterns
- Create feedback collection mechanisms (surveys, user interviews)
- Document lessons learned and validation results
- Plan for A/B testing of different approaches where applicable

## Documentation and Handoff
- Document key findings and user feedback
- Create transition plan for moving from prototype to production
- Identify technical debt and areas requiring refactoring
- Document performance bottlenecks and scalability concerns
- Maintain clear separation between prototype and production code

## Best Practices
- Time-box prototype development to prevent over-investment
- Regular stakeholder demos and feedback sessions
- Focus on learning and validation over perfection
- Use version control but don't worry about production-level branching strategies
- Plan for prototype deprecation and knowledge transfer

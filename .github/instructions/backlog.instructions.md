---
description: "Backlog generation guidelines for creating well-structured, prioritized development tasks"
applyTo: "docs/backlog/*backlog*.md"
---

# Backlog Generation Instructions

## Backlog Purpose and Scope
- **Backlog files contain**: High-level requirements, epic breakdown, and story identification
- **Individual story cards**: Created separately in `docs/stories/*.md` following [user-stories.instructions.md](./user-stories.instructions.md)
- **Do NOT include**: Detailed story card templates in backlog documents
- **Focus on**: Epic analysis, story breakdown, risk assessment, and prioritization

## Story Structure Standards
- Follow consistent story format: "As a [user type], I want [functionality], so that [benefit]"
- Include clear acceptance criteria using Given/When/Then format
- Define Definition of Done (DoD) for each story
- Estimate complexity using story points or time-based estimates
- Assign appropriate labels and tags for categorization

## T-Shirt Sizing and Fibonacci Story Point Estimation

### Fibonacci Story Point Scale
**Available Points**: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...

### T-Shirt Size Guidelines
| T-Shirt Size | Story Points (Fibonacci) | Description | Action Required |
|-------------|--------------------------|-------------|-----------------|
| **XS** | 1, 2 | Simple changes, well-understood implementation | ✅ Ready for development |
| **S** | 3, 5 | Standard feature development, clear requirements | ✅ Ready for development |
| **M** | 8 | Complex feature, some unknowns but manageable | ✅ Ready for development |
| **L** | 13 | Large feature with significant complexity | ❌ **MUST BREAK DOWN** |
| **XL** | 21 | Epic-level work, multiple components | ❌ **MUST BREAK DOWN** |
| **XXL** | 34+ | Major initiative, requires epic breakdown | ❌ **MUST BREAK DOWN** |

### Mandatory Rules
- **Use only Fibonacci numbers for estimation: 1, 2, 3, 5, 8, 13, 21...**
- **No story > 8 story points allowed in sprint**
- **All stories with 13+ points MUST be broken down before development**
- **If breakdown is unclear, create a spike first (≤ 8 points)**

## Technical Task Breakdown
- Break epics into manageable user stories (≤ 8 story points each)
- Create separate technical tasks for infrastructure, setup, and configuration
- Include research spikes for unknown or complex technical areas (≤ 8 story points)
- Add dependency mapping between related stories
- Consider technical debt and refactoring tasks
- **All features must follow Minimal Viable Product (MVP) approach**

## Minimal Viable Product (MVP) Principles

### MVP Development Standards
- **Start Simple**: Implement the most basic version that delivers user value
- **No Over-Engineering**: Avoid complex solutions when simple ones suffice
- **Focus on Core Value**: Identify and implement only the essential features
- **Iterative Enhancement**: Plan for future iterations to add complexity
- **User Feedback Driven**: Prioritize features based on actual user needs

### MVP Implementation Rules
1. **First Implementation**: Always choose the simplest approach that works
2. **Feature Scope**: Implement minimum functionality to validate user value
3. **Technical Debt**: Accept reasonable technical debt for faster delivery
4. **Future-Proofing**: Design for extension but don't implement it upfront
5. **Performance**: Optimize only when performance issues are identified

## Spike Management Framework

### Spike vs. Prototype Distinction
- **Spike (Proof of Concept - POC)**: Technical feasibility investigation, answer "Can we build it?"
- **Prototype (Minimal Viable Product - MVP)**: User experience validation, answer "Should we build it this way?" - see [prototype.instructions.md](./prototype.instructions.md)

### When to Create a Spike (POC)
- **Technical Uncertainty**: Unknown implementation complexity or feasibility
- **Third-party Integration**: Unclear API capabilities or limitations  
- **Architecture Decisions**: Need to evaluate different technical approaches
- **Performance Concerns**: Unknown performance characteristics
- **New Technology**: Team lacks experience with required technology
- **Technical Feasibility**: Can this be built with current technology stack?

### When to Create a Prototype (MVP) Instead
- **User Experience Validation**: Need to test user workflows and interfaces
- **Feature Value Validation**: Uncertain about user adoption or business value
- **Design Validation**: Need to test UI/UX concepts with real users
- **Market Validation**: Testing product-market fit
- **Business Process Validation**: Testing new business workflows

**Reference**: For prototype/MVP guidelines, see [prototype.instructions.md](./prototype.instructions.md)

### Spike Requirements
- **Maximum Size**: ≤ 8 story points
- **Time-boxed**: Fixed duration, no extensions
- **Specific Outcome**: Clear deliverables and decision criteria
- **No Production Code**: Focus on proof-of-concept only
- **Documentation**: Results must guide Product Owner decisions

### Spike Template
For spike story cards, follow the same template structure as regular user stories but with the following modifications:

**Reference**: Use the complete story card template from [user-stories.instructions.md](./user-stories.instructions.md)

**Spike-Specific Modifications**:
- **Story ID Format**: SP-YYYY-### (e.g., SP-2025-001) instead of US-YYYY-###
- **Title Format**: "Spike: [Investigation Title]" 
- **User Story Format**: "As a [development team/product owner], I want [to investigate/validate], so that [informed decisions can be made]"
- **Focus**: Investigation and proof-of-concept rather than production feature

**Additional Spike Requirements**:
- **Time Box**: Maximum 8 story points (strictly enforced)
- **No Production Code**: Focus on proof-of-concept only
- **Specific Deliverables**:
  - [ ] Proof-of-concept implementation
  - [ ] Technical analysis document
  - [ ] Recommendation for Product Owner
  - [ ] Risk assessment and mitigation strategies
  - [ ] Story breakdown (if applicable)

## Uncertainty Resolution Process

### Step 1: Identify Uncertainty
- Technical implementation unknowns
- Ambiguous business requirements  
- Integration complexity questions
- Performance or scalability concerns

### Step 2: Resolution Strategy
1. **Clarify with Product Owner** 
   - Schedule requirements clarification session for business questions
   - Document assumptions and get approval
   - Update story with clarified requirements

2. **Create Technical Spike (POC)**
   - For technical feasibility questions
   - Follow spike template above
   - Time-box investigation (≤ 8 story points)
   - Focus on specific technical questions

3. **Create Prototype (MVP)**
   - For user experience and value validation questions
   - See [prototype.instructions.md](./prototype.instructions.md)
   - Focus on user workflows and business value
   - Gather user feedback and validation

### Step 3: No Assumptions Rule
- **NEVER assume technical implementation details**
- **NEVER assume business requirements** 
- **ALWAYS seek clarification or create spike**
- **DOCUMENT all decisions and rationales**

## Prioritization Framework
- Use MoSCoW method (Must have, Should have, Could have, Won't have)
- Consider business value, technical risk, and dependencies
- Account for team capacity and sprint duration
- Balance feature work with technical improvements
- Regular backlog grooming and refinement sessions

## Quality Assurance Integration
- Include testing tasks in story estimates
- Define test scenarios and edge cases in acceptance criteria
- Consider performance testing and security requirements
- Plan for code review and documentation tasks
- Include deployment and monitoring considerations

## Best Practices
- Keep stories independent and deliverable
- Maintain INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- Regular stakeholder validation of priorities
- Use consistent estimation techniques across the team
- Track velocity and adjust planning accordingly
- **Enforce 8-point maximum rule strictly**
- **Default to MVP approach for all new features**
- **Create spikes for any uncertainty before development**
- **Never assume - always clarify or investigate**
- **Focus on user value over technical perfection**

## Risk Mitigation Strategies
- **Large Stories**: Automatically flagged for breakdown (>8 points)
- **Technical Risk**: Addressed through time-boxed spikes
- **Requirement Risk**: Resolved through PO clarification sessions
- **Implementation Risk**: Mitigated through MVP approach
- **Integration Risk**: Validated through targeted spikes

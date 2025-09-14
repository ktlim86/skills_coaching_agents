---
description: "User story guidelines for creating clear, testable, and valuable requirements"
applyTo: "docs/stories/*.md"
---

# User Story Instructions

## Story Template

Use the following template for all user stories:

```markdown
# Story Card

## Story Information
- **Story ID**: US-YYYY-### (e.g., US-2025-001)
- **Title**: [Brief, descriptive title of the user story]
- **Description**: [Detailed description of the requirement, including context and background]
- **Status**: Not Started
- **Created Date**: [Auto-populated with `date` command in yyyy-mm-dd HH:MM:SS SGT format]
- **Start Date**: [Auto-populated when status changes to "In Progress"]
- **End Date**: [Auto-populated when status changes to "Done"]
- **Duration**: [Auto-calculated when status is "Done": End Date - Start Date]

## User Story
**As a** [persona]
**I want** [goal]
**So that** [reason/benefit]

## Acceptance Criteria
**Given** [initial context]
**When** [action or trigger]
**Then** [expected outcome]

[Additional acceptance criteria as needed]

## Definition of Done
- [ ] Code implemented and peer reviewed
- [ ] Unit tests written with >80% coverage
- [ ] Integration tests passing
- [ ] Security review completed
- [ ] Performance requirements met
- [ ] Documentation updated
- [ ] PO acceptance testing completed

## Status Workflow & Approval Gates
1. **Not Started** → Story created with `date` command timestamp
2. **PO Approved** → Product Owner approval required before development
3. **In Progress** → Development started, Start Date populated with `date` command
4. **PO Acceptance** → Development complete, awaiting PO sign-off
5. **Done** → PO accepted, End Date and Duration calculated

### Gated Process Rules
- ❌ **Cannot move to "In Progress" without "PO Approved" status**
- ❌ **Cannot move to "Done" without "PO Acceptance" status**
- ✅ **All date fields automatically populated using `date` command**
- ✅ **Duration automatically calculated when status = "Done"**

## Date Management Commands
When updating story status, use these commands to populate dates:

**For Created Date (when creating story):**
```bash
# Get current Singapore time
TZ=Asia/Singapore date "+%Y-%m-%d %H:%M:%S SGT"
```

**For Start Date (when status = "In Progress"):**
```bash
# Update Start Date field
TZ=Asia/Singapore date "+%Y-%m-%d %H:%M:%S SGT"
```

**For End Date (when status = "Done"):**
```bash
# Update End Date field and calculate duration
TZ=Asia/Singapore date "+%Y-%m-%d %H:%M:%S SGT"
```
```

## Story Writing Standards
- Use clear, concise language accessible to all stakeholders
- Follow the standard format: "As a [persona], I want [goal], so that [reason]"
- Include specific user personas with defined characteristics and needs
- Focus on user value and business outcomes, not technical implementation
- Ensure stories are testable and have measurable success criteria

## Acceptance Criteria Guidelines
- Write acceptance criteria in Given/When/Then format for clarity
- Include positive and negative test scenarios
- Define boundary conditions and edge cases
- Specify error handling and validation requirements
- Consider accessibility and usability requirements

## Technical Considerations
- Separate user-facing requirements from technical implementation details
- Include non-functional requirements (performance, security, scalability)
- Consider integration points and data requirements
- Document API contracts and data formats where relevant
- Account for backward compatibility and migration needs

## Validation and Refinement
- Regular review sessions with product owners and stakeholders
- Validate stories against user personas and journey maps
- Ensure stories align with overall product vision and roadmap
- Consider story dependencies and ordering
- Update stories based on user feedback and testing results

## Best Practices
- Keep stories small enough to complete in one sprint
- Make stories independent to avoid blocking dependencies
- Include mockups, wireframes, or examples when helpful
- Consider different user types and access levels
- Regular validation with actual users or user proxies

# Story Card

## Story Information
- **Story ID**: US-2025-008C
- **Title**: Learning Plan Management Interface
- **Description**: Create user interface components for displaying, managing, and interacting with learning plans in the right panel
- **Status**: Not Started
- **Created Date**: 2025-09-14 13:42:44 SGT
- **Start Date**: [Auto-populated when status changes to "In Progress"]
- **End Date**: [Auto-populated when status changes to "Done"]
- **Duration**: [Auto-calculated when status is "Done": End Date - Start Date]

## User Story
**As a** learner
**I want** to view and manage my learning plans through an intuitive interface
**So that** I can easily track my progress and modify my learning journey

## Acceptance Criteria
**Given** I have created learning plans
**When** I access the learning plan interface
**Then** I should see my plans with options to view, edit, and manage them

**Additional Acceptance Criteria:**
- Learning plan display component for right panel
- Plan list view with plan summaries
- Detailed plan view with course sequence
- Add/remove courses from existing plans
- Plan progress visualization
- Plan sharing and export capabilities (basic)

## Definition of Done
- [ ] Learning plan display component created
- [ ] Plan list view interface implemented
- [ ] Detailed plan view with course information
- [ ] Add/remove courses functionality
- [ ] Progress visualization components
- [ ] Plan management actions (edit, delete, duplicate)
- [ ] Responsive design for right panel
- [ ] Integration with plan persistence layer

## Status Workflow & Approval Gates
1. **Not Started** → Story created with date command timestamp
2. **PO Approved** → Product Owner approval required before development
3. **In Progress** → Development started, Start Date populated with date command
4. **PO Acceptance** → Development complete, awaiting PO sign-off
5. **Done** → PO accepted, End Date and Duration calculated

### Gated Process Rules
- ❌ **Cannot move to "In Progress" without "PO Approved" status**
- ❌ **Cannot move to "Done" without "PO Acceptance" status**
- ✅ **All date fields automatically populated using `date` command**
- ✅ **Duration automatically calculated when status = "Done"**

## Technical Implementation
- Create LearningPlanDisplay component for right panel
- Implement plan list and detail views
- Add course management interface elements
- Create progress visualization components
- Integrate with learning plan data layer

## Story Points
- **T-Shirt Size**: S
- **Fibonacci Points**: 3
- **Complexity**: Low-Medium (UI components, display logic)

## Dependencies
- US-2025-008B (Learning Plan Creation and Persistence) must be completed first
- US-2025-004 (Agentic AI Chat Interface Foundation) should be completed first

## Interface Components
- Plan overview cards with summary information
- Course sequence timeline view
- Progress indicators and completion status
- Course details modal/expanded view
- Action buttons for plan management
- Integration with chat interface for plan discussions

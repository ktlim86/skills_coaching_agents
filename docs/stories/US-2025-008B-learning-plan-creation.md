# Story Card

## Story Information
- **Story ID**: US-2025-008B
- **Title**: Learning Plan Creation and Persistence
- **Description**: Implement learning plan creation functionality that allows users to select courses and save their personalized learning plans
- **Status**: Not Started
- **Created Date**: 2025-09-14 13:42:44 SGT
- **Start Date**: [Auto-populated when status changes to "In Progress"]
- **End Date**: [Auto-populated when status changes to "Done"]
- **Duration**: [Auto-calculated when status is "Done": End Date - Start Date]

## User Story
**As a** learner
**I want** to create and save a personalized learning plan from recommended courses
**So that** I can organize my learning journey and track my progress

## Acceptance Criteria
**Given** I have received course recommendations
**When** I select courses and create a learning plan
**Then** my plan should be saved and accessible for future reference

**Additional Acceptance Criteria:**
- Course selection functionality from recommendations
- Learning plan data structure and creation
- Local storage persistence for prototype (no database)
- Learning plan viewing and editing capabilities
- Course sequence ordering within plans
- Plan metadata (creation date, progress status)

## Definition of Done
- [ ] Course selection interface for plan creation
- [ ] Learning plan data structure implemented
- [ ] Local storage persistence functionality
- [ ] Plan creation and editing methods
- [ ] Course sequence management
- [ ] Plan metadata tracking
- [ ] Data validation and error handling
- [ ] Unit tests for plan creation logic

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
- Create learning plan data structure
- Implement local storage persistence methods
- Add course selection and plan creation logic
- Create plan editing and management functions
- Add data validation and error handling

## Story Points
- **T-Shirt Size**: M
- **Fibonacci Points**: 5
- **Complexity**: Medium (data persistence, plan management)

## Dependencies
- US-2025-008A (Course Recommendation Engine) must be completed first

## Learning Plan Structure
- Plan ID and metadata (name, creation date, last modified)
- Selected courses list with sequence ordering
- Progress tracking (courses completed, in progress, pending)
- Course details (title, level, estimated duration)
- Plan status (active, completed, archived)

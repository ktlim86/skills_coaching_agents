# Story Card

## Story Information
- **Story ID**: US-2025-008
- **Title**: Course Recommendations and Learning Plan Management
- **Description**: Generate personalized course recommendations based on skill gap analysis and allow users to create and save learning plans
- **Status**: Not Started
- **Created Date**: 2025-09-14 13:37:59 SGT
- **Start Date**: [Auto-populated when status changes to "In Progress"]
- **End Date**: [Auto-populated when status changes to "Done"]
- **Duration**: [Auto-calculated when status is "Done": End Date - Start Date]

## User Story
**As a** learner
**I want** to receive personalized course recommendations and create a learning plan
**So that** I can systematically improve my skills based on my assessment results

## Acceptance Criteria
**Given** I have completed skill assessment and seen my quadrant analysis
**When** the system provides course recommendations
**Then** I should see ordered course suggestions and be able to create a learning plan

**Additional Acceptance Criteria:**
- Display course recommendations ordered by learning progression
- Allow users to select courses and add to learning plan
- Save learning plans for future access
- Show course progression logic (foundational → intermediate → advanced)
- Enable adding additional courses to existing plans
- Display learning plan with course sequence and timeline

## Definition of Done
- [ ] Course recommendation algorithm implemented
- [ ] Course ordering by learning progression
- [ ] Course selection and learning plan creation
- [ ] Learning plan persistence (local storage for prototype)
- [ ] Add/remove courses from learning plan
- [ ] Learning plan display and management
- [ ] Integration with course mapping data (CSV)
- [ ] User interface for plan management

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
- Course recommendation engine based on skill gaps
- Learning plan data structure and persistence
- Course progression logic implementation
- User interface for plan creation and management
- Integration with CSV course data

## Story Points
- **T-Shirt Size**: L (needs breakdown)
- **Fibonacci Points**: 13 (MUST BREAK DOWN)
- **Complexity**: Very High (recommendation engine, persistence, complex UI)

## Dependencies
- US-2025-003 (Data Analysis and Course Mapping) must be completed first
- US-2025-007 (Skill Gap Analysis and Quadrant Visualization) must be completed first

## Notes
**ATTENTION**: This story is 13 points and MUST BE BROKEN DOWN into smaller stories (≤8 points each) before development can begin. Consider creating separate stories for:
1. Course recommendation algorithm (5 points)
2. Learning plan creation and persistence (5 points)  
3. Learning plan management UI (3 points)

## Course Recommendation Logic
- Identify skill gaps from assessment results
- Match gaps to available courses from CSV data
- Order courses by learning progression (foundational first)
- Consider learner's current quadrant for recommendation prioritization
- Provide clear rationale for each recommendation

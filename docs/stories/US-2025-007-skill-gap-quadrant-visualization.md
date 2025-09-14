# Story Card

## Story Information
- **Story ID**: US-2025-007
- **Title**: Skill Gap Analysis and Quadrant Visualization
- **Description**: Process assessment results to calculate competency/capability scores and display 2D quadrant visualization with learner profile identification
- **Status**: Not Started
- **Created Date**: 2025-09-14 13:37:59 SGT
- **Start Date**: [Auto-populated when status changes to "In Progress"]
- **End Date**: [Auto-populated when status changes to "Done"]
- **Duration**: [Auto-calculated when status is "Done": End Date - Start Date]

## User Story
**As a** learner
**I want** to see my skill assessment results visualized in a 2D quadrant chart
**So that** I can understand my current competency and capability levels and my learner profile

## Acceptance Criteria
**Given** I have completed the 10-question skill assessment
**When** the system processes my responses
**Then** I should see a 2D chart showing my position in one of four quadrants with my profile description

**Additional Acceptance Criteria:**
- Calculate average scores for competency (5 questions) and capability (5 questions)
- Display 2D chart with Competency (X-axis) and Capability (Y-axis)
- Show four quadrants: Expert Practitioner, Natural Doer, Emerging Talent, Theorist
- Plot user's position on the chart
- Display quadrant-specific profile description
- Show scoring breakdown and explanation

## Definition of Done
- [ ] Assessment scoring algorithm implemented
- [ ] 2D quadrant chart visualization created
- [ ] Four quadrant definitions and descriptions
- [ ] User position plotting on chart
- [ ] Profile identification and description display
- [ ] Scoring breakdown and explanation
- [ ] Chart responsive design for right panel
- [ ] Integration with assessment quiz results

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
- Calculate competency average (questions 1-5)
- Calculate capability average (questions 6-10)
- Create 2D chart component (Chart.js or similar)
- Implement quadrant logic and descriptions
- Display user position and profile

## Story Points
- **T-Shirt Size**: M
- **Fibonacci Points**: 8
- **Complexity**: High (calculations, visualization, chart integration)

## Dependencies
- US-2025-005 (Skill Assessment Quiz) must be completed first

## Quadrant Definitions
**Quadrant 1: Expert Practitioner (High Competency, High Capability)**
- Knows theory and applies it in practice
- Recognized as advanced/master level

**Quadrant 2: Natural Doer (Low Competency, High Capability)**  
- Strong hands-on experience but limited formal knowledge
- Experience-driven practitioner

**Quadrant 3: Emerging Talent (Low Competency, Low Capability)**
- Just starting out in both theory and practice
- Early career development stage

**Quadrant 4: Theorist (High Competency, Low Capability)**
- Strong academic/theoretical knowledge
- Limited practical application experience

## Scoring Scales
**Competency Scoring:**
- 0 = None (no formal learning, no demonstrable knowledge)
- 1 = Limited (basic course/workshop, cannot apply independently)
- 2 = Strong (intermediate/advanced learning, can apply in controlled contexts)
- 3 = Expert (master-level learning, can create/adapt frameworks)

**Capability Scoring:**
- 0 = None (no real-world experience)
- 1 = Limited (<2 years, guided practice only)
- 2 = Strong (2-5 years, independent application)
- 3 = Expert (>5 years, complex contexts, mentoring others)

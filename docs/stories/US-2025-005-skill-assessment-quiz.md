# Story Card

## Story Information
- **Story ID**: US-2025-005
- **Title**: Interactive Skill Assessment Quiz Interface
- **Description**: Create an interactive quiz interface in the right panel to replace Excel link, allowing users to complete skill assessments directly in the browser
- **Status**: Done
- **Created Date**: 2025-09-14 13:37:59 SGT
- **PO Approval Date**: 2025-09-14 14:21:48 SGT
- **Start Date**: 2025-09-14 15:17:24 SGT
- **End Date**: 2025-09-14 15:33:45 SGT
- **Duration**: 16 minutes 21 seconds

## User Story
**As a** learner
**I want** to complete a skill assessment quiz directly in the right panel
**So that** I can evaluate my competency and capability levels without using external Excel files

## Acceptance Criteria
**Given** the AI suggests taking a skill assessment
**When** the quiz appears in the right panel
**Then** I should be able to answer 10 questions (5 competency, 5 capability) and submit my responses

**Additional Acceptance Criteria:**
- Display 10 assessment questions with 4-point scale (0-3: Foundational, Intermediate, Advanced, Mastery)
- 5 questions for Competency dimension
- 5 questions for Capability dimension
- Each question has clear scale descriptions
- Submit button to complete assessment
- Form validation to ensure all questions are answered
- Clear instructions and progress indication

## Definition of Done
- [ ] Quiz interface component created for right panel
- [ ] 10 assessment questions implemented with proper scales
- [ ] 4-point rating system for each question
- [ ] Form validation for complete responses
- [ ] Submit functionality to capture responses
- [ ] Progress indicator and clear instructions
- [ ] Responsive design for quiz interface
- [ ] Integration with chat flow and AI prompts

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
- Create AssessmentQuiz component for right panel
- Implement form state management for 10 questions
- Add 4-point radio button scales with descriptive labels
- Form validation and submission handling
- Integration with parent components for data flow

## Story Points
- **T-Shirt Size**: M
- **Fibonacci Points**: 5
- **Complexity**: Medium (form handling, validation, UI components)

## Dependencies
- US-2025-004 (Agentic AI Chat Interface Foundation) must be completed first

## Assessment Questions Structure
**Competency Questions (5):**
1. How well can you explain the key concepts and principles of this skill to others?
2. How effectively can you apply this skill to solve typical problems or tasks?
3. How independently can you use this skill without supervision or guidance?
4. How effectively can you adapt this skill to new, unfamiliar, or complex contexts?
5. How often do others seek your input or guidance regarding this skill?

**Capability Questions (5):**
1. How many years of relevant experience do you have actively applying this skill?
2. How consistently do you perform this skill successfully under real workplace conditions?
3. How confidently can you apply this skill under pressure or high-stakes situations?
4. How much exposure do you have across diverse scenarios where this skill was required?
5. How regularly do you use this skill in your current or past roles?

**Scale for all questions:**
- 0 = Foundational
- 1 = Intermediate  
- 2 = Advanced
- 3 = Mastery

# Agent Responsibility Matrix

## Overview
This matrix defines the clear separation of responsibilities across the three agents in the learning platform.

## Responsibility Breakdown

| Capability | Skill Coach Agent | Skill Assessor Agent | Course Matcher Agent |
|------------|------------------|---------------------|---------------------|
| **Primary Role** | Orchestrator & Coordinator | Assessment Specialist | Recommendation Engine |

### 🎯 Skill Coach Agent (Main Coordinator)

#### Core Responsibilities
- **User Interaction Management**: Primary point of contact for all user communications
- **Conversation Flow Control**: Manages the overall conversation state and progression
- **Agent Orchestration**: Coordinates calls to other agents based on user needs
- **Session Management**: Maintains user session state and conversation history
- **Learning Journey Guidance**: Provides overall learning path recommendations

#### Specific Capabilities
- Welcome new users and explain platform capabilities
- Interpret user requests and route to appropriate agents
- Synthesize responses from multiple agents into coherent recommendations
- Manage conversation context and maintain user engagement
- Provide learning strategy advice and goal setting guidance
- Handle general questions about the learning platform

#### Communication Pattern
- **Inbound**: Direct user messages, responses from other agents
- **Outbound**: Messages to user interface, requests to other agents
- **Role**: Hub in hub-and-spoke pattern

---

### 📊 Skill Assessor Agent (Assessment Specialist)

#### Core Responsibilities
- **Assessment Processing**: Analyze quiz responses and calculate scores
- **Competency Evaluation**: Calculate competency scores from knowledge-based questions
- **Capability Evaluation**: Calculate capability scores from experience-based questions
- **Quadrant Determination**: Place users in appropriate skill quadrants
- **Gap Analysis**: Identify specific skill gaps and improvement areas

#### Specific Capabilities
- Process 10-question assessment responses (5 competency + 5 capability)
- Calculate average competency score (0-3 scale)
- Calculate average capability score (0-3 scale)
- Determine skill quadrant placement:
  - Expert Practitioner (High Competency, High Capability)
  - Natural Doer (Low Competency, High Capability)
  - Emerging Talent (Low Competency, Low Capability)
  - Theorist (High Competency, Low Capability)
- Generate skill gap analysis with specific recommendations
- Create assessment reports with detailed insights

#### Communication Pattern
- **Inbound**: Assessment requests from Skill Coach Agent
- **Outbound**: Assessment results and recommendations to Skill Coach Agent
- **Role**: Specialist responding to assessment requests

---

### 📚 Course Matcher Agent (Recommendation Engine)

#### Core Responsibilities
- **Course Matching**: Match courses to identified skill gaps
- **Learning Path Creation**: Design sequential learning paths based on skill levels
- **Recommendation Prioritization**: Order courses by relevance and difficulty
- **Prerequisite Management**: Ensure course prerequisites are met
- **Progress Tracking**: Monitor course completion and learning progress

#### Specific Capabilities
- Access course database (760+ courses from CSV data)
- Match courses to specific skill gaps identified by Skill Assessor
- Create personalized course recommendations based on:
  - Current skill level (beginner, intermediate, advanced)
  - Learning goals and preferences
  - Time availability and commitment
  - Career objectives
- Generate learning plans with timelines and milestones
- Recommend course sequences that build upon each other
- Provide alternative course options for different learning styles

#### Communication Pattern
- **Inbound**: Course recommendation requests from Skill Coach Agent
- **Outbound**: Course lists and learning plans to Skill Coach Agent
- **Role**: Specialist responding to recommendation requests

## Agent Interaction Flows

### 1. User Assessment Flow
```
User Request → Skill Coach → Skill Assessor → Assessment Results → Skill Coach → User
```

### 2. Course Recommendation Flow
```
User Request → Skill Coach → Course Matcher → Course List → Skill Coach → User
```

### 3. Complete Learning Journey Flow
```
User Request → Skill Coach → Skill Assessor → Assessment Results → 
Course Matcher → Learning Plan → Skill Coach → User
```

## Data Flow and Dependencies

### Skill Coach Agent Dependencies
- **Input**: User messages, agent responses
- **Output**: Coordinated responses, agent requests
- **State**: Conversation history, user session data

### Skill Assessor Agent Dependencies
- **Input**: Quiz responses, assessment requests
- **Output**: Scores, quadrant placement, gap analysis
- **State**: Assessment results, historical assessments

### Course Matcher Agent Dependencies
- **Input**: Skill profiles, learning goals, course requests
- **Output**: Course recommendations, learning plans
- **State**: Course database, user preferences, progress tracking

## Error Handling Responsibilities

| Error Type | Primary Handler | Backup Handler | Escalation |
|------------|----------------|----------------|------------|
| User Input Validation | Skill Coach | - | User notification |
| Assessment Calculation | Skill Assessor | Skill Coach | Default assessment |
| Course Matching Failure | Course Matcher | Skill Coach | Generic recommendations |
| Agent Communication | Skill Coach | System | Fallback responses |
| Session Management | Skill Coach | System | New session creation |

## Performance and Scalability

### Load Distribution
- **Skill Coach**: Handles all user interactions (highest load)
- **Skill Assessor**: Processes assessments on-demand (medium load)
- **Course Matcher**: Generates recommendations periodically (variable load)

### Optimization Strategies
- **Caching**: Cache assessment results and course recommendations
- **Lazy Loading**: Load agent capabilities only when needed
- **Parallel Processing**: Skill Assessor and Course Matcher can work in parallel
- **State Management**: Minimize state synchronization between agents

This responsibility matrix ensures clear separation of concerns and prevents overlap between agent capabilities while maintaining efficient coordination.

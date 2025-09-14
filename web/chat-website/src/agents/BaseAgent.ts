/**
 * Multi-Agent Learning Platform - Base Agent Interface
 * Defines the core interfaces and types for the agent system
 */

// Agent Types
export enum AgentType {
  SKILL_COACH = 'skill_coach',
  SKILL_ASSESSOR = 'skill_assessor',
  COURSE_MATCHER = 'course_matcher'
}

// Agent Capabilities
export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
}

// Agent Request/Response Types
export interface AgentRequest {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

export interface AgentResponse {
  id: string;
  requestId: string;
  type: string;
  payload: Record<string, unknown>;
  agentName: string;
  success: boolean;
  error?: AgentError;
  timestamp: Date;
}

export interface AgentError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// User Session and State
export interface UserSession {
  sessionId: string;
  userId?: string;
  conversationHistory: Message[];
  currentState: SessionState;
  metadata: Record<string, unknown>;
  createdAt: Date;
  lastActivity: Date;
}

export interface SessionState {
  currentAgent?: AgentType;
  assessmentProgress?: AssessmentProgress;
  learningProfile?: LearningProfile;
  preferences: UserPreferences;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  agent?: AgentType;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Assessment Related Types
export interface AssessmentProgress {
  questionsAnswered: number;
  totalQuestions: number;
  responses: AssessmentResponse[];
  startedAt: Date;
  completedAt?: Date;
}

export interface AssessmentResponse {
  questionId: string;
  score: number;
  answeredAt: Date;
}

export interface AssessmentResults {
  competencyScore: number;
  capabilityScore: number;
  quadrant: SkillQuadrant;
  skillGaps: SkillGap[];
  recommendations: string[];
  completedAt: Date;
  aiExplanation?: string;
  personalizedInsights?: string;
}

export enum SkillQuadrant {
  EXPERT_PRACTITIONER = 'expert_practitioner',    // High Competency, High Capability
  NATURAL_DOER = 'natural_doer',                  // Low Competency, High Capability  
  EMERGING_TALENT = 'emerging_talent',            // Low Competency, Low Capability
  THEORIST = 'theorist'                           // High Competency, Low Capability
}

export interface SkillGap {
  area: string;
  currentLevel: number;
  recommendedLevel: number;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

// Course and Learning Content
export interface Course {
  course_id: string;
  course_title: string;
  course_description: string;
  career_path: string;
  career_level: string;
  sector: string;
  job_role: string;
  primary_skill: string;
  secondary_skills: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_hours: number;
  provider: string;
  prerequisites: string;
  learning_outcomes: string;
  career_progression_target: string;
}

export interface CourseRecommendation {
  course: Course;
  relevanceScore: number;
  matchedSkillGaps: string[];
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: CourseRecommendation[];
  estimatedDuration: number;
  skillsAddressed: string[];
  progressionLevel: 'foundational' | 'intermediate' | 'advanced' | 'expert';
}

// Learning Profile
export interface LearningProfile {
  assessmentResults?: AssessmentResults;
  skillAreas: SkillArea[];
  learningGoals: LearningGoal[];
  preferredLearningStyle?: LearningStyle;
  availableTime?: TimeCommitment;
}

export interface SkillArea {
  name: string;
  competencyLevel: number;
  capabilityLevel: number;
  lastAssessed?: Date;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetSkills: string[];
  timeframe: string;
  priority: number;
  status: 'active' | 'completed' | 'paused';
}

export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory', 
  KINESTHETIC = 'kinesthetic',
  READING_WRITING = 'reading_writing'
}

export interface TimeCommitment {
  hoursPerWeek: number;
  preferredSchedule: string[];
  flexibilityLevel: 'low' | 'medium' | 'high';
}

export interface UserPreferences {
  language: string;
  notifications: boolean;
  learningReminders: boolean;
  progressTracking: boolean;
  publicProfile: boolean;
}

// Base Agent Interface
export interface IAgent {
  readonly name: string;
  readonly type: AgentType;
  readonly capabilities: AgentCapability[];
  
  // Core agent methods
  initialize(): Promise<void>;
  processRequest(request: AgentRequest): Promise<AgentResponse>;
  getCapabilities(): AgentCapability[];
  getStatus(): AgentStatus;
  cleanup(): Promise<void>;
  
  // Event handling
  addEventListener(event: string, handler: AgentEventHandler): void;
  removeEventListener(event: string, handler: AgentEventHandler): void;
  emit(event: string, data: unknown): void;
}

export interface AgentStatus {
  name: string;
  type: AgentType;
  state: 'initializing' | 'ready' | 'busy' | 'error' | 'cleanup';
  lastActivity?: Date;
  metrics: AgentMetrics;
}

export interface AgentMetrics {
  requestsProcessed: number;
  averageResponseTime: number;
  errorCount: number;
  lastError?: AgentError;
}

export type AgentEventHandler = (data: unknown) => void;

// Abstract Base Agent Class
export abstract class BaseAgent implements IAgent {
  public readonly name: string;
  public readonly type: AgentType;
  public readonly capabilities: AgentCapability[];
  
  protected status: AgentStatus;
  protected eventHandlers: Map<string, AgentEventHandler[]>;
  
  constructor(name: string, type: AgentType, capabilities: AgentCapability[]) {
    this.name = name;
    this.type = type;
    this.capabilities = capabilities;
    this.eventHandlers = new Map();
    
    this.status = {
      name,
      type,
      state: 'initializing',
      metrics: {
        requestsProcessed: 0,
        averageResponseTime: 0,
        errorCount: 0
      }
    };
  }
  
  abstract initialize(): Promise<void>;
  abstract processRequest(request: AgentRequest): Promise<AgentResponse>;
  
  public getCapabilities(): AgentCapability[] {
    return [...this.capabilities];
  }
  
  public getStatus(): AgentStatus {
    return { ...this.status };
  }
  
  public addEventListener(event: string, handler: AgentEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }
  
  public removeEventListener(event: string, handler: AgentEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  public emit(event: string, data: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }
  
  protected updateStatus(state: AgentStatus['state'], lastActivity?: Date): void {
    this.status.state = state;
    this.status.lastActivity = lastActivity || new Date();
  }
  
  protected updateMetrics(responseTime: number, isError: boolean = false): void {
    this.status.metrics.requestsProcessed++;
    
    // Update average response time
    const currentAvg = this.status.metrics.averageResponseTime;
    const count = this.status.metrics.requestsProcessed;
    this.status.metrics.averageResponseTime = 
      (currentAvg * (count - 1) + responseTime) / count;
    
    if (isError) {
      this.status.metrics.errorCount++;
    }
  }
  
  protected createResponse(
    requestId: string, 
    type: string, 
    payload: Record<string, unknown>,
    success: boolean = true,
    error?: AgentError
  ): AgentResponse {
    return {
      id: `${this.name}_${Date.now()}`,
      requestId,
      type,
      payload,
      agentName: this.name,
      success,
      error,
      timestamp: new Date()
    };
  }
  
  public async cleanup(): Promise<void> {
    this.updateStatus('cleanup');
    this.eventHandlers.clear();
    // Subclasses can override for specific cleanup
  }
}

// Agent Factory
export class AgentFactory {
  private static registeredAgents: Map<AgentType, new (...args: unknown[]) => IAgent> = new Map();
  
  public static registerAgent(type: AgentType, agentClass: new (...args: unknown[]) => IAgent): void {
    this.registeredAgents.set(type, agentClass);
  }
  
  public static createAgent(type: AgentType, ...args: unknown[]): IAgent {
    const AgentClass = this.registeredAgents.get(type);
    if (!AgentClass) {
      throw new Error(`Agent type ${type} is not registered`);
    }
    return new AgentClass(...args);
  }
  
  public static getRegisteredTypes(): AgentType[] {
    return Array.from(this.registeredAgents.keys());
  }
}

// Agent Manager - Orchestrates multiple agents
export class AgentManager {
  private agents: Map<AgentType, IAgent>;
  private sessionManager: SessionManager;
  
  constructor() {
    this.agents = new Map();
    this.sessionManager = new SessionManager();
  }
  
  public async registerAgent(agent: IAgent): Promise<void> {
    await agent.initialize();
    this.agents.set(agent.type, agent);
  }
  
  public getAgent(type: AgentType): IAgent | undefined {
    return this.agents.get(type);
  }
  
  public async processUserMessage(
    message: string, 
    sessionId: string,
    _userId?: string
  ): Promise<AgentResponse> {
    // This method will be implemented to route messages to appropriate agents
    // and coordinate their responses
    
    const _session = await this.sessionManager.getSession(sessionId);
    // Implementation will be added in subsequent stories
    
    // Use message and sessionId to prevent unused variable warnings
    console.log(`Processing message: ${message} for session: ${sessionId}`);
    
    throw new Error('Method not implemented yet - will be completed in 006B');
  }
  
  public async cleanup(): Promise<void> {
    for (const agent of this.agents.values()) {
      await agent.cleanup();
    }
    this.agents.clear();
  }
}

// Session Manager - Manages user sessions and state
export class SessionManager {
  private sessions: Map<string, UserSession>;
  
  constructor() {
    this.sessions = new Map();
  }
  
  public async createSession(userId?: string): Promise<UserSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: UserSession = {
      sessionId,
      userId,
      conversationHistory: [],
      currentState: {
        preferences: {
          language: 'en',
          notifications: true,
          learningReminders: true,
          progressTracking: true,
          publicProfile: false
        }
      },
      metadata: {},
      createdAt: new Date(),
      lastActivity: new Date()
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }
  
  public async getSession(sessionId: string): Promise<UserSession | undefined> {
    return this.sessions.get(sessionId);
  }
  
  public async updateSession(session: UserSession): Promise<void> {
    session.lastActivity = new Date();
    this.sessions.set(session.sessionId, session);
  }
  
  public async addMessage(sessionId: string, message: Message): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.conversationHistory.push(message);
      await this.updateSession(session);
    }
  }
  
  public async cleanupOldSessions(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const now = new Date();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

import { 
  BaseAgent, 
  AgentType, 
  AgentCapability, 
  AgentRequest, 
  AgentResponse,
  IAgent
} from './BaseAgent';
import { OpenAIService, getOpenAIService } from '../services/OpenAIService';

interface IntentAnalysis {
  intent: string;
  confidence: number;
  reasoning?: string;
}

/**
 * Skill Coach Agent - Main coordinator for user interactions
 * Serves as the primary interface between users and the learning platform
 */
export class SkillCoachAgent extends BaseAgent {
  private sessionManager: Record<string, unknown> | null = null; // Will be injected
  private skillAssessorAgent?: IAgent;
  private courseMatcherAgent?: IAgent;
  private openAIService!: OpenAIService;
  
  constructor() {
    const capabilities: AgentCapability[] = [
      {
        name: 'user_interaction',
        description: 'Handle primary user conversations and queries',
        inputTypes: ['user_message', 'conversation_start'],
        outputTypes: ['bot_response', 'conversation_flow']
      },
      {
        name: 'agent_orchestration',
        description: 'Coordinate with other agents for specialized tasks',
        inputTypes: ['assessment_request', 'course_request'],
        outputTypes: ['agent_coordination', 'synthesized_response']
      },
      {
        name: 'session_management',
        description: 'Manage user session state and conversation history',
        inputTypes: ['session_data', 'state_update'],
        outputTypes: ['session_state', 'conversation_context']
      },
      {
        name: 'learning_guidance',
        description: 'Provide learning strategy and goal setting advice',
        inputTypes: ['learning_goals', 'skill_profile'],
        outputTypes: ['learning_plan', 'goal_recommendations']
      }
    ];
    
    super('SkillCoach', AgentType.SKILL_COACH, capabilities);
  }
  
  public async initialize(): Promise<void> {
    try {
      this.openAIService = getOpenAIService();
      this.updateStatus('ready');
      console.log('Skill Coach Agent initialized with OpenAI integration');
    } catch (error) {
      console.error('Failed to initialize OpenAI service:', error);
      this.updateStatus('error');
      throw error;
    }
  }
  
  public async processRequest(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    this.updateStatus('busy');
    
    try {
      let response: AgentResponse;
      
      switch (request.type) {
        case 'user_message':
          response = await this.handleUserMessage(request);
          break;
          
        case 'conversation_start':
          response = await this.handleConversationStart(request);
          break;
          
        case 'assessment_request':
          response = await this.handleAssessmentRequest(request);
          break;
          
        case 'course_request':
          response = await this.handleCourseRequest(request);
          break;
          
        case 'learning_guidance':
          response = await this.handleLearningGuidance(request);
          break;
          
        default:
          response = this.createResponse(
            request.id,
            'error',
            { message: `Unknown request type: ${request.type}` },
            false,
            { code: 'UNKNOWN_REQUEST_TYPE', message: 'Request type not supported' }
          );
      }
      
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, !response.success);
      this.updateStatus('ready');
      
      return response;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, true);
      this.updateStatus('error');
      
      return this.createResponse(
        request.id,
        'error',
        { message: 'Internal agent error' },
        false,
        { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { error: String(error) }
        }
      );
    }
  }
  
  /**
   * Handle incoming user messages and determine appropriate response
   */
  private async handleUserMessage(request: AgentRequest): Promise<AgentResponse> {
    const { message } = request.payload;
    const messageText = String(message).toLowerCase();
    
    // Use OpenAI to analyze user intent and generate more natural responses
    try {
      const availableIntents = [
        'skill_assessment', 
        'course_recommendation', 
        'learning_guidance', 
        'general_conversation',
        'greeting',
        'help_request'
      ];
      
      const intentAnalysis = await this.openAIService.analyzeUserIntent(messageText, availableIntents);
      
      // Route based on AI-analyzed intent
      switch (intentAnalysis.intent) {
        case 'skill_assessment':
          return await this.coordinateAssessment(request);
        case 'course_recommendation':
          return await this.coordinateCourseRecommendation(request);
        case 'learning_guidance':
          return await this.provideLearningGuidance(request);
        case 'greeting':
        case 'help_request':
        case 'general_conversation':
        default:
          return await this.provideEnhancedGeneralResponse(request, intentAnalysis);
      }
    } catch (error) {
      console.error('OpenAI intent analysis failed, falling back to keyword matching:', error);
      
      // Fallback to original keyword-based routing
      if (this.isAssessmentRequest(messageText)) {
        return await this.coordinateAssessment(request);
      } else if (this.isCourseRequest(messageText)) {
        return await this.coordinateCourseRecommendation(request);
      } else if (this.isLearningGuidanceRequest(messageText)) {
        return await this.provideLearningGuidance(request);
      } else {
        return await this.provideGeneralResponse(request);
      }
    }
  }
  
  /**
   * Handle conversation start - welcome user and explain capabilities
   */
  private async handleConversationStart(request: AgentRequest): Promise<AgentResponse> {
    const welcomeMessage = `Hello! I'm your AI Learning Assistant, and I'm here to help you discover and develop your skills. 

I work with a team of specialized AI agents to provide you with:

🎯 **Skill Assessment**: I can evaluate your current competency and capability levels across various domains
📚 **Course Recommendations**: I'll match you with the most relevant courses based on your skill gaps and learning goals
🚀 **Learning Guidance**: I'll help you create personalized learning paths and achieve your career objectives

**How can I help you today?**
- Type "assess my skills" to take a skill evaluation
- Ask for "course recommendations" to discover learning opportunities
- Say "help me learn" for learning strategy guidance

What would you like to start with?`;

    return this.createResponse(
      request.id,
      'conversation_start_response',
      {
        message: welcomeMessage,
        agent: AgentType.SKILL_COACH,
        capabilities: this.getCapabilities(),
        suggestedActions: [
          'assess my skills',
          'recommend courses',
          'help me learn',
          'set learning goals'
        ]
      }
    );
  }
  
  /**
   * Coordinate with Skill Assessor Agent for assessment requests
   */
  private async coordinateAssessment(request: AgentRequest): Promise<AgentResponse> {
    try {
      const userMessage = String(request.payload.message);
      
      // Generate personalized assessment introduction using OpenAI
      const context = `You are a skill development coach introducing a comprehensive skill assessment. 
                      The user said: "${userMessage}".
                      Explain the assessment in an encouraging, personalized way that addresses their specific interest.
                      Mention that the assessment evaluates both Competency (knowledge/learning) and Capability (experience/application) 
                      on a 4-point scale (0=Foundational, 1=Intermediate, 2=Advanced, 3=Mastery).
                      Keep it concise but motivating.`;
      
      const personalizedIntro = await this.openAIService.generateChatCompletion([
        { role: 'system', content: context },
        { role: 'user', content: userMessage }
      ]);
      
      const assessmentMessage = `📊 **Skill Assessment Ready**

${personalizedIntro}

**Assessment Framework:**
• **Competency (Knowledge & Learning):** Problem-solving, adaptability, teaching ability
• **Capability (Experience & Application):** Real-world experience, consistency, performance under pressure

Ready to discover your skill profile?`;

      return this.createResponse(
        request.id,
        'assessment_coordination',
        {
          message: assessmentMessage,
          agent: AgentType.SKILL_COACH,
          triggerAssessment: true,
          rightPanelContent: {
            type: 'skill_assessment',
            title: 'Interactive Skill Assessment',
            description: 'Complete this 10-question assessment to understand your current skill levels'
          },
          suggestions: [
            'Start the assessment',
            'Learn more about the framework',
            'Skip to course recommendations'
          ]
        }
      );
    } catch (error) {
      console.error('OpenAI assessment introduction failed:', error);
      
      // Fallback to standard message
      const assessmentMessage = `📊 **Skill Assessor Agent activated**

I'll help you evaluate your current skills across two key dimensions:

**Competency (Knowledge & Learning):**
• Ability to explain concepts to others
• Problem-solving effectiveness  
• Independence in application
• Adaptability to new contexts
• Recognition as a knowledge source

**Capability (Experience & Application):**
• Years of relevant experience
• Consistency in real workplace conditions
• Performance under pressure
• Exposure across diverse scenarios
• Frequency of professional application

The assessment uses a 4-point scale: 0=Foundational, 1=Intermediate, 2=Advanced, 3=Mastery. Your responses will be plotted on a 2D map to identify your skill profile and recommend appropriate learning paths.

Ready to start your skill assessment?`;

      return this.createResponse(
        request.id,
        'assessment_coordination',
        {
          message: assessmentMessage,
          agent: AgentType.SKILL_COACH,
          triggerAssessment: true,
          rightPanelContent: {
            type: 'skill_assessment',
            title: 'Interactive Skill Assessment',
            description: 'Complete this 10-question assessment to understand your current skill levels'
          },
          suggestions: [
            'Start the assessment',
            'Learn more about the framework', 
            'Skip to course recommendations'
          ]
        }
      );
    }
  }
  
  /**
   * Coordinate with Course Matcher Agent for course recommendations
   */
  private async coordinateCourseRecommendation(request: AgentRequest): Promise<AgentResponse> {
    try {
      const userMessage = String(request.payload.message);
      
      // Generate personalized course introduction using OpenAI
      const context = `You are a skill development coach introducing course recommendations. 
                      The user said: "${userMessage}".
                      Provide a personalized, encouraging response about finding the right courses for their goals.
                      Mention that you have access to 761 real courses across multiple categories.
                      Keep it concise and motivating.`;
      
      const personalizedIntro = await this.openAIService.generateChatCompletion([
        { role: 'system', content: context },
        { role: 'user', content: userMessage }
      ]);
      
      const courseMessage = `📚 **Course Matcher Agent Ready**

${personalizedIntro}

**Our Course Database:**
✅ 761 real courses from top providers
✅ Multiple skill levels and career paths
✅ Industry-aligned learning objectives

**Popular Categories:**
• Technology & Programming
• Data Science & Analytics  
• Business & Management
• Creative & Design
• Health & Wellness

What skills would you like to develop?`;

      return this.createResponse(
        request.id,
        'course_coordination',
        {
          message: courseMessage,
          agent: AgentType.SKILL_COACH,
          rightPanelContent: {
            type: 'course_browser',
            title: 'Browse 761+ Courses',
            description: 'Explore our comprehensive course database'
          },
          suggestions: [
            'Show me technology courses',
            'Find data science courses',
            'Recommend courses for my skill level',
            'Create a learning path'
          ]
        }
      );
    } catch (error) {
      console.error('OpenAI course introduction failed:', error);
      
      // Fallback to standard message  
      const courseMessage = `📚 **Course Matcher Agent activated**

Based on your interests, I've curated some learning recommendations. These courses are selected based on current industry demands and career progression paths.

I can also create a personalized learning plan once you complete the skill assessment. This will help me recommend courses that specifically target your skill gaps and learning objectives.

**Available Course Categories:**
• Technology & Programming
• Data Science & Analytics  
• Business & Management
• Creative & Design
• Health & Wellness

What type of skills are you most interested in developing?`;

      return this.createResponse(
        request.id,
        'course_coordination',
        {
          message: courseMessage,
          agent: AgentType.SKILL_COACH,
          rightPanelContent: {
            type: 'course_browser',
            title: 'Browse 761+ Courses',
            description: 'Explore our comprehensive course database'
          },
          suggestions: [
            'Show me technology courses',
            'Find data science courses', 
            'Recommend courses for my skill level',
            'Create a learning path'
          ]
        }
      );
    }
  }
  
  /**
   * Provide learning guidance and strategy advice
   */
  private async provideLearningGuidance(request: AgentRequest): Promise<AgentResponse> {
    const guidanceMessage = `🎯 **Skill Coach Agent activated**

Let me help you plan your career development journey. I've created a career planning framework to guide your learning path.

To give you the best guidance, I'd like to understand:
• Your current role and experience level
• Your target career goals
• Your preferred timeline for advancement
• Your available time for learning

**Learning Strategy Framework:**
1. **Assess Current State** - Understand your skill baseline
2. **Define Goals** - Set clear, measurable learning objectives  
3. **Identify Gaps** - Find the difference between current and target skills
4. **Create Plan** - Design a structured learning pathway
5. **Execute & Track** - Follow the plan and monitor progress

What position are you aiming to reach in the next 2-3 years?`;

    return this.createResponse(
      request.id,
      'learning_guidance',
      {
        message: guidanceMessage,
        agent: AgentType.SKILL_COACH,
        rightPanelContent: {
          type: 'career_planning',
          title: 'Career Development Framework',
          currentLevel: 'To be determined',
          targetLevel: 'To be specified', 
          timeline: '2-3 years'
        },
        contentType: 'planning'
      }
    );
  }
  
  /**
   * Provide enhanced general response using OpenAI
   */
  private async provideEnhancedGeneralResponse(request: AgentRequest, intentAnalysis: IntentAnalysis): Promise<AgentResponse> {
    try {
      const userMessage = String(request.payload.message);
      const context = `You are a helpful skill development coach. The user said: "${userMessage}". 
                      Intent analysis: ${JSON.stringify(intentAnalysis)}.
                      Provide a helpful, encouraging response that guides them toward skill assessment or course recommendations.
                      Keep the response concise and actionable.`;
      
      const aiResponse = await this.openAIService.generateChatCompletion([
        { role: 'system', content: context },
        { role: 'user', content: userMessage }
      ]);
      
      return this.createResponse(
        request.id,
        'enhanced_general_response',
        {
          message: aiResponse,
          agent: AgentType.SKILL_COACH,
          intent: intentAnalysis.intent,
          confidence: intentAnalysis.confidence,
          suggestions: [
            "Take a skill assessment to identify learning opportunities",
            "Explore course recommendations based on your goals", 
            "Ask for specific learning guidance in any skill area"
          ]
        }
      );
    } catch (error) {
      console.error('Enhanced response generation failed:', error);
      // Fallback to basic response
      return await this.provideGeneralResponse(request);
    }
  }
  
  /**
   * Provide general responses for other queries
   */
  private async provideGeneralResponse(request: AgentRequest): Promise<AgentResponse> {
    const { message } = request.payload;
    const messageText = String(message).toLowerCase();
    
    let responseMessage = '';
    
    if (messageText.includes('hello') || messageText.includes('hi')) {
      responseMessage = `Hello! I'm your AI Learning Assistant. I'm here to help you discover and develop your skills through personalized assessments and course recommendations. How can I assist you today?`;
    } else if (messageText.includes('help')) {
      responseMessage = `I can help you with:

🎯 **Skill Assessment** - Evaluate your current competency and capability levels
📚 **Course Recommendations** - Find relevant courses based on your skill gaps  
🚀 **Learning Guidance** - Create personalized learning paths and career planning

Try saying:
• "assess my skills" to start an evaluation
• "recommend courses" to discover learning opportunities
• "help me learn" for learning strategy guidance

What would you like to explore?`;
    } else {
      responseMessage = `I understand you're interested in learning and skill development. Let me help you get started:

• For **skill evaluation**, say "assess my skills"
• For **course recommendations**, ask "what courses should I take?"
• For **learning guidance**, say "help me plan my learning"

Which area would you like to focus on first?`;
    }
    
    return this.createResponse(
      request.id,
      'general_response',
      {
        message: responseMessage,
        agent: AgentType.SKILL_COACH,
        suggestions: [
          'assess my skills',
          'recommend courses', 
          'help me learn',
          'set learning goals'
        ]
      }
    );
  }
  
  /**
   * Handle specific assessment requests
   */
  private async handleAssessmentRequest(request: AgentRequest): Promise<AgentResponse> {
    // This will be called when other agents need to trigger an assessment
    return await this.coordinateAssessment(request);
  }
  
  /**
   * Handle specific course requests
   */
  private async handleCourseRequest(request: AgentRequest): Promise<AgentResponse> {
    // This will be called when other agents need to trigger course recommendations
    return await this.coordinateCourseRecommendation(request);
  }
  
  /**
   * Handle learning guidance requests
   */
  private async handleLearningGuidance(request: AgentRequest): Promise<AgentResponse> {
    return await this.provideLearningGuidance(request);
  }
  
  // Helper methods for intent recognition
  private isAssessmentRequest(message: string): boolean {
    const assessmentKeywords = [
      'assess', 'assessment', 'evaluate', 'evaluation', 'test', 'quiz',
      'skill', 'skills', 'competency', 'capability', 'level', 'proficiency'
    ];
    return assessmentKeywords.some(keyword => message.includes(keyword));
  }
  
  private isCourseRequest(message: string): boolean {
    const courseKeywords = [
      'course', 'courses', 'learn', 'learning', 'training', 'education',
      'recommend', 'recommendation', 'suggest', 'class', 'tutorial'
    ];
    return courseKeywords.some(keyword => message.includes(keyword));
  }
  
  private isLearningGuidanceRequest(message: string): boolean {
    const guidanceKeywords = [
      'plan', 'planning', 'strategy', 'guidance', 'help', 'advice',
      'career', 'goal', 'goals', 'path', 'journey', 'roadmap'
    ];
    return guidanceKeywords.some(keyword => message.includes(keyword));
  }
  
  /**
   * Set references to other agents for coordination
   */
  public setAgentReferences(skillAssessor?: IAgent, courseMatcher?: IAgent): void {
    this.skillAssessorAgent = skillAssessor;
    this.courseMatcherAgent = courseMatcher;
  }
  
  /**
   * Set session manager reference
   */
  public setSessionManager(sessionManager: Record<string, unknown>): void {
    this.sessionManager = sessionManager;
  }
  
  public async cleanup(): Promise<void> {
    await super.cleanup();
    this.skillAssessorAgent = undefined;
    this.courseMatcherAgent = undefined;
    this.sessionManager = null;
  }
}

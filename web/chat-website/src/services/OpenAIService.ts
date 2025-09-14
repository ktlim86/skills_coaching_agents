import OpenAI from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * OpenAI Service - Handles all OpenAI API interactions
 * Provides a clean interface for the agents to use AI capabilities
 */
export class OpenAIService {
  private openai: OpenAI;
  private defaultModel: string;
  private defaultTemperature: number;
  private defaultMaxTokens: number;

  constructor(config: OpenAIConfig) {
    this.openai = new OpenAI({
      apiKey: config.apiKey,
    });
    
    this.defaultModel = config.model || 'gpt-4o-mini';
    this.defaultTemperature = config.temperature || 0.7;
    this.defaultMaxTokens = config.maxTokens || 1000;
  }

  /**
   * Generate a chat completion using OpenAI
   */
  async generateChatCompletion(
    messages: ChatMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<OpenAIResponse> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: options?.model || this.defaultModel,
        messages: messages,
        temperature: options?.temperature || this.defaultTemperature,
        max_tokens: options?.maxTokens || this.defaultMaxTokens,
        stream: false, // Force non-streaming for consistent response type
      });

      // Type guard to ensure we have a ChatCompletion (not a stream)
      if ('choices' in completion) {
        const choice = completion.choices[0];
        if (!choice.message.content) {
          throw new Error('No content in OpenAI response');
        }

        return {
          content: choice.message.content,
          usage: completion.usage ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          } : undefined
        };
      } else {
        throw new Error('Received streaming response when non-streaming was expected');
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate enhanced natural language responses
   */
  async generateNaturalResponse(
    userMessage: string,
    context: string,
    agentRole: string,
    systemPrompt?: string
  ): Promise<string> {
    const defaultSystemPrompt = `You are ${agentRole}, an AI assistant specialized in learning and skill development. 
Your responses should be:
- Conversational and friendly
- Helpful and actionable
- Focused on learning and career development
- Clear and easy to understand

Context: ${context}`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt || defaultSystemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await this.generateChatCompletion(messages, {
      temperature: 0.8,
      maxTokens: 500
    });

    return response.content;
  }

  /**
   * Analyze user intent from their message
   */
  async analyzeUserIntent(
    userMessage: string,
    availableIntents: string[]
  ): Promise<{
    intent: string;
    confidence: number;
    extractedInfo?: Record<string, unknown>;
  }> {
    const systemPrompt = `You are an intent classification system. Analyze the user's message and classify it into one of these intents:
${availableIntents.map(intent => `- ${intent}`).join('\n')}

Respond with a JSON object containing:
- intent: the most likely intent from the list
- confidence: a number between 0 and 1 indicating confidence
- extractedInfo: any relevant information extracted from the message

Be precise and only choose from the provided intents.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.generateChatCompletion(messages, {
      temperature: 0.1,
      maxTokens: 200
    });

    try {
      const parsed = JSON.parse(response.content);
      return {
        intent: parsed.intent || 'unknown',
        confidence: parsed.confidence || 0.5,
        extractedInfo: parsed.extractedInfo || {}
      };
    } catch (error) {
      console.error('Failed to parse intent analysis:', error);
      return {
        intent: 'unknown',
        confidence: 0.1,
        extractedInfo: {}
      };
    }
  }

  /**
   * Generate skill gap explanations and recommendations
   */
  async generateSkillGapExplanation(
    skillGaps: Array<{
      area: string;
      currentLevel: number;
      recommendedLevel: number;
      priority: string;
    }>,
    userQuadrant: string
  ): Promise<string> {
    const systemPrompt = `You are a skill development expert. Generate a clear, encouraging explanation of skill gaps and provide actionable recommendations.

Focus on:
- Explaining what each skill gap means in practical terms
- Why addressing these gaps is important for career growth
- Specific steps the user can take to improve
- Encouraging tone that motivates learning

User's skill profile: ${userQuadrant}`;

    const gapsSummary = skillGaps.map(gap => 
      `${gap.area}: Current level ${gap.currentLevel}, Target level ${gap.recommendedLevel} (${gap.priority} priority)`
    ).join('\n');

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please explain these skill gaps and provide recommendations:\n${gapsSummary}` }
    ];

    const response = await this.generateChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 600
    });

    return response.content;
  }

  /**
   * Generate course recommendation explanations
   */
  async generateCourseExplanation(
    courses: Array<{
      title: string;
      description: string;
      provider: string;
      difficulty_level: string;
      duration_hours: number;
      relevanceScore: number;
      reasoning: string;
    }>,
    userContext: string
  ): Promise<string> {
    const systemPrompt = `You are a learning advisor. Explain why these courses are recommended for the user and how they address their learning needs.

Make the explanation:
- Personalized to the user's context
- Clear about how each course helps with their goals
- Encouraging and motivating
- Practical with next steps

User context: ${userContext}`;

    const coursesSummary = courses.map(course => 
      `${course.title} (${course.provider}, ${course.difficulty_level}, ${course.duration_hours}h) - Relevance: ${course.relevanceScore.toFixed(2)} - ${course.reasoning}`
    ).join('\n\n');

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please explain why these courses are recommended:\n\n${coursesSummary}` }
    ];

    const response = await this.generateChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 700
    });

    return response.content;
  }

  /**
   * Generate learning path explanations
   */
  async generateLearningPathExplanation(
    learningPath: {
      title: string;
      description: string;
      courses: Array<{ title: string; difficulty_level: string; duration_hours: number }>;
      estimatedDuration: number;
      progressionLevel: string;
    },
    userQuadrant: string
  ): Promise<string> {
    const systemPrompt = `You are a career development coach. Explain this learning path and how it's structured to help the user progress effectively.

Focus on:
- Why this sequence of courses makes sense
- How it addresses their current skill level (${userQuadrant})
- Expected progression and outcomes
- Encouraging motivation for the journey ahead

Keep it conversational and inspiring.`;

    const pathSummary = `Learning Path: ${learningPath.title}
Description: ${learningPath.description}
Total Duration: ${learningPath.estimatedDuration} hours
Progression Level: ${learningPath.progressionLevel}

Course Sequence:
${learningPath.courses.map((course, index) => 
  `${index + 1}. ${course.title} (${course.difficulty_level}, ${course.duration_hours}h)`
).join('\n')}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please explain this learning path:\n\n${pathSummary}` }
    ];

    const response = await this.generateChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 600
    });

    return response.content;
  }

  /**
   * Health check for OpenAI service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.generateChatCompletion([
        { role: 'user', content: 'Hello' }
      ], {
        maxTokens: 10
      });
      return response.content.length > 0;
    } catch (error) {
      console.error('OpenAI health check failed:', error);
      return false;
    }
  }
}

// Singleton instance for the application
let openAIServiceInstance: OpenAIService | null = null;

export function getOpenAIService(): OpenAIService {
  if (!openAIServiceInstance) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please set OPENAI_API_KEY or NEXT_PUBLIC_OPENAI_API_KEY environment variable.');
    }

    openAIServiceInstance = new OpenAIService({
      apiKey,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000
    });
  }

  return openAIServiceInstance;
}

export function setOpenAIService(service: OpenAIService): void {
  openAIServiceInstance = service;
}

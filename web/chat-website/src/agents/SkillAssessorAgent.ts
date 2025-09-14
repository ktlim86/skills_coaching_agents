import { 
  BaseAgent, 
  AgentType, 
  AgentCapability, 
  AgentRequest, 
  AgentResponse,
  AssessmentResponse,
  AssessmentResults,
  SkillQuadrant,
  SkillGap
} from './BaseAgent';
import { OpenAIService, getOpenAIService } from '../services/OpenAIService';

/**
 * Skill Assessor Agent - Processes assessment results and analyzes skill gaps
 * Specialized in competency/capability evaluation and quadrant determination
 */
export class SkillAssessorAgent extends BaseAgent {
  private openAIService!: OpenAIService;
  
  constructor() {
    const capabilities: AgentCapability[] = [
      {
        name: 'assessment_processing',
        description: 'Process quiz responses and calculate competency/capability scores',
        inputTypes: ['assessment_responses', 'quiz_data'],
        outputTypes: ['assessment_results', 'skill_scores']
      },
      {
        name: 'score_calculation',
        description: 'Calculate competency and capability scores from assessment data',
        inputTypes: ['raw_scores', 'response_data'],
        outputTypes: ['competency_score', 'capability_score', 'overall_score']
      },
      {
        name: 'quadrant_analysis',
        description: 'Determine skill quadrant placement based on scores',
        inputTypes: ['competency_score', 'capability_score'],
        outputTypes: ['skill_quadrant', 'quadrant_analysis']
      },
      {
        name: 'gap_analysis',
        description: 'Identify skill gaps and improvement recommendations',
        inputTypes: ['assessment_results', 'target_profile'],
        outputTypes: ['skill_gaps', 'improvement_recommendations']
      }
    ];
    
    super('SkillAssessor', AgentType.SKILL_ASSESSOR, capabilities);
  }
  
  public async initialize(): Promise<void> {
    try {
      this.openAIService = getOpenAIService();
      this.updateStatus('ready');
      console.log('Skill Assessor Agent initialized with OpenAI service');
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
        case 'process_assessment':
          response = await this.processAssessmentResults(request);
          break;
          
        case 'calculate_scores':
          response = await this.calculateScores(request);
          break;
          
        case 'determine_quadrant':
          response = await this.determineQuadrant(request);
          break;
          
        case 'analyze_gaps':
          response = await this.analyzeSkillGaps(request);
          break;
          
        case 'generate_report':
          response = await this.generateAssessmentReport(request);
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
   * Process complete assessment results from quiz responses
   */
  private async processAssessmentResults(request: AgentRequest): Promise<AgentResponse> {
    const { responses } = request.payload as { responses: AssessmentResponse[] };
    
    if (!responses || !Array.isArray(responses) || responses.length !== 10) {
      return this.createResponse(
        request.id,
        'assessment_error',
        { message: 'Invalid assessment responses. Expected 10 responses.' },
        false,
        { code: 'INVALID_RESPONSES', message: 'Assessment must contain exactly 10 responses' }
      );
    }
    
    // Calculate scores
    const competencyScore = this.calculateCompetencyScore(responses);
    const capabilityScore = this.calculateCapabilityScore(responses);
    
    // Determine quadrant
    const quadrant = this.getSkillQuadrant(competencyScore, capabilityScore);
    
    // Analyze skill gaps
    const skillGaps = this.identifySkillGaps(responses, competencyScore, capabilityScore);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(quadrant, skillGaps);
    
    // Generate AI-powered explanations
    let aiExplanation = '';
    let personalizedInsights = '';
    
    try {
      aiExplanation = await this.openAIService.generateSkillGapExplanation(
        skillGaps,
        quadrant
      );
      
      // Generate personalized insights based on the specific responses
      personalizedInsights = await this.generatePersonalizedInsights(responses, competencyScore, capabilityScore);
      
    } catch (error) {
      console.error('Failed to generate AI explanations:', error);
      aiExplanation = 'Based on your assessment, we\'ve identified specific areas for skill development.';
      personalizedInsights = 'Your assessment responses show unique patterns that can guide your learning journey.';
    }

    const results: AssessmentResults = {
      competencyScore,
      capabilityScore,
      quadrant,
      skillGaps,
      recommendations,
      completedAt: new Date(),
      aiExplanation,
      personalizedInsights
    };

    return this.createResponse(
      request.id,
      'assessment_results',
      {
        results,
        summary: this.generateResultsSummary(results),
        nextSteps: this.getNextSteps(quadrant),
        aiInsights: {
          explanation: aiExplanation,
          insights: personalizedInsights,
          quadrantDescription: this.getQuadrantDescription(quadrant)
        }
      }
    );
  }
  
  /**
   * Calculate competency score from assessment responses
   */
  private calculateCompetencyScore(responses: AssessmentResponse[]): number {
    const competencyResponses = responses.filter(r => r.questionId.startsWith('comp_'));
    
    if (competencyResponses.length !== 5) {
      throw new Error('Expected 5 competency responses');
    }
    
    const totalScore = competencyResponses.reduce((sum, response) => sum + response.score, 0);
    return totalScore / competencyResponses.length; // Average score 0-3
  }
  
  /**
   * Calculate capability score from assessment responses
   */
  private calculateCapabilityScore(responses: AssessmentResponse[]): number {
    const capabilityResponses = responses.filter(r => r.questionId.startsWith('cap_'));
    
    if (capabilityResponses.length !== 5) {
      throw new Error('Expected 5 capability responses');
    }
    
    const totalScore = capabilityResponses.reduce((sum, response) => sum + response.score, 0);
    return totalScore / capabilityResponses.length; // Average score 0-3
  }
  
  /**
   * Determine skill quadrant based on competency and capability scores
   */
  private getSkillQuadrant(competencyScore: number, capabilityScore: number): SkillQuadrant {
    const competencyThreshold = 1.5; // Mid-point between 0-3 scale
    const capabilityThreshold = 1.5;
    
    const highCompetency = competencyScore >= competencyThreshold;
    const highCapability = capabilityScore >= capabilityThreshold;
    
    if (highCompetency && highCapability) {
      return SkillQuadrant.EXPERT_PRACTITIONER;
    } else if (!highCompetency && highCapability) {
      return SkillQuadrant.NATURAL_DOER;
    } else if (!highCompetency && !highCapability) {
      return SkillQuadrant.EMERGING_TALENT;
    } else {
      return SkillQuadrant.THEORIST;
    }
  }
  
  /**
   * Identify specific skill gaps based on assessment responses
   */
  private identifySkillGaps(
    responses: AssessmentResponse[], 
    competencyScore: number, 
    capabilityScore: number
  ): SkillGap[] {
    const gaps: SkillGap[] = [];
    
    // Analyze individual question responses for specific gaps
    responses.forEach(response => {
      if (response.score < 2) { // Scores below "Advanced" level indicate gaps
        const area = this.getSkillAreaFromQuestionId(response.questionId);
        const priority = response.score === 0 ? 'high' : response.score === 1 ? 'medium' : 'low';
        
        gaps.push({
          area,
          currentLevel: response.score,
          recommendedLevel: Math.min(response.score + 1, 3),
          priority,
          description: this.getGapDescription(response.questionId, response.score)
        });
      }
    });
    
    // Add overall competency/capability gaps if scores are low
    if (competencyScore < 2.0) {
      gaps.push({
        area: 'Overall Competency (Knowledge & Learning)',
        currentLevel: competencyScore,
        recommendedLevel: 2.5,
        priority: 'high',
        description: 'Focus on theoretical knowledge, formal learning, and ability to explain concepts to others'
      });
    }
    
    if (capabilityScore < 2.0) {
      gaps.push({
        area: 'Overall Capability (Experience & Application)',
        currentLevel: capabilityScore,
        recommendedLevel: 2.5,
        priority: 'high',
        description: 'Gain more hands-on experience, practice in real scenarios, and build confidence under pressure'
      });
    }
    
    return gaps.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  /**
   * Generate skill area name from question ID
   */
  private getSkillAreaFromQuestionId(questionId: string): string {
    const skillAreas: Record<string, string> = {
      'comp_1': 'Knowledge Explanation & Teaching',
      'comp_2': 'Problem-Solving Application',
      'comp_3': 'Independent Skill Usage',
      'comp_4': 'Adaptability & Context Switching',
      'comp_5': 'Recognition as Knowledge Source',
      'cap_1': 'Years of Experience',
      'cap_2': 'Workplace Performance Consistency',
      'cap_3': 'Performance Under Pressure',
      'cap_4': 'Diverse Scenario Exposure',
      'cap_5': 'Regular Professional Usage'
    };
    
    return skillAreas[questionId] || questionId;
  }
  
  /**
   * Generate gap description based on question and score
   */
  private getGapDescription(questionId: string, score: number): string {
    const descriptions: Record<string, Record<number, string>> = {
      'comp_1': {
        0: 'Develop ability to explain concepts clearly to others',
        1: 'Improve teaching and knowledge transfer skills'
      },
      'comp_2': {
        0: 'Build problem-solving skills and practical application abilities',
        1: 'Enhance effectiveness in applying skills to solve typical problems'
      },
      'comp_3': {
        0: 'Work towards independent skill application without supervision',
        1: 'Increase autonomy and self-sufficiency in skill usage'
      },
      'comp_4': {
        0: 'Develop adaptability to apply skills in new contexts',
        1: 'Improve flexibility in handling unfamiliar or complex situations'
      },
      'comp_5': {
        0: 'Build expertise to become a go-to resource for others',
        1: 'Increase recognition as a knowledgeable source in this area'
      },
      'cap_1': {
        0: 'Gain more hands-on experience applying this skill',
        1: 'Continue building experience through regular practice'
      },
      'cap_2': {
        0: 'Develop consistency in real workplace performance',
        1: 'Improve reliability and success rate in professional settings'
      },
      'cap_3': {
        0: 'Build confidence to perform under pressure situations',
        1: 'Enhance ability to maintain performance in high-stakes scenarios'
      },
      'cap_4': {
        0: 'Seek exposure to diverse scenarios requiring this skill',
        1: 'Expand experience across different contexts and challenges'
      },
      'cap_5': {
        0: 'Increase regular usage of this skill in professional roles',
        1: 'Make this skill a more central part of your work activities'
      }
    };
    
    return descriptions[questionId]?.[score] || `Improve performance from level ${score}`;
  }
  
  /**
   * Generate recommendations based on quadrant and skill gaps
   */
  private generateRecommendations(quadrant: SkillQuadrant, skillGaps: SkillGap[]): string[] {
    const recommendations: string[] = [];
    
    // Quadrant-specific recommendations
    switch (quadrant) {
      case SkillQuadrant.EXPERT_PRACTITIONER:
        recommendations.push(
          'Continue advancing your expertise through advanced courses and certifications',
          'Consider mentoring others and sharing your knowledge',
          'Explore leadership opportunities in your field',
          'Stay updated with latest industry trends and innovations'
        );
        break;
        
      case SkillQuadrant.NATURAL_DOER:
        recommendations.push(
          'Strengthen theoretical foundation through formal learning',
          'Take structured courses to complement your practical experience',
          'Document and codify your practical knowledge',
          'Pursue certifications to validate your hands-on expertise'
        );
        break;
        
      case SkillQuadrant.EMERGING_TALENT:
        recommendations.push(
          'Start with foundational courses to build both theory and practice',
          'Seek mentorship from experienced practitioners',
          'Look for entry-level opportunities to gain hands-on experience',
          'Join communities and forums to learn from others'
        );
        break;
        
      case SkillQuadrant.THEORIST:
        recommendations.push(
          'Seek practical application opportunities for your knowledge',
          'Find internships, projects, or volunteer work to gain experience',
          'Practice applying concepts in real-world scenarios',
          'Connect with practitioners to learn applied techniques'
        );
        break;
    }
    
    // Gap-specific recommendations
    const highPriorityGaps = skillGaps.filter(gap => gap.priority === 'high');
    if (highPriorityGaps.length > 0) {
      recommendations.push(
        `Focus on high-priority skill gaps: ${highPriorityGaps.map(gap => gap.area).join(', ')}`,
        'Consider courses that address multiple skill gaps simultaneously'
      );
    }
    
    return recommendations;
  }
  
  /**
   * Generate a summary of assessment results
   */
  private generateResultsSummary(results: AssessmentResults): string {
    const quadrantDescriptions = {
      [SkillQuadrant.EXPERT_PRACTITIONER]: 'Expert Practitioner - High knowledge with extensive practical experience',
      [SkillQuadrant.NATURAL_DOER]: 'Natural Doer - Strong practical skills with room to grow theoretical knowledge',
      [SkillQuadrant.EMERGING_TALENT]: 'Emerging Talent - Building both knowledge and experience foundations',
      [SkillQuadrant.THEORIST]: 'Theorist - Strong theoretical knowledge seeking practical application'
    };
    
    return `Your skill profile: ${quadrantDescriptions[results.quadrant]}
    
Competency Score: ${results.competencyScore.toFixed(1)}/3.0 (Knowledge & Learning)
Capability Score: ${results.capabilityScore.toFixed(1)}/3.0 (Experience & Application)

${results.skillGaps.length} skill gaps identified with actionable improvement recommendations.`;
  }
  
  /**
   * Get next steps based on quadrant
   */
  private getNextSteps(quadrant: SkillQuadrant): string[] {
    const nextSteps: Record<SkillQuadrant, string[]> = {
      [SkillQuadrant.EXPERT_PRACTITIONER]: [
        'Explore advanced specialization courses',
        'Consider leadership and mentoring training',
        'Look into industry certifications for your expertise'
      ],
      [SkillQuadrant.NATURAL_DOER]: [
        'Take foundational theory courses in your strong areas',
        'Pursue formal certifications to validate your experience',
        'Consider courses in knowledge management and documentation'
      ],
      [SkillQuadrant.EMERGING_TALENT]: [
        'Start with beginner-friendly comprehensive courses',
        'Look for courses with strong practical components',
        'Seek mentorship or guided learning programs'
      ],
      [SkillQuadrant.THEORIST]: [
        'Find courses with hands-on labs and practical exercises',
        'Look for internship or project-based learning opportunities',
        'Consider applied or case-study focused training'
      ]
    };
    
    return nextSteps[quadrant] || [];
  }
  
  /**
   * Handle individual score calculation requests
   */
  private async calculateScores(request: AgentRequest): Promise<AgentResponse> {
    const { responses } = request.payload as { responses: AssessmentResponse[] };
    
    const competencyScore = this.calculateCompetencyScore(responses);
    const capabilityScore = this.calculateCapabilityScore(responses);
    
    return this.createResponse(
      request.id,
      'scores_calculated',
      {
        competencyScore,
        capabilityScore,
        overallScore: (competencyScore + capabilityScore) / 2
      }
    );
  }
  
  /**
   * Handle quadrant determination requests
   */
  private async determineQuadrant(request: AgentRequest): Promise<AgentResponse> {
    const { competencyScore, capabilityScore } = request.payload;
    
    const quadrant = this.getSkillQuadrant(
      Number(competencyScore), 
      Number(capabilityScore)
    );
    
    return this.createResponse(
      request.id,
      'quadrant_determined',
      {
        quadrant,
        description: this.getQuadrantDescription(quadrant)
      }
    );
  }
  
  /**
   * Handle skill gap analysis requests
   */
  private async analyzeSkillGaps(request: AgentRequest): Promise<AgentResponse> {
    const { responses, competencyScore, capabilityScore } = request.payload;
    
    const skillGaps = this.identifySkillGaps(
      responses as AssessmentResponse[], 
      Number(competencyScore), 
      Number(capabilityScore)
    );
    
    return this.createResponse(
      request.id,
      'gaps_analyzed',
      {
        skillGaps,
        priorityGaps: skillGaps.filter(gap => gap.priority === 'high'),
        improvementPlan: this.createImprovementPlan(skillGaps)
      }
    );
  }
  
  /**
   * Generate comprehensive assessment report
   */
  private async generateAssessmentReport(request: AgentRequest): Promise<AgentResponse> {
    const { responses } = request.payload as { responses: AssessmentResponse[] };
    
    const fullResults = await this.processAssessmentResults({
      ...request,
      type: 'process_assessment'
    });
    
    return this.createResponse(
      request.id,
      'assessment_report',
      {
        ...fullResults.payload,
        reportGenerated: new Date(),
        detailedAnalysis: this.generateDetailedAnalysis(responses)
      }
    );
  }
  
  private getQuadrantDescription(quadrant: SkillQuadrant): string {
    const descriptions = {
      [SkillQuadrant.EXPERT_PRACTITIONER]: 'You have both strong theoretical knowledge and extensive practical experience. You are recognized as an expert in your field.',
      [SkillQuadrant.NATURAL_DOER]: 'You have excellent hands-on experience but could benefit from strengthening your theoretical foundation.',
      [SkillQuadrant.EMERGING_TALENT]: 'You are in the early stages of skill development, building both knowledge and experience.',
      [SkillQuadrant.THEORIST]: 'You have strong theoretical knowledge but need more practical application experience.'
    };
    
    return descriptions[quadrant];
  }
  
  private createImprovementPlan(skillGaps: SkillGap[]): {
    immediate: SkillGap[];
    shortTerm: SkillGap[];
    longTerm: SkillGap[];
  } {
    return {
      immediate: skillGaps.filter(gap => gap.priority === 'high').slice(0, 3),
      shortTerm: skillGaps.filter(gap => gap.priority === 'medium').slice(0, 3),
      longTerm: skillGaps.filter(gap => gap.priority === 'low')
    };
  }
  
  private generateDetailedAnalysis(responses: AssessmentResponse[]): {
    responseDistribution: Record<number, number>;
    strengthAreas: string[];
    improvementAreas: string[];
    recommendedFocus: string;
  } {
    return {
      responseDistribution: this.analyzeResponseDistribution(responses),
      strengthAreas: this.identifyStrengthAreas(responses),
      improvementAreas: this.identifyImprovementAreas(responses),
      recommendedFocus: this.getRecommendedFocus(responses)
    };
  }
  
  private analyzeResponseDistribution(responses: AssessmentResponse[]): Record<number, number> {
    const distribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
    responses.forEach(response => {
      distribution[response.score as keyof typeof distribution]++;
    });
    return distribution;
  }
  
  private identifyStrengthAreas(responses: AssessmentResponse[]): string[] {
    return responses
      .filter(response => response.score >= 2)
      .map(response => this.getSkillAreaFromQuestionId(response.questionId));
  }
  
  private identifyImprovementAreas(responses: AssessmentResponse[]): string[] {
    return responses
      .filter(response => response.score < 2)
      .map(response => this.getSkillAreaFromQuestionId(response.questionId));
  }
  
  private getRecommendedFocus(responses: AssessmentResponse[]): string {
    const competencyResponses = responses.filter(r => r.questionId.startsWith('comp_'));
    const capabilityResponses = responses.filter(r => r.questionId.startsWith('cap_'));
    
    const competencyAvg = competencyResponses.reduce((sum, r) => sum + r.score, 0) / competencyResponses.length;
    const capabilityAvg = capabilityResponses.reduce((sum, r) => sum + r.score, 0) / capabilityResponses.length;
    
    if (competencyAvg < capabilityAvg) {
      return 'Focus on building theoretical knowledge and formal learning';
    } else if (capabilityAvg < competencyAvg) {
      return 'Focus on gaining practical experience and hands-on application';
    } else {
      return 'Balance both theoretical learning and practical application';
    }
  }
  
  /**
   * Generate personalized insights using OpenAI based on assessment responses
   */
  private async generatePersonalizedInsights(
    responses: AssessmentResponse[], 
    competencyScore: number, 
    capabilityScore: number
  ): Promise<string> {
    try {
      const responsePattern = responses.map(r => ({
        question: r.questionId,
        score: r.score,
        category: r.questionId.startsWith('comp_') ? 'competency' : 'capability'
      }));
      
      const context = `Based on assessment responses, generate personalized insights about learning patterns and preferences.
                      Competency Score: ${competencyScore.toFixed(2)}/3
                      Capability Score: ${capabilityScore.toFixed(2)}/3
                      Response Pattern: ${JSON.stringify(responsePattern)}
                      
                      Provide specific, actionable insights about their learning style and development preferences.`;
      
      const insights = await this.openAIService.generateChatCompletion([
        { role: 'system', content: context },
        { role: 'user', content: 'Generate personalized learning insights based on my assessment responses.' }
      ]);
      
      return insights.content;
    } catch (error) {
      console.error('Failed to generate personalized insights:', error);
      return 'Your assessment shows a unique learning profile that can guide your skill development journey.';
    }
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { SkillAssessorAgent } from '../../../src/agents/SkillAssessorAgent';

// Singleton agent instance
let skillAssessorAgent: SkillAssessorAgent | null = null;

/**
 * Skill Assessor API Endpoint
 * 
 * Processes skill assessment responses and returns AI-enhanced results
 * including detailed explanations and personalized insights
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize agent if needed
    if (!skillAssessorAgent) {
      console.log('Initializing Skill Assessor Agent with OpenAI...');
      skillAssessorAgent = new SkillAssessorAgent();
      await skillAssessorAgent.initialize();
      console.log('✅ Skill Assessor Agent ready with AI explanations');
    }

    const { responses, userId, sessionId } = req.body;

    // Validate assessment responses
    if (!responses || !Array.isArray(responses) || responses.length !== 10) {
      return res.status(400).json({ 
        error: 'Invalid assessment responses. Expected 10 responses.' 
      });
    }

    // Create agent request
    const agentRequest = {
      id: `assess_${Date.now()}`,
      type: 'process_assessment',
      payload: { responses },
      userId: userId || 'anonymous',
      sessionId: sessionId || 'default',
      timestamp: new Date()
    };

    // Process assessment with AI enhancements
    const response = await skillAssessorAgent.processRequest(agentRequest);

    if (response.success) {
      res.status(200).json({
        success: true,
        results: response.payload,
        agentName: response.agentName,
        timestamp: response.timestamp
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.error?.message || 'Assessment processing failed'
      });
    }

  } catch (error) {
    console.error('Skill Assessor API Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Usage Example:
 * 
 * POST /api/agents/skill-assessor
 * 
 * Request Body:
 * {
 *   "responses": [
 *     { "questionId": "comp_001", "score": 2, "timestamp": "2025-09-14T..." },
 *     { "questionId": "comp_002", "score": 1, "timestamp": "2025-09-14T..." },
 *     // ... 8 more responses (5 competency + 5 capability)
 *   ],
 *   "userId": "user123",
 *   "sessionId": "session456"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "results": {
 *     "results": {
 *       "competencyScore": 2.0,
 *       "capabilityScore": 2.6,
 *       "quadrant": "expert_practitioner",
 *       "skillGaps": [...],
 *       "recommendations": [...],
 *       "aiExplanation": "Based on your assessment...", // AI-generated
 *       "personalizedInsights": "Your learning pattern..." // AI-generated
 *     },
 *     "summary": "Strong capability with solid competency...",
 *     "aiInsights": {
 *       "explanation": "...",
 *       "insights": "...",
 *       "quadrantDescription": "..."
 *     }
 *   },
 *   "agentName": "SkillAssessor",
 *   "timestamp": "2025-09-14T..."
 * }
 */

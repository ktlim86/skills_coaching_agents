import { NextApiRequest, NextApiResponse } from 'next';
import { SkillCoachAgent } from '../../../src/agents/SkillCoachAgent';

// Singleton agent instance to avoid re-initialization
let skillCoachAgent: SkillCoachAgent | null = null;

/**
 * Skill Coach API Endpoint
 * 
 * Handles conversational interactions with the Skill Coach Agent
 * Includes OpenAI integration for natural language processing
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize agent if not already done
    if (!skillCoachAgent) {
      console.log('Initializing Skill Coach Agent with OpenAI...');
      skillCoachAgent = new SkillCoachAgent();
      await skillCoachAgent.initialize();
      console.log('✅ Skill Coach Agent ready with OpenAI integration');
    }

    // Extract request data
    const { message, userId, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }

    // Create agent request
    const agentRequest = {
      id: `req_${Date.now()}`,
      type: 'user_message',
      payload: { message },
      userId: userId || 'anonymous',
      sessionId: sessionId || 'default',
      timestamp: new Date()
    };

    // Process request with AI enhancement
    const response = await skillCoachAgent.processRequest(agentRequest);

    // Return the enhanced response
    res.status(200).json({
      success: true,
      response: response.payload,
      agentName: response.agentName,
      timestamp: response.timestamp
    });

  } catch (error) {
    console.error('Skill Coach API Error:', error);
    
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
 * POST /api/agents/skill-coach
 * 
 * Request Body:
 * {
 *   "message": "Hi! I'm a software developer looking to improve my skills.",
 *   "userId": "user123",
 *   "sessionId": "session456"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "response": {
 *     "message": "Hello! I'm excited to help you...", // AI-generated response
 *     "suggestions": ["Take a skill assessment", "Find courses"],
 *     "intent": "greeting",
 *     "confidence": 0.95
 *   },
 *   "agentName": "SkillCoach",
 *   "timestamp": "2025-09-14T..."
 * }
 */

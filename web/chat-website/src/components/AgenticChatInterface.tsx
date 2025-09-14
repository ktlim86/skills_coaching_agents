'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  agent?: 'skill_coach' | 'skill_assessor' | 'course_matcher';
}

interface AgenticChatInterfaceProps {
  onConversationStart?: () => void;
  onRightPanelContentChange?: (content: Record<string, unknown>, type: string) => void;
}

export default function AgenticChatInterface({ 
  onConversationStart,
  onRightPanelContentChange 
}: AgenticChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);

  // Initialize with AI greeting
  useEffect(() => {
    const greetingMessage: Message = {
      id: 'greeting-1',
      text: 'Hello! I\'m your AI learning assistant. I have three specialized agents ready to help you:\n\n🎯 **Skill Coach** - Helps identify your learning goals\n📊 **Skill Assessor** - Evaluates your current abilities\n📚 **Course Matcher** - Recommends personalized learning paths\n\nHow can I help you advance your career today?',
      sender: 'bot',
      timestamp: new Date(),
      agent: 'skill_coach'
    };
    setMessages([greetingMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    // Trigger conversation start on first user message
    if (!hasStartedConversation) {
      setHasStartedConversation(true);
      onConversationStart?.();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate agentic AI response with right panel content
    setTimeout(() => {
      const response = generateAgenticResponse(userMessage.text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        agent: response.agent
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);

      // Update right panel content based on agent response
      if (response.rightPanelContent) {
        onRightPanelContentChange?.(response.rightPanelContent, response.contentType);
      }
    }, 1500);
  };

  const generateAgenticResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // Skill Assessment keywords
    if (input.includes('assess') || input.includes('skill') || input.includes('evaluate') || input.includes('test') || 
        input.includes('quiz') || input.includes('competency') || input.includes('capability') || input.includes('level')) {
      return {
        message: '📊 **Skill Assessor Agent activated**\n\nI\'ll help you evaluate your current skills across two key dimensions:\n\n**Competency (Knowledge & Learning):**\n• Ability to explain concepts to others\n• Problem-solving effectiveness\n• Independence in application\n• Adaptability to new contexts\n• Recognition as a knowledge source\n\n**Capability (Experience & Application):**\n• Years of relevant experience\n• Consistency in real workplace conditions\n• Performance under pressure\n• Exposure across diverse scenarios\n• Frequency of professional application\n\nThe assessment uses a 4-point scale: 0=Foundational, 1=Intermediate, 2=Advanced, 3=Mastery. Your responses will be plotted on a 2D map to identify your skill profile and recommend appropriate learning paths.',
        agent: 'skill_assessor' as const,
        rightPanelContent: {
          type: 'skill_assessment',
          title: 'Interactive Skill Assessment',
          description: 'Complete this 10-question assessment to understand your current skill levels'
        },
        contentType: 'assessment'
      };
    }
    
    // Course/Learning keywords
    if (input.includes('course') || input.includes('learn') || input.includes('training') || input.includes('recommend')) {
      return {
        message: '📚 **Course Matcher Agent activated**\n\nBased on your interests, I\'ve curated some learning recommendations in the right panel. These courses are selected based on current industry demands and career progression paths.\n\nI can also create a personalized learning plan once you complete the skill assessment. What type of skills are you most interested in developing?',
        agent: 'course_matcher' as const,
        rightPanelContent: {
          type: 'course_recommendations',
          courses: [
            { title: 'Data Science Fundamentals', duration: '40 hours', level: 'Intermediate' },
            { title: 'Advanced JavaScript', duration: '25 hours', level: 'Advanced' },
            { title: 'Project Management Essentials', duration: '30 hours', level: 'Beginner' }
          ]
        },
        contentType: 'courses'
      };
    }
    
    // Career/Goal keywords
    if (input.includes('career') || input.includes('goal') || input.includes('path') || input.includes('plan')) {
      return {
        message: '🎯 **Skill Coach Agent activated**\n\nLet me help you plan your career development journey. I\'ve created a career planning framework in the right panel.\n\nTo give you the best guidance, I\'d like to understand:\n- Your current role and experience level\n- Your target career goals\n- Your preferred timeline for advancement\n\nWhat position are you aiming to reach in the next 2-3 years?',
        agent: 'skill_coach' as const,
        rightPanelContent: {
          type: 'career_planning',
          title: 'Career Development Framework',
          currentLevel: 'To be determined',
          targetLevel: 'To be specified',
          timeline: '2-3 years'
        },
        contentType: 'planning'
      };
    }
    
    // Default response
    return {
      message: '🎯 **Skill Coach responding**\n\nI understand you\'re looking for learning guidance. I can help you with:\n\n• **Skill Assessment** - Evaluate your current abilities\n• **Course Recommendations** - Find the right learning materials\n• **Career Planning** - Map out your development path\n\nWhat would you like to focus on first? You can say things like "assess my skills", "recommend courses", or "plan my career".',
      agent: 'skill_coach' as const,
      rightPanelContent: null,
      contentType: 'default'
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAgentIcon = (agent?: string) => {
    switch (agent) {
      case 'skill_coach': return '🎯';
      case 'skill_assessor': return '📊';
      case 'course_matcher': return '📚';
      default: return '🤖';
    }
  };

  const getAgentColor = (agent?: string) => {
    switch (agent) {
      case 'skill_coach': return 'from-green-500 to-blue-500';
      case 'skill_assessor': return 'from-purple-500 to-pink-500';
      case 'course_matcher': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Agentic AI Learning Assistant</h1>
            <p className="text-blue-100 text-sm">Multi-agent system for personalized learning</p>
          </div>
        </div>
      </div>

      {/* Messages Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start space-x-3 max-w-[85%]">
              {message.sender === 'bot' && (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAgentColor(message.agent)} flex items-center justify-center text-white text-sm flex-shrink-0 mt-1`}>
                  {getAgentIcon(message.agent)}
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border-2 border-gray-400 shadow-md'
                }`}
                style={{
                  color: message.sender === 'bot' ? '#000000' : undefined,
                  backgroundColor: message.sender === 'bot' ? '#ffffff' : undefined
                }}
              >
                <div className="text-sm whitespace-pre-line" style={{ color: message.sender === 'bot' ? '#000000' : undefined }}>
                  {message.text}
                </div>
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                  {message.agent && (
                    <span className="ml-2 capitalize">• {message.agent.replace('_', ' ')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="bg-gray-100 border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input Area */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex space-x-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about skill assessment, course recommendations, or career planning..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] max-h-32 text-gray-900 bg-white"
            style={{
              color: '#1f2937',
              backgroundColor: '#ffffff'
            }}
            rows={1}
            disabled={isLoading}
            aria-label="Message input"
          />
          <button
            onClick={handleSendMessage}
            disabled={inputText.trim() === '' || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
          <div className="flex space-x-4 text-xs text-gray-500">
            <span>🎯 Coach</span>
            <span>📊 Assessor</span>
            <span>📚 Matcher</span>
          </div>
        </div>
      </div>
    </div>
  );
}

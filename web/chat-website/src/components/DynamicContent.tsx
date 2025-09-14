'use client';

import { useState } from 'react';
import AssessmentQuiz from './AssessmentQuiz';

// Define interfaces for assessment results
interface AssessmentResponse {
  questionId: string;
  score: number;
}

interface AssessmentResults {
  overall: number;
  competency: number;
  capability: number;
  responses: AssessmentResponse[];
}

// Assessment Content Component
export function AssessmentContent() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizSubmit = async (responses: AssessmentResponse[]) => {
    // Process the assessment responses
    console.log('Assessment responses:', responses);
    
    // Calculate results (simplified for now)
    const competencyScores = responses.filter(r => r.questionId.startsWith('comp_'));
    const capabilityScores = responses.filter(r => r.questionId.startsWith('cap_'));
    
    const competencyAvg = competencyScores.reduce((sum, r) => sum + r.score, 0) / competencyScores.length;
    const capabilityAvg = capabilityScores.reduce((sum, r) => sum + r.score, 0) / capabilityScores.length;
    
    const results = {
      overall: (competencyAvg + capabilityAvg) / 2,
      competency: competencyAvg,
      capability: capabilityAvg,
      responses
    };
    
    setAssessmentResults(results);
    setShowQuiz(false);
  };

  const handleQuizCancel = () => {
    setShowQuiz(false);
  };

  // Show results if available
  if (assessmentResults) {
    return (
      <div className="space-y-6">
        <div className="text-center pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Assessment Results</h3>
          <p className="text-gray-600">Your skill assessment has been completed</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-medium text-green-900 mb-4">📊 Your Skill Profile</h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Overall Score</span>
                  <span className="text-lg font-bold text-green-600">
                    {(assessmentResults.overall * 33.33).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${assessmentResults.overall * 33.33}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Competency (Technical)</span>
                  <span className="text-lg font-bold text-blue-600">
                    {(assessmentResults.competency * 33.33).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${assessmentResults.competency * 33.33}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Capability (Soft Skills)</span>
                  <span className="text-lg font-bold text-purple-600">
                    {(assessmentResults.capability * 33.33).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${assessmentResults.capability * 33.33}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setAssessmentResults(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retake Assessment
            </button>
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
              Get Course Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz if started
  if (showQuiz) {
    return (
      <AssessmentQuiz 
        onSubmit={handleQuizSubmit}
        onCancel={handleQuizCancel}
      />
    );
  }

  // Show initial assessment page
  return (
    <div className="space-y-6">
      <div className="text-center pb-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Skill Assessment</h3>
        <p className="text-gray-600">Evaluate your current skills across different domains</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📊 Assessment Overview</h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-white rounded border border-blue-100">
              <div>
                <span className="text-sm font-medium block">Competency Assessment</span>
                <span className="text-xs text-gray-600">Technical skills & knowledge</span>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">5 questions</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border border-blue-100">
              <div>
                <span className="text-sm font-medium block">Capability Assessment</span>
                <span className="text-xs text-gray-600">Soft skills & adaptability</span>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">5 questions</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">⏱️ Assessment Details</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Estimated time: 5-10 minutes</li>
            <li>• 4-point rating scale (Foundational to Mastery)</li>
            <li>• Immediate results and skill profile</li>
            <li>• Personalized learning recommendations</li>
          </ul>
        </div>

        <button 
          onClick={handleStartQuiz}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
        >
          Start Skill Assessment
        </button>
      </div>
    </div>
  );
}

// Course Recommendations Content Component
interface Course {
  id: string;
  title: string;
  provider: string;
  level: string;
  duration: string;
  rating: number;
  description: string;
}

export function CourseRecommendationsContent({ courses }: { courses: Course[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center pb-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Recommended Courses</h3>
        <p className="text-gray-600">Personalized learning paths for your career goals</p>
      </div>
      
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">{course.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {course.level}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Duration: {course.duration}</p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
                View Details
              </button>
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded text-sm hover:bg-blue-50 transition-colors">
                Add to Plan
              </button>
            </div>
          </div>
        ))}
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-2">💡 Pro Tip</h4>
          <p className="text-sm text-orange-800">
            Complete the skill assessment first to get more accurate course recommendations 
            tailored to your current proficiency levels.
          </p>
        </div>
      </div>
    </div>
  );
}

// Career Planning Content Component
export function CareerPlanningContent({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-6">
      <div className="text-center pb-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Career Development Plan</h3>
        <p className="text-gray-600">Map your journey to success</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🎯 Current Status</h4>
            <p className="text-blue-800">{String(data.currentLevel || 'Not assessed')}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">🚀 Target Goal</h4>
            <p className="text-green-800">{String(data.targetLevel || 'Define your goals')}</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">⏰ Timeline</h4>
            <p className="text-purple-800">{String(data.timeline || '6-12 months')}</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">📈 Career Progression Steps</h4>
          <div className="space-y-2">
            {['Complete skill assessment', 'Identify skill gaps', 'Create learning plan', 'Execute courses', 'Apply new skills', 'Advance to next level'].map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-sm ${index === 0 ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium">
          Start Career Planning
        </button>
      </div>
    </div>
  );
}

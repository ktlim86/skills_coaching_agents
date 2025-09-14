'use client';

import { useState } from 'react';

// Assessment question data structure
interface AssessmentQuestion {
  id: string;
  dimension: 'competency' | 'capability';
  question: string;
  description: string;
}

// Response data structure
interface AssessmentResponse {
  questionId: string;
  score: number; // 0-3 scale
}

// Rating scale definitions from backlog02.md
const RATING_SCALE = [
  { 
    value: 0, 
    label: 'Foundational', 
    description: 'No formal learning/experience, limited knowledge or application' 
  },
  { 
    value: 1, 
    label: 'Intermediate', 
    description: 'Basic learning completed, <2 years experience, needs guidance' 
  },
  { 
    value: 2, 
    label: 'Advanced', 
    description: 'Intermediate/advanced learning, 2-5 years experience, works independently' 
  },
  { 
    value: 3, 
    label: 'Mastery', 
    description: 'Expert-level knowledge, >5 years experience, mentors others' 
  }
];

// Sample assessment questions (10 total: 5 competency + 5 capability)
// These are the exact questions from backlog02.md
const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Competency Questions (Knowledge & Learning)
  {
    id: 'comp_1',
    dimension: 'competency',
    question: 'How well can you explain the key concepts and principles of this skill to others?',
    description: 'Evaluate your ability to articulate and teach the theoretical foundations'
  },
  {
    id: 'comp_2',
    dimension: 'competency',
    question: 'How effectively can you apply this skill to solve typical problems or tasks?',
    description: 'Assess your problem-solving capability using this skill in standard situations'
  },
  {
    id: 'comp_3',
    dimension: 'competency',
    question: 'How independently can you use this skill without supervision or guidance?',
    description: 'Rate your autonomy and self-sufficiency in applying this skill'
  },
  {
    id: 'comp_4',
    dimension: 'competency',
    question: 'How effectively can you adapt this skill to new, unfamiliar, or complex contexts?',
    description: 'Evaluate your flexibility and innovation in applying this skill to novel situations'
  },
  {
    id: 'comp_5',
    dimension: 'competency',
    question: 'How often do others seek your input or guidance regarding this skill?',
    description: 'Assess how others perceive your expertise and knowledge in this area'
  },
  
  // Capability Questions (Experience & Application)
  {
    id: 'cap_1',
    dimension: 'capability',
    question: 'How many years of relevant experience do you have actively applying this skill?',
    description: 'Consider your total years of hands-on experience with this skill'
  },
  {
    id: 'cap_2',
    dimension: 'capability',
    question: 'How consistently do you perform this skill successfully under real workplace conditions?',
    description: 'Rate your track record of successful application in professional settings'
  },
  {
    id: 'cap_3',
    dimension: 'capability',
    question: 'How confidently can you apply this skill under pressure or high-stakes situations?',
    description: 'Evaluate your performance when stakes are high or time is limited'
  },
  {
    id: 'cap_4',
    dimension: 'capability',
    question: 'How much exposure do you have across diverse scenarios where this skill was required?',
    description: 'Assess the breadth and variety of contexts where you have applied this skill'
  },
  {
    id: 'cap_5',
    dimension: 'capability',
    question: 'How regularly do you use this skill in your current or past roles?',
    description: 'Rate the frequency of application in your professional experience'
  }
];

interface AssessmentQuizProps {
  onSubmit?: (responses: AssessmentResponse[]) => void;
  onCancel?: () => void;
}

export default function AssessmentQuiz({ onSubmit, onCancel }: AssessmentQuizProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Calculate progress percentage
  const progress = (Object.keys(responses).length / ASSESSMENT_QUESTIONS.length) * 100;

  // Handle rating change for a question
  const handleRatingChange = (questionId: string, score: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: score
    }));
    
    // Clear validation errors when user makes progress
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Check if all questions are answered
    const unansweredQuestions = ASSESSMENT_QUESTIONS.filter(
      q => responses[q.id] === undefined
    );
    
    if (unansweredQuestions.length > 0) {
      errors.push(`Please answer all questions. ${unansweredQuestions.length} questions remaining.`);
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert responses to the expected format
      const assessmentResponses: AssessmentResponse[] = Object.entries(responses).map(
        ([questionId, score]) => ({
          questionId,
          score
        })
      );
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(assessmentResponses);
      }
      
      // For now, just log the results
      console.log('Assessment Results:', assessmentResponses);
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setValidationErrors(['An error occurred while submitting your assessment. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get competency and capability questions
  const competencyQuestions = ASSESSMENT_QUESTIONS.filter(q => q.dimension === 'competency');
  const capabilityQuestions = ASSESSMENT_QUESTIONS.filter(q => q.dimension === 'capability');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Skill Assessment Quiz
        </h2>
        <p className="text-gray-600 mb-4">
          Evaluate your competency and capability levels across key skill areas
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Progress: {Object.keys(responses).length} of {ASSESSMENT_QUESTIONS.length} questions completed
        </p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-800">
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationErrors[0]}
            </div>
          </div>
        </div>
      )}

      {/* Assessment Sections */}
      <div className="space-y-8">
        {/* Competency Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
              Competency
            </span>
            Knowledge & Learning (Theoretical Foundation)
          </h3>
          <div className="space-y-6">
            {competencyQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                selectedScore={responses[question.id]}
                onScoreChange={(score) => handleRatingChange(question.id, score)}
              />
            ))}
          </div>
        </div>

        {/* Capability Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
              Capability
            </span>
            Experience & Application (Practical Implementation)
          </h3>
          <div className="space-y-6">
            {capabilityQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                selectedScore={responses[question.id]}
                onScoreChange={(score) => handleRatingChange(question.id, score)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(responses).length !== ASSESSMENT_QUESTIONS.length}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Complete Assessment'
          )}
        </button>
      </div>
    </div>
  );
}

// Individual Question Card Component
interface QuestionCardProps {
  question: AssessmentQuestion;
  selectedScore?: number;
  onScoreChange: (score: number) => void;
}

function QuestionCard({ question, selectedScore, onScoreChange }: QuestionCardProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          {question.question}
        </h4>
        <p className="text-gray-600 text-sm">
          {question.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {RATING_SCALE.map((rating) => (
          <label
            key={rating.value}
            className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedScore === rating.value
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={rating.value}
              checked={selectedScore === rating.value}
              onChange={() => onScoreChange(rating.value)}
              className="sr-only"
            />
            
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${
                selectedScore === rating.value ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {rating.label}
              </span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                selectedScore === rating.value 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {rating.value}
              </span>
            </div>
            
            <p className={`text-xs ${
              selectedScore === rating.value ? 'text-blue-700' : 'text-gray-500'
            }`}>
              {rating.description}
            </p>
            
            {/* Selection indicator */}
            {selectedScore === rating.value && (
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

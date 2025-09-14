'use client';

import { ReactNode } from 'react';

interface RightPanelProps {
  content: ReactNode;
  title?: string;
}

export default function RightPanel({ content, title = "Results" }: RightPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-md">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-purple-100 text-sm">Dynamic content and recommendations</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {content}
      </div>
    </div>
  );
}

// Default content components for different states
export function WelcomeContent() {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800">Welcome to Your Learning Journey</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Start a conversation with our AI learning assistant to discover your skill gaps, 
        get personalized recommendations, and plan your career development path.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What you can do:</h4>
        <ul className="text-sm text-blue-800 space-y-1 text-left">
          <li>• Take skill assessments</li>
          <li>• Get course recommendations</li>
          <li>• Plan your learning path</li>
          <li>• Track your progress</li>
        </ul>
      </div>
    </div>
  );
}

export function LoadingContent() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Processing your request...</p>
      </div>
    </div>
  );
}

export function ErrorContent({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Something went wrong</h3>
        <p className="text-gray-600">{message}</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}

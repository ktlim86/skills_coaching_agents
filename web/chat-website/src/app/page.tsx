'use client';

import { useState } from 'react';
import SplitScreenLayout from '@/components/SplitScreenLayout';
import AgenticChatInterface from '@/components/AgenticChatInterface';
import RightPanel, { WelcomeContent } from '@/components/RightPanel';
import { AssessmentContent, CourseRecommendationsContent, CareerPlanningContent } from '@/components/DynamicContent';

// Define interfaces for right panel content
interface Course {
  id: string;
  title: string;
  provider: string;
  level: string;
  duration: string;
  rating: number;
  description: string;
}

interface CourseData {
  courses: Course[];
}

interface PlanningData {
  [key: string]: unknown;
}

type RightPanelContentType = CourseData | PlanningData | null;

export default function Home() {
  const [showSplitScreen, setShowSplitScreen] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<RightPanelContentType>(null);
  const [rightPanelType, setRightPanelType] = useState<string>('welcome');

  const handleConversationStart = () => {
    setShowSplitScreen(true);
  };

  const handleRightPanelContentChange = (content: RightPanelContentType, type: string) => {
    setRightPanelContent(content);
    setRightPanelType(type);
  };

  const renderRightPanelContent = () => {
    switch (rightPanelType) {
      case 'assessment':
        return <AssessmentContent />;
      case 'courses':
        return <CourseRecommendationsContent courses={(rightPanelContent as CourseData)?.courses || []} />;
      case 'planning':
        return <CareerPlanningContent data={(rightPanelContent as PlanningData) || {}} />;
      default:
        return <WelcomeContent />;
    }
  };

  const getRightPanelTitle = () => {
    switch (rightPanelType) {
      case 'assessment':
        return 'Skill Assessment';
      case 'courses':
        return 'Course Recommendations';
      case 'planning':
        return 'Career Planning';
      default:
        return 'Learning Hub';
    }
  };

  return (
    <main className="min-h-screen">
      <SplitScreenLayout
        showSplitScreen={showSplitScreen}
        leftPanel={
          <AgenticChatInterface
            onConversationStart={handleConversationStart}
            onRightPanelContentChange={handleRightPanelContentChange}
          />
        }
        rightPanel={
          <RightPanel
            title={getRightPanelTitle()}
            content={renderRightPanelContent()}
          />
        }
      />
    </main>
  );
}

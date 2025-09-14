'use client';

import { ReactNode } from 'react';

interface SplitScreenLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  showSplitScreen: boolean;
}

export default function SplitScreenLayout({ 
  leftPanel, 
  rightPanel, 
  showSplitScreen 
}: SplitScreenLayoutProps) {
  return (
    <div className="h-screen bg-gray-100">
      {showSplitScreen ? (
        // Split screen mode: left chat + right results panel
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-4 p-4">
          {/* Left Panel - Chat Interface */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {leftPanel}
          </div>
          
          {/* Right Panel - Dynamic Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {rightPanel}
          </div>
        </div>
      ) : (
        // Full screen mode: single chat interface
        <div className="h-full">
          {leftPanel}
        </div>
      )}
    </div>
  );
}

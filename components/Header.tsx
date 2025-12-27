
import React from 'react';
import { TUTORIAL_SECTIONS } from '../constants';
import { SectionId } from '../types';

interface HeaderProps {
  activeSection: SectionId;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const current = TUTORIAL_SECTIONS.find(s => s.id === activeSection);

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{current?.icon}</span>
        <h2 className="text-lg font-semibold text-slate-100">{current?.title}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <a 
          href="https://aistudio.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-medium rounded-md shadow-lg shadow-blue-900/20"
        >
          Открыть AI Studio
        </a>
      </div>
    </header>
  );
};

export default Header;

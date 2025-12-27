
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TutorialContent from './components/TutorialContent';
import Playground from './components/Playground';
import ProjectShowcase from './components/ProjectShowcase';
import { SectionId } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('intro');

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
        <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header activeSection={activeSection} />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/tutorial/intro" replace />} />
                <Route path="/tutorial/:sectionId" element={<TutorialContent />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/showcase" element={<ProjectShowcase />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;

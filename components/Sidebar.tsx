
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TUTORIAL_SECTIONS } from '../constants';
import { SectionId } from '../types';

interface SidebarProps {
  activeSection: SectionId;
  onSelectSection: (id: SectionId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSelectSection }) => {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">AS</div>
        <h1 className="font-bold text-lg tracking-tight">AI Studio <span className="text-blue-500 italic">Академия</span></h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Обучающие пути
        </div>
        {TUTORIAL_SECTIONS.map((section) => (
          <NavLink
            key={section.id}
            to={
              section.id === 'playground' ? '/playground' : 
              section.id === 'showcase' ? '/showcase' : 
              `/tutorial/${section.id}`
            }
            onClick={() => onSelectSection(section.id)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
              ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
            `}
          >
            <span className="text-xl">{section.icon}</span>
            <span className="font-medium text-sm">{section.title}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 bg-slate-800/50 m-4 rounded-xl border border-slate-700">
        <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">Технологии</p>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Gemini 3 Pro
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


import React, { useState, useEffect } from 'react';
import { Project, Comment } from '../types';
import { INITIAL_PROJECTS, MODEL_OPTIONS } from '../constants';
import CodeSnippet from './CodeSnippet';

const ProjectShowcase: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Состояние новой формы
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    author: '',
    description: '',
    model: MODEL_OPTIONS[0].id,
    config: { temperature: 0.7, topP: 0.9, topK: 40 },
    prompt: '',
    output: '',
    tags: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('ai_studio_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      setProjects(INITIAL_PROJECTS);
    }
  }, []);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem('ai_studio_projects', JSON.stringify(updated));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      ...newProject as Project,
      id: Date.now().toString(),
      comments: [],
      tags: (newProject.tags as any).toString().split(',').map((t: string) => t.trim())
    };
    const updated = [project, ...projects];
    saveProjects(updated);
    setIsAdding(false);
    setNewProject({
      title: '',
      author: '',
      description: '',
      model: MODEL_OPTIONS[0].id,
      config: { temperature: 0.7, topP: 0.9, topK: 40 },
      prompt: '',
      output: '',
      tags: []
    });
  };

  const handleAddComment = (projectId: string, text: string, author: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          author,
          text,
          date: new Date().toLocaleDateString('ru-RU')
        };
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    saveProjects(updated);
    if (selectedProject?.id === projectId) {
      setSelectedProject(updated.find(p => p.id === projectId) || null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Витрина проектов</h1>
          <p className="text-slate-400">Вдохновляйтесь работами сообщества и делитесь своими достижениями.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20"
        >
          + Добавить проект
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Опубликовать проект</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Название проекта</label>
                  <input required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm" placeholder="Напр: Анализатор кода" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ваше имя</label>
                  <input required value={newProject.author} onChange={e => setNewProject({...newProject, author: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm" placeholder="Иван Иванов" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Описание</label>
                <textarea required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm h-20" placeholder="О чем этот проект?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Модель</label>
                  <select value={newProject.model} onChange={e => setNewProject({...newProject, model: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm">
                    {MODEL_OPTIONS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Теги (через запятую)</label>
                  <input value={newProject.tags as any} onChange={e => setNewProject({...newProject, tags: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm" placeholder="AI, Code, UI" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Промпт</label>
                <textarea required value={newProject.prompt} onChange={e => setNewProject({...newProject, prompt: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm font-mono h-24" placeholder="Введите ваш промпт..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Результат работы</label>
                <textarea required value={newProject.output} onChange={e => setNewProject({...newProject, output: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm font-mono h-24" placeholder="Что ответила модель?" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl">Опубликовать</button>
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/10 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{project.model.split('-')[1].toUpperCase()}</span>
              <span className="text-xs text-slate-500">{project.comments.length} коммент.</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-800 text-[10px] rounded uppercase font-bold text-slate-400">{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold">{project.author[0]}</div>
              <span className="text-xs text-slate-500">от {project.author}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md p-6 border-b border-slate-800 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <p className="text-sm text-slate-400">Автор: {selectedProject.author}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">✕</button>
            </div>
            
            <div className="p-8 space-y-8">
              <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Конфигурация модели</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Temperature</p>
                    <p className="font-mono text-blue-400">{selectedProject.config.temperature}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Top-P</p>
                    <p className="font-mono text-purple-400">{selectedProject.config.topP}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Модель</p>
                    <p className="text-xs text-slate-300 truncate">{selectedProject.model}</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Промпт (Запрос)</h4>
                <CodeSnippet code={selectedProject.prompt} language="text" />
              </section>

              <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Результат работы</h4>
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-slate-300 text-sm whitespace-pre-wrap font-mono">
                  {selectedProject.output}
                </div>
              </section>

              <section className="border-t border-slate-800 pt-8">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                  Обсуждение
                  <span className="text-xs font-normal text-slate-500">({selectedProject.comments.length})</span>
                </h4>
                <div className="space-y-4 mb-8">
                  {selectedProject.comments.map(comment => (
                    <div key={comment.id} className="bg-slate-800/50 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-blue-400">{comment.author}</span>
                        <span className="text-[10px] text-slate-500">{comment.date}</span>
                      </div>
                      <p className="text-sm text-slate-300">{comment.text}</p>
                    </div>
                  ))}
                  {selectedProject.comments.length === 0 && <p className="text-center py-4 text-slate-500 text-sm">Пока нет комментариев. Будьте первым!</p>}
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    handleAddComment(selectedProject.id, form.comment.value, form.author.value || 'Аноним');
                    form.reset();
                  }}
                  className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input name="author" placeholder="Ваше имя" className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm" />
                    <input name="comment" required placeholder="Ваш вопрос или комментарий..." className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors">Отправить</button>
                </form>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;

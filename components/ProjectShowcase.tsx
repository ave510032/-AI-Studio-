
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Project, Comment } from '../types';
import { INITIAL_PROJECTS, MODEL_OPTIONS } from '../constants';
import CodeSnippet from './CodeSnippet';

const ProjectShowcase: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    author: '',
    description: '',
    model: MODEL_OPTIONS[0].id,
    config: { temperature: 0.7, topP: 0.9, topK: 40 },
    systemInstruction: '',
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

    // Проверяем, пришли ли мы из песочницы для добавления
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mode') === 'add') {
      const draft = localStorage.getItem('project_draft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setNewProject(prev => ({ ...prev, ...parsedDraft }));
        setIsAdding(true);
        // Чистим черновик
        localStorage.removeItem('project_draft');
      }
    }
  }, [location.search]);

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
      tags: (newProject.tags as any).toString().split(',').filter(Boolean).map((t: string) => t.trim())
    };
    const updated = [project, ...projects];
    saveProjects(updated);
    setIsAdding(false);
    navigate('/showcase', { replace: true });
  };

  // Fix for error on line 288: Added missing handleAddComment function
  const handleAddComment = (projectId: string, text: string, author: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: author || 'Аноним',
      text,
      date: new Date().toLocaleDateString('ru-RU')
    };
    
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    
    saveProjects(updated);
    
    // Update local state for immediate UI feedback if project details are open
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ 
        ...selectedProject, 
        comments: [...selectedProject.comments, newComment] 
      });
    }
  };

  const tryInPlayground = (project: Project) => {
    // В реальности мы могли бы передать через state, но для простоты используем localStorage
    localStorage.setItem('playground_import', JSON.stringify({
      model: project.model,
      system: project.systemInstruction,
      prompt: project.prompt,
      temp: project.config.temperature
    }));
    navigate('/playground');
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Витрина проектов</h1>
          <p className="text-slate-400 mt-2">Изучайте лучшие практики промпт-инжиниринга от сообщества.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/30 active:scale-95"
        >
          + Создать проект
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
            <button 
              onClick={() => { setIsAdding(false); navigate('/showcase', { replace: true }); }}
              className="absolute top-6 right-6 text-slate-500 hover:text-white"
            >✕</button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🚀</span> Публикация проекта
            </h2>
            <form onSubmit={handleAddProject} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Название</label>
                  <input required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-blue-500 transition-all outline-none" placeholder="Ассистент по..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ваше имя</label>
                  <input required value={newProject.author} onChange={e => setNewProject({...newProject, author: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-blue-500 transition-all outline-none" placeholder="Никнейм" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Описание проекта</label>
                <textarea required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm h-20 resize-none focus:border-blue-500 transition-all outline-none" placeholder="Коротко о том, зачем этот проект..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Модель</label>
                  <select value={newProject.model} onChange={e => setNewProject({...newProject, model: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none">
                    {MODEL_OPTIONS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Теги</label>
                  <input value={newProject.tags as any} onChange={e => setNewProject({...newProject, tags: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none" placeholder="Code, Marketing, JSON..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Системный контекст (необязательно)</label>
                <textarea value={newProject.systemInstruction} onChange={e => setNewProject({...newProject, systemInstruction: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono h-24 focus:border-blue-500 outline-none" placeholder="Укажите роль модели..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Промпт</label>
                <textarea required value={newProject.prompt} onChange={e => setNewProject({...newProject, prompt: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono h-24 focus:border-blue-500 outline-none" placeholder="Текст запроса..." />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">Опубликовать</button>
                <button type="button" onClick={() => { setIsAdding(false); navigate('/showcase', { replace: true }); }} className="px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl transition-all">Отмена</button>
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
            className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-600/50 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer transition-all relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-4xl">✨</span>
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {project.model.includes('pro') ? 'PRO' : 'FLASH'}
              </span>
              <span className="text-[10px] text-slate-500 font-bold">💬 {project.comments.length}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{project.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-grow">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-950/50 text-[9px] rounded-md border border-white/5 uppercase font-black text-slate-500">{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-tr from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-[11px] font-black border border-white/5">{project.author[0].toUpperCase()}</div>
                <span className="text-xs text-slate-500 font-medium">@{project.author}</span>
              </div>
              <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Смотреть детали →</span>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-2xl">💡</div>
                 <div>
                    <h2 className="text-2xl font-black text-white">{selectedProject.title}</h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Автор: {selectedProject.author}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => tryInPlayground(selectedProject)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                >
                  ⚡ Попробовать
                </button>
                <button onClick={() => setSelectedProject(null)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full text-slate-400 transition-colors text-xl">✕</button>
              </div>
            </div>
            
            <div className="p-8 space-y-10">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Температура</h4>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-mono text-blue-400">{selectedProject.config.temperature}</span>
                        <span className="text-[10px] text-slate-600 mb-1">{selectedProject.config.temperature > 0.7 ? 'Творчески' : 'Точно'}</span>
                    </div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Модель</h4>
                    <div className="text-sm font-bold text-slate-300 truncate">{selectedProject.model}</div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Теги</h4>
                    <div className="flex flex-wrap gap-1">
                        {selectedProject.tags.map(t => <span key={t} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase font-bold">{t}</span>)}
                    </div>
                </div>
              </section>

              {selectedProject.systemInstruction && (
                 <section>
                    <h4 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        Системный контекст
                    </h4>
                    <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl text-slate-400 text-sm font-mono border-l-4 border-l-purple-600">
                        {selectedProject.systemInstruction}
                    </div>
                </section>
              )}

              <section>
                <h4 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Промпт
                </h4>
                <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl text-slate-200 text-sm font-mono border-l-4 border-l-blue-600">
                  {selectedProject.prompt}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Пример вывода
                </h4>
                <div className="bg-slate-950 border border-white/5 p-6 rounded-2xl text-slate-400 text-sm whitespace-pre-wrap font-mono italic leading-relaxed">
                  {selectedProject.output}
                </div>
              </section>

              <section className="pt-8 border-t border-white/5">
                <h4 className="text-lg font-black mb-8 flex items-center gap-3">
                  💬 Обсуждение
                  <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">{selectedProject.comments.length}</span>
                </h4>
                
                <div className="space-y-6 mb-10">
                  {selectedProject.comments.map(comment => (
                    <div key={comment.id} className="flex gap-4 group">
                      <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-500 shrink-0 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors">
                        {comment.author[0].toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="font-black text-sm text-slate-300">@{comment.author}</span>
                            <span className="text-[10px] text-slate-600 font-bold">{comment.date}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  {selectedProject.comments.length === 0 && <p className="text-center py-10 text-slate-600 font-bold italic">Проект ждет вашего вопроса...</p>}
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    if(!form.comment.value) return;
                    handleAddComment(selectedProject.id, form.comment.value, form.author.value || 'Аноним');
                    form.reset();
                  }}
                  className="space-y-4 bg-slate-950/50 p-6 rounded-3xl border border-white/5 shadow-2xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input name="author" placeholder="Ваше имя" className="md:col-span-1 bg-slate-900 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" />
                    <input name="comment" required placeholder="Задайте вопрос или оставьте отзыв..." className="md:col-span-3 bg-slate-900 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black rounded-xl transition-all active:scale-95 uppercase tracking-widest">Отправить в чат</button>
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

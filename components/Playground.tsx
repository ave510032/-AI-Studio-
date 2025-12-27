
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { runPrompt } from '../services/geminiService';
import { MODEL_OPTIONS } from '../constants';
import Notification from './Notification';

const Playground: React.FC = () => {
  const navigate = useNavigate();
  const [model, setModel] = useState(MODEL_OPTIONS[0].id);
  const [system, setSystem] = useState("Ты — эксперт по ИИ. Твои ответы должны быть краткими и технически точными.");
  const [prompt, setPrompt] = useState("");
  const [temp, setTemp] = useState(0.7);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  useEffect(() => {
    const importData = localStorage.getItem('playground_import');
    if (importData) {
      const data = JSON.parse(importData);
      setModel(data.model || MODEL_OPTIONS[0].id);
      setSystem(data.system || "");
      setPrompt(data.prompt || "");
      setTemp(data.temp ?? 0.7);
      localStorage.removeItem('playground_import');
      setNotification({ msg: "Конфигурация проекта успешно импортирована!", type: 'success' });
    }
  }, []);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResponse("");

    try {
      const result = await runPrompt(model, prompt, system, { temperature: temp });
      setResponse(result.text || "Ответ от модели не получен.");
      setNotification({ msg: "Ответ успешно сгенерирован!", type: 'success' });
    } catch (err: any) {
      setError(err.message || "Ошибка при вызове API. Проверьте ваш ключ.");
      setNotification({ msg: "Ошибка генерации", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const draft = {
      title: 'Эксперимент из песочницы',
      model,
      systemInstruction: system,
      prompt,
      output: response,
      config: { temperature: temp, topP: 0.9, topK: 40 }
    };
    localStorage.setItem('project_draft', JSON.stringify(draft));
    navigate('/showcase?mode=add');
  };

  return (
    <div className="space-y-6 pb-20">
      {notification && (
        <Notification 
          message={notification.msg} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-blue-500/30">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Интерактивная песочница
            <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest font-black animate-pulse">Live Mode</span>
          </h2>
          <button 
            onClick={() => { setPrompt(''); setResponse(''); setSystem(''); setNotification({msg: "Очищено", type: 'info'}); }}
            className="p-2 text-slate-500 hover:text-white transition-all hover:rotate-90"
            title="Очистить всё"
          >
            🗑️
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest group-focus-within:text-blue-400 transition-colors">Системная инструкция</label>
              <textarea 
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none font-mono placeholder:text-slate-700"
                placeholder="Ты — шеф-повар с 20-летним стажем..."
              />
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest group-focus-within:text-blue-400 transition-colors">Твой запрос</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono placeholder:text-slate-700"
                placeholder="Придумай 5 идей для ужина из курицы..."
              />
            </div>

            <button
              onClick={handleRun}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 font-bold rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-3 group active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="tracking-wide">Генерация...</span>
                </div>
              ) : (
                <>
                  <span className="tracking-wide">Запустить Gemini</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 shadow-inner">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Параметры</h4>
              
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 uppercase font-bold">Модель</label>
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  {MODEL_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase font-bold">Креативность</label>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">{temp.toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1.5" 
                  step="0.1" 
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl border border-white/5 relative group cursor-help">
              <div className="absolute top-2 right-2 text-xs opacity-20 group-hover:opacity-100 transition-opacity">❓</div>
              <h5 className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-widest">Подсказка</h5>
              <p className="text-xs text-slate-400 leading-relaxed italic">Используйте системную инструкцию, чтобы задать тон общения и формат ответа (например, "отвечай только в JSON").</p>
            </div>
          </div>
        </div>

        {(response || error || isLoading) && (
          <div className="mt-8 pt-8 border-t border-slate-800 animate-in fade-in slide-in-from-top-6 duration-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                {isLoading && <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>}
                Результат генерации
              </h3>
              {response && !isLoading && (
                <button 
                  onClick={handleShare}
                  className="text-[10px] font-bold bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all flex items-center gap-2"
                >
                  ✨ Опубликовать на витрине
                </button>
              )}
            </div>
            
            {error ? (
              <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-red-400 text-sm flex gap-4 items-start">
                <span className="text-xl">⚠️</span>
                <div>
                    <p className="font-bold mb-1">Ошибка генерации</p>
                    <p className="opacity-80">{error}</p>
                </div>
              </div>
            ) : (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-800 transition-all hover:border-blue-500/20">
                {isLoading && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Нейронная связь...</span>
                    </div>
                )}
                <button 
                  onClick={() => { navigator.clipboard.writeText(response); setNotification({msg: "Скопировано в буфер!", type: 'info'}); }}
                  className="absolute top-4 right-4 p-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 border border-white/5 shadow-xl"
                  title="Копировать"
                >
                  📋
                </button>
                <div className={`bg-slate-950 p-6 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed min-h-[160px] shadow-inner font-mono border-l-4 border-l-blue-600 ${isLoading ? 'blur-sm' : ''}`}>
                  {response || (isLoading ? "Модель подготавливает глубокий и осмысленный ответ..." : "Ожидание запуска...")}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;


import React, { useState } from 'react';
import { runPrompt } from '../services/geminiService';
import { MODEL_OPTIONS } from '../constants';

const Playground: React.FC = () => {
  const [model, setModel] = useState(MODEL_OPTIONS[0].id);
  const [system, setSystem] = useState("Ты — эксперт по ИИ. Твои ответы должны быть краткими и технически точными.");
  const [prompt, setPrompt] = useState("");
  const [temp, setTemp] = useState(0.7);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResponse("");

    try {
      const result = await runPrompt(model, prompt, system, { temperature: temp });
      setResponse(result.text || "Ответ от модели не получен.");
    } catch (err: any) {
      setError(err.message || "Ошибка при вызове API. Проверьте ваш ключ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          Интерактивная песочница
          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase">LIVE</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Системная инструкция</label>
              <textarea 
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Как модель должна себя вести?"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Текст запроса</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Напишите ваш промпт здесь..."
              />
            </div>

            <button
              onClick={handleRun}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              {isLoading ? "Загрузка..." : "Запустить модель"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Настройки модели</h4>
              
              <div>
                <label className="block text-xs text-slate-400 mb-2">Выбор модели</label>
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-slate-300"
                >
                  {MODEL_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-slate-400">Температура</label>
                  <span className="text-xs font-mono text-blue-400">{temp.toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1.5" 
                  step="0.1" 
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
              <h5 className="text-[10px] font-bold text-blue-500 mb-2 uppercase tracking-widest">Совет дня</h5>
              <p className="text-xs text-slate-400 italic">"Попробуйте изменить системную инструкцию на 'Отвечай только в формате JSON', чтобы увидеть мощь структурированного вывода."</p>
            </div>
          </div>
        </div>

        {(response || error) && (
          <div className="mt-8 pt-8 border-t border-slate-800 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Результат</h3>
            {error ? (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm">
                <strong>Ошибка:</strong> {error}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed min-h-[100px] shadow-inner font-mono border-l-4 border-l-blue-500">
                {response}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;

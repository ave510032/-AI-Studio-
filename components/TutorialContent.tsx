
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CodeSnippet from './CodeSnippet';
import { TUTORIAL_SECTIONS } from '../constants';
import Notification from './Notification';

const TutorialContent: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  const currentIndex = TUTORIAL_SECTIONS.findIndex(s => s.id === sectionId);
  const nextSection = TUTORIAL_SECTIONS[currentIndex + 1];
  const prevSection = TUTORIAL_SECTIONS[currentIndex - 1];

  const tryThisInPlayground = (prompt: string, system?: string) => {
    localStorage.setItem('playground_import', JSON.stringify({
      prompt,
      system: system || "Ты — полезный ИИ-помощник.",
      temp: 0.7
    }));
    navigate('/playground');
  };

  const Quiz = ({ question, options, correct }: { question: string, options: string[], correct: number }) => (
    <div className="mt-12 p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl animate-in fade-in duration-700">
      <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        Быстрая проверка знаний
      </h3>
      <p className="text-lg font-bold mb-6 text-white">{question}</p>
      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setQuizAnswer(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center group ${
              quizAnswer === i 
                ? (i === correct ? 'bg-green-600/10 border-green-500 text-green-400' : 'bg-red-600/10 border-red-500 text-red-400')
                : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-400'
            }`}
          >
            <span>{opt}</span>
            {quizAnswer === i && (
              <span className="text-xl">{i === correct ? '✅' : '❌'}</span>
            )}
          </button>
        ))}
      </div>
      {quizAnswer === correct && (
        <div className="mt-6 p-4 bg-green-600/10 border border-green-500/20 rounded-xl animate-in zoom-in duration-300">
            <p className="text-green-400 text-sm font-bold">Верно! Вы отлично усвоили материал. 🎉</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (sectionId) {
      case 'intro':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-white leading-tight">Gemini и Google AI Studio</h1>
            <p className="text-lg text-slate-400">Это не просто чат-бот. Это мощная экосистема для создания приложений нового поколения. В этом курсе мы пройдем путь от первого запроса до интеграции сложных инструментов.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group cursor-default">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-blue-600/30 transition-all">⚡</div>
                <h3 className="font-bold text-white mb-2">Скорость Flash</h3>
                <p className="text-sm text-slate-400">Gemini Flash обеспечивает минимальную задержку, что идеально для real-time приложений.</p>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all group cursor-default">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-purple-600/30 transition-all">🧠</div>
                <h3 className="font-bold text-white mb-2">Интеллект Pro</h3>
                <p className="text-sm text-slate-400">Gemini Pro справляется со сложной логикой, кодом и многоступенчатыми рассуждениями.</p>
              </div>
            </div>

            <Quiz 
              question="Какая модель Gemini лучше всего подходит для задач с низкой задержкой (low-latency)?"
              options={["Gemini Pro", "Gemini Flash", "Gemini Ultra"]}
              correct={1}
            />
          </div>
        );

      case 'prompt-engineering':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Мастерство промптов</h1>
            <p className="text-slate-400 italic">"Качество ответа модели напрямую зависит от качества вашего вопроса."</p>
            
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                1. Метод S.P.E.C.
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-slate-900/50 rounded-xl border-l-4 border-l-blue-500 hover:bg-slate-900 transition-colors">
                  <strong className="text-white">S (Situation)</strong>: Опишите контекст задачи.
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border-l-4 border-l-purple-500 hover:bg-slate-900 transition-colors">
                  <strong className="text-white">P (Person)</strong>: Назначьте модель ролью.
                </div>
              </div>
              
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative group">
                <button 
                    onClick={() => tryThisInPlayground("Переведи на сленг: Здравствуйте", "Ты — подросток из 2024 года.")}
                    className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                    Запустить этот пример 🚀
                </button>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Пример промпта:</h4>
                <p className="font-mono text-sm text-blue-300">"Ты — эксперт по маркетингу. Напиши 3 заголовка для поста о новом ИИ-курсе."</p>
              </div>
            </section>

            <Quiz 
              question="Что означает буква 'P' в методе S.P.E.C.?"
              options={["Prompt (Запрос)", "Person (Личность/Роль)", "Purpose (Цель)"]}
              correct={1}
            />
          </div>
        );

      case 'model-config':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Настройка параметров</h1>
            <p className="text-slate-400">Управляйте балансом между точностью и творчеством.</p>
            
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                    <div>
                        <h3 className="font-bold text-xl">Temperature</h3>
                        <p className="text-slate-400 text-sm">Главный рычаг случайности ответов.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => {
                            localStorage.setItem('playground_import', JSON.stringify({ prompt: "Напиши код на Python для сортировки списка.", temp: 0.1 }));
                            navigate('/playground');
                        }}
                        className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all text-left group"
                    >
                        <span className="block text-blue-400 font-bold mb-1 group-hover:translate-x-1 transition-transform">0.1 - Точность 🎯</span>
                        <span className="text-xs text-slate-500 italic">Нажми, чтобы протестировать в коде</span>
                    </button>
                    <button 
                        onClick={() => {
                            localStorage.setItem('playground_import', JSON.stringify({ prompt: "Напиши сюрреалистичное стихотворение о квантовом коте.", temp: 1.2 }));
                            navigate('/playground');
                        }}
                        className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all text-left group"
                    >
                        <span className="block text-purple-400 font-bold mb-1 group-hover:translate-x-1 transition-transform">1.2 - Креатив ✨</span>
                        <span className="text-xs text-slate-500 italic">Нажми, чтобы протестировать в стихах</span>
                    </button>
                </div>
            </div>

            <Quiz 
              question="Какую температуру лучше выбрать для написания технической документации?"
              options={["0.1 - 0.3", "0.7 - 0.9", "1.5+"]}
              correct={0}
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-20 animate-in fade-in duration-1000">
            <div className="text-6xl mb-6">🏗️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Раздел в разработке</h2>
            <p className="text-slate-400 mb-8">Мы готовим потрясающий интерактивный контент для этой темы.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold">
              Вернуться назад
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="pb-24">
      {notification && (
        <Notification message={notification.msg} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
        
        <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center">
          {prevSection ? (
            <Link to={`/tutorial/${prevSection.id}`} onClick={() => setQuizAnswer(null)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 transition-all text-slate-400 font-bold border border-transparent hover:border-slate-700">
              <span>←</span> {prevSection.title}
            </Link>
          ) : <div />}
          
          {nextSection ? (
            <Link to={`/tutorial/${nextSection.id}`} onClick={() => setQuizAnswer(null)} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all text-white font-bold shadow-lg shadow-blue-900/20 active:scale-95">
              {nextSection.title} <span>→</span>
            </Link>
          ) : (
            <Link to="/playground" className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition-all text-white font-bold shadow-lg shadow-green-900/20 active:scale-95">
              Перейти к практике! 🚀
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialContent;

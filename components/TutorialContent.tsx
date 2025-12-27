
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import CodeSnippet from './CodeSnippet';

const TutorialContent: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();

  const renderContent = () => {
    switch (sectionId) {
      case 'intro':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-white leading-tight">Добро пожаловать в будущее разработки</h1>
            <p className="text-lg text-slate-400">Google AI Studio — это самый быстрый способ начать работу с моделями Gemini. Это руководство поможет вам освоить все возможности экосистемы Google.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-colors">
                <h3 className="font-bold text-blue-400 mb-2">Быстрое прототипирование</h3>
                <p className="text-sm text-slate-400">Создавайте и тестируйте промпты мгновенно без написания кода.</p>
              </div>
              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-colors">
                <h3 className="font-bold text-blue-400 mb-2">Сравнение моделей</h3>
                <p className="text-sm text-slate-400">Переключайтесь между Flash, Pro и Nano для поиска идеального баланса.</p>
              </div>
            </div>

            <div className="mt-10 p-8 bg-blue-600/10 rounded-2xl border border-blue-500/20">
              <h2 className="text-xl font-bold mb-4 text-blue-300">Настройка API ключа</h2>
              <p className="mb-4 text-slate-300 text-sm">Для работы вам понадобится API ключ из Google AI Studio. Это приложение использует переменные окружения для демонстрации функций.</p>
              <Link to="/tutorial/prompt-engineering" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all">
                Начать обучение промпт-инжинирингу
                <span>→</span>
              </Link>
            </div>
          </div>
        );

      case 'prompt-engineering':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Мастерство промпт-инжиниринга</h1>
            <p className="text-slate-400">Промпт — это не просто вопрос. Это контекст, ограничения и примеры, которые направляют модель.</p>
            
            <h2 className="text-xl font-semibold text-blue-400 pt-4">1. Техника "Роли"</h2>
            <p>Укажите модели, кем она является. "Ты — эксперт по React" даст лучший код, чем просто "Напиши компонент".</p>
            
            <h2 className="text-xl font-semibold text-blue-400 pt-4">2. Zero-Shot против Few-Shot</h2>
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <h4 className="text-sm font-bold text-slate-300 mb-2">Пример Few-Shot:</h4>
                <p className="text-xs text-slate-500 mb-2 italic">// Дайте примеры паттерна, который вы хотите получить</p>
                <CodeSnippet code={`Запрос: Фильм "Начало" -> Тема: Реальность против снов\nЗапрос: Фильм "Матрица" -> Тема: Симуляция\nЗапрос: Фильм "Интерстеллар" -> Тема:`} language="text" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-blue-400 pt-4">3. Цепочка рассуждений (Chain of Thought)</h2>
            <p>Попросите Gemini "думать шаг за шагом". Это значительно снижает риск галлюцинаций в сложных задачах.</p>
            
            <Link to="/tutorial/model-config" className="block p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500 group transition-all mt-8">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">Следующий урок</h4>
                  <p className="text-sm text-slate-500">Конфигурация параметров модели</p>
                </div>
                <span className="text-slate-500 group-hover:translate-x-1 group-hover:text-blue-400 transition-all">→</span>
              </div>
            </Link>
          </div>
        );

      default:
        return <div className="text-slate-500 italic">Раздел находится в разработке...</div>;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderContent()}
    </div>
  );
};

export default TutorialContent;

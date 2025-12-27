
import React from 'react';

interface CodeSnippetProps {
  code: string;
  language?: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language = 'javascript' }) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden my-4 shadow-xl">
      <div className="bg-slate-900 px-4 py-2 text-xs font-mono text-slate-500 border-b border-slate-800 flex justify-between items-center">
        <span>{language.toUpperCase()}</span>
        <button 
          onClick={() => navigator.clipboard.writeText(code)}
          className="hover:text-slate-300 transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="mono text-sm text-blue-300">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeSnippet;

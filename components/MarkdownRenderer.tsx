import React from 'react';

// A simple markdown renderer to avoid external heavy dependencies for this specific task
// In a production app, use 'react-markdown'
interface Props {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content, className }) => {
  const lines = content.split('\n');
  
  return (
    <div className={`space-y-4 text-gray-300 ${className}`}>
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3 border-b border-gray-700 pb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-extrabold text-white mb-4">{line.replace('# ', '')}</h1>;
        
        // List items
        if (line.trim().startsWith('- ')) return (
            <div key={index} className="flex items-start ml-4">
                <span className="mr-2 text-indigo-400">•</span>
                <span>{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</span>
            </div>
        );
        
        // Empty lines
        if (line.trim() === '') return <div key={index} className="h-2" />;

        // Paragraphs with Bold support
        const parsedLine = line.split(/(\*\*.*?\*\*)/).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        return <p key={index} className="leading-relaxed">{parsedLine}</p>;
      })}
    </div>
  );
};

export default MarkdownRenderer;
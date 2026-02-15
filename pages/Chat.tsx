import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, RSSItem, GeneratedReport } from '../types';
import { chatWithAssistant } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface Props {
  profile: UserProfile;
  rssItems: RSSItem[];
  reports: GeneratedReport[];
}

const Chat: React.FC<Props> = ({ profile, rssItems, reports }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // In a real app, we would perform vector search here to get relevant context items
      // For this demo, we pass the raw RSS items as context
      const response = await chatWithAssistant(input, history, profile, rssItems);
      
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.assistant_reply_markdown,
        timestamp: Date.now(),
        referenced_reports: response.referenced_reports,
        referenced_sources: response.referenced_sources
      };
      
      setHistory(prev => [...prev, assistantMsg]);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'assistant', content: "⚠️ Sorry, I encountered an error connecting to the AI service.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6" ref={scrollRef}>
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <span className="text-6xl">💬</span>
            <h2 className="text-2xl font-bold text-gray-300">Ask about your feeds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
                <button onClick={() => setInput("Summarize the latest space news")} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left text-sm">
                    "Summarize the latest space news"
                </button>
                <button onClick={() => setInput("Any new React updates?")} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left text-sm">
                    "Any new React updates?"
                </button>
                <button onClick={() => setInput("What's the sentiment on climate tech?")} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left text-sm">
                    "What's the sentiment on climate tech?"
                </button>
                <button onClick={() => setInput("Create a tweet based on the latest AI report")} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left text-sm">
                    "Create a tweet based on the latest AI report"
                </button>
            </div>
          </div>
        )}

        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] lg:max-w-[75%] rounded-2xl p-4 lg:p-6 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-gray-800 text-gray-100 rounded-bl-none shadow-sm border border-gray-700'
            }`}>
              <MarkdownRenderer content={msg.content} />
              
              {/* Citations / Sources */}
              {msg.role === 'assistant' && msg.referenced_sources && msg.referenced_sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                        {msg.referenced_sources.map((src, i) => (
                            <a 
                                key={i} 
                                href={src.source_url || '#'} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs bg-gray-900 text-indigo-300 px-2 py-1 rounded border border-gray-700 hover:border-indigo-500 transition-colors flex items-center gap-1"
                            >
                                <span>🔗</span> {src.source_name}
                            </a>
                        ))}
                    </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-gray-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
      </div>

      <div className="p-4 bg-gray-950 border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
            placeholder="Ask a question about your topics..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white p-4 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
import React from 'react';
import { RSSItem } from '../types';

interface Props {
  rssItems: RSSItem[];
  setRssItems: (items: RSSItem[]) => void;
}

const Feeds: React.FC<Props> = ({ rssItems }) => {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">RSS Feeds</h1>
            <p className="text-gray-400">Monitoring {rssItems.length} sources for your reports</p>
          </div>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors">
            Manage Sources
          </button>
      </div>

      <div className="grid gap-4">
        {rssItems.map((item) => (
          <div key={item.id} className="bg-gray-800/50 p-6 rounded-xl border border-gray-800 hover:border-gray-600 transition-all">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded uppercase tracking-wider">{item.source_name}</span>
                <span className="text-xs text-gray-500">{new Date(item.published_at).toLocaleString()}</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 hover:text-indigo-300 transition-colors">
                <a href={item.source_url} target="_blank" rel="noreferrer">{item.title}</a>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">{item.summary}</p>
            <div className="flex gap-2">
                {item.category_tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-700">#{tag}</span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feeds;
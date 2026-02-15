import React from 'react';
import { UserProfile, ReportPreferences } from '../types';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  preferences: ReportPreferences;
  setPreferences: (p: ReportPreferences) => void;
}

const Settings: React.FC<Props> = ({ profile, setProfile, preferences, setPreferences }) => {
  
  const handleTopicChange = (topic: string, type: 'primary' | 'secondary', action: 'remove') => {
      if(action === 'remove') {
          if(type === 'primary') setProfile({...profile, primary_topics: profile.primary_topics.filter(t => t !== topic)});
          else setProfile({...profile, secondary_topics: profile.secondary_topics.filter(t => t !== topic)});
      }
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-8">
            
            {/* Profile Section */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Profile & Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
                        <input 
                            type="text" 
                            value={profile.name} 
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Time Zone</label>
                         <input 
                            type="text" 
                            value={profile.time_zone} 
                            readOnly
                            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-indigo-400 mb-2">Primary Topics (High Priority)</label>
                    <div className="flex flex-wrap gap-2">
                        {profile.primary_topics.map(t => (
                            <span key={t} className="bg-indigo-900/50 text-indigo-200 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-indigo-700">
                                {t}
                                <button onClick={() => handleTopicChange(t, 'primary', 'remove')} className="hover:text-white">×</button>
                            </span>
                        ))}
                         <button className="bg-gray-900 text-gray-400 px-3 py-1 rounded-full text-sm border border-gray-600 border-dashed hover:text-white hover:border-gray-400">+ Add</button>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Secondary Topics</label>
                     <div className="flex flex-wrap gap-2">
                        {profile.secondary_topics.map(t => (
                            <span key={t} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-gray-600">
                                {t}
                                <button onClick={() => handleTopicChange(t, 'secondary', 'remove')} className="hover:text-white">×</button>
                            </span>
                        ))}
                         <button className="bg-gray-900 text-gray-400 px-3 py-1 rounded-full text-sm border border-gray-600 border-dashed hover:text-white hover:border-gray-400">+ Add</button>
                    </div>
                </div>
            </div>

            {/* Report Preferences */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Report Configuration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Frequency</label>
                        <select 
                            value={preferences.frequency}
                            onChange={(e) => setPreferences({...preferences, frequency: e.target.value as any})}
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tone</label>
                         <select 
                            value={preferences.tone}
                            onChange={(e) => setPreferences({...preferences, tone: e.target.value as any})}
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                        >
                            <option value="concise">Concise</option>
                            <option value="analytic">Analytic</option>
                            <option value="opinionated">Opinionated</option>
                            <option value="neutral">Neutral</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex gap-8">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={preferences.include_sentiment}
                            onChange={(e) => setPreferences({...preferences, include_sentiment: e.target.checked})}
                            className="w-5 h-5 rounded bg-gray-900 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-300">Analyze Sentiment</span>
                    </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={preferences.include_action_items}
                             onChange={(e) => setPreferences({...preferences, include_action_items: e.target.checked})}
                            className="w-5 h-5 rounded bg-gray-900 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-300">Suggest Action Items</span>
                    </label>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
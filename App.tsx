import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Reports from './pages/Reports';
import Chat from './pages/Chat';
import Feeds from './pages/Feeds';
import Settings from './pages/Settings';
import { UserProfile, ReportPreferences, RSSItem, GeneratedReport, DeliveryChannels } from './types';
import { MOCK_USER_PROFILE, MOCK_PREFERENCES, MOCK_RSS_ITEMS, MOCK_CHANNELS } from './constants';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [preferences, setPreferences] = useState<ReportPreferences>(MOCK_PREFERENCES);
  const [channels, setChannels] = useState<DeliveryChannels>(MOCK_CHANNELS);
  const [rssItems, setRssItems] = useState<RSSItem[]>(MOCK_RSS_ITEMS);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  // Function to add a newly generated report
  const addReport = (report: GeneratedReport) => {
    setGeneratedReports(prev => [report, ...prev]);
  };

  return (
    <HashRouter>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 overflow-auto relative">
          <Routes>
            <Route path="/" element={<Navigate to="/reports" replace />} />
            <Route 
              path="/reports" 
              element={
                <Reports 
                  profile={profile} 
                  preferences={preferences} 
                  channels={channels}
                  rssItems={rssItems}
                  generatedReports={generatedReports}
                  onGenerateReport={addReport}
                />
              } 
            />
            <Route 
              path="/chat" 
              element={
                <Chat 
                  profile={profile}
                  rssItems={rssItems}
                  reports={generatedReports}
                />
              } 
            />
            <Route 
              path="/feeds" 
              element={
                <Feeds rssItems={rssItems} setRssItems={setRssItems} />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <Settings 
                  profile={profile} 
                  setProfile={setProfile}
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
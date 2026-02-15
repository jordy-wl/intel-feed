import React, { useState } from 'react';
import { UserProfile, ReportPreferences, DeliveryChannels, RSSItem, GeneratedReport } from '../types';
import { generateReport } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface Props {
  profile: UserProfile;
  preferences: ReportPreferences;
  channels: DeliveryChannels;
  rssItems: RSSItem[];
  generatedReports: GeneratedReport[];
  onGenerateReport: (report: GeneratedReport) => void;
}

const Reports: React.FC<Props> = ({ profile, preferences, channels, rssItems, generatedReports, onGenerateReport }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReportIndex, setSelectedReportIndex] = useState<number | null>(null);

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const report = await generateReport(profile, preferences, channels, rssItems);
      onGenerateReport(report);
      setSelectedReportIndex(0); // Select the new report
    } catch (err) {
      setError("Failed to generate report. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedReport = selectedReportIndex !== null ? generatedReports[selectedReportIndex] : null;

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left Panel: Report List */}
      <div className="w-full lg:w-1/3 border-r border-gray-800 bg-gray-900 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Reports</h1>
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg ${
                isGenerating 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                '+ Generate New'
              )}
            </button>
          </div>
          {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded mb-4">{error}</div>}
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">History</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {generatedReports.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 p-4">
              <p>No reports yet.</p>
              <p className="text-sm">Click generate to analyze your feeds.</p>
            </div>
          ) : (
            generatedReports.map((report, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedReportIndex(idx)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  selectedReportIndex === idx
                    ? 'bg-gray-800 border-indigo-500 shadow-md'
                    : 'bg-gray-800/50 border-transparent hover:bg-gray-800 hover:border-gray-700'
                }`}
              >
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{report.report_metadata.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{report.report_metadata.subtitle}</p>
                <div className="flex gap-2">
                    {report.embedding.embedding_tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Report Details */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-6 lg:p-10">
        {selectedReport ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <header className="border-b border-gray-700 pb-6">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">{selectedReport.report_metadata.title}</h1>
              <p className="text-xl text-gray-400 font-light">{selectedReport.report_metadata.subtitle}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>📅 {new Date().toLocaleDateString()}</span>
                <span>⏱️ {selectedReport.report_metadata.time_window.start.split('T')[0]} to {selectedReport.report_metadata.time_window.end.split('T')[0]}</span>
              </div>
            </header>

            {/* Embedding Summary */}
            <section className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                <h4 className="text-indigo-400 text-sm font-bold uppercase mb-2">Executive Summary</h4>
                <p className="text-gray-300 italic">{selectedReport.embedding.embedding_summary}</p>
            </section>

            {/* Sections */}
            <div className="space-y-12">
              {selectedReport.sections.map((section) => (
                <section key={section.id} className="relative">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full block"></span>
                    {section.title}
                  </h2>
                  <MarkdownRenderer content={section.body_markdown} />
                  
                  {/* Important Items Card */}
                  {section.important_items.length > 0 && (
                     <div className="grid gap-4 mt-6">
                        {section.important_items.map((item, i) => (
                            <div key={i} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white">{item.headline}</h4>
                                    {item.sentiment !== 'none' && (
                                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                                            item.sentiment === 'positive' ? 'bg-green-900 text-green-300' :
                                            item.sentiment === 'negative' ? 'bg-red-900 text-red-300' :
                                            'bg-gray-700 text-gray-300'
                                        }`}>{item.sentiment}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-400 mb-2">{item.key_point}</p>
                                {item.action_item && (
                                    <div className="text-sm text-yellow-500 flex items-start gap-2 mt-2 bg-yellow-900/10 p-2 rounded">
                                        <span>⚡</span> {item.action_item}
                                    </div>
                                )}
                                <div className="mt-3 text-xs text-indigo-400">
                                    Source: <a href={item.source_url} target="_blank" rel="noreferrer" className="hover:underline">{item.source_name}</a>
                                </div>
                            </div>
                        ))}
                     </div>
                  )}
                </section>
              ))}
            </div>

            {/* Delivery Channel Previews (Tabs) */}
            <section className="mt-12 pt-8 border-t border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Channel Previews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedReport.channels.email.enabled && (
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase">📧 Email Draft</h4>
                            <div className="text-white font-semibold mb-2">Subject: {selectedReport.channels.email.subject}</div>
                            <div className="bg-gray-900 p-3 rounded text-sm text-gray-300 h-40 overflow-y-auto whitespace-pre-wrap font-mono">
                                {selectedReport.channels.email.body_text}
                            </div>
                        </div>
                    )}
                     {selectedReport.channels.video_reel.enabled && (
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase">🎥 Reel Script (~{selectedReport.channels.video_reel.approx_duration_sec}s)</h4>
                            <div className="bg-gray-900 p-3 rounded text-sm text-gray-300 h-40 overflow-y-auto whitespace-pre-wrap font-sans italic">
                                "{selectedReport.channels.video_reel.script}"
                            </div>
                        </div>
                    )}
                </div>
            </section>
          </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                <span className="text-6xl mb-4">📑</span>
                <p className="text-xl font-medium">Select or generate a report to view details</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
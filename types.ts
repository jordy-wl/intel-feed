export interface UserProfile {
  name: string;
  primary_topics: string[];
  secondary_topics: string[];
  time_zone: string;
  language: string;
}

export interface ReportPreferences {
  frequency: 'daily' | 'weekly' | 'monthly';
  max_items: number;
  structure_style: 'bullet_summary' | 'narrative' | 'executive_brief' | 'deep_dive';
  sections: string[];
  tone: 'concise' | 'analytic' | 'opinionated' | 'neutral';
  include_sentiment: boolean;
  include_action_items: boolean;
}

export interface DeliveryChannels {
  email: { enabled: boolean; format: 'html' | 'plaintext' };
  sms: { enabled: boolean; max_chars: number };
  video_reel: { enabled: boolean; max_duration_sec: number };
}

export interface RSSItem {
  id: string;
  title: string;
  summary: string;
  content: string | null;
  published_at: string;
  source_name: string;
  source_url: string;
  category_tags: string[];
}

// Report Generation Output Types
export interface ReportSection {
  id: string;
  title: string;
  summary: string;
  body_markdown: string;
  important_items: Array<{
    rss_item_id: string;
    headline: string;
    key_point: string;
    sentiment: 'positive' | 'neutral' | 'negative' | 'mixed' | 'none';
    action_item: string | null;
    source_name: string;
    source_url: string;
  }>;
}

export interface ReportSource {
  rss_item_id: string;
  source_name: string;
  source_url: string;
  title: string;
  published_at: string;
}

export interface GeneratedReport {
  mode: 'REPORT_GENERATION';
  report_metadata: {
    title: string;
    subtitle: string;
    report_id_hint: string;
    time_window: {
      start: string;
      end: string;
    };
  };
  embedding: {
    embedding_summary: string;
    embedding_tags: string[];
  };
  sections: ReportSection[];
  sources: ReportSource[];
  channels: {
    email: { enabled: boolean; subject: string; body_html: string; body_text: string };
    sms: { enabled: boolean; summary_text: string };
    video_reel: { enabled: boolean; script: string; approx_duration_sec: number };
  };
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  // Optional metadata if message is from assistant
  referenced_reports?: Array<{ report_id: string; title: string; timestamp: string }>;
  referenced_sources?: Array<{ source_type: string; source_name: string; source_url: string | null }>;
}

export interface ChatResponse {
  mode: 'CHAT_RAG';
  assistant_reply_markdown: string;
  referenced_reports: Array<{ report_id: string; title: string; timestamp: string }>;
  referenced_sources: Array<{
    source_type: 'report' | 'rss_item';
    source_id: string;
    source_name: string;
    source_url: string | null;
    justification: string;
  }>;
  suggested_profile_updates: {
    should_update: boolean;
    new_primary_topics: string[];
    new_secondary_topics: string[];
    notes: string;
  };
}

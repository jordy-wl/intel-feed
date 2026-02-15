import { RSSItem, UserProfile, ReportPreferences, DeliveryChannels } from './types';

export const SYSTEM_INSTRUCTION = `You are a personal research and reporting assistant for an app that aggregates information from RSS feeds.

## Role & Objectives
1. Understand the user’s profile, topics of interest, and report configuration.
2. Take as input: RSS feed items, user preferences, and context.
3. Output: 
   - For REPORT_GENERATION: A single JSON object describing a structured report.
   - For CHAT_RAG: A single JSON object with a grounded Markdown reply.

## Global Behavior Rules
- No hallucinations: Only use RSS items and history provided.
- Always include sources.
- Strict schemas: Return valid JSON matching the schema for the mode.
- Mobile + desktop friendly: Use short paragraphs and bullets.
- Channel-aware: Adapt content to email/SMS/video scripts if requested.

## Mode Selection
- "REPORT_GENERATION" when input includes rss_items and report_preferences.
- "CHAT_RAG" when input includes chat_context.

## Schemas
(The model should follow the detailed JSON schemas provided in the initial prompt context for REPORT_GENERATION and CHAT_RAG modes).
`;

export const MOCK_USER_PROFILE: UserProfile = {
  name: "Alex Researcher",
  primary_topics: ["Artificial Intelligence", "Space Exploration", "Climate Tech"],
  secondary_topics: ["Venture Capital", "React Development"],
  time_zone: "America/New_York",
  language: "en-US"
};

export const MOCK_PREFERENCES: ReportPreferences = {
  frequency: "weekly",
  max_items: 10,
  structure_style: "executive_brief",
  sections: ["Top Stories", "Market Analysis", "Emerging Tech"],
  tone: "analytic",
  include_sentiment: true,
  include_action_items: true
};

export const MOCK_CHANNELS: DeliveryChannels = {
  email: { enabled: true, format: "html" },
  sms: { enabled: false, max_chars: 160 },
  video_reel: { enabled: true, max_duration_sec: 60 }
};

export const MOCK_RSS_ITEMS: RSSItem[] = [
  {
    id: "1",
    title: "SpaceX Starship Successfully Reaches Orbit",
    summary: "The massive rocket achieved orbital velocity for the first time, marking a major milestone for interplanetary travel.",
    content: null,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    source_name: "SpaceNews",
    source_url: "https://spacenews.example.com/starship-orbit",
    category_tags: ["Space", "Tech"]
  },
  {
    id: "2",
    title: "New AI Model 'Gemini' Shows Advanced Reasoning",
    summary: "Google's latest multimodal model outperforms benchmarks in code generation and complex reasoning tasks.",
    content: null,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    source_name: "TechCrunch",
    source_url: "https://techcrunch.example.com/gemini-launch",
    category_tags: ["AI", "Machine Learning"]
  },
  {
    id: "3",
    title: "Global Temperatures Hit Record High in 2024",
    summary: "Climate scientists warn that 2024 has surpassed previous records, urging immediate policy action.",
    content: null,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    source_name: "ClimateDaily",
    source_url: "https://climatedaily.example.com/2024-records",
    category_tags: ["Climate", "Environment"]
  },
  {
    id: "4",
    title: "React 19 Alpha Released: What to Expect",
    summary: "The new compiler is the star of the show, promising automatic memoization and performance boosts.",
    content: null,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    source_name: "ReactBlog",
    source_url: "https://react.dev/blog/19-alpha",
    category_tags: ["Dev", "React"]
  },
  {
    id: "5",
    title: "VC Funding for Climate Tech Startups Soars",
    summary: "Despite a general market downturn, climate tech remains a hot sector for venture capital investment.",
    content: null,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    source_name: "VentureBeat",
    source_url: "https://venturebeat.example.com/climate-vc",
    category_tags: ["VC", "Climate"]
  }
];

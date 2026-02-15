import { GoogleGenAI, Type } from "@google/genai";
import { 
  UserProfile, 
  ReportPreferences, 
  DeliveryChannels, 
  RSSItem, 
  GeneratedReport, 
  ChatResponse, 
  ChatMessage 
} from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; 
// Note: In a real app, we would handle missing API key gracefully. 
// For this output, we assume it's injected by the environment or prompt logic.

const ai = new GoogleGenAI({ apiKey });

// Update to a valid model ID available for the API key
const MODEL_ID = "gemini-3-flash-preview";

export const generateReport = async (
  profile: UserProfile,
  preferences: ReportPreferences,
  channels: DeliveryChannels,
  rssItems: RSSItem[]
): Promise<GeneratedReport> => {
  
  const payload = {
    user_profile: profile,
    report_preferences: preferences,
    delivery_channels: channels,
    rss_items: rssItems,
    history_context: { recent_reports: [] } // Mock empty history for now
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: JSON.stringify(payload),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mode: { type: Type.STRING },
            report_metadata: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                report_id_hint: { type: Type.STRING },
                time_window: {
                  type: Type.OBJECT,
                  properties: {
                    start: { type: Type.STRING },
                    end: { type: Type.STRING },
                  }
                }
              }
            },
            embedding: {
              type: Type.OBJECT,
              properties: {
                embedding_summary: { type: Type.STRING },
                embedding_tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  body_markdown: { type: Type.STRING },
                  important_items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        rss_item_id: { type: Type.STRING },
                        headline: { type: Type.STRING },
                        key_point: { type: Type.STRING },
                        sentiment: { type: Type.STRING },
                        action_item: { type: Type.STRING, nullable: true },
                        source_name: { type: Type.STRING },
                        source_url: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            sources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rss_item_id: { type: Type.STRING },
                  source_name: { type: Type.STRING },
                  source_url: { type: Type.STRING },
                  title: { type: Type.STRING },
                  published_at: { type: Type.STRING }
                }
              }
            },
            channels: {
              type: Type.OBJECT,
              properties: {
                email: { 
                    type: Type.OBJECT, 
                    properties: { enabled: { type: Type.BOOLEAN }, subject: { type: Type.STRING }, body_html: { type: Type.STRING }, body_text: { type: Type.STRING } } 
                },
                sms: { 
                    type: Type.OBJECT,
                    properties: { enabled: { type: Type.BOOLEAN }, summary_text: { type: Type.STRING } }
                },
                video_reel: {
                    type: Type.OBJECT,
                    properties: { enabled: { type: Type.BOOLEAN }, script: { type: Type.STRING }, approx_duration_sec: { type: Type.NUMBER } }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeneratedReport;

  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

export const chatWithAssistant = async (
  query: string,
  chatHistory: ChatMessage[],
  profile: UserProfile,
  contextItems: RSSItem[]
): Promise<ChatResponse> => {
  
  const payload = {
    user_profile: profile,
    chat_context: {
        conversation_turns: chatHistory.map(m => ({ role: m.role, content: m.content })),
        referenced_reports: [], // Mocked empty
        retrieved_snippets: contextItems.map(item => ({
            source_type: "rss_item",
            source_id: item.id,
            snippet: `${item.title}: ${item.summary}`,
            source_url: item.source_url
        }))
    },
    user_message: query
  };

  try {
    const response = await ai.models.generateContent({
        model: MODEL_ID,
        contents: JSON.stringify(payload),
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
             responseSchema: {
                type: Type.OBJECT,
                properties: {
                    mode: { type: Type.STRING },
                    assistant_reply_markdown: { type: Type.STRING },
                    referenced_reports: { 
                        type: Type.ARRAY, 
                        items: { type: Type.OBJECT, properties: { report_id: { type: Type.STRING }, title: { type: Type.STRING }, timestamp: { type: Type.STRING } } } 
                    },
                    referenced_sources: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                source_type: { type: Type.STRING },
                                source_id: { type: Type.STRING },
                                source_name: { type: Type.STRING },
                                source_url: { type: Type.STRING, nullable: true },
                                justification: { type: Type.STRING }
                            }
                        }
                    },
                    suggested_profile_updates: {
                        type: Type.OBJECT,
                        properties: {
                            should_update: { type: Type.BOOLEAN },
                            new_primary_topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                            new_secondary_topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                            notes: { type: Type.STRING }
                        }
                    }
                }
             }
        }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as ChatResponse;

  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
}

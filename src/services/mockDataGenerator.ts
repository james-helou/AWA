// src/services/mockDataGenerator.ts
// Service to generate AI-powered mock data for the dashboard preview using OpenAI API

export interface AIMockData {
  activityLog?: Array<{ timestamp: string; message: string }>;
  activityFeed?: Array<{ id: string; type: string; message: string; time: string; user?: string; metadata?: any }>;
  tableRows?: Array<Record<string, any>>;
  rows?: Array<Record<string, any>>;
  summary?: string;
  metrics?: Array<{ label: string; value: string; subtext: string; color: string }>;
  tableTitle?: string;
  tableSubtitle?: string;
  columns?: Array<{ key: string; label: string }>;
  uiType?: string;
  [key: string]: any; // Allow any additional fields
}

export async function generateAIMockData(prompt: string): Promise<AIMockData> {
  // Use Vite env variable for browser compatibility
  const endpoint = 'https://ue2uoai4c8aoa01.openai.azure.com/openai/deployments/gpt-5-nano/chat/completions?api-version=2024-02-15-preview';
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;

  const body = {
    messages: [
      { 
        role: 'system', 
        content: `You are a data generator. Generate realistic, varied values for business software screens.

CRITICAL: The user prompt specifies EXACT columns and what values to use for each column. Follow those instructions precisely.

RULES:
1. Use realistic, diverse data (varied names from different cultures, different statuses, different values)
2. Make each row unique
3. Fill in ALL column fields specified in the prompt
4. Use the exact value types requested (emails → real emails, dates → real dates, decisions → Approved/Rejected)
5. Return ONLY valid JSON

DO NOT change column names or structure. Your job is ONLY to fill in realistic data values.` 
      },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1200,
    temperature: 0.8
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error('Failed to fetch AI mock data');
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('No AI mock data returned');

  // Try to parse the JSON from the model's response
  try {
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON found in response');
    }
    const jsonString = content.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (e) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Failed to parse AI mock data: ' + (e as Error).message);
  }
}

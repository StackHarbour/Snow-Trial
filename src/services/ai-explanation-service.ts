import type { ForecastResult } from '@/domain/forecast/types';
import { env } from '@/lib/http';

export class AIExplanationService {
  async explain(question: string, forecast: ForecastResult): Promise<{ answer: string; configured: boolean }> {
    const key = env('AI_API_KEY');
    const baseUrl = env('AI_API_BASE_URL');
    const model = env('AI_MODEL');
    if (!key || !baseUrl || !model) {
      return { configured: false, answer: 'AI explanation is not configured. I can only explain data that Snow Trail has actually received from its forecast providers.' };
    }

    const payload = {
      model,
      messages: [
        { role: 'system', content: 'You explain Snow Trail forecast data. Never invent values, never claim current weather beyond the supplied context, and explicitly state when the data is insufficient.' },
        { role: 'user', content: JSON.stringify({ question, forecast: { location: forecast.location, current: forecast.current, snow: forecast.snow, confidence: forecast.confidence, freshness: forecast.freshness, hourly: forecast.hourly.slice(0, 48), warnings: forecast.warnings } }) },
      ],
      temperature: 0.1,
    };

    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const answer = data.choices?.[0]?.message?.content;
    if (!answer) throw new Error('AI provider returned no answer');
    return { configured: true, answer };
  }
}

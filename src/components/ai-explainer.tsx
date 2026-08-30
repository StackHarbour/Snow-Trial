'use client';

import { useState } from 'react';
import { Bot, Send } from 'lucide-react';

export function AiExplainer({ locationId }: { locationId: string }) {
  const [question, setQuestion] = useState('What should I know about the next 24 hours of snow?');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function submit() {
    if (!question.trim()) return;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/ai/explain', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: locationId, question }) });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? 'AI request failed');
      setAnswer(data.answer ?? 'No explanation returned.');
    } catch (e) { setError((e as Error).message); } finally { setLoading(false); }
  }
  return <section className="section ai-section"><div className="section-head"><div><span className="eyebrow"><Bot size={14} /> AI forecast explanation</span><h2>Ask about the data. Not a weather oracle.</h2></div></div><div className="ai-box"><textarea value={question} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)} aria-label="Ask Snow Trail about this forecast" rows={2} /><button type="button" onClick={submit} disabled={loading}><Send size={16} /> {loading ? 'Explaining…' : 'Explain'}</button></div>{error && <p className="inline-error">{error}</p>}{answer && <div className="ai-answer">{answer}</div>}</section>;
}

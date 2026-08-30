import { NextRequest, NextResponse } from 'next/server';
import { decodeLocation } from '@/domain/location/codec';
import { ForecastOrchestrator } from '@/services/forecast-orchestrator';
import { AIExplanationService } from '@/services/ai-explanation-service';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';
  if (!rateLimit(`ai:${ip}`, 10)) return NextResponse.json({ error: 'Too many AI requests. Try again shortly.' }, { status: 429 });
  const body = await request.json().catch(() => null) as { id?: string; question?: string } | null;
  if (!body?.id || !body.question?.trim()) return NextResponse.json({ error: 'A location and question are required.' }, { status: 400 });
  const location = decodeLocation(body.id);
  if (!location) return NextResponse.json({ error: 'Invalid location identifier.' }, { status: 400 });
  try {
    const forecast = await new ForecastOrchestrator().get(location);
    const result = await new AIExplanationService().explain(body.question.trim(), forecast);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI explanation failed', error);
    return NextResponse.json({ error: 'The explanation service is temporarily unavailable.' }, { status: 502 });
  }
}
